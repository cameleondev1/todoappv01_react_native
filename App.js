import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "./screens/Home";
import ToDoList from "./screens/ToDoList";
import EditList from "./screens/EditList";
import TestPage from "./screens/TestPage";
import Settings from "./screens/Settings";
import Login from "./screens/Login";
import Colors from "./constants/Colors";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

const AuthScreens = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={Login} />
    </AuthStack.Navigator>
  );
};

const Screens = () => {
  return (
    
    <Stack.Navigator>
      <Stack.Screen name="Fire App" component={Home} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen
        name="ToDoList"
        component={ToDoList}
        options={({ route }) => {
          return {
            title: route.params.title,
            headerStyle: {
              backgroundColor: route.params.color,
            },
            headerTintColor: "white",
          };
        }}
      />

      <Stack.Screen
        name="Edit"
        component={EditList}
        options={({ route }) => {
          return {
            title: route.params.title
              ? `Edit ${route.params.title} list`
              : "Create New List",
            headerStyle: {
              backgroundColor: route.params.color || Colors.blue,
            },
            headerTintColor: "white",
          };
        }}
      />

      <Stack.Screen name="TestPage" component={TestPage} />
    </Stack.Navigator>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    
   // setLoading(true);
    if (firebase.auth().currentUser) {
      setIsAuthenticated(true);
      setLoading(false);
    }
    
    firebase.auth().onAuthStateChanged((user) => {
      console.log("checkin auth state ♫♫♫");
      if (user) {
        setIsAuthenticated(true);
        setLoading(false);

      } else {
        setIsAuthenticated(false);
        setLoading(false);

      }
    });
  }, []);

  // if ( loading === true ){
  //   return (
    
  //     <NavigationContainer>
  //        <Stack.Navigator>
  //       <Stack.Screen options={{headerShown: false}} name="TestPage" component={TestPage} />
  //     </Stack.Navigator>
  //     </NavigationContainer>
  //   );
  // }else {
    return (
    
      <NavigationContainer>
        {isAuthenticated ? <Screens /> : <AuthScreens />}
      </NavigationContainer>
    );
  // }

}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDORQmMI5k8gnmuyGRU8tXDh1fVhIeOgf4",
  authDomain: "slidgev1.firebaseapp.com",
  projectId: "slidgev1",
  storageBucket: "slidgev1.appspot.com",
  messagingSenderId: "736110633774",
  appId: "1:736110633774:web:6a3706b016f4f94e6a50bf",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
