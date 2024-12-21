import React from 'react';
import Quiz from './src/Quiz';
import Home from './src/Home';
import GameOver from './src/GameOver';
import type {PropsWithChildren} from 'react';
import {
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { NavigationContainer, NavigationRouteContext } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='Home' component={Home}></Stack.Screen>
          <Stack.Screen name='Quiz' component={Quiz}></Stack.Screen>
          <Stack.Screen name='GameOver' component={GameOver}></Stack.Screen>
        </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
