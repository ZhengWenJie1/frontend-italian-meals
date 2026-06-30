import React from "react";
import { StyleSheet, Text, View } from "react-native";
 
interface SettingRowProps {
  label: string;
  right: React.ReactNode;
}
 
export function SettingRow({ label, right }: SettingRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {right}
    </View>
  );
}
 
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#fff",
  },
  label: { fontSize: 16, color: "#1A1A1A" },
});
 