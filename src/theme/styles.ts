import { StyleSheet } from "react-native";
import { AppTheme, spacing } from "./colors";

export function createSharedStyles(theme: AppTheme) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: theme.background },
    flatListContent: { padding: spacing.md },
    rowCenter: { flexDirection: "row", alignItems: "center" },
    listItem: {
      backgroundColor: theme.surface,
      borderRadius: 10,
      marginBottom: spacing.md,
      overflow: "hidden",
    },
    listTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.text,
      flex: 1,
      marginRight: spacing.sm,
      flexShrink: 1,
    },
    center: { flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.lg },
    emptyText: { textAlign: "center", color: theme.mutedText, fontSize: 15 },
  });
}
