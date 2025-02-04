import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useUser } from "../context/UserContext";
import { MaterialIcons } from "@expo/vector-icons"; // For arrow icon

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
  onNavigateAbout: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ visible, onClose, onLogout, onNavigateAbout }) => {
  const { user } = useUser();



  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.doneButton}>
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

          {/* About Section (with Arrow) */}
          <TouchableOpacity style={styles.sectionContainer} onPress={onNavigateAbout}>
            <Text style={styles.aboutText}>About</Text>
            <FontAwesome name="chevron-right" size={24} color="#AAAAAA" />
          </TouchableOpacity>

          {/* About Section (with Arrow) */}
          <TouchableOpacity style={styles.sectionContainer} onPress={onNavigateAbout}>
            <Text style={styles.aboutText}>Reset Password</Text>
            <FontAwesome name="chevron-right" size={24} color="#AAAAAA" />
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    height: "80%",
    backgroundColor: "#222222",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  doneButton: {
    alignSelf: "flex-end",
  },
  doneText: {
    color: "#01C7FE",
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
  label: {
    fontSize: 14,
    color: "#AAAAAA",
  },
  info: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  aboutText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  logoutContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 18,
    color: "#01C7FE",
    fontWeight: "bold",
  },
  button: {
    width: '100%', // Set width to a percentage for responsiveness
    height: 50,
    backgroundColor: '#01C7FE', // Blue login button
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center', // Centers the button horizontally
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF', // White button text
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileModal;



