import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { LoginManager, AccessToken, AuthenticationToken } from 'react-native-fbsdk-next';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { registerUser } from '../api/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useUser } from '../context/UserContext';

const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useUser();


  const handleRegister = async () => {
    try {
      const response = await registerUser(firstName, lastName, email, password);
      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('Dashboard', { firstName, email });
    } catch (error) {
      console.error('Registration failed:', error);
      Alert.alert('Error', 'Unable to register. Please try again.');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      console.log("🔹 Facebook login process started...");
  
      LoginManager.setLoginBehavior("browser"); // Ensure it doesn't use native
  
      const result = await LoginManager.logInWithPermissions(["public_profile", "email"], "limited");
  
      console.log("📌 Facebook Login Result:", result);
  
      if (result.isCancelled) {
        console.log("🚫 Facebook login was cancelled by user.");
        return;
      }
  
      const data = await AuthenticationToken.getAuthenticationTokenIOS();
      if (!data) {
        console.log("⚠️ Failed to get Facebook access token");
        return;
      }
  
      console.log("✅ Facebook Access Token:", data.authenticationToken);
  
      const response = await fetch("https://6324-2601-601-0-6ba0-8974-cf9e-bd50-a43e.ngrok-free.app/api/facebook-login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: data.authenticationToken }),
      });
  
      const json = await response.json();
      console.log("📌 Facebook Login Response:", json);
  
      if (response.ok) {
        console.log("🎉 Login successful!");
        navigation.navigate("Dashboard", { user: json });
      } else {
        console.error("❌ Facebook login failed:", json);
      }
    } catch (error) {
      console.error("🔥 Facebook login error:", error);
    }
  };  

  
  

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
  
      console.log('Google Sign-In Response:', JSON.stringify(userInfo, null, 2));
  
      const idToken = userInfo.data?.idToken;
  
      if (!idToken) {
        throw new Error('Google Sign-In failed: No ID Token found.');
      }
  
      const response = await fetch('http://127.0.0.1:8000/api/google-login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to authenticate with backend.');
      }
  
      const data = await response.json();
      setUser({
        token: data.access,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
      });
  
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Google login error:', error);
      Alert.alert('Google Login Failed', error instanceof Error ? error.message : 'An unknown error occurred.');
    }
  };
  

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      extraHeight={100}
      keyboardShouldPersistTaps="handled"
    >
      <LinearGradient
        colors={['#000000', '#555555']} // Black to dark gray gradient
        style={styles.container}
      >
        {/* Exit Button */}
        <TouchableOpacity
          style={styles.exitButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="close" size={28} color="#EBFC00" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>
        Start tracking your progress toward the goal of running in all 50 states!
        </Text>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <Icon name="person" size={20} color="#000000" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#AAAAAA"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="person" size={20} color="#000000" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#AAAAAA"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="email" size={20} color="#000000" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#AAAAAA"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#000000" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#AAAAAA"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Register Button */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or sign up with</Text>
          <View style={styles.divider} />
        </View>

        {/* Social Login Buttons */}
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
            <FontAwesome name="facebook" size={24} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
            <FontAwesome name="google" size={24} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="apple" size={24} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* Redirect to Login */}
        <Text style={styles.footerText}>
          Already registered?{' '}
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate('Login')}
          >
            Sign In
          </Text>
        </Text>
      </LinearGradient>
    </KeyboardAwareScrollView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Center content horizontally
  },
  exitButton: {
    position: 'absolute',
    top: 80,
    right: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 60,
    fontFamily: 'Permanent Marker',
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    paddingTop: 60,
    lineHeight: 56, // Ensure the lineHeight is larger than the font size
    paddingHorizontal: 20, // Add horizontal padding to avoid clipping
    paddingVertical: 20,
    includeFontPadding: true,
  },
  subtitle: {
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
    width: '90%', // Adjust to a percentage for responsive width
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
    width: '90%', // Adjust to a percentage for responsiveness
    height: 50,
    backgroundColor: '#EBFC00',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    alignSelf: 'center',
  },
  divider: {
    flex: 1,
    height: 1,
    margin: 20,
    backgroundColor: '#FFFFFF',
  },
  dividerText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  footerText: {
    fontSize: 16,
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 20,
  },
  linkText: {
    color: '#EBFC00',
    fontWeight: 'bold',
  },
});
