import React from 'react';
import Timeline from 'react-native-timeline-flatlist';

interface TimelineComponentProps {
  data: Array<{ time: string; title: string; description: string; circleColor: string }>;
}

const TimelineComponent: React.FC<TimelineComponentProps> = ({ data }) => {
  console.log('📌 TimelineComponent received data:', data);

  return (
    <Timeline
      data={data}
      circleSize={20}
      lineColor='#A3B3BD'
      timeContainerStyle={{ minWidth: 140, alignItems: 'flex-end' }}
      timeStyle={{
        textAlign: 'right',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        color: 'white',
        padding: 5,
        borderRadius: 13,
      }}
      titleStyle={{
        fontSize: 16,  // Keep state name readable
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 2, // ✅ Reduce space between title (state) and description
      }}
      descriptionStyle={{
        color: 'gray',
        fontSize: 14,
        marginTop: 2, // ✅ Brings race name closer to state name
      }}
      innerCircle={'dot'}
    />
  );
};

export default TimelineComponent;


