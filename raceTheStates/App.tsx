import React, { useEffect, useState } from "react";
import { Linking } from "react-native";
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProvider } from "./src/context/UserContext";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./src/screens/ResetPasswordScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import AboutScreen from "./src/screens/AboutScreen";
import BottomTabs from "./src/navigation/BottomTabs"; 
import { ApplicationProvider } from "@ui-kitten/components"; 
import * as eva from "@eva-design/eva"; 



export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  MainApp: undefined;

};

const linking = {
  prefixes: ["racethestates://"],
  config: {
    screens: {
      Login: "login",
      ForgotPassword: "forgot-password",
      ResetPassword: "reset-password/:uid/:token",
      MainApp: "main",
    },
  },
};

const Stack = createStackNavigator<RootStackParamList>();
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

const parseLink = (url: string | null): { screen: keyof RootStackParamList; params?: any } | null => {
  if (!url) return null;
  
  const match = url.match(/reset-password\/([^/]+)\/([^/]+)/);
  if (match && match[1] && match[2]) {
    return { screen: "ResetPassword", params: { uid: match[1], token: match[2] } };
  }

  return { screen: "Login" }; // Default to Login
};

const App = () => {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    const checkUserSession = async () => {
      const token = await AsyncStorage.getItem("authToken");
      setInitialRoute(token ? "MainApp" : "Login");
    };

    checkUserSession();
  }, []);

  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const parsed = parseLink(event.url);
      if (parsed && navigationRef.isReady()) {
        const { screen, params } = parsed;
        navigationRef.navigate(screen, params);
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    Linking.getInitialURL()
      .then((url) => {
        if (url) {
          handleDeepLink({ url });
        }
      })
      .catch((err) => console.error("Error fetching initial URL:", err));

    return () => subscription.remove();
  }, []);

  if (!initialRoute) return null; // Prevent flicker before determining route

  return (
    <ApplicationProvider {...eva} theme={eva.light}> 
      <UserProvider>
        <NavigationContainer ref={navigationRef} linking={linking}>
          <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            <Stack.Screen name="MainApp" component={BottomTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </ApplicationProvider>
  );
};

export default App;
