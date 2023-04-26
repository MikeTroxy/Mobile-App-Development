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
      chat_id: "",
      chat_data: [],
      loading: true,
    };
  }

  async getData() {
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

  UpdateChat = async (ID) => {
    console.log("Chat Updated");
    return fetch("http://localhost:3333/api/1.0.0/chat/" + ID, {
      method: "PATCH",
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
        } else if (response.status == 403) {
          console.log("Forbidden");
        } else if (response.status == 404) {
          console.log("Not Found");
        } else if (response.status == 500) {
          console.log("Server Error");
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
    this.setState({
      chat_id: this.props.route.params.data.toString()
    },()=>{this.getData();});
  }

  render() {
    if (this.state.loading) {
      return <Text style={styles.text}>Loading, please wait...</Text>;
    } else {
      return (
        <View>
          <Text style={styles.text}>{this.state.chat_data.name}</Text>
        </View>
      );
    }
  }
}
