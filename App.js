import *  as React from 'react';
import HomeScreen from './Screens/HomeScreen.js';
import SignUpScreen from './Screens/SignUp.js';
import List from './Screens/List';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

export default function App(){
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Home'>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name= "List" component={List}/>
             </Stack.Navigator>
        </NavigationContainer>
    );
}