import React, {useEffect, useState} from "react";
import {Image, Linking, Pressable, StyleSheet, Switch, Text, TextInput, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SettingRow } from "../components/SettingRow";
import { loadThemeMode, saveThemeMode } from "../services/storage";
import { getThemeColors } from "../theme/colors";
import * as Location from "expo-location";

function Avatar({ uri }: { uri: string }) {
  const [failed, setFailed] = React.useState(false);
  return (
    <View style={styles.avatarWrap}>
      {failed ? (
        <Text style={{ textAlign: "center", lineHeight: 64 }}>?</Text>
      ) : (
        <Image
          source={{ uri }}
          style={{ width: 64, height: 64 }}
          onError={() => setFailed(true)}
        />
      )}
    </View>
  );
}

type AvatarScreenProps = {
  navigation: any;
  isDarkMode?: boolean;
  setIsDarkMode?: (value: boolean) => void;
  layoutPreference?: "list" | "grid";
  setLayoutPreference?: (value: "list" | "grid") => void;
};

export default function AvatarScreen({ navigation, isDarkMode = false, setIsDarkMode, layoutPreference = "list", setLayoutPreference }: AvatarScreenProps) {
  const [name, setName] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(isDarkMode);
  const [layoutMode, setLayoutMode] = useState(layoutPreference);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locLoading, setLocLoading] = useState(false);

  useEffect(() => {
    setDarkMode(isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    setLayoutMode(layoutPreference);
  }, [layoutPreference]);

  const colors = getThemeColors(darkMode);
  const nameTooShort = name.length > 0 && name.length < 2;

  function toggleTheme(value: boolean) {
    setDarkMode(value);
    setIsDarkMode?.(value);
  }

  function toggleLayout(value: "list" | "grid") {
    setLayoutMode(value);
    setLayoutPreference?.(value);
  }

  function handleLogout() {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  }

  async function selectLocation() {
    try {
      setLocLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permessi posizione negati", "Abilita la posizione nelle impostazioni per usare questa funzione.");
        setLocLoading(false);
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
    } catch (e: any) {
      Alert.alert("Errore", e.message ?? "Impossibile ottenere la posizione");
    } finally {
      setLocLoading(false);
    }
  }

  function openLocationSettings() {
    Linking.openSettings().catch(() => {
      Alert.alert("Errore", "Impossibile aprire le impostazioni del dispositivo.");
    });
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}> 
      <Text style={[styles.title, { color: colors.text }]}>Profilo</Text>

      <SettingRow
        label="Name"
        backgroundColor={colors.surface}
        borderColor={colors.border}
        labelColor={colors.text}
        right={
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={colors.mutedText}
            style={{
              borderWidth: 1,
              borderColor: nameTooShort ? colors.danger : colors.inputBorder,
              borderRadius: 8,
              padding: 6,
              width: 140,
              textAlign: "right",
              backgroundColor: colors.surface,
              color: colors.text,
            }}
          />
        }
      />

      <SettingRow
        label="Posizione"
        backgroundColor={colors.surface}
        borderColor={colors.border}
        labelColor={colors.text}
        right={
          <View style={{ alignItems: "flex-end" }}>
            <View style={styles.locationButtonRow}>
              <Pressable
                style={[styles.button, { borderColor: colors.border, backgroundColor: colors.surface, marginRight: 8 }]}
                onPress={selectLocation}
              >
                <Text style={[styles.buttonText, { color: colors.text }]}>{locLoading ? "Selezionando..." : "Richiedi posizione"}</Text>
              </Pressable>
              <Pressable
                style={[styles.button, { borderColor: colors.border, backgroundColor: colors.surface }]}
                onPress={openLocationSettings}
              >
                <Text style={[styles.buttonText, { color: colors.text }]}>Impostazioni</Text>
              </Pressable>
            </View>
            {location && (
              <Text style={{ marginTop: 6, color: colors.mutedText }}>
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </Text>
            )}
          </View>
        }
      />
      {nameTooShort && (
        <Text style={{ color: colors.danger, fontSize: 12, paddingHorizontal: 16 }}>
          Name is too short
        </Text>
      )}

      <SettingRow
        label="Notifications"
        backgroundColor={colors.surface}
        borderColor={colors.border}
        labelColor={colors.text}
        right={
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            thumbColor={notifications ? colors.primary : "#f4f3f4"}
            trackColor={{ false: "#767577", true: colors.primary }}
          />
        }
      />

      <SettingRow
        label="Dark mode"
        backgroundColor={colors.surface}
        borderColor={colors.border}
        labelColor={colors.text}
        right={
          <Switch
            value={darkMode}
            onValueChange={toggleTheme}
            thumbColor={darkMode ? colors.primary : "#f4f3f4"}
            trackColor={{ false: "#767577", true: colors.primary }}
          />
        }
      />

      <SettingRow
        label="Layout"
        backgroundColor={colors.surface}
        borderColor={colors.border}
        labelColor={colors.text}
        right={
          <View style={styles.segmentedControl}>
            <Pressable
              style={[styles.segmentButton, layoutMode === "list" && [styles.segmentButtonActive, { backgroundColor: colors.primary }]]}
              onPress={() => toggleLayout("list")}
            >
              <Text style={[styles.segmentText, layoutMode === "list" && { color: colors.surface }]}>Lista</Text>
            </Pressable>
            <Pressable
              style={[styles.segmentButton, layoutMode === "grid" && [styles.segmentButtonActive, { backgroundColor: colors.primary }]]}
              onPress={() => toggleLayout("grid")}
            >
              <Text style={[styles.segmentText, layoutMode === "grid" && { color: colors.surface }]}>Griglia</Text>
            </Pressable>
          </View>
        }
      />

      <SettingRow
        label="Logout"
        backgroundColor={colors.surface}
        borderColor={colors.border}
        labelColor={colors.text}
        right={
          <Pressable style={[styles.logoutButton, { backgroundColor: colors.danger }]} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  title: { fontSize: 28, fontWeight: "700", padding: 16 },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    borderWidth: 1,
  },
  button: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  buttonText: { fontWeight: "600" },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
  segmentedControl: {
    flexDirection: "row",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d0d7de",
    overflow: "hidden",
  },
  segmentButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  locationButtonRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  segmentButtonActive: {
    backgroundColor: "#e74c3c",
  },
  segmentText: {
    fontSize: 13,
    fontWeight: "600",
  },
});