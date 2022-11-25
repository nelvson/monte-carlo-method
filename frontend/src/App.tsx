import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";

import {appendUrlQuery, fetch} from './helper';

function calc(data: Array<{ x: number; y: number }>) {
  let circlePoints = 0;

  data.forEach((datum) => {
    let d = datum.x * datum.x + datum.y * datum.y;
    if (d <= 1) {
      circlePoints++;
    }
  });

  console.log((4 * circlePoints) / data.length);
}

export default function App() {
  let [numberOfPoints, setNumberOfPoints] = useState(0);
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={String(numberOfPoints)}
        onChangeText={(val) => {
          if (Number.isNaN(Number(val))) {
            setNumberOfPoints(0);
          } else {
            setNumberOfPoints(Number(val));
          }
        }}
        placeholder="Number of Points"
      />
      <Button
        onPress={async () => {
          let fetchData: {
            status: string;
            data: Array<{ x: number; y: number }>;
            message: string;
          } = await fetch(
            appendUrlQuery("/generatePoints", {
              numberOfPoints,
            })
          );

          calc(fetchData.data);
        }}
        title="Fetch"
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
