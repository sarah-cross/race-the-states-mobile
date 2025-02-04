import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import SvgUSA from '../assets/images/usa.svg';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { jwtDecode } from 'jwt-decode';
import { loginUser } from '../api/auth';
import { useUser } from '../context/UserContext';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useEffect } from 'react';
import { AccessToken, LoginManager, AuthenticationToken } from 'react-native-fbsdk-next';


const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useUser();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '788556943667-rujd9qns3qjm4uqijr04mt1pgv87jprr.apps.googleusercontent.com',
      iosClientId: '788556943667-i24cjquio2muvun8a7ujm9tku6d4ki7i.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  /** ✅ FIXED Email Login */
  const handleLogin = async () => {
    try {
      const { access } = await loginUser(email, password);
      const decodedToken = jwtDecode<any>(access);

      setUser({
        token: access,
        first_name: decodedToken.first_name,
        last_name: decodedToken.last_name,
        email,
      });

      console.log("🎉 Email login successful!");
      navigation.reset({
        index: 0,
        routes: [{ name: "MainApp" }],
      });
    } catch (error) {
      console.error("❌ Email login failed:", error);
      Alert.alert("Error", "Unable to login. Please try again.");
    }
  };

  /** ✅ FIXED Facebook Login */
  const handleFacebookLogin = async () => {
    try {
      console.log("🔹 Facebook login process started...");

      LoginManager.setLoginBehavior("browser");
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
        setUser({
          token: json.access,
          first_name: json.first_name,
          last_name: json.last_name,
          email: json.email,
        });

        console.log("🎉 Facebook login successful!");
        navigation.reset({
          index: 0,
          routes: [{ name: "MainApp" }],
        });
      } else {
        console.error("❌ Facebook login failed:", json);
        Alert.alert("Error", "Facebook login failed. Please try again.");
      }
    } catch (error) {
      console.error("🔥 Facebook login error:", error);
      Alert.alert("Facebook Login Failed", error instanceof Error ? error.message : "An unknown error occurred.");
    }
  };

  /** ✅ FIXED Google Login */
  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("✅ Google Sign-In Response:", userInfo);

      const idToken = userInfo.data?.idToken;
      if (!idToken) {
        throw new Error("Google Sign-In failed: No ID Token found.");
      }

      const response = await fetch("http://127.0.0.1:8000/api/google-login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to authenticate with backend.");
      }

      const data = await response.json();
      setUser({
        token: data.access,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
      });

      console.log("🎉 Google login successful!");
      navigation.reset({
        index: 0,
        routes: [{ name: "MainApp" }],
      });
    } catch (error) {
      console.error("❌ Google login error:", error);
      Alert.alert("Google Login Failed", error instanceof Error ? error.message : "An unknown error occurred.");
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
        colors={['#000000', '#555555']} // Black to dark gray
        style={styles.container}
      >
       

        <SvgUSA width={360} height={300} style={styles.image} />

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Icon name="email" size={20} color="#FFFFFF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#AAAAAA"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#FFFFFF" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#AAAAAA"
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or continue with</Text>
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



        {/* Footer Links */}
        <View style={styles.footer}>
          <Text
            style={styles.forgotPassword}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            Forgot Password?
          </Text>
          <Text style={styles.footerText}>
            Don’t have an account?{' '}
            <Text
              style={styles.linkText}
              onPress={() => navigation.navigate('Register')}
            >
              Sign Up
            </Text>
          </Text>
        </View>
      </LinearGradient>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  image: {
    marginTop: 10,
    width: 300,
    height: 200,
    alignSelf: 'center',
    marginBottom: 10,
    tintColor: '#FFFFFF', // Makes the PNG white
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%', // Set width to a percentage for responsiveness
    height: 50,
    borderWidth: 1,
    borderColor: '#AAAAAA',
    borderRadius: 10,
    backgroundColor: '#FFFFFF', // White input background
    marginBottom: 15,
    paddingHorizontal: 10,
    alignSelf: 'center', // Centers input fields horizontally
  },
  icon: {
    marginRight: 10,
    color: '#000000', // Black icons for contrast
  },
  input: {
    flex: 1,
    color: '#000000', // Black input text for readability
    fontSize: 18,
  },
  button: {
    width: '90%', // Set width to a percentage for responsiveness
    height: 50,
    backgroundColor: '#01C7FE', // Blue login button
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center', // Centers the button horizontally
  },
  buttonText: {
    color: '#FFFFFF', // White button text
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
  
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  forgotPassword: {
    fontSize: 16,
    color: '#FFFFFF', // White link text
    textDecorationLine: 'underline',
    marginBottom: 15,
  },
  footerText: {
    fontSize: 16,
    color: '#AAAAAA', // Gray footer text
  },
  linkText: {
    color: '#01C7FE', // Blue link text for "Sign Up"
    fontWeight: 'bold',
  },
});



export default LoginScreen;