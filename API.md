## Endpoints da API Flask

## Dependências para rodar a API

- Python 3
- Flask
- Flask-CORS
- OracleDB

```bash
pip install flask
pip install flask-cors
pip install oracledb
```

Use o comnando abaixo para rodar a  api localmente:
```bash
npm run api
```


### POST /upload-image
- **Descrição:** Upload de uma imagem para o servidor.

### POST /login
- **Descrição:** Autenticação do usuário.
- **Exemplo: **  http://127.0.0.1:5000/login
    ```json
  {
    "email": "example@example.com",
    "senha": "senha"
  }
  ```

### POST /recuperar-senha
- **Descrição:** Recuperação de senha com base no email.
- **Exemplo: **  http://127.0.0.1:5000/recuperar-senha
- **Envie este json**
    ```json
  {
    "email": "example@example.com",
    "senha": "senha"
  }
  ```

### POST /add-event
- **Descrição:** Adicionar um novo evento.
- **Exemplo: **  http://127.0.0.1:5000/add-event
- **Envie este json**
  ```json
  {
    "dono": "Fulano",
    "caminhoImagem": "/caminho/para/imagem.jpg",
    "nivelSujeira": 2,
    "local": "Praça da Sé",
    "nome": "Limpeza da Praça"
  }
    ```

### GET /events
- **Descrição:** Obter todos os eventos com informações sobre os participantes.
- **Exemplo: **  http://127.0.0.1:5000/events
- **Recebe este json**
    ```json
    [
  {
    "evento_id": 1,
    "dono": "Fulano",
    "caminho_imagem": "/caminho/para/imagem.jpg",
    "nivel_sujeira": 2,
    "local": "Praça da Sé",
    "nome": "Limpeza da Praça",
    "numero_de_emails": 1
  },
  {
    "evento_id": 2,
    "dono": "Ciclano",
    "caminho_imagem": "/caminho/para/imagem2.jpg",
    "nivel_sujeira": 3,
    "local": "Parque Ibirapuera",
    "nome": "Limpeza do Parque",
    "numero_de_emails": 2
  }
  ]
  ```

### DELETE /delete-participant
- **Descrição:** Deletar um participante de um evento.
- **Exemplo: **  http://127.0.0.1:5000/delete-participant
- **Envie este json**
  ```json
  {
  "eventoID": 1,
  "email": "usuario@example.com"
  }
  ```

### GET /check-participant?eventoID=<eventoID>&email=<email>
- **Descrição:** Verificar se um participante está inscrito em um evento.
- **Exemplo** : http://127.0.0.1:5000/check-participant?eventoID=35&email=joao.silva@example.com




| Endpoint                  | Descrição                                   | Método HTTP | Parâmetros                                        | Resposta                                                                                     |
|---------------------------|---------------------------------------------|-------------|--------------------------------------------------|----------------------------------------------------------------------------------------------|
| /upload-image             | Fazer upload de uma imagem                 | POST        | image (arquivo multipart)                       | `{ "message": "Imagem salva com sucesso.", "image_path": "caminho/para/imagem" }`            |
| /login                    | Fazer login                                 | POST        | email, senha                                    | `{ "message": "Credenciais válidas." }`, `{ "message": "Credenciais inválidas." }`           |
| /recuperar-senha          | Recuperar senha                             | POST        | email                                            | `{ "message": "Senha encontrada." }`, `{ "message": "Email não encontrado." }`                |
| /add-event                | Adicionar um novo evento                   | POST        | dono, caminhoImagem, nivelSujeira, local, nome   | `{ "message": "Evento adicionado com sucesso." }`                                              |
| /add-participant          | Adicionar um participante a um evento      | POST        | eventoID, email                                 | `{ "message": "Participante adicionado com sucesso." }`                                        |
| /events                   | Obter todos os eventos                     | GET         | -                                                | `[{"evento_id": 1, "dono": "Fulano", "caminho_imagem": "caminho/para/imagem.jpg", "nivel_sujeira": 2, "local": "Praça da Sé", "nome": "Limpeza da Praça", "numero_de_emails": 1}, ...]`   |
| /check-participant        | Verificar se um participante está em um evento | GET     | eventoID, email                                 | `{ "message": "Participante encontrado." }`, `{ "message": "Participante não encontrado." }` |
| /delete-participant       | Deletar um participante de um evento       | DELETE      | eventoID, email                                 | `{ "message": "Participante deletado com sucesso." }`                                           |

