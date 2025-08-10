import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Button, Vibration, StyleSheet, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(108);
  const [tempTarget, setTempTarget] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const savedCount = await AsyncStorage.getItem("count");
      const savedTarget = await AsyncStorage.getItem("target");
      if (savedCount) setCount(parseInt(savedCount));
      if (savedTarget) setTarget(parseInt(savedTarget));
    };
    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("count", count.toString());
    AsyncStorage.setItem("target", target.toString());
  }, [count, target]);

  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    if (newCount === target) {
      Vibration.vibrate();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.counter}>
        {count} / {target}
      </Text>

      <TouchableOpacity style={styles.bigButton} onPress={increment}>
        <Text style={styles.buttonText}>Chant</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <Button title="Reset" onPress={() => setCount(0)} />
        <TextInput style={styles.input} placeholder="Set Target" keyboardType="numeric" value={tempTarget} onChangeText={setTempTarget} />
        <Button title="Save Target"
          onPress={() => {
            if (tempTarget) {
              setTarget(parseInt(tempTarget));
              setTempTarget("");
            }
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  counter: { fontSize: 40, marginBottom: 30 },
  bigButton: { backgroundColor: "#ff9800", padding: 40, borderRadius: 100 },
  buttonText: { fontSize: 24, color: "#fff" },
  row: { flexDirection: "row", marginTop: 20, alignItems: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: 100,
    marginHorizontal: 10,
  },
});
