import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FavoriteButton from "../components/FavoriteButton";
import { useFavorites } from "../context/FavoriteContext";
import { fetchItalianMeals } from "../services/mealsApi";

export default function HomeScreen({ navigation }: any) {
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [items, setItems] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [viewMode, setViewMode] = useState<"all" | "favorites">("all");
  const { favoriteIds, isLoading: favoritesLoading } = useFavorites();

  const visibleItems =
    viewMode === "favorites"
      ? items.filter((item) => favoriteIds.includes(item.idMeal))
      : items;

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

  useEffect(() => {
    loadMeals();
  }, []);

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

  if (status === "loading" || favoritesLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e74c3c" />
      </View>
    );
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
    <View style={{ flex: 1 }}>
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterBtn, viewMode === "all" && styles.filterBtnActive]}
          onPress={() => setViewMode("all")}
        >
          <Text style={[styles.filterText, viewMode === "all" && styles.filterTextActive]}>
            Lista completa
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterBtn, viewMode === "favorites" && styles.filterBtnActive]}
          onPress={() => setViewMode("favorites")}
        >
          <Text style={[styles.filterText, viewMode === "favorites" && styles.filterTextActive]}>
            Solo preferiti
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === "favorites" && visibleItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nessun preferito ancora.</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 16 }}
          data={visibleItems}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("Details", { id: item.idMeal })}
            >
              <Image source={{ uri: item.strMealThumb }} style={styles.thumb} />
              <View style={styles.row}>
                <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                  {item.strMeal}
                </Text>
                <FavoriteButton id={item.idMeal} />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  error: { fontSize: 16, color: "red", marginBottom: 16, textAlign: "center" },
  btn: { backgroundColor: "#e74c3c", padding: 14, borderRadius: 8 },
  btnText: { color: "#fff", fontWeight: "bold" },
  card: { backgroundColor: "#fff", borderRadius: 10, marginBottom: 14, elevation: 2, overflow: "hidden" },
  thumb: { width: "100%", height: 160 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, paddingVertical: 8 },
  name: { fontSize: 16, fontWeight: "bold", flex: 1, marginRight: 8 },
  headerButton: { marginRight: 12, padding: 4 },
  headerButtonText: { fontSize: 20 },
  filterRow: { flexDirection: "row", paddingHorizontal: 16, paddingTop: 12, gap: 8 },
  filterBtn: { flex: 1, borderRadius: 999, borderWidth: 1, borderColor: "#e74c3c", paddingVertical: 10, alignItems: "center" },
  filterBtnActive: { backgroundColor: "#e74c3c" },
  filterText: { color: "#e74c3c", fontWeight: "600" },
  filterTextActive: { color: "#fff" },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  emptyText: { color: "#666", textAlign: "center" },
});
