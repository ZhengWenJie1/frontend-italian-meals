import AsyncStorage from "@react-native-async-storage/async-storage";

export const FAVORITES_KEY = "app:v1:favs";
export const THEME_KEY = "app:v1:theme";

export async function loadFavoriteIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export async function saveFavoriteIds(ids: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch {

  }
}

export async function loadThemeMode(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(THEME_KEY);
    return raw === "dark";
  } catch {
    return false;
  }
}

export async function saveThemeMode(isDark: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  } catch {

  }
}