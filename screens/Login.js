import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Colors from "../constants/Colors";
import Button from "../components/Button";
import LabeledInput from "../components/LabeledInput";
import validator from "validator";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";


//export const auth = firebase.auth();

const validateFields = (email, password) => {
  const isValid = {
    email: validator.isEmail(email),
    password: validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
    }),
  };
  return isValid;
};

const login = (email, password) => {
  firebase.auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      console.log("Logged in!");
    });
};

const createAccount = (email, password) => {
  firebase.auth()
    .createUserWithEmailAndPassword(email, password)
    .then(({ user }) => {
      console.log("Creating user...");
      firebase.firestore().collection("users").doc(user.uid).set({});
    });
};

// const login = (email, password) => {
//   auth().cu

//   console.log("login here", email, "password", password);
// };
// const createAccount = (email, password) => {
//   console.log("createAccount", email, "password", password);
// };

export default () => {
  const [isCreateMode, setCreateMode] = useState(false);
  const [emailField, setEmailField] = useState({
    text: "",
    errorMessage: "",
  });

  const [passwordField, setPasswordField] = useState({
    text: "",
    errorMessage: "",
  });

  const [passwordReentryField, setPasswordReentryField] = useState({
    text: "",
    errorMessage: "",
  });
  return (
    <View style={styles.container}>
      <Text style={styles.header}>♫.♫ ToDo</Text>
      <View style={{ flex: 1 }}>
        <LabeledInput
          label="Email"
          text={emailField.text}
          onChangeText={(text) => {
            setEmailField({ text });
          }}
          errorMessage={emailField.errorMessage}
          labelStyle={styles.label}
          autoCompleteType="email"
        />

        <LabeledInput
          label="Password"
          text={passwordField.text}
          onChangeText={(text) => {
            setPasswordField({ text });
          }}
          secureTextEntry={true}
          errorMessage={passwordField.errorMessage}
          labelStyle={styles.label}
          autoCompleteType="password"
        />
        {isCreateMode && (
          <LabeledInput
            label="PasswordReentry"
            text={passwordReentryField.text}
            onChangeText={(text) => {
              setPasswordReentryField({ text });
            }}
            secureTextEntry={true}
            errorMessage={passwordReentryField.errorMessage}
            labelStyle={styles.label}
          />
        )}
      </View>

      <Button
        onPress={() => {
          const isValid = validateFields(emailField.text, passwordField.text);
          let isAllValid = true;
          if (!isValid.email) {
            emailField.errorMessage = "Please enter a valid email";
            setEmailField({ ...emailField });
            isAllValid = false;
          }
          if (!isValid.password) {
            passwordField.errorMessage = "Password must be strong";
            setPasswordField({ ...passwordField });
            isAllValid = false;
          }
          if (isCreateMode && passwordReentryField.text != passwordField.text) {
            passwordReentryField.errorMessage = "Password do not match";
            setPasswordReentryField({ ...passwordReentryField });
            isAllValid = false;
          }
          if (isAllValid) {
            isCreateMode
              ? createAccount(emailField.text, passwordField.text)
              : login(emailField.text, passwordField.text);
          }
        }}
        buttonStyle={{ backgroundColor: Colors.red }}
        text={isCreateMode ? "Create Account" : "Login"}
      />
      <TouchableOpacity
        onPress={() => {
          setCreateMode(!isCreateMode);
        }}
      >
        <Text
          style={{
            alignSelf: "center",
            color: Colors.blue,
            fontSize: 16,
            margin: 4,
            marginBottom: 10,
          }}
        >
          {isCreateMode ? "Already have an account?" : "Create new account"}
        </Text>
      </TouchableOpacity>

    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    alignItems: "stretch",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.black,
  },
  header: {
    fontSize: 72,
    color: Colors.red,
    alignSelf: "center",
  },
});
