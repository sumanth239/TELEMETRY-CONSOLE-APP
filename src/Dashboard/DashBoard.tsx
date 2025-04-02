import React, { useState, useEffect } from "react";
import "./DashBoard.css"; // Import the CSS file
import { teleCommandType, systemModes, teleCommands, graphOptions, allLables, } from "../Utils/Constant";
import LineChartComponent from "../Components/Charts/LineChart";
import CalendarComponent from "../Components/Calender";
import useCurrentTime from "../Utils/useCurrentTime";
import axios from "axios";
import { data } from "react-router-dom";

//Intials states of useState
const initialVisibility: { [key: string]: boolean } = {};
const initialGraphOptionsState: { [key: string]: boolean } = {};
const intialTelemeteryData: { [key: string]: { timestamp: string; value: number }[] } = {};


//Modifying intial state of graphs as visible
allLables.forEach((label) => {
  initialVisibility[label] = true;
  intialTelemeteryData[label] = [];
});

//Modifying intial state of grpahs options of label as false
allLables.forEach((label) => {
  initialGraphOptionsState[label] = false;
});

const MAX_POINTS = 10;

const Dashboard: React.FC = () => {

  //states
  const [telemetryData, setTelemetryData] = useState(intialTelemeteryData);   //to handle real time telemetry data 
  const [startSystem, setStartSystem] = useState(false);    //to know system is live or not
  const [systemCounter, setSystemCounter] = useState(0);    //for system counter
  const [utcCounter, setUtcCounter] = useState(0);    //for UTC counter
  const [tmtData, setTmtData] = useState([]);   //to handle telecmd data with counter and telecmd values
  const [systemStartedTime, setSystemStartedTime] = useState<any>("27-03-2025 12:30:45");    //to handle system live time
  const [teleCmdData, setTeleCmdData] = useState<string[]>([]);   //for telecmd packet data genrated from backend
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);     //to handle the calender selected date 
  const [teleCmdsFormData, setTeleCmdsFormData] = useState({ //state to handle all tele cmds states ,telecmd type i.e Real time or Time Tagged,telecmd,telecmd value i.e input by user
    "teleCmdType": "Real Time",
    "teleCmd": { "cmd": "", "cmdId": 0 },
    "teleCmdValue": "",

  })
  const [graphOptionsOpendLables, setgraphOptionsOpendLables] = useState(initialGraphOptionsState);   //state to handle the graph options visibility
  const [visibleGraphs, setVisibleGraphs] = useState<{ [key: string]: boolean }>(     //to handle the  graphs visibility
    () => allLables.reduce((acc, label) => {
      acc[label] = true;      // Initialize each label as visible (true)
      return acc;
    }, {} as { [key: string]: boolean })
  );
  const [systemMode, setSystemMode] = useState("Idle Mode");
  const [teleCmdValueError, setTeleCmdValueError] = useState<string>("");

  const { formattedDate, formattedTime, currentUtcTime } = useCurrentTime();   //Extracting current time and current date thorugh custom hook

  //function to fetch the telecmds data along with telecmd values and system counters  
  const fetchTmtCmds = async () => {
    try {
      const response: any = await axios.get("http://127.0.0.1:8000/dashboard/get_sheduled_commands", {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response) {
        setTmtData(response.data);
      }

      console.log("Response from API:", response.data);
    } catch (error) {
      console.error("API call failed:", error);
    }
  }

  // use Effects
  useEffect(() => {
    fetchTmtCmds()
  }, [startSystem]); // Dependency array remains empty to avoid re-creating intervals


  useEffect(() => {
    if (startSystem) {
      const ws = new WebSocket(`ws://127.0.0.1:8000/ws`);

      ws.onmessage = (event) => {   //on websocket connection
        try {
          const incomingData = JSON.parse(event.data); // Expected JSON: { "Al Angle": 45, "En Angle": 30, "label1": 12, ... }

          setTelemetryData((prevData) => {
            const updatedData = { ...prevData };

            allLables.forEach((label, index) => {
              if (incomingData[index] !== undefined) {
                const newEntry = { timestamp: new Date().toLocaleTimeString("en-GB", { timeZone: "UTC", hour12: true }), value: incomingData[index] };
                updatedData[label] = [...(prevData[label] || []), newEntry].slice(-MAX_POINTS);   //updating real time telemetry data i.e generated and received from backend
              }
            });

            return updatedData;
          });
        } catch (error) {
          console.error("WebSocket Data Error:", error);
        }
      };

      ws.onerror = (error) => console.error("WebSocket Error:", error);
      ws.onclose = () => console.log("WebSocket Disconnected");

      const interval = setInterval(() => {    //interval function to handle the system counter and UTC counter
        setSystemCounter((prev) => prev + 1);
        setUtcCounter((prev) => prev + 1);
      }, 1000);     // Update every second

      return () => { ws.close(); clearInterval(interval) };   //close websocket connection and clear interval for every second

    }


  }, [startSystem]);

  useEffect(() => {
    setTeleCmdValueError(""); // Reset error

    setTeleCmdsFormData((prev) => ({
      ...prev,
      teleCmdValue: "", // Reset input value properly
    }));
  }, [teleCmdsFormData.teleCmd]); 

  //Handlar functions

  const handleDateChange = (event: any) => {   //to handle date change in child component
    setSelectedDateTime(event.target.value);
    console.log(event.target.value)
  };

  const CommandsDataHandler = async (event: any) => {     //to handle commands data on apply telecmd form
    event.preventDefault()

    let teleCommand = teleCmdsFormData.teleCmd
    let teleCommandValue = teleCmdsFormData.teleCmdValue

    if (teleCmdsFormData.teleCmdType == "Real Time") {
      if (teleCommand.cmd == "System Mode") {
        setSystemMode(teleCommandValue)

        if (teleCommandValue == "Stand-By Mode") {
          setStartSystem(!startSystem);
          // setUtcCounter(0); 
          // setSystemCounter(0);
          setSystemStartedTime(new Date())
        }
      } else if (teleCommand.cmd == "Shutdown System") {
        setStartSystem(!startSystem);
        setUtcCounter(0);
        setSystemCounter(0);
        setSystemStartedTime(new Date())

      }
    }


    const cmdData = {
      "telecmd_type": teleCmdsFormData.teleCmdType,
      "telecmd_type_value":
        teleCmdsFormData.teleCmdType == "Real Time"
          ? `${formattedDate} ${formattedTime}`
          : `${selectedDateTime}`,
      "telecmd": teleCommand.cmd,   // Extract cmd from selectedCommand object
      "telecmd_value": teleCommandValue,
      "telecmd_id": teleCommand.cmdId,
      "systemCounter": teleCmdsFormData.teleCmdType == "Real Time" ? 0 : getTimeDifferenceInSeconds(systemStartedTime, selectedDateTime) // Convert cmdId to string if needed
    };
    console.log("Sending command data:", cmdData);
    // return ;

    try {
      const response: any = await axios.post("http://127.0.0.1:8000/dashboard/get_telecmds", cmdData, {   //API to convert the telecmd into packet format along with system counter
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response) {
        setTeleCmdData((prevData) => [...prevData, response.data.data]); // Correct way to update state
        fetchTmtCmds()
      }

      console.log("Response from API:", response.data);
      console.log("tele", teleCmdData)
    } catch (error) {
      console.error("API call failed:", error);
    }
  };


  const CommandHandler = (event: any) => {      //to handle entered telecommand
    const selectedData = JSON.parse(event.target.value);
    setTeleCmdsFormData((prevState) => (
      {
        ...prevState,
        ["teleCmd"]: selectedData,
       [ "teleCmdValue"]:"100"
      }
    ))
    console.log("ay",teleCmdsFormData.teleCmdValue)
  };

  const CommandTypeHandler = (event: any) => {      //to handle telecmd type i.e realtime or time tagged
    setTeleCmdsFormData((prevstate) => ({
      ...prevstate,
      ["teleCmdType"]: event.target.value
    }))
  };

  const TeleCmdValueHandler = (event: any) => {     //to handle telecmd value i.e input by user
    setTeleCmdValueError(""); 
    const numValue = parseFloat(event.target.value);
    console.log(numValue)
    if (teleCmdsFormData.teleCmd.cmd !="System Mode" && isNaN(numValue)) {
      setTeleCmdValueError("Value must be a number.");
      return;
    }

    if (teleCmdsFormData.teleCmd.cmd === "PAT Mode" && (numValue < 0 || numValue > 3)) {
      setTeleCmdValueError("Value must be between 0 and 3.");
      return;
    }

    if (teleCmdsFormData.teleCmd.cmd === "EDFA Power" && (numValue < 20 || numValue > 32)) {
      setTeleCmdValueError("Value must be between 20 and 32 dBm.");
      return;
    }

    if (["Elevation Angle", "Azimuth Angle"].includes(teleCmdsFormData.teleCmd.cmd) && (numValue < -110 || numValue > 110)) {
      setTeleCmdValueError(`Value must be between -110 and 110 degrees.`);
      return;
    }
    setTeleCmdValueError(""); 
    setTeleCmdsFormData((prevstate) => ({
      ...prevstate,
      ["teleCmdValue"]: event.target.value
    }))
  };

  const toggleGraph = (label: string) => {      // to toggle graph visibility
    setVisibleGraphs((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const removeGraph = (label: string, option: string) => {    //to toggle graph visibilty through graph option
    if (option === "Remove") {
      setVisibleGraphs((prev) => ({ ...prev, [label]: false }));
      setgraphOptionsOpendLables((prev) => ({
        ...prev,
        [label]: !prev[label],
      }));
    }
  };

  const graphOptionsButtonHandler = (label: string) => {    //to handle graph options visibility
    setgraphOptionsOpendLables((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  function getTimeDifferenceInSeconds(startTime: Date, endTime: any) {
    const start = new Date(startTime.getTime() - (5.5 * 60 * 60 * 1000))      // Converting start time string to a Date object (in UTC)
    const end = new Date(endTime); // Assuming endTime is already in UTC format

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date format. Use 'DD-MM-YYYY HH:mm:ss' for startTime and a valid UTC format for endTime.");
    }

    return Math.abs((end.getTime() - start.getTime()) / 1000);    // Calculating the difference in seconds
  }

  const systemModeIcon = (mode: string) => {
    if (mode == "Idle Mode") {
      return <i className="bi bi-pause-circle"></i>
    } else if (mode == "Maintenance Mode") {
      return <i className="bi bi-tools"></i>
    } else if (mode == "Stand-By Mode") {
      return <i className="bi bi-hourglass-split"></i>
    } else if (mode == "Downlink Mode") {
      return <i className="bi bi-cloud-arrow-down"></i>
    }
  }
  const renderTeleCmdsExtraFields = () => {
    let command = teleCmdsFormData.teleCmd.cmd;
    if (!command) return null;

    switch (command) {
      case "System Mode":
        return (
          <select onChange={TeleCmdValueHandler}>
            {systemModes.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        )

      case "PAT Mode":
        return (
          <>
            <input onChange={TeleCmdValueHandler}   className={teleCmdValueError ? "input-error" : ""}  type="text" />
          </>

        )

      case "EDFA Power":
        return (
          <>
            <input type="text" className={teleCmdValueError ? "input-error" : ""} onChange={TeleCmdValueHandler} /><b>dBm</b>
          </>

        )

      case "Elevation Angle":
      case "Azimuth Angle":
        return (
          <>
            <input type="text" className={teleCmdValueError ? "input-error" : ""} onChange={TeleCmdValueHandler} /><b>degrees</b>
          </>

        )

      // case "Shutdown System" :
      // case "EDFA Shutdown":
      //   return (
      //     <>
      //       <input type="text" />
      //     </>
      //   )
    }
  }
  // console.log("data", teleCmdsFormData)
  return (
    <>
      {/* {startSystem ? <button onClick={() => { setStartSystem(!startSystem) }}>stop</button> : <button onClick={() => { setStartSystem(!startSystem); setUtcCounter(0); setSystemCounter(0); setSystemStartedTime(new Date()) }}>start</button>} */}
      <div className="dashboard-main-container">
        {/* labels container */}
        <div className="lables-container">
          <div className="labels-data-container">
            {Object.entries(telemetryData).map(([label, data], index) => (
              <div className="labels-data">
                <p className="label-text">{label}</p>
                <div>
                  <p className="label-text">{data[data.length - 1]?.value}</p>
                </div>

                {/* condtionally rendering icons to handle graphs visibility */}
                {visibleGraphs[label] ?
                  <i onClick={() => toggleGraph(label)} className="bi bi-eye" style={{ cursor: "pointer", fontSize: "18px", color: "black", }}></i>
                  :
                  <i onClick={() => toggleGraph(label)} className="bi bi-eye-slash-fill" style={{ cursor: "pointer", fontSize: "18px", color: "black", }}></i>
                }
              </div>
            ))}
          </div>

          <form>
            {/* comands data container */}
            <div className="commands-data-container">
              <p>TELE COMMAND TYPE</p>
              <select onChange={CommandTypeHandler}>
                {teleCommandType.map((value, index) => (
                  <option id={value} key={index}>
                    {value}
                  </option>
                ))}
              </select>

              {/*condtionally rendering calender componenet based on command type */}
              {teleCmdsFormData.teleCmdType == "Time Tagged" && <input type="datetime-local" value={selectedDateTime?.toString()} onChange={handleDateChange} step="1"></input>}
              <p>TELE COMMAND</p>

              <select onChange={CommandHandler}>
                {/* <option selected> TeleCmd</option> */}
                {teleCommands.map((data, index) => (
                  <option id={data?.cmd} key={index} value={JSON.stringify(data)}> {data?.cmd} </option>
                ))}
              </select>
              {renderTeleCmdsExtraFields()}{teleCmdValueError && <p className="error">{teleCmdValueError}</p>}
              {/* <input type="text" placeholder="Value" onChange={TeleCmdValueHandler} value={teleCmdsFormData.teleCmdValue} ></input> */}
              <button id="commands-apply-button" onClick={CommandsDataHandler}>{" "}Apply Now</button>
            </div>
          </form>
        </div>

        {/* graphs container*/}
        <div className="graphs-container">
          <div className="graphs-data-container">
            {/* Condtionly rendering the graphs based on visibility */}
            {Object.entries(telemetryData).map(([label, data], index) =>
              visibleGraphs[label] ? (
                <div className="graph">
                  <div className="graph-header">
                    <p>{label}</p>
                    <button onClick={() => graphOptionsButtonHandler(label)} className="view-more-button" >
                      <i className="bi bi-three-dots-vertical" style={{ fontSize: "18px" }} ></i>
                    </button>

                    {/* conditionally rendering graph options */}
                    {graphOptionsOpendLables[label] && (
                      <div className="graph-options-menu">
                        <ul>
                          {graphOptions.map((item, index) => (
                            <li>
                              <button onClick={() => removeGraph(label, item)} className="graph-options-menu-item" > {item} </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <LineChartComponent data={data} />
                </div>
              ) : null
            )}
          </div>

          {/* commands output container */}
          <div className="commands-output-container">
            <span>System Log</span>
            <ul>
              <li>
                <button className="system-log-buttons">Export Log</button>
              </li>
              <li>
                <button className="system-log-buttons">Clear Log</button>
              </li>
            </ul>

            <div className="system-logs-container">
              {/* {systemLogs.map((data) => (
                <p>
                  {data.timestamp} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                  {data.message}
                </p>
              ))} */}
              {tmtData && tmtData.filter((data: any) => (data.telecmd_type == "Real Time" || data.systemCounter <= systemCounter)).map((data: any) => (
                <p>{data.telecmd_type_value} &nbsp; : {data.teleCmdPacket}&nbsp;</p>
              ))}
            </div>
          </div>
        </div>

        <div className="system-status-and-time-tag-main-contianer">
          <div className="system-status-main-container">
            <div className="system-status-container">
              {startSystem ? <span style={{ display: "inline-flex", marginTop: "7px", marginBottom: "0", alignItems: "center", gap: "10px", lineHeight: "1" }}>
                <i className="bi bi-toggle-on" style={{ fontSize: "38px", color: "green", paddingLeft: "3px" }}></i>
                ON
              </span> :
                <span style={{ display: "inline-flex", marginTop: "7px", marginBottom: "0", alignItems: "center", gap: "10px", lineHeight: "1" }}>
                  <i className="bi bi-toggle-off" style={{ fontSize: "38px", color: "gray", paddingLeft: "3px" }}></i>
                  OFF
                </span>}

              <p >
                <strong> {systemModeIcon(systemMode)} {systemMode}</strong>
              </p>

            </div>
            {/* System Mode Data */}
            <div className="weather-data-container">
              <p>⚡ Power :120w - 160w</p>
              <p>💧 Humidity : 45% - 55%</p>
              <p>🌡️ Temperature: 22°C - 27°C</p>
            </div>

          </div>
          <div className="time-tag-container">

            <p>Time Tag Command Queue</p>
            <div className="time-tag-commands-container">
              {/* Time tags with steppers */}
              {tmtData.filter((data: any) => data.systemCounter > systemCounter && data.telecmd_type == "Time Tagged").map((data: any, index) => (
                <div key={index} className="step-item">

                  <div className="step-circle" style={{
                    backgroundColor: data.status === 'Pending' ? '#E6E6E6' :
                      data.status === 'Failed' ? '#F8CECC' :
                        data.status === 'Success' ? '#D5E8D4' : '#666666'
                  }}></div>
                  <div className="step-line"
                    style={{
                      backgroundColor: data.status === 'Pending' ? '#666666' :
                        data.status === 'Failed' ? '#B85450' :
                          data.status === 'Success' ? '#82B366' : '#666666',
                      display: index === tmtData.filter((data: any) => data.systemCounter > systemCounter && data.telecmd_type == "Time Tagged").length - 1 ? "none" : "block",
                    }}
                  ></div>
                  <p className="step-text">
                    {data.telecmd_type_value} &nbsp; : &nbsp; {data.teleCmdPacket}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/*Time tag container */}
      </div>
    </>
  );
};

export default Dashboard;
