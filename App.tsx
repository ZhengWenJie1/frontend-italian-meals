import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screen/HomeScreen";
import DetailScreen from "./src/screen/DetailScreen";
import LoginScreen from "./src/screen/LoginScreen";
import AvatarScreen from "./src/screen/AvatarScreen";
import { FavoritesProvider } from "./src/context/FavoriteContext";

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
  return (
    <FavoritesProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Avatar" component={AvatarScreen} />
          <Stack.Screen name="Details" component={DetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}