import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useFavorites } from "../context/FavoriteContext";

type Props = { id: string; size?: number };

export default function FavoriteButton({ id, size = 22 }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(id);

  async function handlePress() {
    await toggleFavorite(id);
  }

  return (
    <TouchableOpacity onPress={handlePress} style={styles.btn} accessibilityRole="button">
      <Text style={[styles.icon, { fontSize: size }]}>{fav ? "❤️" : "🤍"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { padding: 8 },
  icon: {},
});
