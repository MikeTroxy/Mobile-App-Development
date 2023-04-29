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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native-web";
import styles from "./Stylesheet";

export default class Adduser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: "",
      search_results: [],
      search: "",
      chat_id: "",
      userid: "",
      contacts: "",
      loading: false,
    };
  }

  addContacttoChat = async (CID) => {
    console.log("Added User to chat");
    return fetch(
      "http://localhost:3333/api/1.0.0/chat/" +
        this.state.chat_id +
        "/user/" +
        CID,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-authorization": await AsyncStorage.getItem(
            "whatsthat_session_token"
          ),
        },
      }
    )
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

  Removeuserfromchat = async (CID) => {
    console.log("Removed user from chat");
    return fetch(
      "http://localhost:3333/api/1.0.0/chat/" +
        this.state.chat_id +
        "/user/" +
        CID,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-authorization": await AsyncStorage.getItem(
            "whatsthat_session_token"
          ),
        },
      }
    )
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

  async getContactData() {
    return fetch("http://localhost:3333/api/1.0.0/contacts", {
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
          contacts: rJson,
          loading: false,
        });
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
        this.getContactData();
      }
    );
  }

  render() {
    return (
      <View>
        <Text>Contacts:</Text>
        <FlatList
          data={this.state.contacts}
          renderItem={({ item }) => {
            return (
              <View>
                <Text>{item.first_name}</Text>
                <Text>{item.last_name}</Text>
                <Text>{item.email}</Text>
                <Text>{item.user_id}</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.addContacttoChat(item.user_id);
                  }}
                  style={styles.button}
                >
                  <Text>Add User To Chat</Text>
                </TouchableOpacity>
              </View>
            );
          }}
          keyExtractor={(item) => item.userid}
        />
      </View>
    );
  }
}
