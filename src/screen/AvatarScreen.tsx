import React, {useState} from "react";
import {Image, Pressable, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SettingRow } from "../components/SettingRow";

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
};

export default function AvatarScreen({ navigation }: AvatarScreenProps) {
  const [name, setName] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
 
  const nameTooShort = name.length > 0 && name.length < 2;

  function handleLogout() {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  }
 
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F2F2F7" }}>
      <Text style={{ fontSize: 28, fontWeight: "700", padding: 16 }}>Profilo</Text>
 
      <SettingRow
        label="Name"
        right={
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            style={{
              borderWidth: 1,
              borderColor: nameTooShort ? "red" : "#ccc",
              borderRadius: 8,
              padding: 6,
              width: 140,
              textAlign: "right",
            }}
          />
        }
      />
      {nameTooShort && (
        <Text style={{ color: "red", fontSize: 12, paddingHorizontal: 16 }}>
          Name is too short
        </Text>
      )}
 
      <SettingRow
        label="Notifications"
        right={
          <Switch value={notifications} onValueChange={setNotifications} />
        }
      />
 
      <SettingRow
        label="Dark mode"
        right={
          <Switch value={darkMode} onValueChange={setDarkMode} />
        }
      />

      <SettingRow
        label="Logout"
        right={
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: "600" },
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
    backgroundColor: "#D63B3B",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
});