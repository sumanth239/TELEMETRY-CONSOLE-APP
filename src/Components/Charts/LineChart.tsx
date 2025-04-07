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
    <ResponsiveContainer width="100%" height="78%">
    <LineChart data={data}   margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <YAxis />
      <Tooltip />
      <Line
        type="monotone"
        dot={<CustomDot />}
        dataKey="value"
        stroke="#8884d8"
        isAnimationActive={false}
      />
    </LineChart>
  </ResponsiveContainer>
  );
};

export default LineChartComponent;
