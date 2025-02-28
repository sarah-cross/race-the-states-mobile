import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useUser } from '../context/UserContext';
import RaceCard from '../components/RaceCard';
import { Menu, Divider, Provider } from "react-native-paper";
import AddRaceModal from './AddRaceModal';

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

type State = {
  id: number;
  name: string;
}


const RaceLogScreen: React.FC = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const [sortVisible, setSortVisible] = useState(false);
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [isAddRaceVisible, setAddRaceVisible] = useState(false); 

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

  // Fetch states
  const fetchStates = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/states/");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const sortedStates = data.sort((a, b) => a.name.localeCompare(b.name));
        setStates(sortedStates);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  useEffect(() => {
    fetchRaceLogData();
    fetchStates(); // ✅ Fetch states on mount
  }, [user]);

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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>My Races</Text>
  
          {/* Right-side buttons container */}
          <View style={styles.headerButtons}>
            {/* Add Race Button */}
            <TouchableOpacity style={styles.iconButton} onPress={() => setAddRaceVisible(true)}>
              <FontAwesome name="plus" size={24} color="white" />
            </TouchableOpacity>
  
            {/* Sort Button with Dropdown Menu */}
            <Menu
              visible={sortVisible}
              onDismiss={closeMenu}
              anchor={(
                <TouchableOpacity style={styles.iconButton} onPress={openMenu}>
                  <FontAwesome name="sort" size={24} color="white" />
                </TouchableOpacity>
              )}
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
        </View>
  
        {/* ✅ Race List */}
        <FlatList
          data={races}
          keyExtractor={(item, index) => `race-${index}`}
          contentContainerStyle={{ paddingTop: 120 }}
          renderItem={({ item }) => <RaceCard {...item} time={item.time ?? "N/A"} />}
        />
  
        {/* ✅ Add Race Modal */}
        <AddRaceModal
          visible={isAddRaceVisible}
          onClose={() => setAddRaceVisible(false)}
          onRaceAdded={fetchRaceLogData} // ✅ Refresh races after adding 
          states={states}
        />
      </LinearGradient>
    </Provider>
  );
}  

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
  
  headerButtons: {
    flexDirection: "row",  // ✅ Aligns buttons horizontally
    alignItems: "center",  // ✅ Centers them vertically
    gap: 4,               // ✅ Adds spacing between icons
  },
  
  iconButton: {
    padding: 8,          // ✅ Adds some tappable area
    borderRadius: 8,      // ✅ Optional: makes touch area more defined
  },
  
  headerText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Permanent Marker",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#FFBA24",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "black",
    fontWeight: "bold",
  },
});

export default RaceLogScreen;
