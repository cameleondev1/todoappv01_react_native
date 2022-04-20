import { NavigationContainer } from "@react-navigation/native";
import React, { useState, useLayoutEffect, useEffect } from "react";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Colors from "../constants/Colors";
import ToDoItem from "../components/ToDoItem";
import firebase from "firebase/compat/app";

import {
  onSnapshot,
  addDoc,
  removeDoc,
  updateDoc,
} from "../services/collections";

// add item component
const renderAddListIcon = (addItem) => {
  return (
    <TouchableOpacity
      onPress={() => addItem({ text: "", isCheked: false, isNewItem: true })}
    >
      <Text style={styles.icon}>+</Text>
    </TouchableOpacity>
  );
};
///////

export default ({ navigation, route }) => {
  let [toDoItems, setToDoItems] = useState([]);
  const [newItem, setNewItem] = useState();

  const toDoItemsRef = firebase
    .firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .collection("lists")
    .doc(route.params.listId)
    .collection("todoItems");

  useEffect(() => {
    onSnapshot(
        toDoItemsRef,
          (newToDoItems) => {
            setToDoItems(newToDoItems);
          },
          {
            sort: (a, b) => {
              if (a.isChecked && !b.isChecked) {
                return 1;
              }
              if (b.isChecked && !a.isChecked) {
                return -1;
              }
              return 0;
            },
          }
    );
  }, []);

  // add item to list function
  const addItemToLists = (item) => {
    setNewItem({ text: "", isChecked: false, new: true });
  };
  ///////

  // remove item from list function
  const removeItemFromList = (item) => {
    toDoItems.splice(item, 1);
    setToDoItems([...toDoItems]);
  };
  ///////

  //updateitem function
  const updateItem = (index, item) => {
    if (item.text === "") {
      item.text = "Untitled Item";
    }
    toDoItems[index] = item;
    setToDoItems([...toDoItems]);
  };
  ///////

  // render add item component
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => renderAddListIcon(addItemToLists),
    });
  });
  //////

  if (newItem) {
    toDoItems = [newItem, ...toDoItems];
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={toDoItems}
        renderItem={({ item: { text, isChecked, id, ...params }, index }) => {
          return (
            <ToDoItem
              {...params}
              text={text}
              isChecked={isChecked}
              onChecked={() => {
                let data = { text, isChecked: !isChecked };
                if (id) {
                  data.id = id;
                }
                addDoc(toDoItemsRef, data);
                // //get item by index
                // const toDoItem = toDoItems[index];
                // // change isChecked value
                // toDoItem.isChecked = !isChecked;
                // //call update function
                // updateItem(index, toDoItem);
              }}
              onChangeText={(newText) => {
                if (params.new) {
                  setNewItem({
                    text: newText,
                    isChecked,
                    new: params.new,
                  });
                } else {
                  toDoItems[index].text = newText;
                  setToDoItems([...toDoItems]);
                }
                // //get item by index
                // const toDoItem = toDoItems[index];
                // // change text value
                // toDoItem.text = newText;
                // //call update function
                // updateItem(index, toDoItem);
              }}
              onDelete={() => {
                params.new ? setNewItem(null) : removeItemFromList(index);
                id && removeDoc(toDoItemsRef, id);
                // removeItemFromList(index);
              }}
              onBlur={() => {
                if (text.length > 1) {
                  let data = { text, isChecked };
                  if (id) {
                   data.id = id;
                  }
                  addDoc(toDoItemsRef, data);
                  params.new && setNewItem(null);
                } else {
                  params.new ? setNewItem(null) : removeItemFromList(index);
                }
              }}
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
    backgroundColor: "white",
  },
  icon: {
    padding: 5,
    fontSize: 32,
    color: "white",
  },
});
