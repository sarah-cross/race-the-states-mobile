import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import USMap from '../components/USMap';
import CircularProgressBar from '../components/CircularProgressBar';
import { useUser } from '../context/UserContext';
import TimelineComponent from '../components/Timeline';

const regionKeys = ['West', 'Midwest', 'South', 'Northeast'] as const;
type RegionName = typeof regionKeys[number];

const regionColors: Record<RegionName, string> = {
  West: '#95FF00',
  Midwest: '#EBFC00',
  South: '#FF63FA',
  Northeast: '#01C7FE',
};

const DEFAULT_BLUE = '#01C7FE';

const Dashboard: React.FC = () => {
  const navigation = useNavigation();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const authHeader = `Bearer ${user?.token}`;
        const response = await fetch("http://localhost:8000/api/dashboard/", {
          method: "GET",
          headers: { Authorization: authHeader },
        });

        if (!response.ok) return;

        const data = await response.json();

        if (data.timeline) {
          const formattedTimeline = data.timeline.map((race: any) => ({
            time: new Date(race.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            title: race.state,
            description: race.race_name,
            circleColor: regionColors[race.region as keyof typeof regionColors] || '#FFFFFF',
          }));

          setTimelineData([...formattedTimeline]);
        }

        setDashboardData(data);
      } catch (error) {
        console.error("❌ Network error:", error);
      }
    };

    if (user) fetchDashboardData();
  }, [user]);


  if (!dashboardData) {
    return (
      <LinearGradient colors={['#000000', '#555555']} style={styles.container}>
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </LinearGradient>
    );
  } 

  return (
    <LinearGradient colors={['#000000', '#555555']} style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Race the States</Text>
        <TouchableOpacity>
          <FontAwesome name="user" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
  
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={{ marginTop: 80 }}> {/* Push content down to avoid overlapping header */}
          {/* US Map Section */}
          <View style={styles.usMap}>
            <USMap completedStates={dashboardData.completed_states ?? []} allStates={dashboardData.all_states ?? []} />
          </View>
  
          {/* Progress Section */}
          <View style={styles.sectionContainer}>
            <ProgressBar 
              progress={(dashboardData.total_states_completed ?? 0) / 50} 
              style={styles.progressBar} 
              color={DEFAULT_BLUE} 
            />
            <Text style={styles.progressText}>{`${dashboardData.total_states_completed ?? 0} / 50 States Completed`}</Text>
          </View>
  
          {/* Region Completion */}
          <View style={styles.sectionContainer}>
            <View style={styles.regionContainer}>
              {Object.entries(dashboardData.progress_by_region).map(([region, value]) => (
                <View key={region} style={styles.circularProgressContainer}>
                  <CircularProgressBar
                  progress={(Number(value) / 10) * 100}
                  size={75}
                  strokeWidth={14}
                  color={regionColors[region as keyof typeof regionColors] || '#e6e6e6'}
                  backgroundColor={`rgba(${parseInt(regionColors[region as keyof typeof regionColors].slice(1, 3), 16)}, 
                                        ${parseInt(regionColors[region as keyof typeof regionColors].slice(3, 5), 16)}, 
                                        ${parseInt(regionColors[region as keyof typeof regionColors].slice(5, 7), 16)}, 0.3)`}
                />
                  <Text style={styles.regionText}>{region}</Text>
                </View>
              ))}
            </View>
          </View>
  
          {/* Timeline Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Race History</Text>
            {timelineData.length > 0 ? (
              <TimelineComponent data={timelineData} />
            ) : (
              <Text style={styles.noDataText}>No races logged yet.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}; // 🔴 FIX: Changed `)` to `}`

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    padding: 10,
  },
  sectionContainer: {
    backgroundColor: '#1C1C1E',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    paddingBottom: 20,
    fontWeight: 'bold',
    fontFamily: 'Permanent Marker',

  },
  progressBar: {
    height: 16,
    borderRadius: 5,
    width: '100%',
    backgroundColor: 'rgba(1, 199, 254, 0.3)',
  },
  progressText: {
    textAlign: 'center',
    color: '#FFFFFF',
    marginTop: 10,
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
  },
  loadingText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 220,
    fontSize: 24,
    fontFamily: 'Permanent Marker',
  },
  noDataText: {
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Dashboard;





