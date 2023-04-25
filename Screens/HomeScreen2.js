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

class App extends Component {
    //logout Method
  async logout() {
    console.log("Logout");
    return fetch("http://localhost:3333/api/1.0.0/logout", {
      method: "POST",
      headers: { 'Content-Type': 'application/json',
        "X-authorization": await AsyncStorage.getItem(
          "whatsthat_session_token"
        )
      }
    })
      .then(async (response) => {
        if (response.status == 200) {
          await AsyncStorage.removeItem("whatsthat_session_token");
          await AsyncStorage.removeItem("whatsthat_user_id");
          this.props.navigation.navigate("Login");
        } else if (response.status == 401) {
          console.log("Unauthorized");
          await AsyncStorage.removeItem("whatsthat_session_token");
          await AsyncStorage.removeItem("whatsthat_user_id");
          this.props.navigation.navigate("Login");
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
        <Text style={styles.text}>Weclome Back!</Text>
        <TouchableOpacity onPress={() => this.logout()} style={styles.button}>
          <Text style={styles.text}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Profile')}
            style = {styles.button}
          >
          <Text style={styles.text}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Search')}
            style = {styles.button}
          >
          <Text style={styles.text}>Add Users</Text>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Contacts')}
            style = {styles.button}
          >
          <Text style={styles.text}>Contacts</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default App;
