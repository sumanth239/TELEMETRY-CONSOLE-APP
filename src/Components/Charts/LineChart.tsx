import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer ,Label} from "recharts";

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
}



const LineChartComponent: React.FC<ChildProps> = ({ data, graphOptions }) => {

  // Custom dot for the latest value
  const CustomDot = (props: any) => {
    const { cx, cy, index } = props;
    if (index === data.length - 1) {
      return (
        <circle cx={cx} cy={cy} r={5} fill="green" stroke="black" strokeWidth={0} />
      );
    }
    else {
      return (
        <circle cx={cx} cy={cy} r={2} fill="red" />
      )

    }
  };

  // console.log("data",data);
  return (
    <ResponsiveContainer width="98%" height="90%">
      <LineChart data={data}>
        {graphOptions.Gridlines && <CartesianGrid strokeDasharray="3 3" />}

        <XAxis dataKey="index">
          {graphOptions["Axis Titles"] && (
            <Label value="TimeStamp" offset={13} position="insideBottom" />
          )}
        </XAxis>

        <YAxis scale={graphOptions["Logarithmic Scale"] ? "log" : "linear"} domain={["auto", "auto"]}>
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
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
