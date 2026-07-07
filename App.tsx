import React, { useEffect, useMemo, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screen/HomeScreen";
import DetailScreen from "./src/screen/DetailScreen";
import LoginScreen from "./src/screen/LoginScreen";
import AvatarScreen from "./src/screen/AvatarScreen";
import { FavoritesProvider } from "./src/context/FavoriteContext";
import { loadThemeMode, saveThemeMode } from "./src/services/storage";
import { getThemeColors } from "./src/theme/colors";

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ["myapp://"],
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

  useEffect(() => {
    void (async () => {
      const savedTheme = await loadThemeMode();
      setIsDarkMode(savedTheme);
    })();
  }, []);

  useEffect(() => {
    void saveThemeMode(isDarkMode);
  }, [isDarkMode]);

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
            {({ navigation }) => <HomeScreen navigation={navigation} isDarkMode={isDarkMode} />}
          </Stack.Screen>
          <Stack.Screen name="Avatar">
            {({ navigation }) => <AvatarScreen navigation={navigation} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />}
          </Stack.Screen>
          <Stack.Screen name="Details">
            {({ navigation, route }) => <DetailScreen navigation={navigation} route={route} isDarkMode={isDarkMode} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}