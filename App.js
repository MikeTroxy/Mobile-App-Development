import *  as React from 'react';
import HomeScreen from './Screens/HomeScreen.js';
import SignUpScreen from './Screens/SignUp.js';
import LoginScreen from './Screens/Login';
import HomeScreen2 from './Screens/HomeScreen2.js';
import Profile from './Screens/Profile.js';
import Update from './Screens/Update.js';
import Contacts from './Screens/Contacts.js';
import Search from './Screens/Search.js';
import Blocked from "./Screens/Blocked.js";
import Chats from "./Screens/Chats.js"
import Conversation from "./Screens/Conversation.js"
import Createconversation from "./Screens/Createconversation.js"
import Adduser from "./Screens/Adduser.js"
import Removeuser from "./Screens/Removeuser.js"
import Chatinfo from "./Screens/Chatinfo.js"
import Editchat from "./Screens/Editchat.js"
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
                <Stack.Screen name= "Chats" component={Chats}/>
                <Stack.Screen name= "Conversation" component={Conversation}/>
                <Stack.Screen name= "Createconversation" component={Createconversation}/>
                <Stack.Screen name= "Adduser" component={Adduser}/>
                <Stack.Screen name= "Removeuser" component={Removeuser}/>
                <Stack.Screen name= "Chatinfo" component={Chatinfo}/>
                <Stack.Screen name= "Editchat" component={Editchat}/>
             </Stack.Navigator>
        </NavigationContainer>
    );
}