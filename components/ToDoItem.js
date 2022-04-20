import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Colors from "../constants/Colors";
import Checkbox from "./Checkbox";

const EditeableText = ({
  isChecked,
  onChangeText,
  text,
  ...props
}) => {
  const [isEditeMode, setEditMode] = useState(props.new);

  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={() => {
        !isChecked && setEditMode(true);
      }}
    >
      {isEditeMode ? (
        <TextInput
          underlineColorAndroid={"transparent"}
          selectionColor={"transparent"}
          autoFocus={true}
          value={text}
          autoComplete={false}
          onChangeText={onChangeText}
          placeholder={"Add new item here"}
          onSubmitEditing={() => {}}
          onBlur={() => {
            props.onBlur && props.onBlur();
            setEditMode(false);
          }}
          maxLength={30}
          style={[styles.input, { outline: "none" }]}
        />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: isChecked ? Colors.lightGray : Colors.black,
              textDecoration: isChecked ? "line-through" : "none",
            },
          ]}
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default ({
  text,
  isChecked,
  onChecked,
  onChangeText,
  onDelete,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", flex: 1 }}>
        <Checkbox isChecked={isChecked} onChecked={onChecked} />
        <EditeableText
          text={text}
          onChangeText={onChangeText}
          isChecked={isChecked}
          {...props}
        />
      </View>
      <TouchableOpacity onPress={onDelete}>
        <Text style={[styles.icon, { color: Colors.red }]}>X</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  icon: {
    padding: 5,
    fontSize: 16,
  },
  input: {
    color: Colors.black,
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 0.5,
    marginHorizontal: 5,
    padding: 3,
    height: 25,
    fontSize: 16,
  },
  text: {
    padding: 3,
    fontSize: 16,
  },
});
