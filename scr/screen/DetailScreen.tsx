import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { BASE } from "../services/mealsApi";

export default function DetailScreen({ route, navigation }: any) {
  const id = route.params?.id;

  if (!id) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Non Valido</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Torna indietro</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const product = BASE.find((p) => p.id === id);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Non trovato</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Torna indietro</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!id || typeof id !== "string") {
    return <Text>Invalid deep link</Text>;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.productId}>ID: {product.id}</Text>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
        <Text style={styles.btnText}>← Torna indietro</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  name: { fontSize: 20, fontWeight: "bold" },
  price: { fontSize: 15, color: "#555", marginTop: 4 },
  description: { fontSize: 14, color: "#666", marginTop: 8 },
  productId: { color: "#999", marginBottom: 32 },
  error: { fontSize: 18, color: "red", marginBottom: 20 },
  back: { color: "#007AFF", fontSize: 16 },
  btn: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
