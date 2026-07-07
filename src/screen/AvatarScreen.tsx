import React, {useEffect, useState} from "react";
import {Image, Pressable, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SettingRow } from "../components/SettingRow";
import { loadThemeMode, saveThemeMode } from "../services/storage";
import { getThemeColors } from "../theme/colors";

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
  segmentButtonActive: {
    backgroundColor: "#e74c3c",
  },
  segmentText: {
    fontSize: 13,
    fontWeight: "600",
  },
});