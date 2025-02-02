import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as d3 from 'd3-geo';
import usMap from '../assets/data/us-states.json';

type RegionName = 'West' | 'Midwest' | 'South' | 'Northeast';

interface StateData {
  name: string;
  region: RegionName;
}

interface USMapProps {
  completedStates: StateData[];
  allStates: StateData[]; // 🔥 All states with their regions
}

const regionColors: Record<RegionName, string> = {
  West: '#95FF00',
  Midwest: '#EBFC00',
  South: '#FF63FA',
  Northeast: '#01C7FE',
};

// ✅ Convert HEX to RGBA for faded colors
const hexToRGBA = (hex: string, alpha: number = 0.) => {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const projection = d3.geoAlbersUsa().scale(1300).translate([480, 250]);
const pathGenerator = d3.geoPath().projection(projection);

const USMap: React.FC<USMapProps> = ({ completedStates = [], allStates = [] }) => {
  console.log('✅ Completed States:', completedStates);
  console.log('✅ All States:', allStates);

  // 🔥 Create a lookup table for region by state name (for all states)
  const stateRegionMap: Record<string, RegionName> = {};
  allStates.forEach(state => {
    stateRegionMap[state.name] = state.region;
  });

  const paths = useMemo(() => {
    return usMap.features.map((feature, i) => {
      const pathData = pathGenerator(feature as d3.GeoPermissibleObjects) || '';
      const stateName = feature.properties.NAME;

      // ✅ Find if the state is completed
      const completedState = completedStates.find(state => state.name === stateName);

      // ✅ Get region from all states
      const region = stateRegionMap[stateName];

      // ✅ Use vibrant color for completed states, faded for uncompleted
      const fillColor = completedState
        ? regionColors[completedState.region]  // 🔥 Fully colored for completed
        : region && regionColors[region]
          ? 'rgba(255, 255, 255, 0.15)' 
          : 'rgba(255, 255, 255, 0.15)';  // Default faded white

      return (
        <Path
          key={`path-${i}`}
          d={pathData}
          fill={fillColor}
          stroke="white"
          strokeWidth={1.5}
        />
      );
    });
  }, [completedStates, allStates]);

  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 970 500">
        {paths}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default USMap;


