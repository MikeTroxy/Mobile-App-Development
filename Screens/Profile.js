import React, { Component } from "react";
import { Text, TextInput, View, Button, Alert, Touchable, TouchableOpacity } from "react-native";
import styles from './Stylesheet.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {},
      loading: true
    }
  }

  componentDidMount(){
    this.getData()
  }

  async getData(){
    return fetch ('http://localhost:3333/api/1.0.0/user/' + await AsyncStorage.getItem("whatsthat_user_id"),{
      headers: {
        "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
      }
    })

    .then((response) => {
      if(response.status == 200){
        return response.json()
      }else{
        throw "Something went wrong :("
      }
    })

    .then((rJson) => {
      this.setState({
        profile: rJson,
        loading: false
      })
    })

    .catch((err) => {
      console.log(err)
    })
  }

  render(){
    if(this.state.loading){
      return (<Text style={styles.text}>Loading, please wait...</Text>)
    }else{
      return(
        <View>
          <Text>Profile</Text>
          <Text style={styles.text}> First Name: {this.state.profile.first_name} </Text>
          <Text style={styles.text}> Last Name: {this.state.profile.last_name} </Text>
          <Text style={styles.text}> Email: {this.state.profile.email} </Text>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Update', {data: this.state.profile})}
            style = {styles.button}>
            <Text style = {styles.text}> Update Info</Text></TouchableOpacity>
        </View>
      )
    }
  }
}

