import React from "react";
import { BottomTabNavigationProp, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import DashboardScreen from "../screens/DashboardScreen";
import RaceLogScreen from "../screens/RaceLogScreen";
import FindRacesScreen from "../screens/FindRacesScreen";
import WishlistScreen from "../screens/WishlistScreen";
import ProfileStack, { ProfileStackParamList } from "./ProfileStack"; // ✅ Ensure correct import
import { NavigatorScreenParams, useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

export type BottomTabParamList = {
  Dashboard: undefined;
  "Race Log": undefined;
  "Find Races": undefined;
  Wishlist: undefined;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};

const Tab = createBottomTabNavigator();

/* const ProfileButton = () => {
  const navigation = useNavigation<BottomTabNavigationProp<BottomTabParamList>>();

  return (
    <TouchableOpacity onPress={() => navigation.navigate("ProfileStack", { screen: "Profile" })}>
      <FontAwesome name="user-circle" size={28} color="white" />
    </TouchableOpacity>
  );
}; */

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          borderTopWidth: 0,
          height: 80,
          justifyContent: "space-evenly",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
          textAlign: "center",
        },
        tabBarItemStyle: {
          flex: 1, 
          flexGrow: 1, // ✅ Forces all items to take up equal space
          justifyContent: "center",
          alignItems: "center",
          padding: 4,
        },
        
        tabBarActiveTintColor: "#01C7FE",
        tabBarInactiveTintColor: "white",
        tabBarIcon: ({ color }) => {
          let iconName = "question-circle";

          if (route.name === "Dashboard") {
            iconName = "chart-bar";
          } else if (route.name === "Race Log") {
            iconName = "edit";
          } else if (route.name === "Find Races") {
            iconName = "search";
          } else if (route.name === "Wishlist") {
            iconName = "heart";
          }

          return <FontAwesome5 name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Race Log" component={RaceLogScreen} />
      <Tab.Screen name="Find Races" component={FindRacesScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />

      {/* ✅ Hidden ProfileStack - Only opens when clicking Profile Icon */}
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{ 
          tabBarButton: () => null, 
          tabBarItemStyle: { display: "none" } 
        }} 
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
