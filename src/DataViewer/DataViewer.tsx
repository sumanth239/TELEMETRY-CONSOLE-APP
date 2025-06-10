//default imports
import React from "react";
import { useState, useRef, useEffect } from "react";

//style sheet imports
import "./DataViewer.css";

//components imports
import GraphComponent from "../Components/Graphs/Graph";

//library imports
import * as XLSX from "xlsx";
import * as helperFunctions from "../Utils/HelperFunctions";
import { LineChart, ResponsiveContainer, Brush } from "recharts";
import Swal from 'sweetalert2';

//utilities imports
import * as types from '../Utils/types';
import * as CONSTANTS from "../Utils/Constants";
import axios from "axios";
import NoDataFound from "../NoData/NoData";
import TimeSlider from "../Components/Graphs/TimeSlider";


//Intials states of useState
const initialVisibility: { [key: string]: boolean } = {};
const initialGraphOptionsState: { [key: string]: boolean } = {};
const initialDropdownOptions: string[] = [];

//Modifying intial states  
CONSTANTS.ALL_LABELS.filter(item => item.graphType).forEach((item) => {    //graphs visiblilty
    initialVisibility[item.label] = true;
});

CONSTANTS.ALL_LABELS.filter(label => label.graphType).forEach((item) => {    //graph options
    const grpahObject = CONSTANTS.COMBINED_LABEL_GROUPS.find((graph) => graph.labels.includes(item.label))
    if (grpahObject) {
        initialGraphOptionsState[grpahObject.title] = false;
    } else {
        initialGraphOptionsState[item.label] = false;
    }
});

CONSTANTS.ALL_LABELS.filter(label => label.graphType).forEach((item) => (    //dropdown options
    initialDropdownOptions.push(helperFunctions.getFullLabelWithUnits(item.label))
))


