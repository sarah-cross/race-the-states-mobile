import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ResetPasswordScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { uid, token } = route.params; // Extract params from the deep link
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordReset = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/password-reset/confirm/${uid}/${token}/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        }
      );

      if (response.ok) {
        Alert.alert('Success', 'Password reset successfully!');
        navigation.navigate('Login');
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <LinearGradient colors={['#000000', '#555555']} style={styles.container}>
      {/* Exit Button */}
      <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
        <Icon name="close" size={28} color="#FF63FA" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Reset Password</Text>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#000000" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#AAAAAA"
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#000000" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholderTextColor="#AAAAAA"
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitButton: {
    position: 'absolute',
    top: 80,
    right: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 40,
    fontFamily: 'Permanent Marker', // Ensure you have the font installed and configured
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    height: 50,
    borderWidth: 1,
    borderColor: '#AAAAAA',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#000000',
    fontSize: 18,
  },
  button: {
    width: '90%',
    height: 50,
    backgroundColor: '#FF63FA',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default ResetPasswordScreen;
