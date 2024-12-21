import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Quiz: undefined;
};
import Ouiz from './Quiz';
const Stack = createNativeStackNavigator<RootStackParamList>();


const Home= ({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList, 'Home'> }) => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Quiz");

        }}
      >
        <Text>Start</Text>
      </TouchableOpacity>
    </View>
  );
};


export default Home;
