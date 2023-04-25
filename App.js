import *  as React from 'react';
import HomeScreen from './Screens/HomeScreen.js';
import SignUpScreen from './Screens/SignUp.js';
import LoginScreen from './Screens/Login';
import HomeScreen2 from './Screens/HomeScreen2.js';
import Profile from './Screens/Profile.js';
import Update from './Screens/Update.js';
import Contacts from './Screens/Contacts.js';
import Search from './Screens/Search.js';
import Blocked from "./Screens/Blocked.js"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

export default function App(){
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Home'>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name= "Login" component={LoginScreen}/>
                <Stack.Screen name= "HomeScreen2" component={HomeScreen2}/>
                <Stack.Screen name= "Profile" component={Profile}/>
                <Stack.Screen name= "Update" component={Update}/>
                <Stack.Screen name= "Contacts" component={Contacts}/>
                <Stack.Screen name= "Blocked" component={Blocked}/>
                <Stack.Screen name= "Search" component={Search}/>
             </Stack.Navigator>
        </NavigationContainer>
    );
}