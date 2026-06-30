import React, { useEffect, useState } from "react";
import {
  Text, TouchableOpacity, View, StyleSheet,
  ActivityIndicator, Image, ScrollView,
} from "react-native";
import { fetchMealById } from "../services/mealsApi";
import HomeScreen from "./HomeScreen";

export default function DetailScreen({ route, navigation }: any) {
  const id = route.params?.id;
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [meal, setMeal] = useState<any>(null);
  const [message, setMessage] = useState("");

  async function loadMeal() {
    setStatus("loading");
    try {
      const data = await fetchMealById(id);
      if (!data) { setStatus("error"); setMessage("Piatto non trovato"); return; }
      setMeal(data);
      setStatus("success");
    } catch (e: any) {
      setStatus("error");
      setMessage(e.message ?? "Errore di rete");
    }
  }

  useEffect(() => { loadMeal(); }, [id]);

  if (status === "loading") {
    return <View style={styles.center}><ActivityIndicator size="large" color="#e74c3c" /></View>;
  }

  if (status === "error") {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{message}</Text>
        <TouchableOpacity style={styles.btn} onPress={loadMeal}>
          <Text style={styles.btnText}>Riprova</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
      <Text style={styles.name}>{meal.strMeal}</Text>
      <Text style={styles.section}>Istruzioni</Text>
      <Text style={styles.instructions}>{meal.strInstructions}</Text>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack(HomeScreen)}>
        <Text style={styles.btnText}>← Torna indietro</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  error: { fontSize: 16, color: "red", marginBottom: 16, textAlign: "center" },
  image: { width: "100%", height: 220, borderRadius: 10 },
  name: { fontSize: 22, fontWeight: "bold", marginTop: 12, marginBottom: 8 },
  section: { fontSize: 16, fontWeight: "bold", marginTop: 12, marginBottom: 4, color: "#e74c3c" },
  instructions: { fontSize: 14, color: "#444", lineHeight: 22 },
  btn: { backgroundColor: "#e74c3c", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 20 },
  btnText: { color: "#fff", fontWeight: "bold" },
});
