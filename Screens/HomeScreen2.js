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

export default class Homescreen2 extends Component {
  //logout Method
  async logout() {
    console.log("Logout");
    return fetch("http://localhost:3333/api/1.0.0/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-authorization": await AsyncStorage.getItem(
          "whatsthat_session_token"
        ),
      },
    })
      .then(async (response) => {
        if (response.status == 200) {
          await AsyncStorage.removeItem("whatsthat_session_token");
          await AsyncStorage.removeItem("whatsthat_user_id");
          this.props.navigation.navigate("Login");
          toast.show("Logged Out", {type: "Success"} )
        } else if (response.status == 401) {
          toast.show("You don't have permission to do that", {type: "danger"} )
          console.log("Unauthorized");
          await AsyncStorage.removeItem("whatsthat_session_token");
          await AsyncStorage.removeItem("whatsthat_user_id");
          this.props.navigation.navigate("Login");
        }else if (response.json == 500){
          toast.show("Server Error", {type: "danger"} )
          console.log("Server Error")
        }else {
          toast.show("Something went wrong", {type: "danger"} )
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
        <Text style={styles.text}>Weclome Back!</Text>
        <TouchableOpacity onPress={() => this.logout()} style={styles.button}>
          <Text style={styles.text}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Profile")}
          style={styles.button}
        >
          <Text style={styles.text}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Search")}
          style={styles.button}
        >
          <Text style={styles.text}>Add Users</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Contacts")}
          style={styles.button}
        >
          <Text style={styles.text}>Contacts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Chats")}
          style={styles.button}
        >
          <Text style={styles.text}>Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Createconversation")}
          style={styles.button}
        >
          <Text style={styles.text}>Create chat</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
