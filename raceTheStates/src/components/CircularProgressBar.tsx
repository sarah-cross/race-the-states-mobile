import React from 'react';
import Svg, { Circle, Text } from 'react-native-svg';

interface CircularProgressBarProps {
  progress: number; // Progress as a percentage (0-100)
  size?: number; // Diameter of the circle
  strokeWidth?: number; // Width of the progress stroke
  color?: string; // Color of the progress stroke
  backgroundColor?: string; // Background color of the circle
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  progress,
  size = 100,
  strokeWidth = 12,
  color = '#4CAF50',
  backgroundColor = '#e6e6e6',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={backgroundColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`} // Rotate to start from the top
      />
      <Text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em" // Adjust text vertically
        fontSize={size / 6} // Adjust font size relative to the size of the circle
        fill={'white'}
      >
        {`${Math.round(progress)}%`}
      </Text>
    </Svg>
  );
};

export default CircularProgressBar;