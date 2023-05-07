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
        toast.show("Chat Created!", {type: "success"} )
        console.log("OK");
      }else if (response.status == 400) {
        toast.show("Bad Request", {type: "danger"} )
        console.log("Bad Request");
      }else if (response.status == 401) {
        toast.show("You don't have permission to do that", {type: "danger"} )
        console.log("Unauthorized");
      }else if (response.status == 403) {
        toast.show("Action Not Allowed", {type: "danger"} )
        console.log("Forbidden");
      }else if (response.status == 404) {
        toast.show("Chat Not Found", {type: "danger"} )
        console.log("Not Found");
      }else if (response.status == 500) {
        toast.show("Server Error", {type: "danger"} )
        console.log("Server Error");
      }else {
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
          style={styles.textinput}
        />
        <TouchableOpacity
          onPress={() => this.Createchat()}
          style={styles.button}
        >
          <Text style={styles.infotext}>Create chat</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
