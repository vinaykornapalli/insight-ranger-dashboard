
import React from "react";

interface CircularMeterProps {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  valueLabel?: string;
}

const CircularMeter: React.FC<CircularMeterProps> = ({
  value,
  maxValue = 10,
  size = 120,
  strokeWidth = 10,
  color = "#7E69AB",
  backgroundColor = "#e6e6e6",
  label,
  valueLabel,
}) => {
  const normalizedValue = Math.min(Math.max(value, 0), maxValue);
  const percentage = (normalizedValue / maxValue) * 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${center} ${center})`}
          strokeLinecap="round"
        />
        {/* Center text */}
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dy=".3em"
          fontSize="1.8rem"
          fontWeight="bold"
          fill={color}
        >
          {valueLabel || normalizedValue}
        </text>
      </svg>
      {label && <div className="text-xs text-gray-500 mt-2">{label}</div>}
    </div>
  );
};

export default CircularMeter;
