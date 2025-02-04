/// I HAVE TWO APP.TSX
/// I THINK THIS IS THE CORRECT ONE!!
/*
import React from 'react';
import { Linking } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserProvider } from './context/UserContext';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import AboutScreen from './screens/AboutScreen';
import BottomTabs from './components/BottomTabs'; 

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  Dashboard: undefined;
  MainApp: undefined;
  About: undefined;
};

const linking = {
  prefixes: ['racethestates://'],
  config: {
    screens: {
      Login: 'login',
      ForgotPassword: 'forgot-password',
      ResetPassword: 'reset-password/:uid/:token',
      Dashboard: 'dashboard',
    },
  },
};


const Stack = createStackNavigator<RootStackParamList>();
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

const parseLink = (url: string | null): { screen: keyof RootStackParamList; params?: any } | null => {
  if (!url) {
    console.log('No URL to parse');
    return null;
  }

  console.log('Parsing URL:', url);

  const match = url.match(/reset-password\/([^/]+)\/([^/]+)/); // Match both uid and token
  if (match && match[1] && match[2]) {
    console.log('Parsed UID:', match[1], 'Parsed Token:', match[2]);
    return { screen: 'ResetPassword', params: { uid: match[1], token: match[2] } };
  }

  console.log('No match found for URL:', url);
  return { screen: 'Login' }; // Default to Login
};




const App = () => {
  React.useEffect(() => {
      const handleDeepLink = (event: { url: string }) => {
        console.log('Deep Link Event Triggered:', event.url);
    
        const parsed = parseLink(event.url);
        console.log('Parsed Deep Link Result:', parsed);
    
        if (parsed && navigationRef.isReady()) {
          const { screen, params } = parsed;
          navigationRef.navigate(screen, params);
        } else {
          console.log('Deep link could not be parsed or navigation not ready:', event.url);
        }
      };
    
      const subscription = Linking.addEventListener('url', handleDeepLink);
    
      Linking.getInitialURL()
        .then((url) => {
          if (url) {
            console.log('Initial URL Detected:', url);
            handleDeepLink({ url });
          } else {
            console.log('No Initial URL');
          }
        })
        .catch((err) => console.error('Error fetching initial URL:', err));
    
      return () => {
        subscription.remove(); // Cleanup listener
      };
    }, []);
    
  
  
    


  return (
    <UserProvider>
      <NavigationContainer ref={navigationRef} linking={linking}>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>

          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />

   
          <Stack.Screen name="MainApp" component={BottomTabs} />

          <Stack.Screen name="About" component={AboutScreen} />
          
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
*/