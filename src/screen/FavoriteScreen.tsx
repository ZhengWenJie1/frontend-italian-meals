import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import FavoriteButton from "../components/FavoriteButton";
import { useFavorites } from "../context/FavoriteContext";
import { fetchItalianMeals } from "../services/mealsApi";

export default function FavoriteScreen() {
  const { favoriteIds, isLoading } = useFavorites();
  const [meals, setMeals] = useState<any[]>([]);
  const [loadingMeals, setLoadingMeals] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoadingMeals(true);
      const allMeals = await fetchItalianMeals();

      if (!isMounted) return;

      const favorites = allMeals.filter((meal: any) =>
        favoriteIds.includes(meal.idMeal)
      );

      setMeals(favorites);
      setLoadingMeals(false);
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [favoriteIds]);

  if (isLoading || loadingMeals) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#e74c3c" />
      </View>
    );
  }

  if (favoriteIds.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>
          Nessun preferito ancora. Tocca ❤️ su un piatto dalla lista.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={{ padding: 16 }}
      data={meals}
      keyExtractor={(item) => item.idMeal}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.name}>{item.strMeal}</Text>
          <FavoriteButton id={item.idMeal} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  emptyText: { textAlign: "center", color: "#666" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: "600", flex: 1, marginRight: 8 },
});