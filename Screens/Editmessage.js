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
      message: "",
      message_id: "",
      loading: false,
    };
  }

  async UpdateMessage() {
    console.log(this.state.message_id);
    return fetch(
      "http://localhost:3333/api/1.0.0/chat/" +
        this.state.chat_id +
        "/message/" +
        this.state.message_id,
      {
        method: "PATCH",
        headers: {
          "X-Authorization": await AsyncStorage.getItem(
            "whatsthat_session_token"
          ),
          "Content-type": "application/json",
        },
        body: JSON.stringify({ "message": this.state.message }),
      }
    )
      .then((response) => {
        if (response.status == 200) {
          toast.show("Edit Successful!", {type: "success"} )
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
          toast.show("Message Not Found", {type: "danger"} )
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

  handleMessageupdate = (text) => {
    this.setState({ message: text });
  };

  componentDidMount() {
    this.setState(
      {
        message_id: this.props.route.params.data.toString(),
        chat_id: this.props.route.params.moredata.toString(),
      }
    );
  }

  render() {
    if (this.state.loading) {
      return <Text style={styles.text}>Loading, please wait...</Text>;
    } else {
      return (
        <View>
          <TextInput
            placeholder="..."
            onChangeText={this.handleMessageupdate}
            value={this.state.message}
            style={styles.text}
          />
          <TouchableOpacity
            onPress={() => {
              this.UpdateMessage();
            }}
            style={styles.button}
          >
            <Text style={styles.text}>Update Message</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}
