import React, { Component } from 'react';
import { Text, TextInput, View, Button, Alert } from 'react-native';

let emailvalid = false;
let passwordvalid = false;

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      email: "",
      password: ""
    }
  }

  handleEmailInput = (email) => {
    this.setState({email: email})
  }

  handlePasswordInput = (pass) => {
    this.setState({password: pass})
  }

  login = (email, password) => {
    this.EmailVerificationCheck(email)
    this.PasswordVerificationCheck(password)
    if (emailvalid == true){
      if(passwordvalid == true){
        alert("Your Email and Password are Valid!")
      }

      else{
        alert("Your Password is incorrect, please try again")
      }

    }
    else{
      alert("your email doesn't exist, please enter a valid email")
    }
  }

  EmailVerificationCheck = (email) => {
    if (email.match(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/)){
      emailvalid = true;
    }
    else{
      emailvalid = false;
    }
  }

  PasswordVerificationCheck = (password) => {
    if (password.match(/^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/)){
      passwordvalid = true;
    }
    else{
      passwordvalid = false;
    }
  }

  render() {
    return (
      <View>
        <TextInput 
        placeholder='email' 
        onChangeText={this.handleEmailInput} 
        value={this.state.email} 
        />
        
        <TextInput 
        placeholder='password...' 
        onChangeText={this.handlePasswordInput} 
        value={this.state.password} 
        />
         
        <Button
        onPress={ () => this.login(this.state.email, this.state.password)}
        title='Submit'
        />
        <Button
            title="Back"
            onPress={() => this.props.navigation.navigate('Home')}
        />
      </View>
    );
  }

}

export default App
