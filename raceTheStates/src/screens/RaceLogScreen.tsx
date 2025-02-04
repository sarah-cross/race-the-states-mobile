import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RaceLogScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Race Log Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000', // Matches the theme
  },
  text: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default RaceLogScreen;
