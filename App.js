import { StatusBar } from "expo-status-bar";
import { Image } from "react-native";
import {
  CallsScreen,
  DetailsScreen,
  HomeScreen,
  ProfileScreen,
  SettingsScreen,
} from "./screens";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/login";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseApp } from "./firebaseConfig";
import { useAuthStore } from "./store";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const unAuthStack = createNativeStackNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: "#e91e63",
        tabBarShowLabel: false,
        tabBarStyle: { height: 60, borderColor: "#fff" },
      }}
    >
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Image source={require("./assets/images/icons/profile.png")} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Calls",
          tabBarIcon: ({ color, size }) => (
            <Image source={require("./assets/images/icons/settingsicn.png")} />
          ),
        }}
      />
      <Tab.Screen
        name="Calls"
        component={CallsScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Image source={require("./assets/images/icons/call.png")} />
          ),
          tabBarBadge: 3,
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Image source={require("./assets/images/icons/message.png")} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const auth = getAuth(firebaseApp);
  // const [user, setUser] = useState();
  const { user, setUser } = useAuthStore();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Authenticated! " + user.uid);
        setUser(user);
      } else {
        console.log("error");
      }
    });
  }, []);
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {user ? (
        <Stack.Navigator
          initialRouteName="Main"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Main" component={MyTabs} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      ) : (
        <unAuthStack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <unAuthStack.Screen name="Login" component={LoginScreen} />
        </unAuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}
