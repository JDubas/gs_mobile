import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha: password }),
            });

            if (response.status === 200) {
                navigation.navigate('Home', { email: email });
            } else if (response.status === 401) {
                alert('Falha no login: Email ou senha inválidos');
            } else {
                alert('Erro ao fazer login');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao fazer login. Verifique se a API.py está rodando (Use "npm run api").');
        }
    };

    const handleForgotPassword = () => {
        navigation.navigate('RecuperarSenha');
    };

    return (
        <View style={styles.container}>
            <View style={styles.loginBox}>
            <Image
        source={require('../assets/lock.png')}
        style={styles.image}
      />
                <Text style={styles.heading}>
                    Login
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <Button
                    title="Login"
                    onPress={handleLogin}
                />
                <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
                </TouchableOpacity>
            </View>
            <StatusBar style="auto" />
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
    loginBox: {
        width: '100%',
        maxWidth: 400,
        padding: 20,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
    },
    heading: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 15,
        marginBottom: 20,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    forgotPassword: {
        color: 'blue',
        textDecorationLine: 'underline',
        marginTop: 15,
    },
    image: {
        width: 300,
        height: 300,
        marginBottom: 20,
      },
});
