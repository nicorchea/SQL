import React, { Component, useRef } from "react";
import { Button, Text, View, StyleSheet, TextInput, TouchableOpacity, Share } from "react-native";
import Constants from "expo-constants";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import ViewShot from "react-native-view-shot";
import QRCode from "react-native-qrcode-svg";

export default function App() {
  const [QRvalue, setQRValue] = React.useState("");
  const ref = React.useRef();
  const viewShotRef = useRef();

  async function captureViewShot() {
    const imageURI = await viewShotRef.current.capture();

    console.log(imageURI);

    try {
      let filename = "share.gif"; // or some other way to generate filename
      let filepath = `${FileSystem.documentDirectory}/${filename}`;
      await FileSystem.writeAsStringAsync(filepath, imageURI, { encoding: "base64" });
      await Sharing.shareAsync(filepath, { mimeType: "image/gif" });
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <View style={styles.container}>
      <Button title="COMPARTIR" />
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Generate QRCode</Text>
        <View style={styles.row}>
          <TextInput placeholder="Add Value to QRCode" style={styles.textInput} autoCapitalize="none" value={QRvalue} onChangeText={setQRValue} />
        </View>
        <ViewShot ref={viewShotRef} options={{ format: "png", quality: 1.0, result: "base64" }}>
          <View>
            <QRCode size={300} value={QRvalue ? QRvalue : "NA"} getRef={ref} />
          </View>
        </ViewShot>
      </View>
      <View style={styles.sectionContainer}>
        <TouchableOpacity style={styles.newButton} onPress={() => captureViewShot()}>
          <Text style={[styles.sectionDescription, { color: "#fff", fontWeight: "900" }]}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  highlight: {
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  textInput: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlign: "center",
    marginRight: 20,
    marginVertical: 20,
    borderRadius: 20,
    width: 162,
    borderWidth: 1,
    borderStyle: "solid",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  newButton: {
    backgroundColor: "deepskyblue",
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 75,
    borderRadius: 20,
    paddingBottom: 17,
  },
  Button: {
    backgroundColor: "deepskyblue",
    marginTop: 32,
    marginRight: 50,
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 20,
    paddingBottom: 17,
  },
});
