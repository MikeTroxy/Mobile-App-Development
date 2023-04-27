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

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: "",
      search_results: [],
      search: "",
      loading: false
    };
  }

  async getData() {
    this.setState({
      loading: true
    });
    return fetch(
      "http://localhost:3333/api/1.0.0/search?q=" + this.state.search,
      {
        headers: {
          "X-Authorization": await AsyncStorage.getItem(
            "whatsthat_session_token"
          ),
        },
      }
    )
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
            search_results: rJson,
            loading: false,
          },
          () => {
            console.log(this.state.search_results);
          }
        );
      })
      .catch((err) => {
        console.log(err);
      })
  }

  addContact = async (ID) => {
    console.log("Add Contact");
    return fetch("http://localhost:3333/api/1.0.0/user/" + ID + "/contact", {
      method: "POST",
      headers: { 'Content-Type': 'application/json',
        "X-authorization": await AsyncStorage.getItem(
          "whatsthat_session_token"
        )
      }
    })
      .then(async (response) => {
        if (response.status == 200) {
          
            console.log("OK")
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
  }

  blockContact = async (ID) => {
    console.log("block Contact");
    return fetch("http://localhost:3333/api/1.0.0/user/" + ID + "/block", {
      method: "POST",
      headers: { 'Content-Type': 'application/json',
        "X-authorization": await AsyncStorage.getItem(
          "whatsthat_session_token"
        )
      }
    })
      .then(async (response) => {
        if (response.status == 200) {
          
            console.log("OK")
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
  }

  handleSearch = (text) => {
    this.setState({ search: text });
  };


  async componentDidMount() {
    this.setState({
      userid: await AsyncStorage.getItem("whatsthat_user_id"),
    });
  }

  render() {
    if (this.state.loading == true) {
      return;
    }
    return (
      <View>
        <TextInput
          placeholder="Search"
          onSubmitEditing={() => {
            this.getData();
          }}
          onChangeText={this.handleSearch}
          value={this.state.search}
        />
        <Text>Your id is: {this.state.userid}</Text>
        <FlatList
          data={this.state.search_results}
          renderItem={({ item }) => {
            if(item.user_id == this.state.userid){
              return
            }
            else{
              return(
                <View>
                  <Text>{item.given_name}</Text>
                  <Text>{item.family_name}</Text>
                  <Text>{item.email}</Text>
                  <Text>{item.user_id}</Text>
                  <TouchableOpacity 
                  onPress={() => {this.addContact(item.user_id)}}
                  style = {styles.button}
                  >
                    <Text>Add Contact</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                  onPress={() => {this.blockContact(item.user_id)}}
                  style = {styles.button}
                  >
                    <Text>Block</Text>
                  </TouchableOpacity>
                </View>
              )
            }
            }}
          keyExtractor={(item) => item.userid}
        />
      </View>
    );
  }
}