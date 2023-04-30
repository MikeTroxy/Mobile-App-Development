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

export default class Chatinfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chat_id: "",
      chat_data: [],
      loading: true,
    };
  }

  async getChatData() {
    console.log(this.state.chat_id);
    return fetch("http://localhost:3333/api/1.0.0/chat/" + this.state.chat_id, {
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
        this.setState(
          {
            chat_data: rJson,
            loading: false,
          },
          () => {
            console.log(this.state.chat_data);
          }
        );
      })

      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {
    this.setState(
      {
        chat_id: this.props.route.params.data.toString(),
      },
      () => {
        this.getChatData();
      }
    );
  }

  render() {
    if (this.state.loading) {
      return <Text style={styles.text}>Loading, please wait...</Text>;
    } else {
      return (
        <View>
          <Text style={styles.text}>{this.state.chat_data.name}</Text>
          <Text> Creator: </Text>
          <Text styles={styles.text}>
            {this.state.chat_data.creator.first_name}
          </Text>
          <Text styles={styles.text}>
            {this.state.chat_data.creator.last_name}
          </Text>
          <Text styles={styles.text}>{this.state.chat_data.creator.email}</Text>
          <Text>Members</Text>
          <FlatList 
            data={this.state.chat_data.members}
            renderItem={({ item }) => {
              return (
                <View>
                  <Text>Memebers: </Text>
                  <Text>First Name</Text>
                  <Text> {item.first_name}</Text>
                  <Text>Last Name</Text>
                  <Text> {item.last_name}</Text>
                </View>
              );
            }}
            keyExtractor={(item) => item.chat_id}
          />
          <FlatList 
            data={this.state.chat_data.messages}
            renderItem={({ item }) => {
              return (
                <View>
                  <Text>{item.author.first_name}: {item.message}</Text>
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
