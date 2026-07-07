import React from "react";
import { StyleSheet, Text, View } from "react-native";
 
interface SettingRowProps {
  label: string;
  right: React.ReactNode;
  backgroundColor?: string;
  labelColor?: string;
  borderColor?: string;
}
 
export function SettingRow({
  label,
  right,
  backgroundColor = "#fff",
  labelColor = "#1A1A1A",
  borderColor = "#E0E0E0",
}: SettingRowProps) {
  return (
    <View style={[styles.row, { backgroundColor, borderBottomColor: borderColor }]}> 
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
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
  },
  label: { fontSize: 16 },
});
 