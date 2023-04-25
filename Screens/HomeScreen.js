import React, { Component } from "react";
import { Text, TextInput, View, Button, Alert, Touchable, TouchableOpacity } from "react-native";
import styles from './Stylesheet.js';

class App extends Component {
  render() {
    return (
      <View>
        <Text style = {styles.text}>Welcome to WhatsThat!</Text>
        <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Login')}
            style = {styles.button}
          ><Text style = {styles.text}>Login</Text></TouchableOpacity>

        <TouchableOpacity
            onPress={() => this.props.navigation.navigate('SignUp')}
            style = {styles.button}
          ><Text style = {styles.text}>Sign Up</Text></TouchableOpacity>

      </View>
    );
  }
}

export default App;
