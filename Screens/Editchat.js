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

export default class Editchat extends Component {
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

  async Updatechat() {
    console.log(this.state.chat_id);
    return fetch("http://localhost:3333/api/1.0.0/chat/" + this.state.chat_id, {
      method: "PATCH",
      headers: {
        "X-Authorization": await AsyncStorage.getItem(
          "whatsthat_session_token"
        ),
        "Content-type": "application/json",
      },
      body: JSON.stringify({ "name": this.state.name }),
    })
      .then((response) => {
        if (response.status == 200) {
          console.log("Chat Name Updated Successfully");
        } else {
          throw "Something went wrong :(";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChatname = (text) => {
    this.setState({ name: text });
  };

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

          <TextInput
            placeholder="..."
            onChangeText={this.handleChatname}
            value={this.state.message}
            style={styles.text}
          />

          <TouchableOpacity
            onPress={() => {
              this.Updatechat();
            }}
            style={styles.button}
          >
            <Text style={styles.text}>Update Chat Name</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("Adduser", {
                data: this.state.chat_id,
              })
            }
            style={styles.button}
          >
            <Text style={styles.text}>Add User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("Removeuser", {
                data: this.state.chat_id,
              })
            }
            style={styles.button}
          >
            <Text style={styles.text}>Remove User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("Chatinfo", {
                data: this.state.chat_id,
              })
            }
            style={styles.button}
          >
            <Text style={styles.text}>View Chat Info</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}
