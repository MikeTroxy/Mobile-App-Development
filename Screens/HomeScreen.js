import React, { Component } from "react";
import { Text, TextInput, View, Button, Alert } from "react-native";

class App extends Component {
  render() {
    return (
      <View>
        <Text>Welcome to WhatsThat!</Text>
        <Button
            title="Sign Up Now!!"
            onPress={() => this.props.navigation.navigate('SignUp')}
 />

      </View>
    );
  }
}

export default App;
