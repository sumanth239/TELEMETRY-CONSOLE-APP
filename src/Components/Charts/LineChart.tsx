import React from "react";
import ReactECharts from "echarts-for-react";
import * as types from '../../Utils/types';
import * as CONSTANTS from '../../Utils/Constants';

interface ChildProps {
  data: types.DataPoint[];
  graphOptions: types.GraphOptions;
  timeSlider: Boolean;
  graphType: string;
  graphLineToggles: Boolean[];
}

const LineChartComponent: React.FC<ChildProps> = ({ data, graphOptions, timeSlider, graphType, graphLineToggles }) => {

  const getSeries = () => {
    if (!data.length) return [];

    const keys = Object.keys(data[0]).filter((key) => key !== "timestamp");

    return keys.map((key, index) => {
      if (!graphLineToggles[index]) return null;

      return {
        name: key,
        type: graphType === "step" ? "line" : "line",
        step: graphType === "step" ? "middle" : undefined,
        showSymbol: true,
        symbolSize: (value: any, params: any) => {
          return params.dataIndex === data.length - 1 ? 6 : 3;
        },
        itemStyle: {
          color: CONSTANTS.COLOR_MAP[index]
        },
        data: data.map(d => [d.timestamp, d[key as keyof types.DataPoint]]),
      };
    }).filter(Boolean);
  };

  const mainSeries = getSeries();
  // Add blinking effect at the latest point of each line series
const blinkingPoints = mainSeries.map((series) => {
  const lastData = series?.data[series.data.length - 1];
  return {
    type: 'effectScatter',
    name: `${series?.name}-blinking`,
    coordinateSystem: 'cartesian2d',
    data: [lastData],
    symbolSize: 10,
    showEffectOn: 'render',
    rippleEffect: {
      period: 1,
      scale: 2.5,
      brushType: 'stroke'
    },
    itemStyle: {
      color: series?.itemStyle?.color || undefined // reuse line color
    },
    zlevel: 10
  };
});


  const option = {
    animation: false,
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      show: false // Set true if needed
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '22%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      name: graphOptions["Axis Titles"] ? "timestamp" : '',
      nameLocation: 'middle',     // ⬅️ Places it in the center
      nameGap: 20,                // ⬅️ Distance below the axis
      data: data.map(d => d.timestamp),
      axisLabel: {
        fontSize: 10
      },
      splitLine: {
        show: graphOptions["Gridlines"],
      }
    },
    yAxis: {
      type: graphOptions["Logarithmic Scale"] ? 'log' : 'value',
      name: graphOptions["Axis Titles"] ? "Value" : '',
      nameRotate: 90, // ⬅️ Rotate the axis name only
      nameLocation: 'middle', // Optional: place the name in the middle
      nameGap: 25, // Optional: space between the axis and the name
      axisLabel: {
        fontSize: 10
      },
      splitLine: {
        show: graphOptions["Gridlines"],
      }
    },
    series: [...mainSeries, ...blinkingPoints],
    dataZoom: timeSlider ? [
      {
        type: 'slider',
        start: 0,
        end: 100,
        xAxisIndex: 0
      }
    ] : [],
  };

  return (
    <div style={{ width: '100%', height: timeSlider ? "88%" : "100%" }}>
      <ReactECharts
        option={option}
        notMerge={true}
        lazyUpdate={true}
        style={{ width: '100%', height: '100%', marginTop: "0px" }}
      />
    </div>
  );
};

export default LineChartComponent;
