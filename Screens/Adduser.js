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
          toast.show("Added Contact to Chat", {type: "success"} )
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
          toast.show("User Not Found", {type: "danger"} )
          console.log("Not Found");
        }else if (response.status == 500) {
          toast.show("Server Error", {type: "danger"} )
          console.log("Server Error");
        }else {
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
          console.log("OK")
          return response.json();
        }else if (response.status == 401) {
          toast.show("You don't have permission to do that", {type: "danger"} )
          console.log("Unauthorized");
        }else if (response.status == 500) {
          toast.show("Server Error", {type: "danger"} )
          console.log("Server Error");
        }else {
          throw "something went wrong";
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
        <Text style={styles.infotext}>Contacts:</Text>
        <FlatList
          data={this.state.contacts}
          renderItem={({ item }) => {
            return (
              <View
              style={styles.messagestyle}
              >
                <Text style={styles.infotext}>{item.first_name}</Text>
                <Text style={styles.infotext}>{item.last_name}</Text>
                <Text style={styles.infotext}>{item.email}</Text>
                <Text style={styles.infotext}>{item.user_id}</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.addContacttoChat(item.user_id);
                  }}
                  style={styles.button}
                >
                  <Text style={styles.infotext}>Add User To Chat</Text>
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
