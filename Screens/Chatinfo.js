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
          toast.show("OK", {type: "success"} )
          console.log("OK");
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
          <Text style={styles.tittletext}>{this.state.chat_data.name}</Text>
          <Text style={styles.tittletext}>Creator: </Text>
          <View style={styles.messagestyle}>
          <Text style={styles.infotext}>
            {this.state.chat_data.creator.first_name}
          </Text>
          <Text style={styles.infotext}>
            {this.state.chat_data.creator.last_name}
          </Text>
          <Text style={styles.infotext}>{this.state.chat_data.creator.email}</Text>
          </View>
          <Text style={styles.tittletext}>Members:</Text>
          <FlatList 
            data={this.state.chat_data.members}
            renderItem={({ item }) => {
              return (
                <View style={styles.messagestyle}>
                  <Text style={styles.infotext}>First Name: {item.first_name}</Text>
                  <Text style={styles.infotext}>Last Name:  {item.last_name}</Text>
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
