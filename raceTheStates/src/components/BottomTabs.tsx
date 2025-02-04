import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import DashboardScreen from '../screens/DashboardScreen';
import RaceLogScreen from '../screens/RaceLogScreen';
import FindRacesScreen from '../screens/FindRacesScreen';
import WishlistScreen from '../screens/WishlistScreen';
//import FontAwesome from 'react-native-vector-icons/FontAwesome5';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          borderTopWidth: 0, // ✅ Removes gray line above navigation bar
          height: 80, // ✅ Makes nav bar taller for better spacing
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4, // ✅ Moves text down for better alignment
        },
        tabBarItemStyle: {
          paddingTop: 4, // ✅ Adds spacing above icons
        },
        tabBarActiveTintColor: '#01C7FE',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
            let iconName: string = 'question-circle'; 

          if (route.name === 'Dashboard') {
            iconName = 'chart-bar'; // ✅ Speedometer icon
          } else if (route.name === 'Race Log') {
            iconName = 'edit';
          } else if (route.name === 'Find Races') {
            iconName = 'search';
          } else if (route.name === 'Wishlist') {
            iconName = 'heart';
          }

          return <FontAwesome name={iconName} size={20} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Race Log" component={RaceLogScreen} />
      <Tab.Screen name="Find Races" component={FindRacesScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;


