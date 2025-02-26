import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ProfileStackParamList } from "../navigation/ProfileStack"; // ✅ Import ProfileStack types
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useUser } from "../context/UserContext";

type ChangePasswordNavigationProp = StackNavigationProp<ProfileStackParamList, "ChangePassword">;

const ChangePasswordScreen: React.FC = () => {
  const navigation = useNavigation<ChangePasswordNavigationProp>();
  const { user } = useUser();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    try {
    
      console.log("User token:", user?.token);
      const response = await fetch("http://127.0.0.1:8000/api/change-password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user!.token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        Alert.alert("Error", data.error || "Something went wrong.");
        return;
      }

      Alert.alert("Success", "Password changed successfully.");
      navigation.goBack(); // ✅ Go back to the Profile modal after changing password
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert("Error", "Network error. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* ✅ Back Button Header (Matches About Screen) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Change Password</Text>
      </View>
      <View style={styles.content}>
        <TextInput
            placeholder="Current Password"
            placeholderTextColor="#888"
            secureTextEntry
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
        />
        <TextInput
            placeholder="New Password"
            placeholderTextColor="#888"
            secureTextEntry
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
        />
        <TextInput
            placeholder="Confirm New Password"
            placeholderTextColor="#888"
            secureTextEntry
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={handleChangePassword} style={styles.button}>
            <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "90%", // ✅ Match Profile modal height
    backgroundColor: "#222222",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    position: "absolute",
    bottom: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // ✅ Centers the title
    marginBottom: 20,
    position: "relative", // ✅ Allows back button positioning
  },
  backButton: {
    position: "absolute",
    left: 0, // ✅ Keeps the back button on the left
  },
  headerText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  content: {
    marginTop: 40,
  },
  input: {
    backgroundColor: "#333333",
    padding: 10,
    borderRadius: 8,
    color: "white",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#FFBA24",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ChangePasswordScreen;
