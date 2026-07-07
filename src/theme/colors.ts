export type AppTheme = {
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  border: string;
  inputBorder: string;
  primary: string;
  danger: string;
};

export const lightTheme: AppTheme = {
  background: "#F2F2F7",
  surface: "#FFFFFF",
  text: "#1A1A1A",
  mutedText: "#666666",
  border: "#E0E0E0",
  inputBorder: "#CCCCCC",
  primary: "#D63B3B",
  danger: "#D63B3B",
};

export const darkTheme: AppTheme = {
  background: "#1C1C1E",
  surface: "#2C2C2E",
  text: "#F5F5F5",
  mutedText: "#BDBDBD",
  border: "#3A3A3C",
  inputBorder: "#8E8E93",
  primary: "#FF6B6B",
  danger: "#D63B3B",
};

export function getThemeColors(isDark: boolean): AppTheme {
  return isDark ? darkTheme : lightTheme;
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
};
