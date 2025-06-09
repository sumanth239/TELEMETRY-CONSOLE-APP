import React from "react";
import ReactECharts from "echarts-for-react";

interface TimeSliderProps {
  timeSliderData: { timestamp: number; [key: string]: any }[];
  onBrushChange: (startIndex: number, endIndex: number) => void;
  startIndex?: number;
  endIndex?: number;
}

const TimeSlider: React.FC<TimeSliderProps> = ({
  timeSliderData,
  onBrushChange,
  startIndex = 0,
  endIndex,
}) => {
  const timestamps = timeSliderData.map((d) => d.timestamp);

  const option = {
    animation: false,
    grid: { top: 0, bottom: 0, left: 0, right: 0 },
    xAxis: {
      type: "category",
      data: timestamps,
      show: false,
    },
    yAxis: {
      type: "value",
      show: false,
    },
    series: [
      {
        type: "line",
        data: new Array(timestamps.length).fill(0), // dummy data for line
        showSymbol: false,
        lineStyle: { opacity: 0 },
      },
    ],
    dataZoom: [
      {
        type: "slider",
        show: true,
        xAxisIndex: 0,
        height: 30,
        bottom: 10,
        start: (startIndex / timestamps.length) * 100,
        end: endIndex
          ? (endIndex / timestamps.length) * 100
          : 100,
        handleIcon:
          "path://M8.7,15.3v-6.7c0-0.5-0.4-1-1-1s-1,0.4-1,1v6.7c0,0.5,0.4,1,1,1S8.7,15.8,8.7,15.3z",
        handleSize: "100%",
        handleStyle: {
          color: "#8884d8",
        },
        fillerColor: "#8884d855",
        backgroundColor: "#f0f0f0",
      },
    ],
  };

  const onEvents = {
    dataZoom: (e: any) => {
      const start = Math.round((e.start / 100) * timestamps.length);
      const end = Math.round((e.end / 100) * timestamps.length);
      onBrushChange(start, end);
    },
  };

  return (
    <div style={{ width: "65%" }}>
      <ReactECharts
        option={option}
        style={{ width: "100%", height: 50 }}
        onEvents={onEvents}
      />
    </div>
  );
};

export default TimeSlider;
