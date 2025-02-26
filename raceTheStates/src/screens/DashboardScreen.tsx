import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from '../../App';
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { BottomTabParamList } from '../navigation/BottomTabs';
import { FlatList } from 'react-native';

import USMap from '../components/USMap';
import CircularProgressBar from '../components/CircularProgressBar';
import { useUser } from '../context/UserContext';
import TimelineComponent from '../components/Timeline';
import PRRaceCard from '../components/PRRaceCard';
import ProfileModal from './ProfileModal';
import { ProfileStackParamList } from '../navigation/ProfileStack';

const regionKeys = ['West', 'Midwest', 'South', 'Northeast'] as const;
type RegionName = typeof regionKeys[number];

const regionColors: Record<RegionName, string> = {
  West: '#95FF00',
  Midwest: '#EBFC00',
  South: '#FF63FA',
  Northeast: '#01C7FE',
};

// maybe this orange for default? #FFBA24 
const DEFAULT_BLUE = '#01C7FE';

const totalStatesByRegion: Record<string, number> = {
  West: 13,
  Midwest: 12,
  South: 14,
  Northeast: 11,
};


const Dashboard: React.FC = () => {
  type NavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<BottomTabParamList, "Dashboard">,
    StackNavigationProp<ProfileStackParamList>
  >;

const navigation = useNavigation<NavigationProp>();  
  const [loading, setLoading] = useState(true);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const { user } = useUser();

  const [isProfileModalVisible, setProfileModalVisible] = useState(false);
  const { logout } = useUser();

  const handleLogout = () => {
    logout(); // Clear user session
    setProfileModalVisible(false); // Close modal after logout

  };

  const [dashboardData, setDashboardData] = useState<{
    personal_record: {
      race_name: string;
      state: string;
      region_color: string;
      svg_path: string;
      time: string;
      date: string;
    } | null;
    timeline: any[];
    total_states_completed: number;
    total_miles_logged: number;
    all_states: any[];
    completed_states: any[];
    progress_by_region: Record<string, number>;
    average_race_times: Record<string, string>;
  }>({
    personal_record: null,
    timeline: [],
    total_states_completed: 0,
    total_miles_logged: 0,
    all_states: [],
    completed_states: [],
    progress_by_region: {},
    average_race_times: {},
  });


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const authHeader = `Bearer ${user?.token}`;
        const response = await fetch("http://localhost:8000/api/dashboard/", {
          method: "GET",
          headers: { Authorization: authHeader },
        });

        if (!response.ok) {
          console.error("❌ API error:", response.status, response.statusText);
          return;
        }
        

        const data = await response.json();

        const formattedTimeline = data.timeline.map((race: any) => ({
          time: new Date(race.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          title: race.state,
          description: race.race_name,
          circleColor: regionColors[race.region as keyof typeof regionColors] || '#FFFFFF',
        }));

        setTimelineData(formattedTimeline);

        setDashboardData({
          ...data,
          personal_record: data.personal_record
            ? {
                race_name: data.personal_record.race_name,
                state: data.personal_record.state,
                region_color: data.personal_record.region_color,
                svg_path: data.personal_record.svg_path,
                time: data.personal_record.time,
                date: new Date(data.personal_record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              }
            : null,
        });

      } catch (error) {
        console.error("❌ Network error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <LinearGradient colors={['#000000', '#555555']} style={styles.container}>
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#000000', '#555555']} style={styles.container}>
      
      {/* ✅ Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Race the States</Text>
        <TouchableOpacity onPress={() => navigation.navigate("ProfileStack", { screen: "Profile" })}>
          <FontAwesome name="user-circle" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>


  
      {/* ✅ Main Content */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={timelineData}
          keyExtractor={(item, index) => `timeline-${index}`}
          ListHeaderComponent={
            <>
              {/* US Map Section */}
              <View style={styles.usMap}>
                <USMap completedStates={dashboardData.completed_states ?? []} allStates={dashboardData.all_states ?? []} />
              </View>
  
              {/* Stats Section */}
              <View style={styles.statsContainer}>
                <View style={styles.statesStatBox}>
                  <Text style={styles.sectionTitle}>States Completed</Text>
                  <Text style={styles.statNumber}>{dashboardData.total_states_completed ?? 0}</Text>
                </View>
                <View style={styles.milesStatBox}>
                  <Text style={styles.sectionTitle}>Miles Logged</Text>
                  <Text style={styles.statNumber}>{dashboardData.total_miles_logged}</Text>
                </View>
              </View>

              {/* Region Completion */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Progress by Region</Text>
                {/* Region Completion */}
                <View style={styles.regionContainer}>
                  {Object.entries(dashboardData.progress_by_region).map(([region, value]) => {
                    const totalStatesInRegion = totalStatesByRegion[region] || 1;
                    return (
                      <View key={region} style={styles.circularProgressContainer}>
                        <CircularProgressBar
                          progress={(Number(value) / totalStatesInRegion) * 100}
                          size={75}
                          strokeWidth={14}
                          color={regionColors[region as keyof typeof regionColors] || '#e6e6e6'}
                          backgroundColor={`rgba(255, 255, 255, 0.15)`}
                        />
                        <Text style={styles.regionText}>{region}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
  
              {/* Timeline Section */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Timeline</Text>
                {timelineData.length > 0 ? (
                  <TimelineComponent data={timelineData} />
                ) : (
                  <Text style={styles.noDataText}>Add your first race on the Race Log!</Text>
                )}
              </View>
  
              {/* Personal Record Section */}
              <View style={styles.prSectionContainer}>
                <Text style={styles.sectionTitle}>Personal Record</Text>
                {dashboardData.personal_record ? (
                  <PRRaceCard
                    race_name={dashboardData.personal_record.race_name}
                    state={dashboardData.personal_record.state}
                    region_color={dashboardData.personal_record.region_color}
                    svg_path={dashboardData.personal_record.svg_path}
                    time={dashboardData.personal_record.time}
                    date={dashboardData.personal_record.date}
                  />
                ) : (
                  <Text style={styles.noDataText}>No PR race yet.</Text>
                )}
              </View>
            </>
          }
          renderItem={null} // Timeline handled in ListHeaderComponent
        />
      </View>
    </LinearGradient>
  );
  
  
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollContainer: {
    flexGrow: 1, // ✅ Allows scrolling if content overflows
    paddingBottom: 30, // ✅ Adds space at bottom for readability
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
  usMap: {
    paddingTop: 100,
    padding: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Ensures equal spacing
    marginHorizontal: 15, // Matches other sections
  },
  statesStatBox: {
    flex: 1, // Ensures each box takes up half the width
    backgroundColor: '#000000', // Matches other sections
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7.5,
    marginBottom: 25,
  },
  milesStatBox: {
    flex: 1, // Ensures each box takes up half the width
    backgroundColor: '#000000', // Matches other sections
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 7.5,
    marginBottom: 25,
  },
  statNumber: {
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Permanent Marker',
  },
  
  sectionContainer: {
    backgroundColor: '#000000',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 22,
    color: '#FFFFFF',
    paddingBottom: 20,
    fontWeight: 'bold',
    fontFamily: 'Permanent Marker',

  },
  progressBar: {
    height: 16,
    borderRadius: 5,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  progressText: {
    textAlign: 'center',
    color: '#FFFFFF',
    marginTop: 10,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  regionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  circularProgressContainer: {
    alignItems: 'center',
  },
  regionText: {
    marginTop: 5,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  prSectionContainer: {
    backgroundColor: '#000000',
    borderRadius: 15,
    padding: 20,
    marginBottom: 5,
    marginHorizontal: 15, // prevents the container from filling the width of the screen 
    height: 200,
  },
  loadingText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 220,
    fontSize: 24,
    fontFamily: 'Permanent Marker',
  },
  noDataText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },

});

export default Dashboard;





