import React from 'react';
import Timeline from 'react-native-timeline-flatlist';

interface TimelineComponentProps {
  data: Array<{ time: string; title: string; description: string; circleColor: string }>;
}

const TimelineComponent: React.FC<TimelineComponentProps> = ({ data }) => {

  return (
    <Timeline
      data={data}
      circleSize={20}
      lineColor='#A3B3BD'
      timeContainerStyle={{ minWidth: 140, alignItems: 'flex-end' }}
      timeStyle={{
        textAlign: 'right',
        backgroundColor: '#01C7FE',
        color: 'white',
        padding: 5,
        borderRadius: 13,
        fontWeight: 'bold',
      }}
      titleStyle={{
        fontSize: 18,  // Keep state name readable
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 2, // ✅ Reduce space between title (state) and description
      }}
      descriptionStyle={{
        color: 'gray',
        fontSize: 16,
        marginTop: 2, // ✅ Brings race name closer to state name
      }}
      innerCircle={'dot'}
    />
  );
};

export default TimelineComponent;


