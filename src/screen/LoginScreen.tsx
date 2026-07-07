import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { validateLogin } from "../services/auth";

type LoginScreenProps = {
  navigation: any;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const emailOk = email.includes("@");
  const passwordOk = password.length >= 6;
  const formOk = emailOk && passwordOk;

  function submit() {
    setSubmitted(true);
    setError("");
    
    if (formOk) {
      const user = validateLogin(email, password);
      if (user) {
        navigation.replace("Home", { user });
      } else {
        setError("Email o password non validi");
      }
    }
  }

  return (
    <View style={s.container}>
      <Text style={s.title}>Sign in</Text>

      <TextInput
        style={s.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {submitted && !emailOk && (
        <Text style={s.error}>Email non valida (manca @)</Text>
      )}

      <TextInput
        style={s.input}
        placeholder="Password (min 6 caratteri)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {submitted && !passwordOk && (
        <Text style={s.error}>Troppo corta (min 6 caratteri)</Text>
      )}

      {error && <Text style={s.error}>{error}</Text>}

      <TouchableOpacity
        style={[s.btn, !formOk && s.btnDisabled]}
        disabled={!formOk}
        onPress={submit}
      >
        <Text style={s.btnText}>Accedi</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F7F7F7",
  },
  title: { fontSize: 26, fontWeight: "500", marginBottom: 24, color: "#111111" },
  input: {
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#111111",
  },
  error: { color: "#f71010", fontSize: 13, marginBottom: 8 },
  btn: {
    backgroundColor: "#0f0000",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: "#ffffff", fontWeight: "500", fontSize: 16 },
  success: { color: "#2b1919", textAlign: "center", marginTop: 12 },
});
