import React, { Component } from "react";
import {
  Text,
  TextInput,
  View,
  Button,
  Alert,
  Touchable,
  TouchableOpacity,
} from "react-native";
import styles from "./Stylesheet.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class Conversation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      loading: true,
    };
  }

  async Createchat() {
    console.log("Create chat");
    return fetch("http://localhost:3333/api/1.0.0/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-authorization": await AsyncStorage.getItem(
          "whatsthat_session_token"
        ),
      },
      body: JSON.stringify({
        name: this.state.name,
      }),
    })
      .then(async (response) => {
        if (response.status == 200) {
          console.log("OK");
        } else if (response.status == 401) {
          console.log("Unauthorized");
        } else {
          throw "something went wrong";
        }
      })

      .catch((error) => {
        this.setState({ error: error });
        this.setState({ submitted: false });
      });
  }

  addContact = async (ID) => {
    console.log("Add Contact");
    return fetch("http://localhost:3333/api/1.0.0/user/" + ID + "/contact", {
      method: "POST",
      headers: { 'Content-Type': 'application/json',
        "X-authorization": await AsyncStorage.getItem(
          "whatsthat_session_token"
        )
      }
    })
      .then(async (response) => {
        if (response.status == 200) {
          
            console.log("OK")
        } else if (response.status == 401) {
          console.log("Unauthorized");
        } else {
          throw "something went wrong";
        }
      })

      .catch((error) => {
        this.setState({ error: error });
        this.setState({ submitted: false });
      });
  }

  render() {
    return (
      <View>
        <TextInput
          placeholder="Chat Name"
          onChangeText={(val) => this.setState({ name: val })}
        />
        <TouchableOpacity
          onPress={() => this.Createchat()}
          style={styles.button}
        >
          <Text style={styles.text}>Create chat</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
