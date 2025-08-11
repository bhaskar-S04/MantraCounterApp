import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Button, StyleSheet, TextInput } from "react-native";
import {useAudioPlayer} from "expo-audio";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(0);
  const [tempTarget, setTempTarget] = useState("");
  
  const player = useAudioPlayer(require('./assets/beep-125033.mp3'));


  useEffect(() => {
    const loadData = async () => {
    try{
      const savedCount = await AsyncStorage.getItem("count");
      const savedTarget = await AsyncStorage.getItem("target");
      if (savedCount !== null) setCount(parseInt(savedCount));
      if (savedTarget !== null) setTarget(parseInt(savedTarget));
      } catch (error) {
      console.log("Error loading data:", error);
      }
    };
    loadData();
  }, []);


  useEffect(() => {
    AsyncStorage.setItem("count", count.toString());
  }, [count]);

  useEffect(()=>{
    if (target > 0) {
      AsyncStorage.setItem("target", target.toString());
    }
  }, [target]);


    const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    if (newCount === target && player) {
      player.seekTo(0);
      player.play();
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
  container: {flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white"},
  counter: { fontSize: 40, marginBottom: 30 },
  bigButton: { backgroundColor: "orange", padding: 40, borderRadius: 100 },
  buttonText: { fontSize: 24, color: "white" },
  row: { flexDirection: "row", marginTop: 20, alignItems: "center" },
  input: { borderWidth: 1, borderColor: "white", padding: 10, width: 100, marginHorizontal: 10},
});