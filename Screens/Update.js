import React, { Component } from "react";
import { Text, TextInput, View, Button, Alert, Touchable, TouchableOpacity } from "react-native";
import styles from './Stylesheet.js';
import { PasswordVerificationCheck } from "./ValidationCheck.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class Update extends Component {
    constructor(props) {
      super(props);
      this.state = {
        original_data: {},
        first_name: "",
        last_name: "",
        email: "",
        password: ""
      }
    }

    componentDidMount(){
        this.setState({
            original_data: this.props.route.params.data,
            first_name: this.props.route.params.data.first_name,
            last_name: this.props.route.params.data.last_name,
            email: this.props.route.params.data.email,
        }, () => {
            console.log(this.state)
        })
    }

     async updateProfile(){

        let data = {}

        if(this.state.first_name != this.state.original_data_first_name){
            data["first_name"] = this.state.first_name 
        }

        if(this.state.last_name != this.state.original_data_last_name){
            data["last_name"] = this.state.last_name 
        }

        if(this.state.email != this.state.original_data_email){
            data["email"] = this.state.email 
        }   

        if (this.state.password != ""){
            PasswordVerificationCheck(this.state.password)

            data["password"] = this.state.password
        }

        console.log(data)

        return fetch('http://localhost:3333/api/1.0.0/user/' + await AsyncStorage.getItem("whatsthat_user_id"), {
            method: "PATCH",
            headers: {
                "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token"),
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            if(response.status == 200){
              console.log("User info Updated Successfully")
            }else{
              throw "Something went wrong :("
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }

    render(){
        return (
            <View>
                <Text>Update Profile Information</Text>
                <Text>First Name</Text>
                <TextInput
                    value={this.state.first_name}
                    onChangeText={(val) => this.setState({"first_name": val})}
                />

                <Text>Last Name</Text>
                <TextInput
                    value={this.state.last_name}
                    onChangeText={(val) => this.setState({"last_name": val})}
                />
                
                <Text>Email</Text>
                <TextInput
                    value={this.state.email}
                    onChangeText={(val) => this.setState({"email": val})}
                />

                <Text>Password</Text>
                <TextInput
                    value={this.state.password}
                    onChangeText={(val) => this.setState({"password": val})}
                    secureTextEntry
                />

                <TouchableOpacity
                    onPress ={ () => this.updateProfile()}
                    style = {styles.button}
                ><Text style = {styles.text}>Update</Text></TouchableOpacity>
            </View>
        )
    }
}