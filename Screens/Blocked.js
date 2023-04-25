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

export default class Blocked extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: "",
      contacts: "",
      loading: false,
    };
  }

  async getData() {
    return fetch("http://localhost:3333/api/1.0.0/blocked", {
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

  unblockContact = async (ID) => {
    console.log("block Contact");
    return fetch("http://localhost:3333/api/1.0.0/user/" + ID + "/block", {
      method: "DELETE",
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
    this.getData();
  }

  render() {
    return (
      <View>
        <Text>Blocked Contacts:</Text>
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
                    this.unblockContact(item.user_id);
                  }}
                  style={styles.button}
                >
                  <Text>Unblock Contact</Text>
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
