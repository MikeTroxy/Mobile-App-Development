import React, { Component } from "react";
import {
  Text,
  TextInput,
  View,
  Button,
  Alert,
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
        }else if (response.status == 401) {
          toast.show("You don't have permission to do that", {type: "danger"} )
          console.log("Unauthorized");
        }else if (response.status == 500) {
          toast.show("Server Error", {type: "danger"} )
          console.log("Server Error");
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

  componentDidMount() {
    this.getchatData();
  }

  render() {
    if (this.state.loading) {
      return <Text style={styles.text}>Loading, please wait...</Text>;
    } else {
      return (
        <View>
          <Text style={styles.text}>Chats</Text>
          <FlatList
            data={this.state.chat_data}
            renderItem={({ item }) => {
              return (
                <View>
                  
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate("Conversation", {
                        data: item.chat_id,
                      });
                    }}
                    style={styles.button}
                  >
                    <Text style={styles.infotext}>{item.name}</Text>
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
}
