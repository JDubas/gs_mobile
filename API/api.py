from flask import Flask, jsonify, request
import oracledb
from flask_cors import CORS
from werkzeug.utils import secure_filename 
import os


app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'API', 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# Dados de conexão ao Oracle
dsn_tns = oracledb.makedsn('oracle.fiap.com.br', '1521', service_name='orcl')
username = 'rm76153'
password = '150598'

@app.route('/upload-image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "Nenhuma imagem encontrada no formulário."}), 400

    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({"error": "Nenhum arquivo selecionado."}), 400

    if image_file:
        filename = secure_filename(image_file.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image_file.save(image_path)
        return jsonify({"message": "Imagem salva com sucesso.", "image_path": image_path}), 200

# Função para verificar se o usuário e senha existem na tabela mobile_logins
def check_credentials(email, senha):
    try:
        # Conectar ao banco de dados Oracle
        conn = oracledb.connect(user=username, password=password, dsn=dsn_tns)
        cursor = conn.cursor()

        # Executar a consulta
        cursor.execute("SELECT COUNT(*) FROM mobile_login WHERE email = :email AND senha = :senha", {'email': email, 'senha': senha})

        # Recuperar o resultado
        count = cursor.fetchone()[0]

        # Fechar o cursor e conexão
        cursor.close()
        conn.close()

        return count > 0

    except oracledb.DatabaseError as e:
        error, = e.args
        return {"error": error.message}

# Função para recuperar a senha com base no email
def get_password_by_email(email):
    try:
        # Conectar ao banco de dados Oracle
        conn = oracledb.connect(user=username, password=password, dsn=dsn_tns)
        cursor = conn.cursor()

        # Executar a consulta
        cursor.execute("SELECT senha FROM mobile_login WHERE email = :email", {'email': email})

        # Recuperar o resultado
        row = cursor.fetchone()

        # Fechar o cursor e conexão
        cursor.close()
        conn.close()

        if row:
            return row[0]
        else:
            return None

    except oracledb.DatabaseError as e:
        error, = e.args
        return {"error": error.message}

def consultar_comentarios():
    try:
        # Conectar ao banco de dados Oracle
        conn = oracledb.connect(user=username, password=password, dsn=dsn_tns)
        cursor = conn.cursor()

        # Executar a consulta SQL
        cursor.execute("SELECT * FROM ComentariosRedesSociais")

        # Recuperar todos os resultados
        resultados = cursor.fetchall()

        # Converter os resultados em um formato adequado para jsonify
        dados = []
        for resultado in resultados:
            dados.append({
                'id_comentario': resultado[0],
                'texto_comentario': resultado[1],
                'sentimento': resultado[2],
                'rede_social': resultado[3]
            })

        # Fechar o cursor e a conexão
        cursor.close()
        conn.close()

        return jsonify(dados)

    except oracledb.DatabaseError as e:
        error, = e.args
        return {"error": error.message}

def get_user_info_by_email(email):
    try:
        # Conectar ao banco de dados Oracle
        conn = oracledb.connect(user=username, password=password, dsn=dsn_tns)
        cursor = conn.cursor()

        # Executar a consulta
        cursor.execute("SELECT NOME_USUARIO, senha FROM mobile_login WHERE email = :email", {'email': email})

        # Recuperar o resultado
        row = cursor.fetchone()

        # Fechar o cursor e conexão
        cursor.close()
        conn.close()

        if row:
            return {'nome': row[0], 'senha': row[1]}
        else:
            return None

    except oracledb.DatabaseError as e:
        error, = e.args
        return {"error": error.message}

@app.route('/user-info/<email>', methods=['GET'])
def get_user_info(email):
    user_info = get_user_info_by_email(email)
    
    if user_info:
        return jsonify(user_info), 200
    else:
        return jsonify({"message": "Email não encontrado."}), 404

@app.route('/comentarios', methods=['GET'])
def get_comentarios():
    return consultar_comentarios()

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    senha = data.get('senha')

    if email is None or senha is None:
        return jsonify({"error": "Email e senha são obrigatórios."}), 400

    if check_credentials(email, senha):
        return jsonify({"message": "Credenciais válidas."}), 200
    else:
        return jsonify({"message": "Credenciais inválidas."}), 401

@app.route('/recuperar-senha', methods=['POST'])
def recuperar_senha():
    data = request.get_json()
    email = data.get('email')

    if email is None:
        return jsonify({"error": "Email é obrigatório."}), 400

    senha = get_password_by_email(email)
    
    if senha:
        return jsonify({"message": "Senha encontrada.", "senha": senha}), 200
    else:
        return jsonify({"message": "Email não encontrado."}), 404

# Função para adicionar um novo evento
@app.route('/add-event', methods=['POST'])
def add_event():
    data = request.get_json()
    dono = data.get('dono')
    caminho_imagem = data.get('caminhoImagem')
    nivel_sujeira = data.get('nivelSujeira')
    local = data.get('local')
    nome = data.get('nome')

    if not all([dono, caminho_imagem, nivel_sujeira, local, nome]):
        return jsonify({"error": "Todos os campos são obrigatórios."}), 400

    try:
        # Conectar ao banco de dados Oracle
        conn = oracledb.connect(user=username, password=password, dsn=dsn_tns)
        cursor = conn.cursor()

        # Inserir novo evento
        cursor.execute("""
            INSERT INTO Mobile_Eventos (Dono, CaminhoImagem, NivelSujeira, Local, Nome)
            VALUES (:dono, :caminho_imagem, :nivel_sujeira, :local, :nome)
        """, [dono, caminho_imagem, nivel_sujeira, local, nome])

        # Confirmar a transação
        conn.commit()

        # Fechar o cursor e a conexão
        cursor.close()
        conn.close()

        return jsonify({"message": "Evento adicionado com sucesso."}), 201

    except oracledb.DatabaseError as e:
        error, = e.args
        return jsonify({"error": error.message}), 500

# Função para adicionar um novo participante a um evento
@app.route('/add-participant', methods=['POST'])
def add_participant():
    data = request.get_json()
    evento_id = data.get('eventoID')
    email = data.get('email')

    if not all([evento_id, email]):
        return jsonify({"error": "EventoID e Email são obrigatórios."}), 400

    try:
        # Conectar ao banco de dados Oracle
        conn = oracledb.connect(user=username, password=password, dsn=dsn_tns)
        cursor = conn.cursor()

        # Inserir novo participante
        cursor.execute("""
            INSERT INTO Mobile_Participantes (EventoID, Email)
            VALUES (:evento_id, :email)
        """, [evento_id, email])

        # Confirmar a transação
        conn.commit()

        # Fechar o cursor e a conexão
        cursor.close()
        conn.close()

        return jsonify({"message": "Participante adicionado com sucesso."}), 201

    except oracledb.DatabaseError as e:
        error, = e.args
        return jsonify({"error": error.message}), 500

@app.route('/events', methods=['GET'])
def get_events():
    try:
        # Conectar ao banco de dados Oracle
        conn = oracledb.connect(user=username, password=password, dsn=dsn_tns)
        cursor = conn.cursor()

        # Executar a consulta SQL
        cursor.execute("""
            SELECT e.ID, e.Dono, e.CaminhoImagem, e.NivelSujeira, e.Local, e.Nome, COUNT(p.Email) AS NumeroDeEmails
            FROM Mobile_Eventos e
            LEFT JOIN Mobile_Participantes p ON e.ID = p.EventoID
            GROUP BY e.ID, e.Dono, e.CaminhoImagem, e.NivelSujeira, e.Local, e.Nome
        """)

        # Recuperar todos os resultados
        resultados = cursor.fetchall()

        # Converter os resultados em um formato adequado para jsonify
        dados = []
        for resultado in resultados:
            dados.append({
                'evento_id': resultado[0],
                'dono': resultado[1],
                'caminho_imagem': resultado[2],
                'nivel_sujeira': resultado[3],
                'local': resultado[4],
                'nome': resultado[5],
                'numero_de_emails': resultado[6]
            })

        # Fechar o cursor e a conexão
        cursor.close()
        conn.close()

        return jsonify(dados), 200

    except oracledb.DatabaseError as e:
        error, = e.args
        return jsonify({"error": error.message}), 500

@app.route('/check-participant', methods=['GET'])
def check_participant():
    evento_id = request.args.get('eventoID')
    email = request.args.get('email')

    if not all([evento_id, email]):
        return jsonify({"error": "EventoID e Email são obrigatórios."}), 400

    try:
        # Conectar ao banco de dados Oracle
        conn = oracledb.connect(user=username, password=password, dsn=dsn_tns)
        cursor = conn.cursor()

        # Executar a consulta SQL
        cursor.execute("""
            SELECT COUNT(*) FROM Mobile_Participantes 
            WHERE EventoID = :evento_id AND Email = :email
        """, {'evento_id': evento_id, 'email': email})

        # Recuperar o resultado
        count = cursor.fetchone()[0]

        # Fechar o cursor e a conexão
        cursor.close()
        conn.close()

        if count > 0:
            return jsonify({"message": "Participante encontrado."}), 200
        else:
            return jsonify({"message": "Participante não encontrado."}), 404

    except oracledb.DatabaseError as e:
        error, = e.args
        return jsonify({"error": error.message}), 500

# Função para deletar uma entrada na tabela Mobile_Participantes com base no EventoID e Email
@app.route('/delete-participant', methods=['DELETE'])
def delete_participant():
    data = request.get_json()
    evento_id = data.get('eventoID')
    email = data.get('email')

    if not all([evento_id, email]):
        return jsonify({"error": "EventoID e Email são obrigatórios."}), 400

    try:
        # Conectar ao banco de dados Oracle
        conn = oracledb.connect(user=username, password=password, dsn=dsn_tns)
        cursor = conn.cursor()

        # Deletar participante
        cursor.execute("""
            DELETE FROM Mobile_Participantes 
            WHERE EventoID = :evento_id AND Email = :email
        """, {'evento_id': evento_id, 'email': email})

        # Confirmar a transação
        conn.commit()

        # Fechar o cursor e a conexão
        cursor.close()
        conn.close()

        return jsonify({"message": "Participante deletado com sucesso."}), 200

    except oracledb.DatabaseError as e:
        error, = e.args
        return jsonify({"error": error.message}), 500

if __name__ == '__main__':
    app.run(debug=True)
