//default imports
import React from "react";
import { useState, useRef ,useEffect} from "react";

//style sheet imports
import "./DataViewer.css";

//components imports
import GraphComponent from "../Components/Graphs/Graph";

//library imports
import * as XLSX from "xlsx";
import * as helperFunctions from "../Utils/HelperFunctions";
import { LineChart, ResponsiveContainer, Brush } from "recharts";

//utilities imports
import * as types from '../Utils/types';
import * as CONSTANTS from "../Utils/Constants";
import axios from "axios";


//Intials states of useState
const intialTelemeteryData: { [key: string]: { value: number, timestamp: string }[] } = {};
const initialVisibility: { [key: string]: boolean } = {};
const initialGraphOptionsState: { [key: string]: boolean } = {};
const initialDropdownOptions: string[] = [];

//Modifying intial states  
CONSTANTS.ALL_LABELS.forEach((item) => {    //graphs visiblilty
    initialVisibility[item.label] = true;
});

CONSTANTS.ALL_LABELS.forEach((item) => {    //graph options
    const grpahObject = CONSTANTS.COMBINED_LABEL_GROUPS.find((graph) => graph.labels.includes(item.label))
    if (grpahObject) {
        initialGraphOptionsState[grpahObject.title] = false;
    } else {
        initialGraphOptionsState[item.label] = false;
    }
});

CONSTANTS.ALL_LABELS.forEach((item) => (    //dropdown options
    initialDropdownOptions.push(`${item.label}${item.units && `(${item.units})`}`)
))

function mergeTelemetryByTimestamp(labels: string[], telemetryData: any) {          //to merge the data points of combined graphs ,to single object
    const mergedMap: { [timestamp: string]: any } = {};

    labels.forEach(label => {
        telemetryData[label]?.forEach((point: any) => {
            const { timestamp, value } = point;
            if (!mergedMap[timestamp]) {
                mergedMap[timestamp] = { timestamp };
            }
            mergedMap[timestamp][label] = value;
        });
    });

    // Convert map to sorted array
    const mergedArray = Object.values(mergedMap).sort((a: any, b: any) => a.timestamp - b.timestamp);
    return mergedArray;
}

