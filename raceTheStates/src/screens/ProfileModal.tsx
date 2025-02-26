import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack"; // ✅ Import StackNavigationProp
import { ProfileStackParamList } from "../navigation/ProfileStack"; // ✅ Import ProfileStack types
import { useUser } from "../context/UserContext";

const ProfileModal = () => {
  const { user, logout } = useUser();
  const navigation = useNavigation<StackNavigationProp<ProfileStackParamList, "Profile">>(); // ✅ Use correct type

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          onPress: () => {
            logout();
            navigation.goBack(); // ✅ Close profile modal on logout
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        {/* Close Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.doneButton}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>

        {/* Profile Image Section */}
        <View style={styles.profileSection}>
          <FontAwesome name="user-circle" size={70} color="#FFFFFF" />
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>{user?.first_name} {user?.last_name}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
        </View>

        {/* About Section */}
        <TouchableOpacity 
          style={styles.sectionContainer} 
          onPress={() => navigation.navigate("About")} // ✅ Now correctly recognized
        >
          <Text style={styles.aboutText}>About</Text>
          <FontAwesome name="chevron-right" size={24} color="#AAAAAA" />
        </TouchableOpacity>

        {/* Reset Password Section */}
        <TouchableOpacity 
          style={styles.sectionContainer} 
          onPress={() => navigation.navigate("ChangePassword")} // ✅ Use navigate instead of replace
        >
          <Text style={styles.aboutText}>Change Password</Text>
          <FontAwesome name="chevron-right" size={24} color="#AAAAAA" />
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}; 

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    width: "100%",
    height: "90%",
    backgroundColor: "#222222",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  doneButton: {
    alignSelf: "flex-end",
  },
  doneText: {
    color: "#FFBA24",
    fontSize: 18,
    fontWeight: "bold",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333333",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    marginTop: 20,
  },
  profileTextContainer: {
    marginLeft: 15,
  },
  profileName: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  profileEmail: {
    fontSize: 14,
    color: "#AAAAAA",
    marginTop: 4,
  },
  sectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#333333",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFBA24',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileModal;

