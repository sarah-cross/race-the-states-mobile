import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useUser } from '../context/UserContext';
import RaceCard from '../components/RaceCard';
import { Menu, Divider, Provider } from "react-native-paper";

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

  const [sortVisible, setSortVisible] = useState(false);
  const [sortOption, setSortOption] = useState<string | null>(null);

  const openMenu = () => setSortVisible(true);
  const closeMenu = () => setSortVisible(false);

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

  const sortRaces = (type: string) => {
    let sorted = [...races];

    switch (type) {
      case "date-newest":
        sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "date-oldest":
        sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "time-fastest":
        sorted.sort((a, b) => (a.time ?? "99:99").localeCompare(b.time ?? "99:99"));
        break;
      case "time-slowest":
        sorted.sort((a, b) => (b.time ?? "99:99").localeCompare(a.time ?? "99:99"));
        break;
      case "region":
        sorted.sort((a, b) => a.region.localeCompare(b.region));
        break;
      default:
        break;
    }

    setSortOption(type);
    setRaces(sorted);
    closeMenu();
  };

  useEffect(() => {
    fetchRaceLogData();
  }, [user]);

  return (
    <Provider>
      <LinearGradient colors={["#000000", "#555555"]} style={styles.container}>
        {/* ✅ Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>My Races</Text>

          {/* ✅ Sort Button with Dropdown Menu */}
          <Menu
            visible={sortVisible}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity onPress={openMenu}>
                <FontAwesome name="sort" size={24} color="white" />
              </TouchableOpacity>
            }
          >
            <Menu.Item onPress={() => sortRaces("date-newest")} title="Date (Newest → Oldest)" />
            <Menu.Item onPress={() => sortRaces("date-oldest")} title="Date (Oldest → Newest)" />
            <Divider />
            <Menu.Item onPress={() => sortRaces("time-fastest")} title="Race Time (Fastest → Slowest)" />
            <Menu.Item onPress={() => sortRaces("time-slowest")} title="Race Time (Slowest → Fastest)" />
            <Divider />
            <Menu.Item onPress={() => sortRaces("region")} title="Region (Alphabetically)" />
          </Menu>
        </View>

        {/* ✅ Race List */}
        <FlatList
          data={races}
          keyExtractor={(item, index) => `race-${index}`}
          contentContainerStyle={{ paddingTop: 120 }}
          renderItem={({ item }) => <RaceCard {...item} time={item.time ?? "N/A"} />}
        />
      </LinearGradient>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Permanent Marker",
  },
});

export default RaceLogScreen;
