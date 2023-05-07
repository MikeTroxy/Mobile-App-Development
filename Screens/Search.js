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
        }else if (response.status == 400) {
          toast.show("Bad Request", {type: "danger"} )
          console.log("Bad Request");
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
          toast.show("Contact Added", {type: "success"} )
          console.log("OK");
        }else if (response.status == 400) {
          toast.show("You can't add yourself as a contact", {type: "danger"} )
          console.log("You can't add yourself as a contact");
        }else if (response.status == 401) {
          toast.show("You don't have permission to do that", {type: "danger"} )
          console.log("Unauthorized");
        }else if (response.status == 403) {
          toast.show("Action Not Allowed", {type: "danger"} )
          console.log("Forbidden");
        }else if (response.status == 404) {
          toast.show("Contact Not Found", {type: "danger"} )
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
          style={styles.textinput}
          placeholder="Search"
          onSubmitEditing={() => {
            this.getData();
          }}
          onChangeText={this.handleSearch}
          value={this.state.search}
        />
        <Text style={styles.tittletext} >Your id is: {this.state.userid}</Text>
        <FlatList
          data={this.state.search_results}
          renderItem={({ item }) => {
            if(item.user_id == this.state.userid){
              return
            }
            else{
              return(
                <View
                style={styles.messagestyle}
                >
                  <Text style={styles.infotext}>{item.given_name}</Text>
                  <Text style={styles.infotext}>{item.family_name}</Text>
                  <Text style={styles.infotext}>{item.email}</Text>
                  <Text style={styles.infotext}>{item.user_id}</Text>
                  <TouchableOpacity 
                  onPress={() => {this.addContact(item.user_id)}}
                  style = {styles.button}
                  >
                    <Text>Add Contact</Text>
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