import React, { useEffect, useMemo, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screen/HomeScreen";
import DetailScreen from "./src/screen/DetailScreen";
import LoginScreen from "./src/screen/LoginScreen";
import AvatarScreen from "./src/screen/AvatarScreen";
import { FavoritesProvider } from "./src/context/FavoriteContext";
import { loadLayoutPreference, loadThemeMode, saveLayoutPreference, saveThemeMode } from "./src/services/storage";
import { getThemeColors } from "./src/theme/colors";
import * as Linking from "expo-linking";
const Stack = createNativeStackNavigator();

const linking = {
  prefixes: [Linking.createURL("/"), "myapp://"],
  config: {
    screens: {
      Home: "home",
      Details: "dettagli/:id",
      Avatar: "avatar",
    },
  },
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [layoutPreference, setLayoutPreference] = useState<"list" | "grid">("list");

  useEffect(() => {
    void (async () => {
      const savedTheme = await loadThemeMode();
      const savedLayout = await loadLayoutPreference();
      setIsDarkMode(savedTheme);
      setLayoutPreference(savedLayout);
    })();
  }, []);

  useEffect(() => {
    void saveThemeMode(isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    void saveLayoutPreference(layoutPreference);
  }, [layoutPreference]);

  const theme = useMemo(() => getThemeColors(isDarkMode), [isDarkMode]);

  return (
    <FavoritesProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: theme.surface },
            headerTintColor: theme.text,
            contentStyle: { backgroundColor: theme.background },
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home">
            {({ navigation }) => <HomeScreen navigation={navigation} isDarkMode={isDarkMode} layoutPreference={layoutPreference} />}
          </Stack.Screen>
          <Stack.Screen name="Avatar">
            {({ navigation }) => (
              <AvatarScreen
                navigation={navigation}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                layoutPreference={layoutPreference}
                setLayoutPreference={setLayoutPreference}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Details">
            {({ navigation, route }) => <DetailScreen navigation={navigation} route={route} isDarkMode={isDarkMode} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}