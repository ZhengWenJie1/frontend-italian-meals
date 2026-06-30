import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  FlatList, Text, TouchableOpacity, View,
  StyleSheet, ActivityIndicator, Image,
} from "react-native";
import { fetchItalianMeals } from "../services/mealsApi";
import Avatar from "./AvatarScreen";

export default function HomeScreen({ navigation, route }: any) {
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [items, setItems] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  
  async function loadMeals() {
    setStatus("loading");
    try {
      const data = await fetchItalianMeals();
      if (data.length === 0) {
        setStatus("error");
        setMessage("Nessun piatto italiano disponibile");
      } else {
        setItems(data);
        setStatus("success");
      }
    } catch (e: any) {
      setStatus("error");
      setMessage(e.message ?? "Errore di rete");
    }
  }

  useEffect(() => { loadMeals(); }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Italian Meals",
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Avatar")}
          style={styles.headerButton}
          accessibilityLabel="Vai al profilo"
        >
          <Text style={styles.headerButtonText}>👤</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (status === "loading") {
    return <View style={styles.center}><ActivityIndicator size="large" color="#e74c3c" /></View>;
  }

  if (status === "error") {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{message}</Text>
        <TouchableOpacity style={styles.btn} onPress={loadMeals}>
          <Text style={styles.btnText}>Riprova</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={{ padding: 16 }}
      data={items}
      keyExtractor={(item) => item.idMeal}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Details", { id: item.idMeal })}
        >
          <Image source={{ uri: item.strMealThumb }} style={styles.thumb} />
          <Text style={styles.name}>{item.strMeal}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  error: { fontSize: 16, color: "red", marginBottom: 16, textAlign: "center" },
  btn: { backgroundColor: "#e74c3c", padding: 14, borderRadius: 8 },
  btnText: { color: "#fff", fontWeight: "bold" },
  card: { backgroundColor: "#fff", borderRadius: 10, marginBottom: 14, elevation: 2, overflow: "hidden" },
  thumb: { width: "100%", height: 160 },
  name: { fontSize: 16, fontWeight: "bold", padding: 12 },
  headerButton: { marginRight: 12, padding: 4 },
  headerButtonText: { fontSize: 20 },
});
