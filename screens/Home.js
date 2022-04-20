import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import {
  onSnapshot,
  addDoc,
  removeDoc,
  updateDoc,
} from "../services/collections";
import firebase from "firebase/compat/app";

const ListButton = ({ title, color, onPress, onDelete, onOptions }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.itemContainer, { backgroundColor: color }]}
    >
      <View>
        <Text style={styles.itemTitle}>{title}</Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={onOptions}>
          <Ionicons name="options-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Ionicons name="trash-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const renderAddListIcon = (navigation, addItemToLists) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity
        style={{ marginRight: 10 }}
        onPress={() => navigation.navigate("Settings")}
      >
        <Ionicons name="settings" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginRight: 10 }}
        onPress={() => navigation.navigate("TestPage")}
      >
        <Ionicons name="rocket" size={24} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          marginRight: 10,
          borderWidth: 1,
          borderRadius: 3,
          borderColor: "black",
        }}
        onPress={() =>
          navigation.navigate("Edit", { saveChanges: addItemToLists })
        }
      >
        <MaterialIcons name="add" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default ({ navigation }) => {
  const [lists, setLists] = useState([]);
  const listsRef = firebase
    .firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .collection("lists");

  useEffect(() => {
    onSnapshot(
      listsRef,
      (newLists) => {
        setLists(newLists);
      },
      {
        sort: (a, b) => {
          if (a.index < b.index) {
            return -1;
          }
          if (a.index > b.index) {
            return 1;
          }
          return 0;
        },
      }
    );
  }, []);

  const addItemToLists = ({ title, color }) => {
    const index = lists.length > 1 ? lists[lists.length - 1].index + 1 : 0;
    addDoc(listsRef, { title, color, index });
  };

  const removeItemFromList = (id) => {
    removeDoc(listsRef, id);
  };

  const updateItemFormLists = (id, item) => {
    updateDoc(listsRef, id, item)
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => renderAddListIcon(navigation, addItemToLists),
    });
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={lists}
        renderItem={({ item: { title, color, id, index }}) => {
          return (
            <ListButton
              title={title}
              color={color}
              navigation={navigation}
              onPress={() => {
                navigation.navigate("ToDoList", { title, color, listId: id });
              }}
              onOptions={() => {
                navigation.navigate("Edit", {
                  title,
                  color,
                  saveChanges: (newItem) => 
                    updateItemFormLists(id, {index, ...newItem}),
                });
              }}
              onDelete={() => removeItemFromList(id)}
            />
          );
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  itemTitle: { fontSize: 24, padding: 5, color: "white" },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 100,
    flex: 1,
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
  },
  icon: {
    padding: 5,
    fontSize: 24,
  },
  centredView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
