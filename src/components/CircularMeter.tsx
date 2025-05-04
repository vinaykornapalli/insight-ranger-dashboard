
import React from "react";
import { Gauge } from "lucide-react";

interface CircularMeterProps {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  description?: string;
  rating?: string;
}

const CircularMeter: React.FC<CircularMeterProps> = ({
  value,
  maxValue = 10,
  size = 160,
  strokeWidth = 16,
  color = "#7E69AB",
  backgroundColor = "#EBE8F2",
  label,
  description,
  rating,
}) => {
  const normalizedValue = Math.min(Math.max(value, 0), maxValue);
  const percentage = (normalizedValue / maxValue) * 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center">
      {label && (
        <div className="mb-2 text-gray-700 font-medium text-sm">{label}</div>
      )}
      {description && (
        <p className="text-gray-500 text-sm text-center mb-3">{description}</p>
      )}
      <div className="relative" style={{ width: size, height: size }}>
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
        </svg>
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <div className="text-4xl font-bold" style={{ color }}>
            {value}
          </div>
          {maxValue !== 100 && (
            <div className="text-gray-500 text-xs mt-1">/{maxValue}</div>
          )}
        </div>
      </div>
      {rating && (
        <div className="mt-4 text-gray-700 font-medium text-center">{rating}</div>
      )}
    </div>
  );
};

export default CircularMeter;
