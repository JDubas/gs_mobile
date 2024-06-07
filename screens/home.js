import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Text, Image } from 'react-native';

export default function Home({ route, navigation }) {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const { email } = route.params;
    setEmail(email);
  }, [route]); 

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Bem vindo a EcoBeach</Text>
      <text style={styles.emailText}>Usuario  logado: {email}</text>

      <Image
        source={require('../assets/limpando.jpg')}
        style={styles.image}
      />
      <Text style={styles.explanationText}>
        Este aplicativo conecta pessoas interessadas em trabalho voluntário, mas que não sabem como ou onde começar. 
        Você pode cadastrar uma praia que precisa de limpeza ou encontrar uma próxima a você e se voluntariar para 
        ajudar a preservar o meio ambiente.
      </Text>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            title="Cadastrar praia"
            onPress={() => navigation.navigate('Cadastro', { email: email })}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Candidatar-se para auxilio"
            onPress={() => navigation.navigate('Eventos', { email: email })}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  emailText: {
    fontSize: 18,
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  explanationText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    fontFamily: 'Arial',
    width: '50%', 
    alignSelf: 'center', 
  },
  buttonContainer: {
    flexDirection: 'row', 
    justifyContent: 'center',
    width: '100%',
  },
  buttonWrapper: {
    width: 150, 
    height: 100,
    marginHorizontal: 10,
  },
  button: {
    padding: 15,
    backgroundColor: '#007bff', 
    color: '#fff', 
    borderRadius: 5,
  },
});
