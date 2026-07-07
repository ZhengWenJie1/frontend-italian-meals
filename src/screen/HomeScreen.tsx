import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import FavoriteButton from "../components/FavoriteButton";
import { useFavorites } from "../context/FavoriteContext";
import { fetchItalianMeals } from "../services/mealsApi";
import { getThemeColors } from "../theme/colors";
import { createSharedStyles } from "../theme/styles";

export default function HomeScreen({ navigation, isDarkMode = false, layoutPreference = "list" }: any) {
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
  const [items, setItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState("");
  const [viewMode, setViewMode] = useState<"all" | "favorites">("all");
  const { favoriteIds, isLoading: favoritesLoading } = useFavorites();
  const colors = getThemeColors(isDarkMode);
  const shared = createSharedStyles(colors);
  const { width } = useWindowDimensions();
  const isWide = width >= 600;
  const numColumns = layoutPreference === "grid" ? 2 : 1;
  const useGrid = numColumns > 1;

  const visibleItems =
    (viewMode === "favorites" ? items.filter((item) => favoriteIds.includes(item.idMeal)) : items).filter((item) =>
      item.strMeal.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
      <View style={shared.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (status === "error") {
    return (
      <View style={shared.center}>
        <Text style={[styles.error, { color: colors.danger }]}>{message}</Text>
        <TouchableOpacity style={[styles.btn, { backgroundColor: colors.danger }]} onPress={loadMeals}>
          <Text style={styles.btnText}>Riprova</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.searchRow}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.surface, borderColor: colors.inputBorder, color: colors.text }]}
          placeholder="Cerca un piatto..."
          placeholderTextColor={colors.mutedText}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[
            styles.filterBtn,
            { borderColor: colors.danger },
            viewMode === "all" && [styles.filterBtnActive, { backgroundColor: colors.danger }],
          ]}
          onPress={() => setViewMode("all")}
        >
          <Text style={[styles.filterText, { color: colors.danger }, viewMode === "all" && [styles.filterTextActive, { color: colors.surface }] ]}>
            Lista completa
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterBtn,
            { borderColor: colors.danger },
            viewMode === "favorites" && [styles.filterBtnActive, { backgroundColor: colors.danger }],
          ]}
          onPress={() => setViewMode("favorites")}
        >
          <Text style={[styles.filterText, { color: colors.danger }, viewMode === "favorites" && [styles.filterTextActive, { color: colors.surface }] ]}>
            Solo preferiti
          </Text>
        </TouchableOpacity>
      </View>

      {visibleItems.length === 0 ? (
        <View style={shared.center}>
          <Text style={shared.emptyText}>
            {viewMode === "favorites" ? "Nessun preferito ancora." : "Nessun piatto trovato."}
          </Text>
        </View>
      ) : (
        <FlatList
          key={numColumns}
          numColumns={numColumns}
          columnWrapperStyle={useGrid ? { gap: 12 } : undefined}
          contentContainerStyle={shared.flatListContent}
          data={visibleItems}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[shared.listItem, useGrid && { flex: 1 }]}
              onPress={() => navigation.navigate("Details", { id: item.idMeal })}
            >
              <Image source={{ uri: item.strMealThumb }} style={styles.thumb} />
              <View style={[shared.rowCenter, styles.row]}>
                <Text style={shared.listTitle} numberOfLines={2} ellipsizeMode="tail">
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
  error: { fontSize: 16, marginBottom: 16, textAlign: "center" },
  btn: { padding: 14, borderRadius: 8 },
  btnText: { color: "#fff", fontWeight: "bold" },
  thumb: { width: "100%", height: 160 },
  row: { justifyContent: "space-between", paddingHorizontal: 12, paddingVertical: 8 },
  headerButton: { marginRight: 12, padding: 4 },
  headerButtonText: { fontSize: 20 },
  filterRow: { flexDirection: "row", paddingHorizontal: 16, paddingTop: 12, gap: 8 },
  filterBtn: { flex: 1, borderRadius: 999, borderWidth: 1, borderColor: "#e74c3c", paddingVertical: 10, alignItems: "center" },
  filterBtnActive: { backgroundColor: "#e74c3c" },
  filterText: { color: "#e74c3c", fontWeight: "600" },
  filterTextActive: { color: "#fff" },
  searchRow: { paddingHorizontal: 16, paddingTop: 16 },
  searchInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
});
