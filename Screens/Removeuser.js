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


export default class Removeuser extends Component {
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
      chat_data: [],
    };
  }

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
          toast.show("User Removed", {type: "success",duration: 4000}  )
          console.log("OK");
        }else if (response.status == 401) {
          toast.show("You don't have permission to do that", {type: "danger",duration: 4000} )
          console.log("Unauthorized");
        }else if (response.status == 403) {
          toast.show("Action Not Allowed", {type: "danger",duration: 4000} )
          console.log("Forbidden");
        }else if (response.status == 404) {
          toast.show("Chat Not Found", {type: "danger",duration: 4000} )
          console.log("Not Found");
        }else if (response.status == 500) {
          toast.show("Server Error", {type: "danger",duration: 4000} )
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
    return (
      <View>
        <FlatList
          data={this.state.chat_data.members}
          renderItem={({ item }) => {
            return (
              <View style={styles.messagestyle}>
                <Text style={styles.infotext}>{item.first_name}</Text>
                <Text style={styles.infotext}>{item.last_name}</Text>
                <Text style={styles.infotext}>{item.email}</Text>
                <Text style={styles.infotext}>{item.user_id}</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.Removeuserfromchat(item.user_id);
                  }}
                  style={styles.button}
                >
                  <Text style={styles.infotext}>Remove</Text>
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
