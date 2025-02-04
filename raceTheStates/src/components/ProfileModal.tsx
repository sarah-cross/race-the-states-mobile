import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useUser } from "../context/UserContext";

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
  onNavigateAbout: () => void;
  onNavigateReset: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ visible, onClose, onNavigateAbout, onNavigateReset }) => {
  const { user, logout } = useUser();

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          onPress: () => {
            logout(); // Call logout function from context
            onClose(); // Close modal after logout
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

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

          {/* About Section */}
          <TouchableOpacity style={styles.sectionContainer} onPress={onNavigateAbout}>
            <Text style={styles.aboutText}>About</Text>
            <FontAwesome name="chevron-right" size={24} color="#AAAAAA" />
          </TouchableOpacity>

          {/* Reset Password Section */}
          <TouchableOpacity style={styles.sectionContainer} onPress={onNavigateReset}>
            <Text style={styles.aboutText}>Reset Password</Text>
            <FontAwesome name="chevron-right" size={24} color="#AAAAAA" />
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
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