const DataViewer: React.FC = () => {
    //constants 
    const renderedLabels = new Set<string>();
    //states 
    const [selectedOptions, setSelectedOptions] = useState<string[]>(initialDropdownOptions);   //to handle label selections
    const [isOpen, setIsOpen] = useState<boolean>(false);   //to handle label selections
    const [visibleGraphs, setVisibleGraphs] = useState<{ [label: string]: types.GraphState }>(() => {        //to handle the  graphs visibility
        const initialState: { [label: string]: types.GraphState } = {};

        CONSTANTS.ALL_LABELS.forEach((item) => {
            let fullLabel = `${item.label}${item.units && `(${item.units})`}`
            initialState[fullLabel] = {
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
    //to handle the calendar selected start and end dates
    const [selectedDateRange, setSelectedDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
        startDate: null,
        endDate: null,
    });
    const [telemetryData, setTelemetryData] = useState(intialTelemeteryData);
    const [timeSliderData, setTimeSliderData] = useState<any>([])
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(0);
    const [graphOptionsOpendLables, setgraphOptionsOpendLables] = useState(     //to handle the graph options visibility
        initialGraphOptionsState
    );
    const [sessionLogsData, setSessionLogsData] = useState<{ [key: string]: any }[]>([]);  //state to log the data 
    const [file, setFile] = useState<File>();
    const fileInputRef = useRef<HTMLInputElement>(null);

    //use effetcts
    useEffect(() => {
        if (timeSliderData.length === 0) return;
      
        const index = timeSliderData.length > 60 ? 60 : timeSliderData.length - 1;
        setEndIndex(index);
      }, [timeSliderData]);


    //handler functions
    const toggleGraph = (label: string) => {        // to Toggle graph visibility
        setVisibleGraphs((prev) => ({
            ...prev,
            [label]: {
                ...prev[label],
                graphOptions: {
                    ...prev[label].graphOptions,
                    ["Remove"]: !prev[label].graphOptions["Remove" as keyof types.GraphOptions],
                },
                visibility: !prev[label].visibility
            }
        }));
    };

    

    const handleBrushChange = (e: any) => {     //to hadle brush(time slider) range
        if (!e?.startIndex || !e?.endIndex) return;
        setStartIndex(e.startIndex);
        setEndIndex(e.endIndex);
    };

    const graphOptionsButtonHandler = (label: string) => {      //for Graph options visibilty
        setgraphOptionsOpendLables((prev) => ({ ...prev, [label]: prev[label] ? !prev[label] : true }));
    };

    const changeGraphOption = (label: string, option: string) => {      //to change the graph otption
        if (option === "Remove") {
            const groupObj = CONSTANTS.COMBINED_LABEL_GROUPS_WITH_UNITS.find((graph) => graph.labels.includes(label));        //cobined graph labels object
            if(groupObj){
                groupObj.labels.map((graphLabel) => {       //disable all labels visibility of cobined graph  object
                    setVisibleGraphs((prev) => ({
                        ...prev,
                        [graphLabel]: {
                            ...prev[graphLabel],
                            visibility: !prev[graphLabel].visibility
                        }
                    }));
                })
                setgraphOptionsOpendLables((prev) => ({
                    ...prev,
                    [groupObj.title]: !prev[groupObj.title],
                }));
            }else{
                setVisibleGraphs((prev) => ({       //disable only single label visibility
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

        setVisibleGraphs((prev) => ({       //upadting label graph options
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

    const handleCheckboxChange = (item: types.LabelInfo) => {   //for labels dropdown selection
        let fullLabel = `${item.label}${item.units && `(${item.units})`}`
        setSelectedOptions((prev) =>
            prev.includes(fullLabel)
                ? prev.filter((item) => item !== fullLabel)
                : [...prev, fullLabel]
        );
        setVisibleGraphs((prev) => ({
            ...prev,
            [fullLabel]: {
                ...prev[item.label],
                visibility: !prev[item.label].visibility
            }
        }));
    };


    const handleAllSelectbBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {     //for dorpdown all selector
        if (event.target.checked) {
            setSelectedOptions(initialDropdownOptions);     // Select all labels and show all graphs
            setVisibleGraphs(() => {
                const initialState: { [label: string]: types.GraphState } = {};

                CONSTANTS.ALL_LABELS.forEach((item) => {
                    initialState[item.label] = {
                        visibility: true,
                        graphOptions: {
                            "Logarithmic Scale": false,
                            "Axis Titles": false,
                            "Gridlines": false,
                        },
                    };
                });

                return initialState;
            });
            
        } else {
            setSelectedOptions([]);      // Clear selection and hide all graphs
            setVisibleGraphs(() => {
                const initialState: { [label: string]: types.GraphState } = {};

                CONSTANTS.ALL_LABELS.forEach((item) => {
                    initialState[item.label] = {
                        visibility: false,
                        graphOptions: {
                            "Logarithmic Scale": false,
                            "Axis Titles": false,
                            "Gridlines": false,
                        },
                    };
                });

                return initialState;
            });
            
        }
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => { // to handle date change
        const { value, name } = event.target;
        console.log(`Selected ${name}:`, value);
        setSelectedDateRange((prev) => {
            const updatedRange = {
                ...prev,
                [name]: value ? new Date(value) : null,
            };
            
            return updatedRange;
        });
        setFile(undefined); // Reset file when date range is changed
    };

    const fetchTelemetryData = async () => {
        if (!selectedDateRange.startDate || !selectedDateRange.endDate) {
            console.warn("Start date or end date is missing.");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8000/dataviewer/telemetry`, {
                params: {
                    start_date: selectedDateRange.startDate.toISOString(),
                    end_date: selectedDateRange.endDate.toISOString(),
                },
            });

            const { telemetry_data } = response.data;
            console.log("Fetched Telemetry Data:", telemetry_data);
            const updatedTelemetryData: { [key: string]: { value: number, timestamp: string }[] } = {};
            const timestampMap: { [key: string]: number } = {};

            Object.values(telemetry_data).forEach((dataArray: any) => {
                dataArray.forEach((entry: any) => {
                    if (!timestampMap[entry.time]) {
                        timestampMap[entry.time] = 1;
                    } else {
                        timestampMap[entry.time]++;
                    }
                });
            });

            const timeSliderDataArray = Object.entries(timestampMap).map(([timestamp, value]) => ({
                timestamp,
                value,
            }));

            setTimeSliderData(timeSliderDataArray);
            // Process SCITM data
            telemetry_data.SCITM.forEach((entry: any) => {
                const timestamp = entry.time;
                entry.telemetry_data.slice(0, 14).forEach((value: number, index: number) => {
                    const label = CONSTANTS.ALL_LABELS[index] ? `${CONSTANTS.ALL_LABELS[index].label}${CONSTANTS.ALL_LABELS[index].units ? `(${CONSTANTS.ALL_LABELS[index].units})` : ''}` : null;
                    if (label) {
                        if (!updatedTelemetryData[label]) {
                            updatedTelemetryData[label] = [];
                        }
                        updatedTelemetryData[label].push({ value, timestamp });
                    }
                });
            });

            // Process HKTM data
            telemetry_data.HKTM.forEach((entry: any) => {
                const timestamp = entry.time;
                entry.telemetry_data.forEach((value: number, index: number) => {
                    const label =  CONSTANTS.ALL_LABELS[index+14] ? `${CONSTANTS.ALL_LABELS[index+14].label}${CONSTANTS.ALL_LABELS[index+14].units ? `(${CONSTANTS.ALL_LABELS[index+14].units})` : ''}` : null;
                    if (label) {
                        if (!updatedTelemetryData[label]) {
                            updatedTelemetryData[label] = [];
                        }
                        updatedTelemetryData[label].push({ value, timestamp });
                    }
                });
            });

            setTelemetryData(updatedTelemetryData);
            setFile(undefined) // Reset date range after fetching data
            console.log("Updated Telemetry Data:", updatedTelemetryData);
        } catch (error) {
            console.error("Error fetching telemetry data:", error);
        }
    };
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTelemetryData({});
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;

        // Check file type
        if (!selectedFile.name.endsWith(".xlsx") && !selectedFile.name.endsWith(".xls")) {
            alert("Please upload a valid Excel file (.xlsx or .xls)");
            return;
        }

        setFile(selectedFile);
        setSelectedDateRange({ startDate: null, endDate: null }); // Reset date range when a new file is uploaded
    };

    const parseCustomTimestamp = (timestampStr: string): number | null => {
        // Expected format: "16/04/2025, 6:42:16 am"
        const [datePart, timePart, meridian] = timestampStr.replace(",", "").split(" "); // ["16/04/2025", "6:42:16", "am"]

        const [day, month, year] = datePart.split("/").map(Number);
        let [hours, minutes, seconds] = timePart.split(":").map(Number);

        if (meridian.toLowerCase() === "pm" && hours !== 12) hours += 12;
        if (meridian.toLowerCase() === "am" && hours === 12) hours = 0;

        const formatted = new Date(year, month - 1, day, hours, minutes, seconds);
        return isNaN(formatted.getTime()) ? null : formatted.getTime();
    };

    const readExcelData = () => {
        setSelectedDateRange({ startDate: null, endDate: null }); // Reset date range when a new file is uploaded
        if (!file) {
            console.warn("No file selected.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData: any = XLSX.utils.sheet_to_json(sheet);
            
            const transformedData: any = {};

            let firstTimestamp: number | null = null;

            jsonData.forEach((row: any, index: number) => {
                const timestampStr = row["Timestamp"];
                const timestamp = parseCustomTimestamp(timestampStr);

                if (timestamp === null) {
                    console.warn("Invalid timestamp:", timestampStr);
                    return;
                }

                if (index === 0) {
                    firstTimestamp = timestamp;
                }

                Object.keys(row).forEach((key) => {
                    // if (key === "Timestamp") return;

                    if (!transformedData[key]) {
                        transformedData[key] = [];
                    }

                    let timeInfo = {};

                    if (index === 0 || index === jsonData.length - 1) {
                        timeInfo = { timestamp: timestampStr };
                    } else if (firstTimestamp !== null) {
                        const diffSeconds = (timestamp - firstTimestamp) / 1000;
                        timeInfo = { timestamp: diffSeconds };
                    }

                    transformedData[key].push({
                        value: parseFloat(row[key]),
                        ...timeInfo,
                    });
                });
            });

            
            setTimeSliderData(Object.entries(transformedData)[0][1]);       //data for the time slider 
            setTelemetryData(transformedData);
            
            console.log("Transformed Telemetry Data:", transformedData);



            //to store excel logs data into state
            const logsSheetName = workbook.SheetNames[1]
            const logsSheet = workbook.Sheets[logsSheetName];
            const logsJsonData: any = XLSX.utils.sheet_to_json(logsSheet);
            setSessionLogsData(logsJsonData);

        };
        
        reader.readAsArrayBuffer(file);
        setFile(undefined); // Reset file after reading
    };

    return (
        <>
            {/* data viewer main container*/}
            <div className="dataviewer-main-container">
                <div className="calender-container">
                    <div className="dropdown-container">
                        <button type="button"   className="dropdown-button" onClick={() => setIsOpen(!isOpen)}  >
                            Select  labels &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <i className={`bi ${isOpen ? "bi-caret-up-fill" : "bi-caret-down-fill"} dropdown-icon`}></i>
                        </button>

                        {isOpen && (
                            <div className="dropdown-menu">
                                <ul>
                                    <li className="dropdown-item">
                                        <label>All</label>
                                        <input
                                            type="checkbox"
                                            checked={selectedOptions.length === initialDropdownOptions.length}
                                            onChange={handleAllSelectbBoxChange}
                                        />

                                    </li>
                                    {CONSTANTS.ALL_LABELS.map((item, index) => (
                                        <li key={item.label} className="dropdown-item">
                                            <label>{item.label}</label>
                                            <input
                                                type="checkbox"
                                                checked={selectedOptions.includes(`${item.label}${item.units && `(${item.units})`}`)}
                                                onChange={() => handleCheckboxChange(item)}
                                            />

                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="time-range-container">
                        <span>Select Start Date : <input type="datetime-local"  value={selectedDateRange.startDate ? selectedDateRange.startDate.toISOString().slice(0, -1) : ''} name="startDate" onChange={handleDateChange} step="1"></input></span>
                        <span>Select End Date : <input type="datetime-local"  value={selectedDateRange.endDate ? selectedDateRange.endDate.toISOString().slice(0, -1) : ''} name="endDate" onChange={handleDateChange} step="1"></input></span>
                    </div>

                    <ul className="data-buttons-container" >
                        <li><input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileUpload} /> {!file && "Select .xlsx or .xls file "}</li>
                        <li>
                            {file && !selectedDateRange.startDate && !selectedDateRange.endDate && <button className="system-log-buttons" onClick={readExcelData}>Import Data </button>}

                        </li>
                        <li>
                            {selectedDateRange.startDate && selectedDateRange.endDate && <button className="system-log-buttons" onClick={fetchTelemetryData}>Import Data</button>}
                        </li>

                    </ul>

                </div>
                <div className="graphs-main-container">
                    <div className="labels-container">
                        <div className="labels-data-container">
                            {selectedOptions.map((item) => (
                                <div className="labels-data" key={item}>
                                    <p className="label-text">{item} </p>

                                    {/* condtionally rendering icons to handle graphs visibility */}
                                    {visibleGraphs[item]?.visibility ? (
                                        <i  onClick={() => toggleGraph(item)}   className="bi bi-eye"   style={{cursor: "pointer",color: "black"}} ></i>
                                    ) : 
                                    (
                                        <i  onClick={() => toggleGraph(item)}   className="bi bi-eye-slash-fill"    style={{cursor: "pointer",color: "black",}}></i>
                                    )}

                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="graphs-container">
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{ width: '65%' }}>
                                <ResponsiveContainer width="100%" height={50} >
                                    <LineChart data={timeSliderData} >
                                        {/* <XAxis dataKey="timestamp" /> */}
                                        <Brush
                                            dataKey="timestamp"
                                            height={30}
                                            stroke="#8884d8"
                                            onChange={handleBrushChange}
                                            startIndex={startIndex}
                                            endIndex={endIndex}
                                            className="time-slider"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>



                        <div className="graphs-data-container">
                            {/* Condtionly rendering the graphs based on visibility */}
                            {Object.entries(telemetryData).map(([label, data]) => {
                                if (renderedLabels.has(label)) return null;
                                const groupObj = CONSTANTS.COMBINED_LABEL_GROUPS_WITH_UNITS.find(groupObj => groupObj.labels.includes(label));        //checking label is combined graph or not

                                if (groupObj && groupObj.labels.some(lbl => visibleGraphs[lbl]?.visibility)) {
                                    groupObj.labels.forEach(lbl => renderedLabels.add(lbl));
                                    const mergedData = mergeTelemetryByTimestamp(groupObj.labels, telemetryData);       //merging mutiple label data pooints 
                                    const graphLineToggles: Boolean[] = []      //array which contains labels visiblity of combined graphs

                                    groupObj.labels.map((obj) => (
                                        graphLineToggles.push(visibleGraphs[obj].visibility)
                                    ))

                                    return (
                                        <div className="graph">
                                            <div className="graph-header">
                                                <p>{groupObj.title}</p>
                                                <button onClick={() => graphOptionsButtonHandler(groupObj.title)}   className="view-more-button" >
                                                    <i  className="bi bi-three-dots-vertical"   style={{ fontSize: "18px" }}></i>
                                                </button>

                                                {/* conditionally rendering graph options */}
                                                {graphOptionsOpendLables[groupObj.title] && (       //for combined graphs we send parameter title 
                                                    <div className="graph-options-menu">
                                                        <ul>
                                                            {CONSTANTS.GRAPH_OPTIONS.map((item, index) => (
                                                                <li onClick={() => changeGraphOption(label, item)} className={`graph-options-menu-item ${visibleGraphs[label]?.graphOptions[item as keyof types.GraphOptions] ? "selected" : ""
                                                                    }`}>
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                            <GraphComponent graphLineToggles={graphLineToggles} data={mergedData.slice(startIndex, endIndex)} graphOptions={visibleGraphs[label].graphOptions} timeSlider={true} graphType={helperFunctions.getLabelGraphType(label)} />
                                        </div>
                                    )
                                }

                                renderedLabels.add(label);
                                return visibleGraphs[label]?.visibility ? (
                                    <div className="graph">
                                        <div className="graph-header">
                                            <p>{label}</p>
                                            <button onClick={() => graphOptionsButtonHandler(label)}    className="view-more-button" >
                                                <i  className="bi bi-three-dots-vertical"   style={{ fontSize: "18px" }} />
                                            </button>

                                            {/* conditionally rendering graph options */}
                                            {graphOptionsOpendLables[label] && (
                                                <div className="graph-options-menu">
                                                    <ul>
                                                        {CONSTANTS.GRAPH_OPTIONS.map((item, index) => (
                                                            <li onClick={() => changeGraphOption(label, item)} className={`graph-options-menu-item ${visibleGraphs[label]?.graphOptions[item as keyof types.GraphOptions] ? "selected" : ""}`}>
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                        <GraphComponent graphLineToggles={[visibleGraphs[label]?.visibility]} data={data.slice(startIndex, endIndex)} graphOptions={visibleGraphs[label].graphOptions} timeSlider={true} graphType={helperFunctions.getLabelGraphType(label)} />
                                    </div>
                                ) : null

                            })}
                        </div>
                    </div>

                    {/*system log container */}
                    <div className="system-log-container">

                        <p>Session Log</p>
                        <div className="logs-container">
                            {sessionLogsData.map((log, index) => (
                                <div key={index} className="log-entry">
                                    <p className="timestamp">{log.TimeStamp} UTC :</p>
                                    <p>{log.Action}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default DataViewer;