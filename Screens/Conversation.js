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

export default class Conversation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chat_id: "",
      chat_data: [],
      message: "",
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

  async Sendmessage() {
    return fetch(
      "http://localhost:3333/api/1.0.0/chat/" + this.state.chat_id + "/message",
      {
        method: "POST",
        headers: {
          "X-Authorization": await AsyncStorage.getItem(
            "whatsthat_session_token"
          ),
          "Content-type": "application/json",
        },
        body: JSON.stringify({ message: this.state.message }),
      }
    )
      .then((response) => {
        if (response.status == 200) {
          toast.show("Message Sent!", {type: "success"} )
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

  Deletemessage = async (MID) => {
    console.log("Removed message from chat");
    return fetch(
      "http://localhost:3333/api/1.0.0/chat/" +
        this.state.chat_id +
        "/message/" +
        MID,
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
          toast.show("Message Deleted!", {type: "success"} )
          console.log("OK");
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

      .catch((error) => {
        this.setState({ error: error });
        this.setState({ submitted: false });
      });
  };

  handleMessage = (text) => {
    this.setState({ message: text });
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
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("Editchat", {
                data: this.state.chat_id,
              })
            }
            style={styles.button}
          >
            <Text style={styles.infotext}>Edit</Text>
          </TouchableOpacity>
          <FlatList
            data={this.state.chat_data.messages}
            inverted = {true}
            extraData={this.state.chat_data.messages}
            renderItem={({ item }) => {
              return (
                <View style={ styles.messagestyle }>
                  <Text style={styles.infotext}>
                    {item.author.first_name}: {item.message}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.Deletemessage(item.message_id);
                    }}
                    style={styles.button}
                  >
                    <Text style={styles.infotext}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("Editmessage", {
                        data: item.message_id,
                        moredata: this.state.chat_id,
                      })
                    }
                    style={styles.button}
                  >
                    <Text style={styles.infotext}>Edit</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
            keyExtractor={(item) => item.chat_id}
          />
          <View style = {{flexDirection: "row"}}>
          <TextInput
            placeholder="..."
            onChangeText={this.handleMessage}
            value={this.state.message}
            style={[styles.sendmessage, {flex: 2}]}
          />

          <TouchableOpacity
            onPress={() => {
              this.Sendmessage();
            }}
            style={[styles.sendbutton, {flex: 1}]}
          >
            <Text style={styles.infotext}>Send</Text>
          </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}
