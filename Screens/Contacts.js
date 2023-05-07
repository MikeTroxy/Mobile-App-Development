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

export default class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: "",
      search_results: [],
      contacts: "",
      loading: false,
    };
  }

  async getData() {
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
          toast.show("You don't have permission to do that", {type: "danger", duration: 4000} )
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

  deleteContact = async (ID) => {
    console.log("Delete Contact");
    return fetch("http://localhost:3333/api/1.0.0/user/" + ID + "/contact", {
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
          toast.show("Contact Removed", {type: "success",duration: 4000}  )
          console.log("OK");
        }else if (response.status == 400) {
          toast.show("You can't remove yourself as a contact", {type: "danger",duration: 4000} )
          console.log("You can't remove yourself as a contact");
        }else if (response.status == 401) {
          toast.show("You don't have permission to do that", {type: "danger",duration: 4000} )
          console.log("Unauthorized");
        }else if (response.status == 404) {
          toast.show("Contact Not Found", {type: "danger",duration: 4000} )
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

  blockContact = async (ID) => {
    console.log("block Contact");
    return fetch("http://localhost:3333/api/1.0.0/user/" + ID + "/block", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-authorization": await AsyncStorage.getItem(
          "whatsthat_session_token"
        ),
      },
    })
      .then(async (response) => {
        if (response.status == 200) {
          toast.show("Contact Blocked", {type: "success",duration: 4000}  )
          console.log("OK");
        }else if (response.status == 400) {
          toast.show("You can't block yourself", {type: "danger",duration: 4000} )
          console.log("You can't block yourself");
        }else if (response.status == 401) {
          toast.show("You don't have permission to do that", {type: "danger",duration: 4000} )
          console.log("Unauthorized");
        }else if (response.status == 404) {
          toast.show("Contact Not Found", {type: "danger",duration: 4000} )
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

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <View>
        <Text style={styles.tittletext}>Contacts:</Text>
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
                    this.deleteContact(item.user_id);
                  }}
                  style={styles.button}
                >
                  <Text style={styles.infotext}>Remove Contact</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.blockContact(item.user_id);
                  }}
                  style={styles.button}
                >
                  <Text style={styles.infotext}>Block</Text>
                </TouchableOpacity>
              </View>
            );
          }}
          keyExtractor={(item) => item.userid}
        />
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("Blocked")}
          style={styles.button}
        >
          <Text style={styles.infotext}>BlockList</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
