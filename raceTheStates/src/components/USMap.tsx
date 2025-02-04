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
  allStates: StateData[];
}

const regionColors: Record<RegionName, string> = {
  West: '#95FF00',
  Midwest: '#EBFC00',
  South: '#FF63FA',
  Northeast: '#01C7FE',
};

const projection = d3.geoAlbersUsa().scale(1300).translate([480, 250]);
const pathGenerator = d3.geoPath().projection(projection);

const USMap: React.FC<USMapProps> = ({ completedStates = [], allStates = [] }) => {
  const stateRegionMap: Record<string, RegionName> = {};
  allStates.forEach(state => {
    stateRegionMap[state.name] = state.region;
  });

  const paths = useMemo(() => {
    return usMap.features.map((feature, i) => {
      const pathData = pathGenerator(feature as d3.GeoPermissibleObjects) || '';
      const stateName = feature.properties.NAME;
      const region = stateRegionMap[stateName];

      const completedState = completedStates.find(state => state.name === stateName);

      const fillColor = completedState ? regionColors[completedState.region] : 'transparent';
      const borderColor = region ? regionColors[region] : 'white'; // Region-based outline

      return (
        <Path
          key={`path-${i}`}
          d={pathData}
          fill={fillColor} // ✅ Transparent unless completed
          stroke={borderColor} // ✅ Regional color as border
          strokeWidth={4} // ✅ Inner border thickness
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

