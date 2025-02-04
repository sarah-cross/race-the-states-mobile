import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ForgotPasswordScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/password-reset/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      console.log("📧 Sending email for reset:", email);
      console.log("🔹 Request method:", response.status);


      if (response.ok) {
        Alert.alert(
          'Success',
          'If an account with that email exists, a password reset link has been sent.'
        );
        navigation.goBack(); // Return to the login screen
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Error',
        'Unable to send password reset email. Please check your internet connection and try again.'
      );
    }
  };

  return (
    <LinearGradient colors={['#000000', '#555555']} style={styles.container}>

      {/* Exit Button */}
      <TouchableOpacity
          style={styles.exitButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="close" size={28} color="#FF63FA" />
        </TouchableOpacity>


      {/* Title */}
      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.instructions}>
        Enter your email address below to receive a password reset link. 
      </Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Icon name="email" size={20} color="#000000" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#AAAAAA"
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
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
    fontFamily: 'Permanent Marker',
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  instructions: {
    fontSize: 18,
    color: '#AAAAAA',
    textAlign: 'center',
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
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

export default ForgotPasswordScreen;
