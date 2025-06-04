// src/components/EchartsLogZoomChart.tsx

import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

const EchartsLogZoomChart: React.FC = () => {
  const [lineData, setLineData] = useState<number[]>([10]);
  const [stepLineData, setStepLineData] = useState<number[]>([12]);
  const [timestamps, setTimestamps] = useState<string[]>([
    new Date().toLocaleTimeString(),
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeLabel = now.toLocaleTimeString();
      const value = Math.random() * 100 + 1; // must be > 0 for log scale

      setLineData(prev => {
        const updated = [...prev, value];
        return updated.length > 10 ? updated.slice(-10) : updated;
      });

      setStepLineData(prev => {
        const updated = [...prev, value * 1.5];
        return updated.length > 10 ? updated.slice(-10) : updated;
      });

      setTimestamps(prev => {
        const updated = [...prev, timeLabel];
        return updated.length > 10 ? updated.slice(-10) : updated;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const option = {
    title: {
      text: "Apache ECharts - Real-Time Logarithmic Chart",
      left: "center",
    },
    tooltip: {
      trigger: "axis",
    },
    xAxis: {
      type: "category",
      data: timestamps,
    },
    yAxis: {
      type: "log",
      logBase: 10,
      name: "Log Scale",
      min: 1,
      boundaryGap: [0.05, 0.05],
    },
    series: [
      {
        name: "Line",
        type: "line",
        data: lineData,
        smooth: true,
        showSymbol: false,
      },
      {
        name: "Step Line",
        type: "line",
        data: stepLineData,
        step: "middle",
        showSymbol: false,
      },
    ],
    dataZoom: [
      {
        type: "inside",
        throttle: 50,
      },
      {
        type: "slider",
      },
    ],
    animation: false,
    grid: {
      left: "10%",
      right: "10%",
      bottom: "15%",
      containLabel: true,
    },
  };

  return (
    <div style={{ width: "100%", maxWidth: 900, margin: "0 auto" }}>
      <ReactECharts
        option={option}
        style={{ height: 400 }}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
};

export default EchartsLogZoomChart;
