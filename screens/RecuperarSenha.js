import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { useState } from 'react';

export default function RecuperarSenha() {
    const [email, setEmail] = useState('');
    const [mensagem, setMensagem] = useState('');

    const handleRecuperarSenha = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/recuperar-senha', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.status === 200) {
                setMensagem(`Sua senha é: ${data.senha}`);
            } else if (response.status === 404) {
                setMensagem('Email não encontrado.');
            } else {
                setMensagem('Erro ao recuperar senha.');
            }
        } catch (error) {
            console.error('Erro ao recuperar senha:', error);
            setMensagem('Erro ao recuperar senha. Verifique se a API está rodando.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>
                Recuperar Senha
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <Button
                title="Recuperar Senha"
                onPress={handleRecuperarSenha}
            />

            {mensagem !== '' && <Text style={styles.mensagem}>{mensagem}</Text>}

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
    mensagem: {
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center',
        color: 'red',
    },
});
