import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAuthStore } from "../store";
import { getAuth, signOut } from "firebase/auth";
import { firebaseApp } from "../firebaseConfig";

const ProfileScreen = ({ navigation }) => {
  const auth = getAuth(firebaseApp);
  const { user, setUser } = useAuthStore();
  const logoutFunction = async () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setUser(null);
      })
      .catch((error) => {
        // An error happened.
      });
  };
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text>Profile</Text>
      <Text>Logged in as : {user.email}</Text>
      <TouchableOpacity
        onPress={() => {
          user ? logoutFunction() : navigation.push("Login");
        }}
      >
        <Text>{user ? "Logout" : "Login"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
