import React, { useState, useEffect } from "react";
import "./DashBoard.css"; // Import the CSS file
import { teleCommandType, systemModes, teleCommands, graphOptions, allLabels, } from "../Utils/Constant";
import LineChartComponent from "../Components/Charts/LineChart";
import useCurrentTime from "../Utils/useCurrentTime";
import axios from "axios";
import * as helperFunctions from "../Utils/HelperFunctions";
import temperatureIcon from "../assets/temperature_icon.png";
import powerIcon from "../assets/bolt_icon.png";
import AlertPopup from "../Components/AlertPopUp/AlertPopUp";
import * as types from '../Utils/types';
import { confirmAction } from "../Components/PopUps/ConfirmAction";
import { inputModalAction } from "../Components/PopUps/InputAction";



// =============================================
// Initialization and State Management
// =============================================
const initialVisibility: { [key: string]: boolean } = {};
const initialGraphOptionsState: { [key: string]: boolean } = {};
const intialTelemeteryData: { [key: string]: { value: number }[] } = {};


//Modifying intial state of graphs as visible
allLabels.forEach((item) => {
  initialVisibility[item.label] = true;
  intialTelemeteryData[item.label] = [];
});

//Modifying intial state of grpahs options of label as false
allLabels.forEach((item) => {
  initialGraphOptionsState[item.label] = false;
});

const MAX_POINTS = 10;

