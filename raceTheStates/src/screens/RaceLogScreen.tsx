import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useUser } from '../context/UserContext';
import RaceCard from '../components/RaceCard';

type Race = {
  state: string;
  city?: string;
  region: string;
  region_color: string;
  svg_path: string;
  race_name: string;
  date: string;
  time: string | null;
  distance: string;
};

const RaceLogScreen: React.FC = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const fetchRaceLogData = async () => {
    try {
      setLoading(true);
      const authHeader = `Bearer ${user?.token}`;
      const response = await fetch("http://localhost:8000/api/race-log/", {
        method: "GET",
        headers: { Authorization: authHeader },
      });
  
      if (!response.ok) {
        console.error("❌ API error:", response.status, response.statusText);
        return;
      }
  
      const data = await response.json();
      setRaces(data.races);
    } catch (error) {
      console.error("❌ Network error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRaceLogData(); // ✅ Now this works because function is already defined
  }, [user]);
  

  return (
    <LinearGradient colors={["#000000", "#555555"]} style={styles.container}>
      {/* ✅ Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>My Races</Text>
        <TouchableOpacity onPress={() => console.log("Sort races")}>
          <FontAwesome name="sort" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ✅ Race List using RaceCard */}
      <FlatList
        data={races}
        keyExtractor={(item, index) => `race-${index}`}
        contentContainerStyle={{ paddingTop: 120 }}
        renderItem={({ item }) => <RaceCard {...item} time={item.time ?? "N/A"} />}
      />

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  header: {
    position: 'absolute', // ✅ Keeps it anchored
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000, // Ensures it stays above content
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // ✅ Slight transparency for a smooth effect
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Permanent Marker',
  },
  loadingText: {
    color: "white",
    fontFamily: 'Permanent Marker'
  }
});

export default RaceLogScreen;
