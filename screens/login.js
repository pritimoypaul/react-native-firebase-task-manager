import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseApp } from "../firebaseConfig";

const LoginScreen = () => {
  const auth = getAuth(firebaseApp);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginFunction = async () => {
    console.log(email, password);
    if (email == null || email == "" || password == null || password == "") {
      return;
    }
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("user : " + user);
        setIsLoading(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("error : " + errorMessage);
        ToastAndroid.show("Could not Sign in!", ToastAndroid.SHORT);
        setIsLoading(false);
      });
  };

  const signupFunction = async () => {
    if (email == null || email == "" || password == null || password == "") {
      return;
    }
    setIsLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log("user : " + user);
        setIsLoading(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("error : " + errorMessage);
        ToastAndroid.show("Could not Sign up!", ToastAndroid.SHORT);
        setIsLoading(false);
      });
  };
  return (
    <View className="flex-1 justify-center items-center px-[24]">
      <Text className="font-bold text-lg">Enter Login Details to Continue</Text>
      <View className="w-full mt-4">
        <TextInput
          value={email}
          placeholder="email"
          className="p-3 border border-gray-300 rounded-md"
          onChangeText={(e) => setEmail(e)}
        />
        <TextInput
          value={password}
          placeholder="password"
          className="p-3 mt-2 border border-gray-300 rounded-md"
          secureTextEntry={true}
          onChangeText={(e) => setPassword(e)}
        />
        <TouchableOpacity
          className="mt-2 bg-black p-3 rounded-sm"
          onPress={() => {
            loginFunction();
          }}
          disabled={isLoading}
        >
          <Text className="text-white text-center">Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="mt-2 bg-black p-3 rounded-sm"
          onPress={() => {
            signupFunction();
          }}
          disabled={isLoading}
        >
          <Text className="text-white text-center">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
