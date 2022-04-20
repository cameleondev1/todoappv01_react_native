import { StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native";
import  Colors  from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons"
import { ActivityIndicator } from "react-native-web";

export default () => {
    return(
        <View style={{flex:1, justifyContent: "center", alignContent:"center"}}> 
            <ActivityIndicator size="large" />
        </View>
    );
}