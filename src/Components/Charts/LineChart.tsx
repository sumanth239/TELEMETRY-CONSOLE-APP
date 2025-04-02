import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

//Type of data point data 
interface DataPoint {
  "value":number,
}

//Type of graph data
interface ChildProps {
  data :DataPoint[]
}

const LineChartComponent: React.FC <ChildProps > = ({data}) => {
  
   // Custom dot for the latest value
   const CustomDot = (props: any) => {
    const { cx, cy, index } = props;
    if (index === data.length - 1) {
      return (
        <circle cx={cx} cy={cy} r={5} fill="green" stroke="black" strokeWidth={0} />
      );
    }
    else{
      return (
        <circle cx={cx} cy={cy} r={2} fill="red"/>
      )
    
    }
  };

  // console.log("data",data);
  return (
    <ResponsiveContainer width="100%" height="80%">
      <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="timestamp" tickFormatter={(t) => t} />
      <YAxis />
      <Tooltip />
      <Line type="monotone"  dot={<CustomDot />}  dataKey="value" stroke="#8884d8" isAnimationActive={false} />
    </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
