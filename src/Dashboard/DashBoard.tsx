//default imports
import React, { useState, useEffect } from "react";

//style sheet imports
import "./DashBoard.css"; // Import the CSS file

//components imports
import GraphComponent from "../Components/Graphs/Graph";
import { confirmAction } from "../Components/PopUps/ConfirmAction";
import { inputModalAction } from "../Components/PopUps/InputAction";
import AlertPopup from "../Components/AlertPopUp/AlertPopUp";
import { useSettings } from "../SettingsSceen/SettingScreen";

//library imports
import * as types from '../Utils/types';
import axios from "axios";
import Swal from 'sweetalert2';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useDashboardStore } from "../Store/useDashboardStore";

//utilities imports
import * as helperFunctions from "../Utils/HelperFunctions";
import temperatureIcon from "../assets/temperature_icon.png";
import powerIcon from "../assets/bolt_icon.png";
import * as CONSTANTS from "../Utils/Constants";


// Initialization and State Management
const initialVisibility: { [key: string]: boolean } = {};
const initialGraphOptionsState: { [key: string]: boolean } = {};
const intialTelemeteryData: { [key: string]: { value: number, timestamp: string }[] } = {};


//Modifying intial state of graphs as visible
CONSTANTS.ALL_LABELS.forEach((item) => {
  if (item.graphType) {
    initialVisibility[item.label] = true;

  } else {
    initialVisibility[item.label] = false;
  }
  intialTelemeteryData[item.label] = [];

});

//Modifying intial state of graphs options of label as false
CONSTANTS.ALL_LABELS.filter(item => item.graphType).forEach((item) => {
  const grpahObject = CONSTANTS.COMBINED_LABEL_GROUPS.find((graph) => graph.labels.includes(item.label))
  if (grpahObject) {
    initialGraphOptionsState[grpahObject.title] = false;
  } else {
    initialGraphOptionsState[item.label] = false;
  }

});




