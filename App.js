import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//import screens
import Cadastro from './screens/cadastro';
import Eventos from './screens/Eventos';
import Inicial from './screens/inicial';
import RecuperarSenha from './screens/RecuperarSenha';
import Home from './screens/home';


const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Inicial" component={Inicial} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
      <Stack.Screen name="Eventos" component={Eventos} />
      <Stack.Screen name="RecuperarSenha" component={RecuperarSenha} />
      <Stack.Screen name="Home" component={Home} />
    
    </Stack.Navigator>
  );
}

export default function App() {
  return (
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
