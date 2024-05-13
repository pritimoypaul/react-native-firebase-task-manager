import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { firebaseApp } from "../firebaseConfig";
import { useStore } from "../store";
import uploadImageFromDevice from "../utils/uploadImageFromDevice";

const DetailsScreen = ({ navigation, route }) => {
  const db = getFirestore(firebaseApp);
  const { updatedTime, setUpdatedTime } = useStore();
  const [id, setId] = useState("");
  const [data, setData] = useState({});
  const { width } = useWindowDimensions();
  const [imgURI, setImageURI] = useState(null);

  //get local file
  const handleLocalImageUpload = async () => {
    const fileURI = await uploadImageFromDevice();

    if (fileURI) {
      setImageURI(fileURI);
    }
  };

  // get data function
  const getData = async () => {
    console.log("this is the id: " + id);
    const docRef = doc(db, "task", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log({ ...docSnap.data(), id: docSnap.id });
      setData({ ...docSnap.data(), id: docSnap.id });
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  //update function
  const updateData = async (id, isDone) => {
    const docRef = doc(db, "task", id);
    await updateDoc(docRef, {
      isDone: !isDone,
    });
    getData();
    setUpdatedTime(updatedTime + 1);
  };

  // useEffect
  useEffect(() => {
    console.log(route.params?.id);
    setId(route.params?.id);
  }, [route.params?.id]);

  useEffect(() => {
    if (id == null || id == "") {
      return;
    }
    getData();
  }, [id]);

  return (
    <View className="pt-[50] px-[24]">
      <View className="flex-row justify-between">
        <Text className="font-bold">Details</Text>
        <Text className="text-blue-400">
          {data?.isDone ? "Done" : "Not Done"}
        </Text>
      </View>
      <Text className="text-xl mt-4">{data?.text}</Text>
      <Text>{data?.description}</Text>
      {imgURI && (
        <View className="mt-4">
          <Image
            className="rounded-lg"
            source={{ uri: imgURI }}
            resizeMode="contain"
            style={{ width: width - 48, height: width / 1 }}
          />
        </View>
      )}
      <TouchableOpacity
        className="mt-4 bg-blue-900 p-3 rounded-sm"
        onPress={() => handleLocalImageUpload()}
      >
        <Text className="text-white text-center">Update Image</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-4 bg-black p-3 rounded-sm"
        onPress={() => updateData(data.id, data.isDone)}
      >
        <Text className="text-white text-center">
          Mark as {data?.isDone ? "Not Done" : "Done"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DetailsScreen;