const DataViewer: React.FC = () => {
    //constants 
    const renderedLabels = new Set<string>();
    //states 
    const [selectedOptions, setSelectedOptions] = useState<string[]>(initialDropdownOptions);   //to handle label selections
    const [isOpen, setIsOpen] = useState<boolean>(false);   //to handle label selections
    const [isImported ,setIsImported] = useState(false);
    const [visibleGraphs, setVisibleGraphs] = useState<{ [label: string]: types.GraphState }>(() => {        //to handle the  graphs visibility
        const initialState: { [label: string]: types.GraphState } = {};

        CONSTANTS.ALL_LABELS.filter(label => label.graphType).forEach((item,index) => {
            let fullLabel = `${item.label}${item.units && `(${item.units})`}`
            initialState[fullLabel] = {
                visibility: true?index < CONSTANTS.MAX_VISIBLE_GRAPHS : false,
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
    //to handle the calendar selected start and end dates
    const [selectedDateRange, setSelectedDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
        startDate: null,
        endDate: null,
    });
    const [telemetryData, setTelemetryData] = useState<{ [key: string]: { value: number, timestamp: string }[] }>({});
    const [timeSliderData, setTimeSliderData] = useState<any>([])
    const [startIndex, setStartIndex] = useState(5);
    const [endIndex, setEndIndex] = useState(10);
    const [graphOptionsOpendLables, setgraphOptionsOpendLables] = useState(     //to handle the graph options visibility
        initialGraphOptionsState
    );
    const [sessionLogsData, setSessionLogsData] = useState<{ [key: string]: any }[]>([]);  //state to log the data 
    const [file, setFile] = useState<File>();
    const fileInputRef = useRef<HTMLInputElement>(null);

    //use effetcts
    useEffect(() => {
        if (timeSliderData.length === 0) return;

        const index = timeSliderData.length > CONSTANTS.MAX_TIME_SLIDER_INDEX ? CONSTANTS.MAX_TIME_SLIDER_INDEX : timeSliderData.length - 1;
        setEndIndex(index);
    }, [timeSliderData]);
    console.log("start index", startIndex)
    console.log("End inde", endIndex)
    console.log(telemetryData)


    //handler functions
    const toggleGraph = (label: string) => {        // to Toggle graph visibility
        const visibleGraphCount = Object.values(visibleGraphs).filter(graph => graph.visibility).length;
        if (!visibleGraphs[label].visibility && visibleGraphCount >= CONSTANTS.MAX_VISIBLE_GRAPHS) {
              Swal.fire({
                title: 'Limit Reached',
                text: 'You can only view up to 6 graphs at a time.',
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
                graphOptions: {
                    ...prev[label].graphOptions,
                    Remove: !prev[label].graphOptions.Remove,                       //toggle remove option
                },
                visibility: !prev[label].visibility         //toggle visibility
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
            const groupObj = CONSTANTS.COMBINED_LABEL_GROUPS_WITH_UNITS.find((graph) => graph.labels.includes(label));        //combined graph labels object
            if (groupObj) {
                groupObj.labels.map((graphLabel) => {       //disable all labels visibility of cobined graph  object
                    setVisibleGraphs((prev) => ({
                        ...prev,
                        [graphLabel]: {
                            ...prev[graphLabel],
                            visibility: !prev[graphLabel].visibility
                        }
                    }));
                })
                setgraphOptionsOpendLables((prev) => ({             //toggle combined graph options visibility
                    ...prev,
                    [groupObj.title]: !prev[groupObj.title],
                }));
            } else {
                setVisibleGraphs((prev) => ({       //disable only single label visibility
                    ...prev,
                    [label]: {
                        ...prev[label],
                        visibility: !prev[label].visibility
                    }
                }));
                setgraphOptionsOpendLables((prev) => ({      //toggle single label options visibility
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
        let fullLabel = helperFunctions.getFullLabelWithUnits(item.label); // Get full label with units if available
        setSelectedOptions((prev) =>
            prev.includes(fullLabel)
                ? prev.filter((item) => item !== fullLabel)
                : [...prev, fullLabel]
        );
        setVisibleGraphs((prev) => ({               //updating visibility of label graph
            ...prev,
            [fullLabel]: {
                ...prev[item.label],
                visibility: !prev[item.label].visibility
            }
        }));
    };


    const handleAllSelectbBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {     //for dropdown all selector
        if (event.target.checked) {
            setSelectedOptions(initialDropdownOptions);     // Select all labels and show all graphs
            setVisibleGraphs(() => {
                const initialState: { [label: string]: types.GraphState } = {};

                CONSTANTS.ALL_LABELS.forEach((item) => {
                    initialState[item.label] = {
                        visibility: true,
                        graphOptions: {
                            "Remove": false,
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
                            "Remove": false,
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
        if (!selectedDateRange.startDate || !selectedDateRange.endDate || selectedDateRange.startDate >= selectedDateRange.endDate) {
            if (selectedDateRange.startDate && selectedDateRange.endDate && selectedDateRange.startDate >= selectedDateRange.endDate) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Date Range',
                    text: 'Start date must be earlier than end date.',
                });
                return;
            }

            return;
        }
        const timeDifInMinutes = helperFunctions.getTimeDifferenceInMinutes(selectedDateRange.startDate, selectedDateRange.endDate)
        if (timeDifInMinutes > 20) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Date Range',
                text: 'You can select maximum 20 minutes range',
            });
            return;
        }

        try {
            // Show loading popup
            Swal.fire({
                title: 'Loading...',
                text: 'Fetching telemetry data, please wait.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const response = await axios.get(CONSTANTS.GET_TELEMETRY_API_URL, {
                params: {
                    start_date: selectedDateRange.startDate.toISOString(),
                    end_date: selectedDateRange.endDate.toISOString(),
                },
            });

            const { telemetry_data } = response.data;
            const updatedTelemetryData: { [key: string]: { value: number, timestamp: string }[] } = {};
            const timestampMap: { [key: string]: number } = {};

            Object.values(telemetry_data).forEach((dataArray: any) => {         // Process each telemetry data array for timestamps
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
                    const label = helperFunctions.getFullLabelWithUnits(CONSTANTS.ALL_LABELS[index].label);
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
                    const label = helperFunctions.getFullLabelWithUnits(CONSTANTS.ALL_LABELS[index + 14].label)
                    if (label) {
                        if (!updatedTelemetryData[label]) {
                            updatedTelemetryData[label] = [];
                        }
                        updatedTelemetryData[label].push({ value, timestamp });
                    }
                });
            });

            setTelemetryData(updatedTelemetryData);
            setFile(undefined); // Reset date range after fetching data

            // Close loading popup and show success message
            Swal.close();
            Swal.fire({
                icon: 'success',
                title: 'Data Imported',
                text: 'Telemetry data has been successfully fetched.',
            });

            setIsImported(true);
        } catch (error) {
            // Close loading popup and show error message
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch telemetry data. Please try again later.',
            });
            console.error("Error fetching telemetry data:", error);
        }
    };


    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTelemetryData({});
        setEndIndex(10);
        setStartIndex(5);
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

    const filterDataByTimeRange = (data: types.DataPoint[]) => {                                     //to filter the data based on the timeslider
        if (startIndex < 0 || endIndex >= timeSliderData.length || startIndex > endIndex) {
            console.error("Invalid start or end index");
            return [];
        }

        const startTimestamp = timeSliderData[startIndex]?.timestamp;
        const endTimestamp = timeSliderData[endIndex]?.timestamp;

        if (!startTimestamp || !endTimestamp) {
            console.error("Invalid timestamps in timeSliderData");
            return [];
        }

        const filteredData = data.filter((item) => {
            const itemTimestamp = item.timestamp;
            return itemTimestamp >= startTimestamp && itemTimestamp <= endTimestamp;
        });
        const baseTime = helperFunctions.parseTimeToMillis(filteredData[0].timestamp)
        const upData = filteredData.map((point, index) => {
            const timestamp = new Date(point.timestamp);
            const miliTime = helperFunctions.parseTimeToMillis(point.timestamp)
            console.log(timestamp.getTime(), baseTime)
            const formattedTimestamp = index === 0
                ? timestamp.toLocaleTimeString('en-US', { hour12: false })
                : `+${((miliTime - baseTime) / 1000).toFixed(1)}s`;

            return {
                ...point,
                timestamp: formattedTimestamp,
            };
        });

        // return filteredData
        return upData
    };

    const readExcelData = () => {
        setSelectedDateRange({ startDate: null, endDate: null }); // Reset date range when a new file is uploaded
        if (!file) {
            Swal.fire({
                icon: 'error',
                title: 'No File Selected',
                text: 'Please select a file to import data.',
            });
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
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
                        if (!transformedData[key]) {
                            transformedData[key] = [];
                        }

                        let timeInfo = {};

                        if (index === 0 || index === jsonData.length - 1) {
                            timeInfo = { timestamp: timestampStr };
                        } else if (firstTimestamp !== null) {
                            // const diffSeconds = (timestamp - firstTimestamp) / 1000;
                            timeInfo = { timestamp: timestampStr };
                        }

                        transformedData[key].push({
                            value: parseFloat(row[key]),
                            ...timeInfo,
                        });
                    });
                });

                setTimeSliderData(Object.entries(transformedData)[0][1]); // Data for the time slider
                setTelemetryData(transformedData);


                // Store excel logs data into state
                const logsSheetName = workbook.SheetNames[1];
                const logsSheet = workbook.Sheets[logsSheetName];
                const logsJsonData: any = XLSX.utils.sheet_to_json(logsSheet);
                setSessionLogsData(logsJsonData);
                setIsImported(true);
                Swal.fire({
                    icon: 'success',
                    title: 'Data Imported',
                    text: 'Telemetry data has been successfully imported.',
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to read the file. Please ensure it is a valid Excel file.',
                });
                console.error("Error reading Excel file:", error);
            }
        };

        reader.onerror = () => {
            Swal.fire({
                icon: 'error',
                title: 'File Read Error',
                text: 'An error occurred while reading the file. Please try again.',
            });
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
                        <button type="button" className="dropdown-button" onClick={() => setIsOpen(!isOpen)}  >
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
                                                checked={selectedOptions.includes(helperFunctions.getFullLabelWithUnits(item.label))}
                                                onChange={() => handleCheckboxChange(item)}
                                            />

                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="time-range-container">
                        <span>Select Start Date : <input type="datetime-local"  name="startDate" onChange={handleDateChange} step="1"></input></span>
                        <span>Select End Date : <input type="datetime-local"  name="endDate" onChange={handleDateChange} step="1"></input></span>
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
                                        <i onClick={() => toggleGraph(item)} className="bi bi-eye" style={{ cursor: "pointer", color: "black" }} ></i>
                                    ) :
                                        (
                                            <i onClick={() => toggleGraph(item)} className="bi bi-eye-slash-fill" style={{ cursor: "pointer", color: "black", }}></i>
                                        )}

                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="graphs-container">
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{ width: '60%' }}>
                                {/* <TimeSlider 
                                        timeSliderData={timeSliderData}
                                        onBrushChange={(start, end) => {
                                            setStartIndex(start);
                                            setEndIndex(end);
                                          // handle range update logic
                                        }}
                                        startIndex={startIndex}
                                        endIndex={endIndex}
                                /> */}
                                <ResponsiveContainer width="100%" height={50} >
                                    <LineChart data={timeSliderData} >
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


                        {isImported && helperFunctions.isArrayEmpty(Object.entries(telemetryData)) ? (
                            <NoDataFound message={CONSTANTS.NO_DATA_FOUND} />
                        ) : (
                            <div className="graphs-data-container">
                                {/* Condtionly rendering the graphs based on visibility */}

                                {Object.entries(telemetryData).map(([label, data]) => {
                                    if (helperFunctions.isArrayEmpty(data)) {
                                        return null;
                                    }
                                    if (renderedLabels.has(label)) return null;
                                    const groupObj = CONSTANTS.COMBINED_LABEL_GROUPS_WITH_UNITS.find(groupObj => groupObj.labels.includes(label));        //checking label is combined graph or not

                                    if (groupObj && groupObj.labels.some(lbl => visibleGraphs[lbl]?.visibility)) {
                                        groupObj.labels.forEach(lbl => renderedLabels.add(lbl));
                                        const mergedData = helperFunctions.mergeTelemetryByTimestamp(groupObj.labels, telemetryData);       //merging mutiple label data pooints 
                                        const graphLineToggles: Boolean[] = []      //array which contains labels visiblity of combined graphs

                                        groupObj.labels.map((obj) => (
                                            graphLineToggles.push(visibleGraphs[obj].visibility)
                                        ))

                                        return (
                                            <div className="graph">
                                                <div className="graph-header">
                                                    <p>{groupObj.title}</p>
                                                    <button onClick={() => graphOptionsButtonHandler(groupObj.title)} className="view-more-button" >
                                                        <i className="bi bi-three-dots-vertical" style={{ fontSize: "18px" }}></i>
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
                                                <GraphComponent graphLineToggles={graphLineToggles} data={filterDataByTimeRange(mergedData)} graphOptions={visibleGraphs[label].graphOptions} timeSlider={true} graphType={helperFunctions.getLabelGraphType(label)} />
                                            </div>
                                        )
                                    }

                                    renderedLabels.add(label);
                                    return visibleGraphs[label]?.visibility ? (
                                        <div className="graph">
                                            <div className="graph-header">
                                                <p>{label}</p>
                                                <button onClick={() => graphOptionsButtonHandler(label)} className="view-more-button" >
                                                    <i className="bi bi-three-dots-vertical" style={{ fontSize: "18px" }} />
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
                                            <GraphComponent graphLineToggles={[visibleGraphs[label]?.visibility]} data={filterDataByTimeRange(data)} graphOptions={visibleGraphs[label].graphOptions} timeSlider={true} graphType={helperFunctions.getLabelGraphType(label)} />
                                        </div>
                                    ) : null

                                })}
                            </div>)
                        }

                    </div>

                    {/*system log container */}
                    <div className="system-log-container">

                        <p>Session Log</p>
                        <div className="logs-container">
                            {isImported && helperFunctions.isArrayEmpty(sessionLogsData) ? <NoDataFound message={CONSTANTS.NO_SESSION_LOGS_FOUND} /> : (
                                sessionLogsData.map((log, index) => (
                                    <div key={index} className="log-entry">
                                        <p className="timestamp">{log.TimeStamp} UTC :</p>
                                        <p>{log.Action}</p>
                                    </div>
                                ))
                            )
                            }

                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default DataViewer;