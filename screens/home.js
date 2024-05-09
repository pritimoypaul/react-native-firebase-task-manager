import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  documentId,
  getDocs,
  getFirestore,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { firebaseApp } from "../firebaseConfig";
import { AntDesign } from "@expo/vector-icons";
import { useAuthStore, useStore } from "../store";

const HomeScreen = ({ navigation }) => {
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const { updatedTime, setUpdatedTime } = useStore();
  const { user, setUser } = useAuthStore();
  const db = getFirestore(firebaseApp);

  const getData = async () => {
    let newTasks = [];

    const querySnapshot = await getDocs(
      query(
        collection(db, "task"),
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      )
    );
    querySnapshot.forEach((doc) => {
      let data = { ...doc.data(), id: doc.id };
      newTasks.push(data);
    });
    setTasks(newTasks);
    console.log(tasks);
  };

  const addData = async () => {
    console.log(text);
    // null check
    if (text == "") {
      return;
    }

    console.log("current time : " + Timestamp.now());
    try {
      setIsLoading(true);
      const docRef = await addDoc(collection(db, "task"), {
        uid: user.uid,
        text: text,
        description: description,
        isDone: false,
        createdAt: Timestamp.now(),
      });
      setIsLoading(false);
      getData();
    } catch (e) {
      setIsLoading(false);
    }
    setText("");
    setDescription("");
  };

  const deleteData = async (id) => {
    await deleteDoc(doc(db, "task", id));
    getData();
  };

  useEffect(() => {
    console.log(updatedTime);
    getData();
  }, [updatedTime]);
  return (
    <View className="flex-1">
      <View className="mt-[50] mx-[24]">
        <Text className="text-bold">Add New Task</Text>
        <View className="mt-2">
          <TextInput
            value={text}
            className="p-3 border border-gray-300 rounded-md"
            placeholder="type here.."
            onChangeText={(e) => {
              setText(e);
            }}
          />
          <TextInput
            multiline={true}
            numberOfLines={3}
            value={description}
            className="mt-2 p-3 border border-gray-300 rounded-md"
            placeholder="type here.."
            onChangeText={(e) => {
              setDescription(e);
            }}
          />
          <TouchableOpacity
            className="mt-2 bg-black p-3 rounded-sm"
            onPress={() => {
              addData();
            }}
            disabled={isLoading}
          >
            <Text className="text-white text-center">Submit</Text>
          </TouchableOpacity>
        </View>
        <View className="mt-2 h-[400]">
          <ScrollView showsVerticalScrollIndicator={false}>
            {tasks?.map((task) => (
              <TouchableOpacity
                key={task.id}
                onPress={() => navigation.navigate("Details", { id: task.id })}
              >
                <View className="bg-slate-50 my-2 p-3 rounded-sm flex-row justify-between">
                  <Text className={task.isDone ? "line-through" : ""}>
                    {task.text}
                  </Text>
                  <TouchableOpacity onPress={() => deleteData(task.id)}>
                    <AntDesign name="delete" size={18} color="black" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
