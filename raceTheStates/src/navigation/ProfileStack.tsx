import React from "react";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import ProfileModal from "../screens/ProfileModal";
import AboutScreen from "../screens/AboutScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen"; 

export type ProfileStackParamList = {
  Profile: undefined;
  About: undefined;
  ChangePassword: undefined;
};

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, 
        presentation: "transparentModal", // ✅ Allows Dashboard to be seen behind modal
        cardOverlayEnabled: true, // ✅ Enables transparency effect
      }}
    >
      {/* ✅ Profile Modal - Slides up from the bottom */}
      <Stack.Screen
        name="Profile"
        component={ProfileModal}
        options={{
          presentation: "transparentModal", // ✅ Keeps Dashboard visible behind modal
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />

      {/* ✅ About - Slides in from right, not full-screen */}
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{
          presentation: "transparentModal", // ✅ Allows Dashboard to remain visible
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />

      {/* ✅ Change Password - Should slide in from right */}
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          presentation: "transparentModal", // ✅ Enables transparency effect
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
