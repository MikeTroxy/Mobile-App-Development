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
import { FlatList } from "react-native-web";

export default class Chats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatid: "",
      chat_data: [],
      contacts: "",
      loading: false,
    };
  }

  async getchatData() {
    return fetch("http://localhost:3333/api/1.0.0/chat", {
      headers: {
        "X-Authorization": await AsyncStorage.getItem(
          "whatsthat_session_token"
        ),
      },
    })
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        } else {
          throw "Something went wrong :(";
        }
      })

      .then((rJson) => {
        this.setState({
          chat_data: rJson,
          loading: false,
        });
      })

      .catch((err) => {
        console.log(err);
      });
  }

  Startchat = async (ID) => {
    console.log("Add Contact");
    return fetch("http://localhost:3333/api/1.0.0/user/" + ID + "/contact", {
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
  };

  Updatechat = async (ID) => {
    console.log("Update Chat");
    return fetch("http://localhost:3333/api/1.0.0/chat/" + ID, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-authorization": await AsyncStorage.getItem(
          "whatsthat_session_token"
        ),
      },
      body: JSON.stringify({
        name: "OOF",
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
  };

  componentDidMount() {
    this.getchatData();
  }

  render() {
    return (
      <View>
        <Text style={styles.text}>Chats</Text>
        <FlatList
          data={this.state.chat_data}
          renderItem={({ item }) => {
            return (
              <View>
                <Text>{item.name}</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("Conversation", {
                      data: item.chat_id,
                    });
                  }}
                  style={styles.button}
                >
                  <Text>Go to chat</Text>
                </TouchableOpacity>
              </View>
            );
          }}
          keyExtractor={(item) => item.chat_id}
        />
      </View>
    );
  }
}
