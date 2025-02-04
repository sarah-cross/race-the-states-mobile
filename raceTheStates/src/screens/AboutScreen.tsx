import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const AboutScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>About</Text>
        <View style={{ width: 24 }} /> {/* Spacer to balance the layout */}
      </View>

      {/* About Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Race the States</Text>
        <Text style={styles.subtitle}>Version 1.0.0</Text>
        <Text style={styles.description}>
          Race the States is designed to help you track your races across the US. Log your races, track your progress, and find new events to participate in!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222222",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  content: {
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#AAAAAA",
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: "#CCCCCC",
    textAlign: "center",
    marginHorizontal: 10,
  },
});

export default AboutScreen;