const Dashboard: React.FC = () => {

  //states
  const [zoomLevels, setZoomLevels] = useState<Record<string, number>>({});
  const DEFAULT_ZOOM = 1; // 1x zoom (default view), higher means zoom in (fewer points)

  const [telemetryData, setTelemetryData] = useState(intialTelemeteryData);   //to handle real time telemetry data 
  const [startSystem, setStartSystem] = useState(false);    //to know system is live or not
  const [systemCounter, setSystemCounter] = useState(0);    //for system counter
  const [utcCounter, setUtcCounter] = useState(0);    //for UTC counter
  const [tmtData, setTmtData] = useState([]);   //to handle telecmd data with counter and telecmd values
  const [systemStartedTime, setSystemStartedTime] = useState<any>("27-03-2025 12:30:45");    //to handle system live time
  const [teleCmdData, setTeleCmdData] = useState<string[]>([]);   //for telecmd packet data genrated from backend
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);     //to handle the calender selected date 
  const [systemMode, setSystemMode] = useState("0"); //to handle the system mode
  const [teleCmdValueError, setTeleCmdValueError] = useState<string[]>([]); //to handle telecmd input validation errors
  const { formattedDate, formattedTime, currentUtcTime } = useCurrentTime();   //Extracting current time and current date thorugh custom hook
  const [graphOptionsOpendLables, setgraphOptionsOpendLables] = useState(initialGraphOptionsState);   //state to handle the graph options visibility
  const [isLogging, setIsLogging] = useState(false);   //state to handle telemetry data logging
  const [sessionLogsData, setSessionLogsData] = useState<{ [key: string]: any }[]>([]);  //state to log the data 
  const [exportTelemetryData, setExportTelemetryData] = useState<{ [key: string]: any }[]>([]);  //state to log the data 
  const [showAlert, setShowAlert] = useState(false);
  const [teleCmdsFormData, setTeleCmdsFormData] = useState({ //state to handle all tele cmds states ,telecmd type i.e Real time or Time Tagged,telecmd,telecmd value i.e input by user
    "teleCmdType": "Real Time",
    "teleCmd": { "cmd": "", "cmdId": 0 },
    "teleCmdValue": [""],

  })
  const [visibleGraphs, setVisibleGraphs] = useState<{ [label: string]: types.GraphState }>(() => {
    const initialState: { [label: string]: types.GraphState } = {};

    allLabels.forEach((item) => {
      initialState[item.label] = {
        visibility: true,
        graphOptions: {
          "Logarithmic Scale": false,
          "Axis Titles": false,
          "Gridlines": true,
        } as const,
      };
    });

    return initialState;
  });


  // console.log("telemetry data",telemetryData)

  // =============================================
  // WebSocket and Data Handling
  // =============================================
  const fetchTmtCmds = async () => {
    try {
      const response: any = await axios.get("http://192.168.0.124:8000/dashboard/get_sheduled_commands", {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response) {
        setTmtData(response.data);
      }

      // console.log("Response from API:", response.data);
    } catch (error) {
      console.error("API call failed:", error);
    }
  }

  // use Effects
  useEffect(() => {
    fetchTmtCmds()
  }, [startSystem]); // Dependency array remains empty to avoid re-creating intervals

  useEffect(() => {
    const handleSessionLogsUpdated = () => {
      const sessionStr = sessionStorage.getItem("sessionStorage");
      if (!sessionStr) return;

      try {
        const sessionData = JSON.parse(sessionStr);
        if (Array.isArray(sessionData.Logs)) {
          setSessionLogsData(sessionData.Logs);
        }
      } catch (err) {
        console.error("Failed to parse session logs:", err);
      }
    };

    // 👂 Listen for custom event
    window.addEventListener("sessionLogsUpdated", handleSessionLogsUpdated);

    // Cleanup
    return () => {
      window.removeEventListener("sessionLogsUpdated", handleSessionLogsUpdated);
    };
  }, []);


  useEffect(() => {
    if (startSystem) {
      const ws = new WebSocket(`ws://192.168.0.124:8000/ws`);

      ws.onmessage = (event) => {   //on websocket connection

        //logging telemetry data to export data through excel 
        if (isLogging) {
          const data = JSON.parse(event.data);
          const newData = {
            Timestamp: new Date().toLocaleString("en-GB", { timeZone: "UTC", hour12: true }),
            ...allLabels.reduce((acc, item, index) => {
              acc[`${item.label}${item.units && `(${item.units})`}`] = data[index] || null;
              return acc;
            }, {} as { [key: string]: any })
          };



          setExportTelemetryData((prevState) => [...prevState, newData]);
          console.log("new data", newData)
        }


        try {
          const incomingData = JSON.parse(event.data); // Expected JSON: { "Al Angle": 45, "En Angle": 30, "label1": 12, ... }
          // console.log("incoming data",incomingData);
          setTelemetryData((prevData) => {
            const updatedData = { ...prevData };

            allLabels.forEach((item, index) => {
              if (incomingData[index] !== undefined) {
                const newEntry = { value: incomingData[index], timestamp: new Date().toLocaleTimeString("en-GB", { timeZone: "UTC", hour12: true }) };
                updatedData[item.label] = [...(prevData[item.label] || []), newEntry].slice(-MAX_POINTS);   //updating real time telemetry data i.e generated and received from backend
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


  }, [startSystem, isLogging]);

  useEffect(() => {
    setTeleCmdValueError([]); // Reset error

    setTeleCmdsFormData((prev) => ({
      ...prev,
      teleCmdValue: [], // Reset input value properly
    }));
  }, [teleCmdsFormData.teleCmd]);


  // =============================================
  // Command Processing
  // =============================================
  const CommandsDataHandler = async (event: any) => {
    event.preventDefault()
    helperFunctions.updateSessionLogs(`User executed ${teleCmdsFormData.teleCmdType} ${teleCmdsFormData.teleCmd.cmd} command`)

    let teleCommand = teleCmdsFormData.teleCmd
    let teleCommandValue = teleCmdsFormData.teleCmdValue

    if (teleCmdsFormData.teleCmdType == "Real Time") {
      if (teleCommand.cmd == "System Mode") {
        setSystemMode(teleCommandValue[0])

        if (teleCommandValue[0] == "2") {
          setStartSystem(!startSystem);
          helperFunctions.updateSessionLogs("System started  successfully ")
          setSystemStartedTime(new Date())
        }
      } else if (teleCommand.cmd == "Shutdown System") {
        setStartSystem(!startSystem);
        setUtcCounter(0);
        setSystemCounter(0);
        setSystemStartedTime(new Date())
      }
    }

    const formatDateTime = (date: Date) => {
      const day = date.toLocaleString("en-GB", { day: "2-digit" });
      const month = date.toLocaleString("en-GB", { month: "2-digit" });
      const year = date.toLocaleString("en-GB", { year: "numeric" });
      const time = date.toLocaleTimeString("en-GB", {
        hour12: true,
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      });

      return `${day}-${month}-${year} ${time}`;
    };

    const cmdData = {
      "telecmd_type": teleCmdsFormData.teleCmdType,
      "telecmd_type_value":
        teleCmdsFormData.teleCmdType == "Real Time"
          ? `${formattedDate} ${formattedTime}`
          : selectedDateTime
            ? formatDateTime(selectedDateTime)
            : "",
      "telecmd": teleCommand.cmd,
      "telecmd_value": `$${teleCmdsFormData.teleCmdType == "Real Time" ? `RLT,${formattedDate} ${formattedTime}` : `TMT,${selectedDateTime
        ? formatDateTime(selectedDateTime)
        : ""}`},${teleCommand.cmdId},${teleCommandValue.toString()}*\r\n`,
      "telecmd_id": teleCommand.cmdId,
      "systemCounter": teleCmdsFormData.teleCmdType == "Real Time" ? 0 : getTimeDifferenceInSeconds(systemStartedTime, selectedDateTime)
    };

    try {
      const response: any = await axios.post("http://192.168.0.124:8000/dashboard/get_telecmds", cmdData, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response) {
        helperFunctions.updateSessionLogs(`User executed ${teleCmdsFormData.teleCmdType} ${teleCmdsFormData.teleCmd.cmd} command is  executed successfully `)
        setTeleCmdData((prevData) => [...prevData, response.data.data]);
        fetchTmtCmds()
      }

      // console.log("Response from API:", response.data);
      // console.log("tele", teleCmdData)
    } catch (error) {
      helperFunctions.updateSessionLogs(`User executed ${teleCmdsFormData.teleCmdType} ${teleCmdsFormData.teleCmd.cmd} command is failed to execute`)
      console.error("API call failed:", error);
    }
  };

  // =============================================
  // Graph Management
  // =============================================
  const toggleGraph = (label: string) => {
    setVisibleGraphs((prev) => ({
      ...prev,
      [label]: {
        ...prev[label],
        visibility: !prev[label].visibility
      }
    }));
  };

  const handleWheelZoom = (e: React.WheelEvent<HTMLDivElement>, label: string) => {
    // These two lines are correct, but might not be sufficient in all browsers
    e.preventDefault(); 
    e.stopPropagation();
    
    // Add this to ensure the parent doesn't scroll
    if (e.currentTarget.contains(e.target as Node)) {
      setZoomLevels((prev) => {
        const current = prev[label] || DEFAULT_ZOOM;
        const delta = e.deltaY < 0 ? 1 : -1;
        const next = Math.max(1, current + delta);
        return { ...prev, [label]: next };
      });
    }
  };
  const changeGraphOption = (label: string, option: string) => {
    if (option === "Remove") {
      setVisibleGraphs((prev) => ({
        ...prev,
        [label]: {
          ...prev[label],
          visibility: !prev[label].visibility
        }
      }));
      setgraphOptionsOpendLables((prev) => ({
        ...prev,
        [label]: !prev[label],
      }));
    }

    type GraphOptionKey = "Logarithmic Scale" | "Axis Titles" | "Gridlines";

    if (!graphOptions.includes(option as keyof types.GraphOptions)) return;

    setVisibleGraphs((prev) => ({
      ...prev,
      [label]: {
        ...prev[label],
        graphOptions: {
          ...prev[label].graphOptions,
          [option]: !prev[label].graphOptions[option as keyof types.GraphOptions],
        },
      },
    }));
  };

  const graphOptionsButtonHandler = (label: string) => {
    setgraphOptionsOpendLables((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // =============================================
  // Utility Functions
  // =============================================
  function getTimeDifferenceInSeconds(startTime: Date, endTime: any) {
    const start = new Date(startTime.getTime() - (5.5 * 60 * 60 * 1000))
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid date format. Use 'DD-MM-YYYY HH:mm:ss' for startTime and a valid UTC format for endTime.");
    }

    return Math.abs((end.getTime() - start.getTime()) / 1000);
  }

  const systemModeIcon = (mode: string) => {
    if (mode == "Safe Mode") {
      return <i className="bi bi-pause-circle"></i>
    } else if (mode == "Maintenance Mode") {
      return <i className="bi bi-tools"></i>
    } else if (mode == "Stand-By Mode") {
      return <i className="bi bi-hourglass-split"></i>
    } else if (mode == "Downlink Mode") {
      return <i className="bi bi-cloud-arrow-down"></i>
    }
  }

  // =============================================
  // Event Handlers
  // =============================================
  const handleDateChange = (event: any) => {
    const date = new Date(event.target.value);
    setSelectedDateTime(date);
  };

  const CommandHandler = (event: any) => {
    const selectedData = JSON.parse(event.target.value);
    setTeleCmdsFormData((prevState) => (
      {
        ...prevState,
        ["teleCmd"]: selectedData,
        ["teleCmdValue"]: ["", "", ""]
      }
    ))
  };

  const CommandTypeHandler = (event: any) => {
    setTeleCmdsFormData((prevstate) => ({
      ...prevstate,
      ["teleCmdType"]: event.target.value
    }))
  };

  const TeleCmdValueHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    const value = event.target.value;
    const numValue = parseFloat(value);

    setTeleCmdsFormData((prevState) => {
      const updatedValues = [...prevState.teleCmdValue];

      if (typeof index === "number") {
        updatedValues[index] = value;
      } else {
        return {
          ...prevState,
          teleCmdValue: [value],
        };
      }

      return {
        ...prevState,
        teleCmdValue: updatedValues,
      };
    });

    const cmdInfo = teleCommands.find(
      (item) => item.cmd === teleCmdsFormData.teleCmd.cmd
    );

    if (!cmdInfo) return;

    if (cmdInfo.inputType === 2 && typeof index === "number") {
      const inputConfigs = cmdInfo.inputValues as Array<{
        name: string;
        units: string;
        range?: [number, number];
      }>;

      const inputConfig = inputConfigs[index];

      var error = "";
      if (isNaN(numValue) && value != "") {
        error = `Value must be a number.`;
        return;
      }

      const [min, max] = inputConfig.range || [];
      if (
        inputConfig.range &&
        (typeof min === "number" && typeof max === "number")
      ) {
        if (numValue < min || numValue > max) {
          error = `Value must be between ${min} and ${max}.`;
        }
      }
    }

    if (typeof index === "number") {
      setTeleCmdValueError((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[index] = error;
        return newErrors;
      });
    }
  };

  const handleLogging = () => {
    confirmAction({
      title: 'Stop logging?',
      text: 'Logging will be stopped and data collection will end.',
      confirmButtonText: 'Stop',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#e53e3e',
      onConfirm: () => {
        helperFunctions.updateSessionLogs(`User stopped logging telemetry data`);
        setIsLogging(false);
      },
    });
  };

  const handleExportData = () => {
    helperFunctions.updateSessionLogs(`User started exporting telemetry data`);
    inputModalAction({
      title: 'Export Telemetry Data',
      text: 'Enter a filename for the Excel export:',
      confirmButtonText: 'Export',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#2563eb',
      inputType: 'text',
      inputPlaceholder: 'e.g. TelemetryData',
      onConfirm: (fileName) => {
        helperFunctions.exportToExcel({ telemetryData: exportTelemetryData, logsData: sessionLogsData, fileName });
        setExportTelemetryData([]);
      },
    });

    setExportTelemetryData([]);
  };

  const renderTeleCmdsExtraFields = () => {         //function to render different input fields for different commands
    let cmd = teleCmdsFormData.teleCmd.cmd;
    if (!cmd) return null;

    let cmdInfo = teleCommands.find((item) => item.cmd === cmd);
    if (!cmdInfo) return null

    if (cmdInfo.inputType === 1) {
      // Narrowing the type for TypeScript
      const inputOptions = cmdInfo.inputValues as { label: string; value: number }[];

      return (
        <>
          <select onChange={(e) => TeleCmdValueHandler(e)}>
            {inputOptions.map(({ label, value }, index) => (
              <option key={index} value={value}>
                {label}
              </option>
            ))}
          </select>
        </>
      );
    } else if (cmdInfo.inputType === 2) {
      const inputOptions = cmdInfo.inputValues as { name: string; units: string; range: [number, number] }[];

      return (
        <div className="dynamic-inputs-container" >
          {inputOptions.map((item, index) => (

            <div>
              <input value={teleCmdsFormData.teleCmdValue[index]} onChange={(e) => TeleCmdValueHandler(e, index)} placeholder={item.name} className={teleCmdValueError[index] ? "input-error" : ""} type="text" />&nbsp;<b>  {item.units}</b>
              {teleCmdValueError[index] && <div className="error">{teleCmdValueError[index]}</div>}
            </div>

          ))}
        </div>
      );
    }

  }

  useEffect(() => {
    const graphElements = document.querySelectorAll('.graph');

    const wheelHandler = (e:any) => {
      e.preventDefault();
      const label = e.currentTarget.getAttribute('data-label');
      if (label) {
        const delta = e.deltaY < 0 ? 1 : -1;
        setZoomLevels((prev) => {
          const current = prev[label] || DEFAULT_ZOOM;
          const next = Math.max(1, current + delta);
          return { ...prev, [label]: next };
        });
      }
    };

    graphElements.forEach(el => {
      el.addEventListener('wheel', wheelHandler, { passive: false });
    });

    return () => {
      graphElements.forEach(el => {
        el.removeEventListener('wheel', wheelHandler);
      });
    };
  }, [visibleGraphs]); // Re-add listeners when visible graphs change

  const alertMessages = [
    'Network connection lost.',
    'Failed to load data.',
    'New update available.',
    'alert message with more than one line text',
  ];
  // console.log("data", teleCmdsFormData)


  return (
    <>
      <div className="dashboard">
        <div className="dashboard-container1">
          <div className="system-status-container">
            <div className="status-item">
              <span className="icon"><i className="bi bi-power" style={{ color: startSystem ? "#66FF66" : "grey" }} ></i></span>
              <span className="text">{startSystem ? "System ON" : "System OFF"}</span>
            </div>

            <div className="status-item">
              <span className="icon">{systemModeIcon(systemModes[Number(systemMode)])}</span>
              <span className="text">{systemModes[Number(systemMode)]}</span>
            </div>

            <div className="status-item">
              <span className="icon"><img id="temperature-icon" src={temperatureIcon} alt="Temperature" /></span>
              <span className="text">37 °C</span>
            </div>

            <div className="status-item">
              <span className="icon"><img src={powerIcon} alt="Power" id="power-icon" /></span>
              <span className="text">45W Consumption</span>
            </div>

            <div className="status-item">
              <span className="icon"><i className="bi bi-exclamation-triangle-fill" style={{ color: "#FF6666" }} ></i></span>
              <span className="text">Alerts &nbsp; &nbsp;&nbsp;<i className="bi bi-box-arrow-up-right" onClick={() => setShowAlert(true)} ></i></span>

            </div>
          </div>
          {showAlert && (
            <AlertPopup
              alerts={alertMessages}
              onClose={() => setShowAlert(false)}
            />
          )}

          <div className="commands-main-container">
            {/* comands data container */}
            <div className="commands-data-container">
              <div>
                <select onChange={CommandTypeHandler}>
                  <option value="" disabled selected hidden>TeleCmd Type</option>
                  {teleCommandType.map((value, index) => (
                    <option id={value} key={index}>
                      {value}
                    </option>
                  ))}
                </select>

                {/*condtionally rendering calender componenet based on command type */}
                {teleCmdsFormData.teleCmdType == "Time Tagged" && <input type="datetime-local" onChange={handleDateChange} step="1"></input>}
              </div>


              <div>
                <select onChange={CommandHandler}>
                  <option value="" disabled selected hidden>TeleCmd</option>
                  {teleCommands.map((data, index) => (
                    <option id={data?.cmd} key={index} value={JSON.stringify(data)}> {data?.cmd} </option>
                  ))}
                </select>
                {renderTeleCmdsExtraFields()}

              </div>
              <button id="commands-apply-button" disabled={teleCmdValueError.length == 0 || teleCmdValueError.every(item => item === "") ? false : true} onClick={CommandsDataHandler}>{" "}Apply Now</button>
            </div>

            {/* commands output container */}
            <div className="commands-output-container">
              <span>Session Log</span>
              <div className="system-logs-container">
                {sessionLogsData.map((log, index) => (
                  <div key={index} className="log-entry">
                    <p>{log.TimeStamp} &nbsp; : &nbsp; {log.Action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-container2">
          <div className="telemetry-main-container" >
            <div className="logs-button-container">
              <button className="start-logging-button" onClick={() => { setIsLogging(!isLogging); helperFunctions.updateSessionLogs(`User started logging telemetry data`) }} disabled={!startSystem || isLogging} >Start Logging</button>
              <button className="stop-logging-button" onClick={handleLogging} disabled={!isLogging}>Stop Logging</button>
              {exportTelemetryData.length > 0 && !isLogging && <button className="export-button" onClick={handleExportData}>Export Data</button>}
            </div>
            <div className="labels-and-graphs-container">
              <div className="labels-data-container">
                {Object.entries(telemetryData).map(([label, data], index) => (
                  <div className="labels-data">
                    <p className="label-key">{label}  {helperFunctions.getLabelUnits(label) && `(${helperFunctions.getLabelUnits(label)})`} </p>
                    <div>
                      <p className="label-value"> {helperFunctions.resolveLabelValue(label, data[data.length - 1]?.value)}</p>
                    </div>

                    {/* condtionally rendering icons to handle graphs visibility */}
                    {visibleGraphs[label].visibility ?
                      <i onClick={() => toggleGraph(label)} className="bi bi-eye" style={{ cursor: "pointer", color: "black", }}></i>
                      :
                      <i onClick={() => toggleGraph(label)} className="bi bi-eye-slash-fill" style={{ cursor: "pointer", color: "black", }}></i>
                    }
                  </div>
                ))}
              </div>
              {/* graphs container*/}
              <div className="graphs-data-container">
                {/* Condtionly rendering the graphs based on visibility */}
                {Object.entries(telemetryData).map(([label, data], index) =>
                  visibleGraphs[label].visibility ? (
                    <div className="graph" onWheel={(e) => handleWheelZoom(e, label)}
                    style={{ overflowY: 'hidden' }}>
                      <div className="graph-header">
                        <p>{label} {helperFunctions.getLabelUnits(label) && `(${helperFunctions.getLabelUnits(label)})`}</p>
                        <button onClick={() => graphOptionsButtonHandler(label)} className="view-more-button" >
                          <i className="bi bi-three-dots-vertical"  ></i>
                        </button>

                        {/* conditionally rendering graph options */}
                        {graphOptionsOpendLables[label] && (
                          <div className="graph-options-menu">
                            <ul>
                              {graphOptions.map((item, index) => (
                                <li onClick={() => changeGraphOption(label, item)} className={`graph-options-menu-item ${visibleGraphs[label]?.graphOptions[item as keyof types.GraphOptions] ? "selected" : ""
                                  }`}>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <LineChartComponent
                        data={data.slice(-Math.min(10, Math.floor(MAX_POINTS / (zoomLevels[label] || DEFAULT_ZOOM))))}
                        graphOptions={visibleGraphs[label].graphOptions}
                        timeSlider={false}
                      />
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </div>


          {/*Time tag container */}
          <div className="time-tag-container">

            <p>Command Queue</p>
            <div className="time-tag-commands-container">
              {/* Time tags with steppers */}
              {tmtData.map((data: any, index) => (
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
                      display: index === tmtData.length - 1 ? "none" : "block",
                    }}
                  ></div>
                  <p className="step-text">
                    {data.telecmd_type_value} : {data.telecmd_value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>

  );
};

export default Dashboard;
