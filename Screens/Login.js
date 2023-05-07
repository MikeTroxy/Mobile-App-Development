import React, { Component } from "react";
import { Text, TextInput, View, Button, Alert, Touchable } from "react-native";
import { TouchableOpacity } from "react-native-web";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./Stylesheet.js";

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      emailtest: "miketroxy@gmail.com",
      passwordtest: "Mike123!",
    };
  }

  //Method for login in the API

  login() {
    console.log("Successful Login! Welcome");

    return fetch("http://localhost:3333/api/1.0.0/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: this.state.emailtest,
        password: this.state.passwordtest,
      }),
    })
      .then((response) => {
        if (response.status == 200) {
          toast.show("Welcome Back!", {type: "success"} )
          return response.json();
        } else if (response.status == 400) {
          toast.show("Invalid email/password supplied", {type: "danger"} )
          throw "Invalid email/password supplied";
        } else {
          toast.show("Server Error", {type: "danger"})
          throw "Server Error";
        }
      })

      .then(async (rJson) => {
        console.log(rJson);
        try {
          await AsyncStorage.setItem("whatsthat_user_id", rJson.id);
          await AsyncStorage.setItem("whatsthat_session_token", rJson.token);
          this.setState({ email: "", password: "" }); //how to make it blank
          this.props.navigation.navigate("HomeScreen2");
        } catch {
          throw "something went wrong";
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleEmailInput = (email) => {
    this.setState({ email: email });
  };

  handlePasswordInput = (pass) => {
    this.setState({ password: pass });
  };

  render() {
    return (
      <View>
        <TextInput
          placeholder="email"
          onChangeText={this.handleEmailInput}
          value={this.state.email}
          style={styles.text}
        />

        <TextInput
          placeholder="password..."
          secureTextEntry
          onChangeText={this.handlePasswordInput}
          value={this.state.password}
          style={styles.text}
        />

        <TouchableOpacity onPress={() => this.login()} style={styles.button}>
          <Text style={styles.text}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Home")}
          style={styles.button}
        >
          <Text style={styles.text}> Home</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
