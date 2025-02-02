import 'react-native-gesture-handler'; // This should be at the top of the file
import { AppRegistry } from 'react-native';
import App from './App'; // Ensure this points to the correct App.tsx
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
