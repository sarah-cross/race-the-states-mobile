import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ProfileStackParamList } from "../navigation/ProfileStack"; // About is part of the Profile Stack 
import FontAwesome from "react-native-vector-icons/FontAwesome";

// ✅ Use ProfileStackParamList instead of RootStackParamList
type AboutScreenNavigationProp = StackNavigationProp<ProfileStackParamList, "About">;

const AboutScreen: React.FC = () => {
  const navigation = useNavigation<AboutScreenNavigationProp>();

  return (
    <View style={styles.container}>
    {/* ✅ Back button should navigate properly */}
    <View style={styles.header}>
      {/* ✅ Back Button - Manually Positioned */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ position: "absolute", left: 0 }} // ✅ Keeps the back button on the left
      >
        <FontAwesome name="chevron-left" size={24} color="white" />
      </TouchableOpacity>

      {/* ✅ Centered Title */}
      <Text style={styles.headerText}>About</Text>
    </View>


      {/* About Content */}
      <View style={styles.content}>

        <Text style={styles.description}>
          👋 Hi there! Welcome to Race the States! I'm Sarah.{"\n\n"}
          This app was created for runners who have the awesome goal of running in all 50 states.
          I set out on this goal too, and I found myself wanting an app to track my progress——so I built it!{"\n\n"}
          My hope is that Race the States helps you stay motivated and on track so we can reach this goal together.
          If you have any suggestions for ways to improve the app, want to see new features, or have a bug to report, shoot me an email at{" "}
          <Text style={{ fontWeight: "bold" }}>sarah.cross617@gmail.com</Text>.{"\n\n"}
          Happy running! 🏃‍♀️✨
        </Text>

      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "90%", // ✅ Match Profile Modal height
    backgroundColor: "#222222",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    position: "absolute",
    bottom: 0, // ✅ Ensures it's positioned at the bottom, like a modal
  },
  
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,

  },
  headerText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    alignContent: "center",
  },
  content: {
    alignItems: "center",
    padding: 20,
    
  },

  description: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
    marginHorizontal: 10,
  },
});

export default AboutScreen;
