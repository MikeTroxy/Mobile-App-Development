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
          console.log("Message Sent");
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
          <Text style={styles.text}>{this.state.chat_data.name}</Text>
          <FlatList
            extraData={this.state.chat_data.messages.reverse()}
            data={this.state.chat_data.messages.reverse()}
            renderItem={({ item }) => {
              return (
                <View>
                  <Text>
                    {item.author.first_name}: {item.message}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.Deletemessage(item.message_id);
                    }}
                  >
                    <Text style={styles.text}>Remove</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("Editmessage", {
                        data: item.message_id,
                        moredata: this.state.chat_id
                      })
                    }
                    style={styles.button}
                  >
                    <Text style={styles.text}>Edit</Text>
                  </TouchableOpacity>
                </View>
              );
            }}
            keyExtractor={(item) => item.chat_id}
          />
          <TextInput
            placeholder="..."
            onChangeText={this.handleMessage}
            value={this.state.message}
            style={styles.text}
          />

          <TouchableOpacity
            onPress={() => {
              this.Sendmessage();
            }}
            style={styles.button}
          >
            <Text style={styles.text}>Send Message</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate("Editchat", {
                data: this.state.chat_id,
              })
            }
            style={styles.button}
          >
            <Text style={styles.text}>Edit chat</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}
