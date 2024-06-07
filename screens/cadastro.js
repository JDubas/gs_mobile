import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Cadastro({ route, navigation }) {
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [nomeImage, setNomeImage] = useState('');
  const [beachName, setBeachName] = useState('');
  const [location, setLocation] = useState('');
  const [pollutionLevel, setPollutionLevel] = useState(1);

  useEffect(() => {
    if (route && route.params && route.params.email) {
      setEmail(route.params.email);
    } else {
      console.error('Email não encontrado em route.params:', route);
    }
  }, [route]);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setImage(imageUrl);
      setNomeImage(selectedFile.name);

      try {
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('beachName', beachName); 
        formData.append('location', location); 

        const response = await axios.post('http://127.0.0.1:5000/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        const imageUrl = URL.createObjectURL(selectedFile);
        setImage(imageUrl);
      } catch (error) {
        console.error('Erro ao enviar imagem:', error);
      }
    }
  };

  const handleSubmit = async () => {
    if (!image || !beachName || !location) {
      alert('Todos os campos são obrigatórios.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/add-event', {
        dono: email, // Substitua pelo valor correto
        caminhoImagem: nomeImage, 
        nivelSujeira: pollutionLevel, 
        local: location, 
        nome: beachName
      });

      alert('Evento adicionado com sucesso!');
      navigation.goBack();

    } catch (error) {
      console.error('Erro ao enviar dados:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h1 style={styles.heading}>Cadastro de Praia</h1>
        <input type="file" accept="image/*" onChange={handleFileChange} style={styles.input} />
        <div style={styles.inputContainer}>
          <label htmlFor="beachName" style={styles.label}>Nome da Praia:</label>
          <input type="text" id="beachName" value={beachName} onChange={(e) => setBeachName(e.target.value)} style={styles.input} />
        </div>
        <div style={styles.inputContainer}>
          <label htmlFor="location" style={styles.label}>Localização:</label>
          <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} style={styles.input} />
        </div>
        <div style={styles.inputContainer}>
          <label htmlFor="pollutionLevel" style={styles.label}>Nível de Poluição:</label>
          <input type="range" id="pollutionLevel" min="1" max="10" value={pollutionLevel} onChange={(e) => setPollutionLevel(e.target.value)} style={styles.slider} />
          <span>{pollutionLevel}</span>
        </div>
        <button onClick={handleSubmit} style={styles.button}>Enviar</button>
        {image && <img src={image} alt="Selecionado" style={styles.image} />}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '20px',
  },
  formBox: {
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    marginBottom: '20px',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: '10px',
  },
  label: {
    marginRight: '10px',
  },
  input: {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginBottom: '10px',
    width: '100%',
    boxSizing: 'border-box',
  },
  slider: {
    marginLeft: '10px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    background: '#007BFF',
    color: '#fff',
    cursor: 'pointer',
    marginTop: '20px',
    width: '100%',
  },
  image: {
    width: '300px',
    height: '300px',
    objectFit: 'cover',
    marginBottom: '20px',
  },
};
