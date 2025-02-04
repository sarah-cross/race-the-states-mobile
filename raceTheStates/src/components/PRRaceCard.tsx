import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';

interface PRRaceCardProps {
    race_name: string;
    state: string;
    region_color: string;
    time: string;
    date: string;
    svg_path: string;
}

// ✅ Function to format race time (ISO 8601 -> HH:MM)
const formatRaceTime = (time: string) => {
    const match = time.match(/P(\d+D)?T(\d{2})H(\d{2})M(\d{2})S/);
    return match ? `${match[2]}:${match[3]}` : time;
};

const PRRaceCard: React.FC<PRRaceCardProps> = ({ race_name, state, region_color, time, date, svg_path }) => {
    if (!svg_path) return null;

    // ✅ Construct SVG dynamically
    const svgXmlData = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200">
            <path d="${svg_path}" fill="${region_color}" stroke="black" stroke-width="2"/>
        </svg>
    `;

    return (
        <View style={styles.row}>
            {/* ✅ State SVG (vertically centered, no extra container) */}
            <SvgXml xml={svgXmlData} width={150} height={150} preserveAspectRatio="xMidYMid meet" style={styles.stateSvg} />

            {/* ✅ Race Details, directly placed (no container) */}
            <View>
                <Text style={styles.raceName}>{race_name}</Text>
                <Text style={styles.stateText}>{state}</Text>
                <Text style={styles.time}>{formatRaceTime(time)}</Text>
                <Text style={styles.date}>{date}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row', // ✅ Aligns state & text side by side
        alignItems: 'flex-start', // ✅ Vertically center elements
        marginTop: 4,
    },
    stateSvg: {
       // marginRight: 4, // Space between the state and text
        marginTop: 4,
        marginLeft: 20,

    },
    raceName: {
        fontSize: 18, // ✅ Bold white (matches Timeline)
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 2,
    },
    stateText: {
        fontSize: 16, // ✅ Gray subtext (matches Timeline)
        color: 'gray',
        marginTop: 2,
        
    }, 
    time: {
        fontSize: 16,
        color: 'gray',
        marginTop: 2,
    },
    date: {
        fontSize: 16,
        color: 'gray',
        marginTop: 2,
    },
});

export default PRRaceCard;
