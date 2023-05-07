import {
  Camera,
  CameraType,
  onCameraReady,
  CameraPictureOptions,
} from "expo-camera";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from './Stylesheet.js';

export default function CameraSendToServer() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [camera, setCamera] = useState(null);

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
    console.log("Camera: ", type);
  }

  async function takePhoto() {
    if (camera) {
      const options = {
        quality: 0.5,
        base64: true,
        onPictureSaved: (data) => sendToServer(data),
      };
      const data = await camera.takePictureAsync(options);
    }
  }

  async function sendToServer(data) {
    console.log("HERE", data.uri);

    let res = await fetch(data.uri);
    let blob = await res.blob();

    return fetch("http://localhost:3333/api/1.0.0/user/" + await AsyncStorage.getItem("whatsthat_user_id") + "/photo", {
      method: "POST",
      headers: {
        "Content-Type": "image/png",
        "X-authorization": await AsyncStorage.getItem(
          "whatsthat_session_token"
        ),
      },
      body: blob,
    })
      .then(async (response) => {
        if (response.status == 200) {
            toast.show("Photo Uploaded!", {type: "success"} )
            console.log("OK");
          }else if (response.status == 400) {
            toast.show("Bad request", {type: "danger"} )
            console.log("Bad request");
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

      .catch((error) => {
        this.setState({ error: error });
        this.setState({ submitted: false });
      });
  }

  if (!permission || !permission.granted) {
    return <Text>No access to camera</Text>;
  } else {
    return (
      <View style={styles.container}>
        <Camera style={styles.camera} type={type} ref={(ref) => setCamera(ref)}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={takePhoto}>
              <Text style={styles.text}>Take Photo</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
    );
  }
}