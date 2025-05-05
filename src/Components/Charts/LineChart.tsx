//default imports
import React from "react";
import { useState } from "react";

//style sheet imports
import "./LineChart.css";

//library imports
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, Brush } from "recharts";

//utilities imports
import * as types from '../../Utils/types';


//props
interface ChildProps {
  data: types.DataPoint[]
  graphOptions: types.GraphOptions
  timeSlider: Boolean
  graphType: string
  graphLineToggles :Boolean[]
}



const LineChartComponent: React.FC<ChildProps> = ({ data, graphOptions, timeSlider, graphType ,graphLineToggles}) => {
  const [zoomDomain, setZoomDomain] = useState({ startIndex: 0, endIndex: data.length - 1 });


  // Custom dot for the latest value
  const CustomDot = (props: any) => {
    const { cx, cy, index } = props;
    if (index === data.length - 1) {
      return (
        <circle cx={cx} cy={cy} r={5} fill="green" stroke="black" strokeWidth={0} className="blinking-dot" />
      );
    }
    else {
      return (
        <circle cx={cx} cy={cy} r={2} fill="red" />
      )

    }
  };

  const handleBrushChange = (newDomain: any) => {       //default time slider of recharts
    if (newDomain?.startIndex != null && newDomain?.endIndex != null) {
      setZoomDomain(newDomain);
    }
  };
  
  const getColorForLabel = (index: number) => {
    const colorMap = [
      "#446BAD",
      "#ff7300",
       "#387908",
       "#F05A7E",
       "#82ca9d",
       "#000000"]
    return colorMap[index] ;
  };


  return (
    <ResponsiveContainer width="100%" height={timeSlider ? "85%" : "90%"}>
      <LineChart className="chart" data={data}>
        {graphOptions.Gridlines && <CartesianGrid strokeDasharray="3 3" />}

        <XAxis  dataKey="timestamp" fontSize={10} domain={[zoomDomain.startIndex, zoomDomain.endIndex]} tickFormatter={(value) => value} >
          {graphOptions["Axis Titles"] && (
            <Label value="timestamp" offset={6} position="insideBottom" fontSize={8} />
          )}
        </XAxis>

        <YAxis  fontSize={10} scale={graphOptions["Logarithmic Scale"] ? "log" : "linear"} domain={["auto", "auto"]} >
          {graphOptions["Axis Titles"] && (
            <Label  value="Value" offset={36} angle={-90} fontSize={8}  position="insideLeft" style={{ textAnchor: "middle" }} />
          )}
        </YAxis>

        <Tooltip />
        {/* {data && data[0] && Object.keys(data[0]).length > 2 &&  <Legend  fontSize={5}/>}  legend to display the x axis graph line axis titles*/}  
       
        {data && data[0] && Object.keys(data[0])?.filter((key) => key != "timestamp").map((line,index) =>
          graphLineToggles[index] && <Line
          key={line}
          dataKey={line.includes(" ") ? `['${line}']` : line}   //since recharts lib cant render varible names directly
          type={graphType == "step" ? "step" : "monotone"}
          stroke={ getColorForLabel(index)}
          dot={<CustomDot />}
          isAnimationActive={false}
        />
        )}


        {/* 🔍 Zoom control */}
        {/* { timeSlider && <Brush
          dataKey="timestamp"
          height={20}
          stroke="#8884d8"
          startIndex={zoomDomain.startIndex}
          endIndex={zoomDomain.endIndex}
          onChange={handleBrushChange}
        />} */}
      </LineChart>
    </ResponsiveContainer>

  );
};

export default LineChartComponent;