const Dashboard: React.FC = () => {

  //default intilizalize values
  const renderedLabels = new Set<string>();
  const startSystem = helperFunctions.getSessionStorageKey("powerOn");    //to know system is live or not
  const alertsCount = helperFunctions.getActiveAlertsCount()
  //states
  const [zoomLevels, setZoomLevels] = useState<Record<string, number>>({});
  const [telemetryData, setTelemetryData] = useState(intialTelemeteryData);   //to handle real time telemetry data 
  const [tmtData, setTmtData] = useState([]);   //to handle telecmd data with counter and telecmd values
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);     //to handle the calender selected date 
  const [systemStatusLabels, setSystemStatusLabels] = useState({
    "SystemMode": CONSTANTS.DEFAULT_INITIAL_SYSTEM_MODE,
    "Temperature": CONSTANTS.DEFAULT_INITIAL_TEMP,
    "TotalPowerConsumption": CONSTANTS.DEFAULT_INITIAL_POWER
  })
  const [teleCmdValueError, setTeleCmdValueError] = useState<string[]>([]); //to handle telecmd input validation errors
  const [graphOptionsOpendLables, setgraphOptionsOpendLables] = useState(initialGraphOptionsState);   //state to handle the graph options visibility
  const { isLogging, setIsLogging } = useDashboardStore();  //state to handle telemetry data logging
  const [sessionLogsData, setSessionLogsData] = useState<{ [key: string]: any }[]>(() => {       //state to log the data 
    const sessionStr = localStorage.getItem("sessionStorage");
    if (!sessionStr) return [];

    try {
      const sessionData = JSON.parse(sessionStr);
      if (Array.isArray(sessionData.Logs)) {
        return sessionData.Logs.reverse();;
      }
    } catch (err) {
      console.error("FAILED to parse session logs:", err);
    }

    return [];
  });
  const { frequency } = useSettings();
  const [processedTelemetryData, setProcessedTelemetryData] = useState<types.TelemetryData>(intialTelemeteryData);
  const [exportTelemetryData, setExportTelemetryData] = useState<{ [key: string]: any }[]>([]);  //state to log the data 
  const [showAlert, setShowAlert] = useState(false);
  const [teleCmdsFormData, setTeleCmdsFormData] = useState({ //state to handle all tele cmds states ,telecmd type i.e Real time or Time Tagged,telecmd,telecmd value i.e input by user
    "teleCmdType": "Real Time",
    "teleCmd": { "cmd": "", "cmdId": 0 },
    "teleCmdValue": [0],

  })
  const [visibleGraphs, setVisibleGraphs] = useState<{ [label: string]: types.GraphState }>(() => {
    const initialState: { [label: string]: types.GraphState } = {};

    CONSTANTS.ALL_LABELS.filter(item => item.graphType).forEach((item) => {
      initialState[item.label] = {
        visibility: false,
        graphOptions: {
          "Remove": false,
          "Logarithmic Scale": false,
          "Axis Titles": false,
          "Gridlines": true,
        } as const,
      };
    });

    return initialState;
  });
  const {labelOrder, setLabelOrder} = useDashboardStore();;    //state to keeps track of the current order in which labels are displayed.

  // use Effects
  useEffect(() => {
    setTeleCmdValueError([]); // Reset error
    let cmdInfo = CONSTANTS.TELE_COMMANDS.find((item) => item.cmd === teleCmdsFormData.teleCmd.cmd);
    setTeleCmdsFormData((prev) => ({
      ...prev,
      teleCmdValue: cmdInfo?.inputType === 1 ? [teleCmdsFormData.teleCmdValue[0]] : [], // Reset input value properly
    }));
  }, [teleCmdsFormData.teleCmd]);


  useEffect(() => {
    const interval = setInterval(() => {
      const loginedTime = helperFunctions.getSessionStorageKey("loginTime") || new Date().toISOString();

      axios
        .get(CONSTANTS.GET_TELECOMMANDS_API_URL, { params: { from_time: loginedTime } })
        .then(res => {
          setTmtData(res.data.telecommands || []);  //setting the telecmds data to state
        })
        .catch(err => {
          console.error('Error fetching telecommands:', err);
        });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {   // to update session logs
    const handleSessionLogsUpdated = () => {
      const sessionStr = localStorage.getItem("sessionStorage");
      if (!sessionStr) return;

      try {
        const sessionData = JSON.parse(sessionStr);
        if (Array.isArray(sessionData.Logs)) {
          setSessionLogsData(sessionData.Logs.reverse());
        }
      } catch (err) {
        console.error("FAILED to parse session logs:", err);
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
    if (!startSystem) return;
    const processed: types.TelemetryData = Object.fromEntries(
      Object.entries(telemetryData).map(([label, data]) => {
        const index = CONSTANTS.ALL_LABELS.findIndex((item) => item.label === label);
        const filtered = index >= 0 && index < CONSTANTS.SCITM_MAX_INDEX ? data.filter((_, i) => i % frequency === 0) : data;
        return [label, filtered.slice(-CONSTANTS.MAX_POINTS)];
      })
    );

    const updatedData: types.TelemetryData = intialTelemeteryData;

    for (const label in processed) {
      const series = processed[label];
      if (helperFunctions.isArrayEmpty(series)) continue;

      const baseTime = helperFunctions.parseTimeToMillis(series[0].timestamp);

      updatedData[label] = series.map((point, index) => {
        const [datePart, timePart] = point.timestamp.split(', ')
        const miliTime = helperFunctions.parseTimeToMillis(point.timestamp)

        const formattedTimestamp = index === 0
          ? timePart
          : `+${((miliTime - baseTime) / 1000).toFixed(1)}s`;

        return {
          ...point,
          timestamp: formattedTimestamp,
        };
      });
    }

    if (startSystem) {
      setSystemStatusLabels((prevData) => ({                      //updating system status labels
        ...prevData,
        SystemMode: helperFunctions.getLatestLabelValue(updatedData, "System Mode"),
        Temperature: helperFunctions.getLatestLabelValue(updatedData, "ODT Temperature"),
        TotalPowerConsumption: helperFunctions.getLatestLabelValue(updatedData, "Total Power")

      }))
    }

    setProcessedTelemetryData(updatedData);
  }, [telemetryData, frequency]);



  //websockets
  useEffect(() => {
    if (!startSystem) return; // Ensure WebSocket connection is only active when the system is true

    const ws = new WebSocket(CONSTANTS.TELEMETRY_WEBSOCKET_URL)

    ws.onmessage = (event) => {

      try {

        const response = JSON.parse(event.data);
        //extracting response object
        const telemetryType = response?.type
        const incomingData = response?.data

        const startIndex = telemetryType === "SCITM" ? 0 : CONSTANTS.SCITM_MAX_INDEX;
        const endIndex = telemetryType === "SCITM" ? CONSTANTS.SCITM_MAX_INDEX : CONSTANTS.ALL_LABELS.length;

        if (!startSystem) return; // Double-check to ensure no processing happens if the system is false

        // Logging telemetry data to export data through Excel
        if (isLogging) {

          const newData = {
            Timestamp: helperFunctions.getUTCTimestampWithMilliseconds(),
            ...CONSTANTS.ALL_LABELS.slice(startIndex, endIndex).reduce((acc, item, index) => {               //using startIndex and endIndex to update different packets
              acc[`${item.label}${item.units && `(${item.units})`}`] = incomingData[index] !== undefined ? incomingData[index] : null;
              return acc;
            }, {} as { [key: string]: any }),
          };

          setExportTelemetryData((prevState) => [...prevState, newData]);
        }

        if (helperFunctions.isArrayEmpty(incomingData)) {
          helperFunctions.updateAlerts(CONSTANTS.BIT_ERROR_ALERT, false);
          confirmAction({
            title: 'New Alert',
            text: CONSTANTS.BIT_ERROR_ALERT,
            confirmButtonText: 'Acknowledge',
            cancelButtonText: 'Do it Later',
            confirmButtonColor: '#20409A',
            cancelButtonColor: '#e53e3e',
            allowOutsideClick: false,
            onConfirm: () => {
              helperFunctions.updateAlertsAction(alertsCount)
            },
          });
        }

        setTelemetryData((prevData) => {
          const updatedData = { ...prevData };

          CONSTANTS.ALL_LABELS.slice(startIndex, endIndex).forEach((item, index) => {
            if (incomingData[index] !== undefined) {
              const newEntry = { value: incomingData[index], timestamp: helperFunctions.getUTCTimestampWithMilliseconds() };
              updatedData[item.label] = [...(prevData[item.label] || []), newEntry]; // Updating real-time telemetry data
            }
          });

          return updatedData;
        });

      } catch (error) {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Failed to connect websocket,${error}`,
        });
        console.error("Error fetching telemetry data:", error);
        console.error("WebSocket Data Error:", error);
      }
    };


    ws.onerror = (error) => console.error("WebSocket Error:", error);
    ws.onclose = () => console.log("WebSocket Disconnected");


    return () => {
      ws.close(); // Ensure WebSocket is closed when the component unmounts or dependencies change
    };


  }, [startSystem, isLogging]);




  //handler functions

  // Command Processing
  const formHandler = async (event: any) => {

    event.preventDefault()
    helperFunctions.updateSessionLogs(`executed ${teleCmdsFormData.teleCmdType} ${teleCmdsFormData.teleCmd.cmd} command`)
    const teleCommand = teleCmdsFormData.teleCmd
    const teleCommandValue = teleCmdsFormData.teleCmdValue
    const apid = teleCmdsFormData.teleCmdType === "Real Time" ? CONSTANTS.REALTIME_CMD_APID : CONSTANTS.TIMETAG_CMD_APID;


    if (teleCommand.cmdId === 0 || teleCommand.cmd === "") {
      Swal.fire("Please select any of the teleCommand");
      return;
    }

    if (teleCmdValueError.length !== 0 && teleCmdValueError.every(item => item !== "")) {
      Swal.fire("Please Enter valid data")
      return;
    }

    if (!CONSTANTS.NO_INPUT_COMMANDS.includes(teleCommand.cmdId) && teleCommandValue.length === 0) {
      Swal.fire("Please Enter valid data")
      return;
    }

    try {
      const teleCmdValues = teleCommandValue.map((val) => Number(val))
      const response = await axios.post(CONSTANTS.POST_TELECOMMABD_API_URL, {
        telecmd_id: Number(teleCommand.cmdId),
        telecmd: teleCommand.cmd,
        telecmd_value: teleCmdValues,
        apid: apid,
        timestamp: apid === 1 ? selectedDateTime : new Date().toISOString(),
      }, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      });

      if (teleCommand.cmdId === CONSTANTS.POWER_ON_CMD_ID) {
        helperFunctions.updatePowerOnStatus(true); // Start the system if not already started
      }

      if (teleCommand.cmdId === CONSTANTS.SHUTDOWN_CMD_ID) {
        helperFunctions.updatePowerOnStatus(false); // Start the system if not already started
      }

    } catch (error) {
      console.error("FAILED to send telecommand:", error);
    }



  };


  // Graph Management
  const toggleGraph = (label: string) => {
    const visibleGraphCount = Object.values(visibleGraphs).filter(graph => graph.visibility).length;

    if (!visibleGraphs[label].visibility && visibleGraphCount >= CONSTANTS.MAX_VISIBLE_GRAPHS) {
      Swal.fire({
        title: 'Limit Reached',
        text: `You can only view up to ${CONSTANTS.MAX_VISIBLE_GRAPHS} graphs at a time.`,
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#20409A',
      });
      return;
    }

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
        const current = prev[label];
        const delta = e.deltaY < 0 ? 1 : -1;
        const next = Math.max(1, current + delta);
        return { ...prev, [label]: next };
      });
    }
  };

  const changeGraphOption = (label: string, option: string) => {
    if (option === "Remove") {
      const groupObj = CONSTANTS.COMBINED_LABEL_GROUPS.find((graph) => graph.labels.includes(label));

      if (groupObj) {
        groupObj.labels.forEach((graphLabel) => {
          setVisibleGraphs((prev) => ({
            ...prev,
            [graphLabel]: {
              ...prev[graphLabel],
              visibility: !prev[graphLabel].visibility
            }
          }));
        });
        setgraphOptionsOpendLables((prev) => ({
          ...prev,
          [groupObj.title]: !prev[groupObj.title],
        }));

      } else {
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

    }


    if (!CONSTANTS.GRAPH_OPTIONS.includes(option as keyof types.GraphOptions)) return;

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


  // Event Handlers
  const handleDateChange = (event: any) => {
    const date = new Date(event.target.value);
    setSelectedDateTime(date);
  };

  const CommandHandler = (event: any) => {
    const selectedData = JSON.parse(event.target.value);
    setTeleCmdsFormData((prevState) => (
      {
        ...prevState,
        teleCmd: selectedData,
        teleCmdValue: selectedData.inputType !== 1 ? [] : [0]
      }
    ))


  };

  const CommandTypeHandler = (event: any) => {
    setTeleCmdsFormData((prevstate) => ({
      ...prevstate,
      teleCmdType: event.target.value
    }))
  };

  const TeleCmdValueHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    const value = event.target.value;
    const numValue = Number(value);

    setTeleCmdsFormData((prevState: any) => {
      const updatedValues = [...prevState.teleCmdValue];

      if (typeof index === "number") {
        updatedValues[index] = value;
      } else {
        return {
          ...prevState,
          teleCmdValue: [numValue],
        };
      }

      return {
        ...prevState,
        teleCmdValue: updatedValues,
      };
    });

    const cmdInfo = CONSTANTS.TELE_COMMANDS.find(
      (item) => item.cmd === teleCmdsFormData.teleCmd.cmd
    );

    if (!cmdInfo) return;

    if (cmdInfo.inputType === CONSTANTS.INPUT_TYPES.VALUE && typeof index === "number") {
      const inputConfigs = cmdInfo.inputValues as Array<{
        name: string;
        units: string;
        range?: [number, number];
      }>;

      const inputConfig = inputConfigs[index];

      var error = "";
      if (isNaN(numValue) && value !== "") {
        error = `Value must be a number.`;
      } else {
        if (!CONSTANTS.FLOAT_INPUT_COMMANDS.includes(teleCmdsFormData.teleCmd.cmdId)) {
          if (typeof numValue === 'number' && !Number.isInteger(numValue)) {
            error = `Float value is not allowed`
          }
        }
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

  const handleLogging = () => {             //alert pop up for logging
    confirmAction({
      title: 'Stop logging?',
      text: 'Logging will be stopped and data collection will end.',
      confirmButtonText: 'Stop',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#e53e3e',
      onConfirm: () => {
        helperFunctions.updateSessionLogs(`stopped logging telemetry data`);
        setIsLogging(false);
      },
    });
  };

  const handleExportData = () => {                                  //alert pop up for excel sheet name
    helperFunctions.updateSessionLogs(`started exporting telemetry data`);
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

  //function to render different input fields for different commands
  const renderTeleCmdsExtraFields = () => {
    let cmd = teleCmdsFormData.teleCmd.cmd;
    if (!cmd) return null;

    let cmdInfo = CONSTANTS.TELE_COMMANDS.find((item) => item.cmd === cmd);
    if (!cmdInfo) return null

    if (cmdInfo.inputType === CONSTANTS.INPUT_TYPES.DROPDOWN) {
      const inputOptions = cmdInfo.inputValues as { label: string; value: number }[];            // Narrowing the type for TypeScript

      return (
        <>
          <select onChange={(e) => TeleCmdValueHandler(e)}>
            {inputOptions.map(({ label, value }, index) => (
              <option key={index} value={value}>  {label} </option>
            ))}
          </select>
        </>
      );
    } else if (cmdInfo.inputType === CONSTANTS.INPUT_TYPES.VALUE) {
      const inputOptions = cmdInfo.inputValues as { name: string; units: string; range: [number, number] }[];

      return (
        <div className="dynamic-inputs-container" >
          {inputOptions.map((item, index) => (

            <div key={item.name}>
              <input value={teleCmdsFormData.teleCmdValue[index] ? teleCmdsFormData.teleCmdValue[index] : ""} onChange={(e) => TeleCmdValueHandler(e, index)} placeholder={item.name} className={teleCmdValueError[index] ? "input-error" : ""} type="text" />&nbsp;<b>  {item.units}</b>
              {teleCmdValueError[index] && <div className="error">{teleCmdValueError[index]}</div>}
            </div>

          ))}
        </div>
      );
    }

  }

  
  const onDragEnd = (result: DropResult) => {     //Triggered when the user finishes a drag.And update the label order based on drag result
    if (!result.destination) return;

    const reordered = Array.from(labelOrder);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);

    setLabelOrder(reordered);
  };

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
              <span className="icon">{helperFunctions.systemModeIcon(systemStatusLabels.SystemMode)}</span>
              <span className="text">{systemStatusLabels.SystemMode}</span>
            </div>

            <div className="status-item">
              <span className="icon"><img id="temperature-icon" src={temperatureIcon} alt="Temperature" /></span>
              <span className="text">{systemStatusLabels.Temperature} &nbsp;°C</span>
            </div>

            <div className="status-item">
              <span className="icon"><img src={powerIcon} alt="Power" id="power-icon" /></span>
              <span className="text">{systemStatusLabels.TotalPowerConsumption}&nbsp;&nbsp;W</span>
            </div>

            <div className="status-item">
              <span className="icon"><i className="bi bi-exclamation-triangle-fill" style={{ color: "#FF6666" }} ></i></span>
              <span
                className="text"
                style={{ color: helperFunctions.getActiveAlertsCount() > 0 ? "#B85450" : "rgba(142, 238, 171, 0.795)" }}
              >
                Alerts : {alertsCount} &nbsp; &nbsp;&nbsp;
                <i className="bi bi-box-arrow-up-right" onClick={() => setShowAlert(true)} ></i>
              </span>

            </div>
          </div>
          {showAlert && <AlertPopup onClose={() => setShowAlert(false)} />}

          <div className="commands-main-container">
            {/* comands data container */}
            <div className="commands-data-container">
              <div>
                <select onChange={CommandTypeHandler}>
                  <option value="" disabled selected hidden>TeleCmd Type</option>
                  {CONSTANTS.TELE_COMMAND_TYPES.map((value, index) => (
                    <option id={value} key={index}>   {value} </option>
                  ))}
                </select>

                {/*condtionally rendering calender componenet based on command type */}
                {teleCmdsFormData.teleCmdType === "Time Tagged" && <input type="datetime-local" onChange={handleDateChange} step="1"></input>}
              </div>


              <div>
                <select onChange={CommandHandler}>
                  <option value="" disabled selected hidden>TeleCmd</option>
                  {CONSTANTS.TELE_COMMANDS.map((data, index) => (
                    <option id={data?.cmd} key={index} value={JSON.stringify(data)}> {data?.cmd} </option>
                  ))}
                </select>
                {renderTeleCmdsExtraFields()}

              </div>
              <button id="commands-apply-button" onClick={formHandler}>Apply Now</button>
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
              <button className="start-logging-button" onClick={() => { setIsLogging(!isLogging); helperFunctions.updateSessionLogs(`started logging telemetry data`) }} disabled={!startSystem || isLogging} >Start Logging</button>
              <button className="stop-logging-button" onClick={handleLogging} disabled={!isLogging}>Stop Logging</button>
              {exportTelemetryData.length > 0 && !isLogging && <button className="export-button" onClick={handleExportData}>Export Data</button>}
            </div>
            <div className="labels-and-graphs-container">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="labels">
                  {(provided) => (
                    <div className="labels-data-container" ref={provided.innerRef} {...provided.droppableProps} >
                      {labelOrder.map((label, index) => {
                        const data = processedTelemetryData[label];
                        return (
                          <Draggable key={label} draggableId={label} index={index}>
                            {(provided) => (
                              <div className="labels-data" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                                <p className="label-key">{label}</p>
                                <div>
                                  <p className="label-value">
                                    {helperFunctions.resolveLabelValue(label, data[data.length - 1]?.value)}
                                  </p>
                                </div>
                                <p className="label-key">
                                  {helperFunctions.getLabelUnits(label) && `${helperFunctions.getLabelUnits(label)}`}
                                </p>

                                {helperFunctions.hasGraphType(label) && (
                                  visibleGraphs[label]?.visibility ? (
                                    <i onClick={() => toggleGraph(label)} className="bi bi-eye" style={{ cursor: "pointer", color: "black" }}></i>
                                  ) : (
                                    <i onClick={() => toggleGraph(label)} className="bi bi-eye-slash-fill" style={{ cursor: "pointer", color: "black" }}></i>
                                  )
                                )}
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {/* graphs container*/}
              <div className="graphs-data-container">
                {/* Condtionly rendering the graphs based on visibility */}
                {Object.entries(processedTelemetryData).map(([label, data]) => {
                  if (renderedLabels.has(label)) return null;

                  const groupObj = CONSTANTS.COMBINED_LABEL_GROUPS.find(groupObj => groupObj.labels.includes(label));    //checking label is combined graph or not


                  if (groupObj && groupObj.labels.some(lbl => visibleGraphs[lbl]?.visibility)) {
                    groupObj.labels.forEach(lbl => renderedLabels.add(lbl));
                    const mergedData = helperFunctions.mergeTelemetryByTimestamp(groupObj.labels, processedTelemetryData);    //merging mutiple label data pooints 
                    const graphLineToggles: Boolean[] = []     //array which contains labels visiblity of combined graphs

                    groupObj.labels.map((obj) => (
                      graphLineToggles.push(visibleGraphs[obj].visibility)
                    ))

                    return (

                      <div className="graph" onWheel={(e) => handleWheelZoom(e, label)} key={label} style={{ overflowY: 'hidden', opacity: data.length === 0 ? 0.3 : 1 }}>
                        <div className="graph-header">
                          <p>{groupObj.title}</p>
                          <button onClick={() => graphOptionsButtonHandler(groupObj.title)} className="view-more-button" >
                            <i className="bi bi-three-dots-vertical"  ></i>
                          </button>

                          {/* conditionally rendering graph options */}
                          {graphOptionsOpendLables[groupObj.title] && (   //for combined graphs we send parameter title 
                            <div className="graph-options-menu">
                              <ul>
                                {CONSTANTS.GRAPH_OPTIONS.map((item, index) => (
                                  <li key={item} onClick={() => changeGraphOption(label, item)} className={`graph-options-menu-item ${visibleGraphs[label]?.graphOptions[item as keyof types.GraphOptions] ? "selected" : ""
                                    }`}>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <GraphComponent
                          graphLineToggles={graphLineToggles}
                          data={mergedData}
                          graphOptions={visibleGraphs[label].graphOptions}
                          timeSlider={false}
                          graphType={helperFunctions.getLabelGraphType(label)}
                        />
                      </div>
                    );
                  }


                  // Fallback: Render individual graph
                  renderedLabels.add(label);
                  return visibleGraphs[label]?.visibility ? (
                    <div className="graph" onWheel={(e) => handleWheelZoom(e, label)} style={{ overflowY: 'hidden', opacity: data.length === 0 ? 0.3 : 1 }}>
                      <div className="graph-header">
                        <p>{helperFunctions.getFullLabelWithUnits(label)}</p>
                        <button onClick={() => graphOptionsButtonHandler(label)} className="view-more-button" >
                          <i className="bi bi-three-dots-vertical"  ></i>
                        </button>

                        {/* conditionally rendering graph options */}
                        {graphOptionsOpendLables[label] && (
                          <div className="graph-options-menu">
                            <ul>
                              {CONSTANTS.GRAPH_OPTIONS.map((item, index) => (
                                <li key={item} onClick={() => changeGraphOption(label, item)} className={`graph-options-menu-item ${visibleGraphs[label]?.graphOptions[item as keyof types.GraphOptions] ? "selected" : ""
                                  }`}>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <GraphComponent
                        graphLineToggles={[visibleGraphs[label].visibility]}
                        data={data.slice(-Math.min(10, Math.floor(CONSTANTS.MAX_POINTS / (zoomLevels[label] || CONSTANTS.DEFAULT_ZOOM))))}
                        graphOptions={visibleGraphs[label].graphOptions}
                        timeSlider={false}
                        graphType={helperFunctions.getLabelGraphType(label)}
                      />
                    </div>
                  ) : null;
                })}
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

                  <div className="step-circle"
                    style={{
                      backgroundColor: data.status === 'PENDING' ? '#E6E6E6' :
                        data.status === 'FAILED' ? '#F8CECC' :
                          data.status === 'SUCCESS' ? '#D5E8D4' : '#666666'
                    }}>
                  </div>
                  <div className="step-line"
                    style={{
                      backgroundColor: data.status === 'PENDING' ? '#666666' :
                        data.status === 'FAILED' ? '#B85450' :
                          data.status === 'SUCCESS' ? '#82B366' : '#666666',
                      display: index === Object.entries(tmtData).length - 1 ? "none" : "block",
                    }}>
                  </div>
                  <p className="step-text">
                    {data.apid === 0 ? (
                      <>
                        <i className="bi bi-alarm" style={{ color: data.status === 'PENDING' ? '#666666' : data.status === 'FAILED' ? '#B85450' : data.status === 'SUCCESS' ? '#82B366' : '#666666' }} />&nbsp;
                        {helperFunctions.formatDateToReadableString(data.timestamp)} : {data.telecmd}
                      </>
                    ) : (
                      <>
                        <i className="bi bi-calendar2-check-fill" style={{ color: data.status === 'PENDING' ? '#666666' : data.status === 'FAILED' ? '#B85450' : data.status === 'SUCCESS' ? '#82B366' : '#666666' }} />&nbsp;
                        {helperFunctions.formatDateToReadableString(data.timestamp)} : {data.telecmd}
                      </>
                    )}
                    {!helperFunctions.isArrayEmpty(data.telecmd_values) && data.telecmd_values.map((value: number, idx: number) => (
                      <span key={idx}>, {helperFunctions.resolveLabelValue(data.telecmd, value)} </span>
                    ))}
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
