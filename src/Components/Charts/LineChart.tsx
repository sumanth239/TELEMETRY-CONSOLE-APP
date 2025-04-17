import React from "react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label , Brush } from "recharts";
import "./LineChart.css";

//Type of data point data 
interface DataPoint {
  "value": number,
}

//type of graph options 
type GraphOptions = {
  "Logarithmic Scale": boolean;
  "Axis Titles": boolean;
  "Gridlines": boolean;
}

//Type of graph data
interface ChildProps {
  data: DataPoint[]
  graphOptions: GraphOptions
  timeSlider:Boolean
}



const LineChartComponent: React.FC<ChildProps> = ({ data, graphOptions ,timeSlider}) => {
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
  const handleBrushChange = (newDomain: any) => {
    if (newDomain?.startIndex != null && newDomain?.endIndex != null) {
      setZoomDomain(newDomain);
    }
  };

  // console.log("data",data);
  return (
    <ResponsiveContainer width="98%" height="88%">
      <LineChart data={data}>
        {graphOptions.Gridlines && <CartesianGrid strokeDasharray="3 3" />}

        <XAxis
          dataKey="timestamp"
          fontSize={12}
          // domain={[zoomDomain.startIndex, zoomDomain.endIndex]}
          // tickFormatter={(value) => value} // format timestamp if needed
        >
          {graphOptions["Axis Titles"] && (
            <Label value="timestamp" offset={13} position="insideBottom" />
          )}
        </XAxis>

        <YAxis
          scale={graphOptions["Logarithmic Scale"] ? "log" : "linear"}
          domain={["auto", "auto"]}
        >
          {graphOptions["Axis Titles"] && (
            <Label
              value="Value"
              offset={12}
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle" }}
            />
          )}
        </YAxis>

        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          dot={<CustomDot />}
          isAnimationActive={false}
        />

        {/* 🔍 Zoom control */}
        { timeSlider && <Brush
          dataKey="timestamp"
          height={20}
          stroke="#8884d8"
          startIndex={zoomDomain.startIndex}
          endIndex={zoomDomain.endIndex}
          onChange={handleBrushChange}
        />}
      </LineChart>
    </ResponsiveContainer>

  );
};

export default LineChartComponent;
