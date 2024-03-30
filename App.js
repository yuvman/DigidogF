import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen'; 
import GifGridScreen from './GifGridScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Welcome' }} />
                <Stack.Screen name="GifGrid" component={GifGridScreen} options={{ title: 'Gif Grid' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
