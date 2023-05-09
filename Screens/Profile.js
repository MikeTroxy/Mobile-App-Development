import React, { Component } from "react";
import { Text, TextInput, View, Button, Alert, Touchable, TouchableOpacity, Image} from "react-native";
import styles from './Stylesheet.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CameraS from "./Camera.js"

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {},
      loading: true,
      camera: false,
      photo: null
    }
  }

  async getData(){
    return fetch ('http://localhost:3333/api/1.0.0/user/' + await AsyncStorage.getItem("whatsthat_user_id"),{
      headers: {
        "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
      }
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
        profile: rJson,
        
      },() => {this.getProfilePhoto()})
    })

    .catch((err) => {
      console.log(err)
    })
  }

  async getProfilePhoto(){
    return fetch ('http://localhost:3333/api/1.0.0/user/' + await AsyncStorage.getItem("whatsthat_user_id") + "/photo",{
      headers: {
        "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
      }
    })

    .then((response) => {
      if (response.status == 200) {
        console.log("OK")
        return response.blob();
      }else if (response.status == 401) {
        toast.show("You don't have permission to do that", {type: "danger", duration: 4000} )
        console.log("Unauthorized");
      }else if (response.status == 404) {
        toast.show("Photo not found", {type: "danger", duration: 4000} )
        console.log("Not found");
      }else if (response.status == 500) {
        toast.show("Server Error", {type: "danger"} )
        console.log("Server Error");
      }else {
        throw "something went wrong";
      }
    })

    .then((resBlob) => {
      let data = URL.createObjectURL(resBlob)
      this.setState({
        photo: data,
        loading: false
      })
    })

    .catch((err) => {
      console.log("error", err)
    })
  }

  componentDidMount(){
    this.getData()
  }

  render(){
    if(this.state.loading){
      return (<Text style={styles.text}>Loading, please wait...</Text>)
    } else if(this.state.camera){return(<CameraS/>)}
    else{
      return(
        <View>
          <Image source={{uri: this.state.photo}} style= {styles.image}></Image>
          <Text style={styles.text}> First Name: {this.state.profile.first_name} </Text>
          <Text style={styles.text}> Last Name: {this.state.profile.last_name} </Text>
          <Text style={styles.text}> Email: {this.state.profile.email} </Text>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Update', {data: this.state.profile})}
            style = {styles.button}>
            <Text style = {styles.text}> Update Info</Text></TouchableOpacity>

            <TouchableOpacity
            onPress={() => this.setState({camera: true})}
            style = {styles.button}>
            <Text style = {styles.text}> Update Picture</Text></TouchableOpacity>
        </View>
      )
    }
  }
}

