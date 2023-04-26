import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert, Touchable } from 'react-native';
import { TouchableOpacity } from 'react-native-web';
import styles from './Stylesheet.js';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      shoppingListData: [],
      first_name: "",
      last_name: "",
      email: "",
      password: ""
    };
  }

  //Method for adding a user in the API

  AddUser(){
    return fetch("http://localhost:3333/api/1.0.0/user",
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "first_name": this.state.first_name,
        "last_name": this.state.last_name,
        "email": this.state.email,
        "password": this.state.password
      })
    })
    .then((response) => {
      alert("Item Added!");
    })
    .catch((error) => {
      console.error(error);
    });
  }

  handleFNameInput = (first_name) => {
    this.setState({first_name: first_name})
  }

  handleLNameInput = (last_name) => {
    this.setState({last_name: last_name})
  }

  handleEmailInput = (email) => {
    this.setState({email: email})
  }

  handlePasswordInput = (pass) => {
    this.setState({password: pass})
  }

  render() {
    return (
      <View>
        <TextInput 
        placeholder='First name' 
        onChangeText={this.handleFNameInput} 
        value={this.state.first_name}
        style = {styles.text} 
        />
        
        <TextInput 
        placeholder='Last name' 
        onChangeText={this.handleLNameInput} 
        value={this.state.last_name}
        style = {styles.text}  
        />


        <TextInput 
        placeholder='email' 
        onChangeText={this.handleEmailInput} 
        value={this.state.email}
        style = {styles.text} 
        />
        
        <TextInput 
        placeholder='password...' 
        onChangeText={this.handlePasswordInput} 
        value={this.state.password}
        style = {styles.text}  
        />
         
        <TouchableOpacity
          onPress ={ () => this.AddUser()}
          style = {styles.button}
          ><Text style = {styles.text}>Sign up!</Text></TouchableOpacity>
    
        <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Home')}
            style = {styles.button}>
            <Text style = {styles.text}> Home</Text></TouchableOpacity>
      </View>
    );
  }
}
