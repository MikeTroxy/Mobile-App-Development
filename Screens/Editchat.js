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
          toast.show("OK", {type: "success"} )
          return response.json();
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
          toast.show("Chat name updated successfully!", {type: "success"} )
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
          <Text style={styles.tittletext}>{this.state.chat_data.name}</Text>

          <TextInput
            placeholder="..."
            onChangeText={this.handleChatname}
            value={this.state.message}
            style={styles.textinput}
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
