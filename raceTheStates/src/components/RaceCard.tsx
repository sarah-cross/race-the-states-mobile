import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

interface RaceCardProps {
  race_name: string;
  state: string;
  city?: string;
  region_color: string;
  time: string;
  date: string;
  svg_path: string;
}

// ✅ Format race time (Same as PR card)
const formatRaceTime = (time: string) => {
  const match = time.match(/P(\d+D)?T(\d{2})H(\d{2})M(\d{2})S/);
  return match ? `${match[2]}:${match[3]}` : time;
};

const RaceCard: React.FC<RaceCardProps> = ({ race_name, state, city, region_color, time, date, svg_path }) => {
    if (!svg_path) return null;

    const scaleFactors: Record<string, number> = {
        Alaska: 1.2, // Scale UP Alaska
        Hawaii: 1.2, // Slightly bigger
        Utah: 0.8,   // Scale DOWN Utah
    };

    const scaleFactor = scaleFactors[state] || 1; // Default scale 1 if not listed

    const svgXmlData = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 700">
          <path d="${svg_path}" fill="${region_color}" stroke="${region_color}" stroke-width="2"/>
      </svg>
  `;

    return (
        <View style={styles.card}>
            {/* ✅ Scaled SVG */}
            <View style={{ width: 80, height: 80, justifyContent: "center", alignItems: "center" }}>
                <SvgXml xml={svgXmlData} width={75 * scaleFactor} height={75 * scaleFactor} />
            </View>


            {/* ✅ Race Details */}
            <View style={styles.raceDetails}>
                <Text style={styles.raceName}>{race_name}</Text>

                {/* ✅ City (if available) */}
                {city && <Text style={styles.cityText}>{city}, {state}</Text>}

                {/* ✅ State & Date */}
                {!city && <Text style={styles.stateText}>{state}</Text>}
                <Text style={styles.date}>{date}</Text>
                <Text style={styles.time}>{formatRaceTime(time) || "N/A"}</Text>
            </View>
        </View>
    );
};



const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 15,
    borderRadius: 10,
    marginBottom: 0,
    margin: 15,
    height: 100,
  },
  stateSvg: {
    paddingRight: 40,
  },
  raceDetails: {
    flex: 1, 
    justifyContent: 'center', 
    marginLeft: 20,
  },
  raceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cityText: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  stateText: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  date: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  time: {
    fontSize: 14,
    color: '#AAAAAA',
  },
});

export default RaceCard;
