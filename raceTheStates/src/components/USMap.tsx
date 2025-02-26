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

// React.FC is a TS generic type that defines a functional component, type checks the properties
const USMap: React.FC<USMapProps> = ({ completedStates = [], allStates = [] }) => { // destructuring (accessing specific properties of an object); the object being destructured is props, but props is not explicitly named
  const stateRegionMap: Record<string, RegionName> = {}; // initialize an empty object named stateRegionMap; Record<string, RegionName> is TS annotation
  allStates.forEach(state => { // need to create a new map of state-region pairs for fast look up when we loop through the json of states
    stateRegionMap[state.name] = state.region; // add a new key-value pair to stateRegionMap where stateRegion[state] = region.. 
  });

  const paths = useMemo(() => { // prevents re-running when it doesn't need to
    return usMap.features.map((feature, i) => {  // loop over map features and transform each item into a new value
      const pathData = pathGenerator(feature as d3.GeoPermissibleObjects) || '';  // create path data for each feature (state)
      const stateName = feature.properties.NAME; // get the state's name
      const region = stateRegionMap[stateName]; // get the state's region

      const completedState = completedStates.find(state => state.name === stateName); // look through list of completedStates to see if stateName is there

      const fillColor = completedState ? regionColors[completedState.region] : 'transparent';
      const borderColor = region ? regionColors[region] : 'white'; // Region-based outline

      return (
        <Path
          key={`path-${i}`}
          d={pathData}
          fill={fillColor} // Transparent unless completed
          stroke={borderColor} // Regional color as border
          strokeWidth={2.5} // Inner border thickness
        />
      );
    });
  }, [completedStates, allStates]); // dependency array of useMemo(); if either of these change, it re runs the map function; otherwise use previously computed

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

