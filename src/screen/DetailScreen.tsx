import React, { useEffect, useState } from "react";
import {
  Text, TouchableOpacity, View, StyleSheet,
  ActivityIndicator, Image, ScrollView,
} from "react-native";
import { fetchMealById } from "../services/mealsApi";
import FavoriteButton from "../components/FavoriteButton";
import { getThemeColors } from "../theme/colors";

export default function DetailScreen({ route, navigation, isDarkMode = false }: any) {
  const id = route.params?.id;
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [meal, setMeal] = useState<any>(null);
  const [message, setMessage] = useState("");
  const colors = getThemeColors(isDarkMode);

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
    return <View style={[styles.center, { backgroundColor: colors.background }]}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  if (status === "error") {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}> 
        <Text style={[styles.error, { color: colors.danger }]}>{message}</Text>
        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.danger }]} onPress={loadMeal}>
          <Text style={styles.btnText}>Riprova</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: colors.background }}>
      <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
      <View style={styles.titleRow}>
        <Text style={[styles.name, { color: colors.text }]}>{meal.strMeal}</Text>
        <FavoriteButton id={meal.idMeal} />
      </View>
      <Text style={[styles.section, { color: colors.danger }]}>Istruzioni</Text>
      <Text style={[styles.instructions, { color: colors.mutedText }]}>{meal.strInstructions}</Text>
      <TouchableOpacity style={[styles.btn, { backgroundColor: colors.danger }]} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.btnText}>← Torna indietro</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  error: { fontSize: 16, marginBottom: 16, textAlign: "center" },
  image: { width: "100%", height: 220, borderRadius: 10 },
  titleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12 },
  name: { fontSize: 22, fontWeight: "bold", marginBottom: 8, flex: 1, marginRight: 8 },
  section: { fontSize: 16, fontWeight: "bold", marginTop: 12, marginBottom: 4 },
  instructions: { fontSize: 14, lineHeight: 22 },
  btn: { padding: 14, borderRadius: 8, alignItems: "center", marginTop: 20 },
  btnText: { color: "#fff", fontWeight: "bold" },
});
