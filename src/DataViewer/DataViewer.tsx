import React from "react";
import "./DataViewer.css";
import { graphOptions, allLabels, systemLogs } from "../Utils/Constant";
import { useState, useRef } from "react";
import LineChartComponent from "../Components/Charts/LineChart";
import CalendarComponent from "../Components/Calender";
import * as XLSX from "xlsx";
import { Label } from "recharts";
import * as types from "../Utils/types";
import * as helperFunctions  from "../Utils/HelperFunctions";

//types 
type GraphOptions = {
    "Logarithmic Scale": boolean;
    "Axis Titles": boolean;
    "Gridlines": boolean;
};

type GraphState = {
    visibility: boolean;
    graphOptions: GraphOptions;
};

//Interfaces

interface LabelsData {
    [key: string]: { value: string }[];
}

const intialTelemeteryData: { [key: string]: { value: number }[] } = {};
//Intials states of useState
const initialVisibility: { [key: string]: boolean } = {};
const initialGraphOptionsState: { [key: string]: boolean } = {};
const initialDropdownOptions: string[] = [];

//Modifying intial states  
allLabels.forEach((item) => {    //graphs visiblilty
    initialVisibility[item.label] = true;
});

allLabels.forEach((item) => {    //graph options
    initialGraphOptionsState[item.label] = false;
});

allLabels.forEach((item) => (    //dropdown options
    initialDropdownOptions.push(`${item.label}${item.units && `(${item.units})`}`)
))

const DataViewer: React.FC = () => {

    //states 
    const [selectedOptions, setSelectedOptions] = useState<string[]>(initialDropdownOptions);   //to handle label selections
    const [isOpen, setIsOpen] = useState<boolean>(false);   //to handle label selections
    const [visibleGraphs, setVisibleGraphs] = useState<{ [label: string]: GraphState }>(() => {
        const initialState: { [label: string]: GraphState } = {};

        allLabels.forEach((item) => {
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
    });      //to handle the  graphs visibility 
    const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);    //to handle the calender selected date
    const [telemetryData, setTelemetryData] = useState(intialTelemeteryData);
    const [graphOptionsOpendLables, setgraphOptionsOpendLables] = useState(     //to handle the graph options visibility
        initialGraphOptionsState
    );
    const [file, setFile] = useState<File>();
    const fileInputRef = useRef<HTMLInputElement>(null);


    //handler functions
    const toggleGraph = (label: string) => {        // to Toggle graph visibility
        setVisibleGraphs((prev) => ({
            ...prev,
            [label]: {
                ...prev[label],
                visibility: !prev[label].visibility
            }
        }));
    };

    const removeGraph = (label: string, option: string) => {    //toggle  graph visibility through graph option
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
    };


    const graphOptionsButtonHandler = (label: string) => {      //for Graph options visibilty
        setgraphOptionsOpendLables((prev) => ({ ...prev, [label]: !prev[label] }));
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

        if (!graphOptions.includes(option as keyof GraphOptions)) return;

        setVisibleGraphs((prev) => ({
            ...prev,
            [label]: {
                ...prev[label],
                graphOptions: {
                    ...prev[label].graphOptions,
                    [option]: !prev[label].graphOptions[option as keyof GraphOptions],
                },
            },
        }));
    };

    const handleCheckboxChange = (item:types.LabelInfo) => {   //for labels dropdown selection
        let fullLabel = `${item.label}${item.units && `(${item.units})`}`
        setSelectedOptions((prev) =>
            prev.includes(fullLabel)
                ? prev.filter((item) => item !== fullLabel)
                : [fullLabel, ...prev]
        );
        setVisibleGraphs((prev) => ({
            ...prev,
            [item.label]: {
                ...prev[item.label],
                visibility: !prev[item.label].visibility
            }
        }));
    };


    const handleAllSelectbBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {     //for dorpdown all selector
        if (event.target.checked) {
            setSelectedOptions(initialDropdownOptions);     // Select all labels and show all graphs
            setVisibleGraphs(() => {
                const initialState: { [label: string]: GraphState } = {};

                allLabels.forEach((item) => {
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
            // Select all labels and show all graphs
        } else {
            setSelectedOptions([]);      // Clear selection and hide all graphs
            setVisibleGraphs(() => {
                const initialState: { [label: string]: GraphState } = {};

                allLabels.forEach((item) => {
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
            // Clear selection and hide all graphs
        }
    };

    const handleDateChange = (date: Date | null) => {       //to handle date change in child component
        setSelectedDateTime(date);
        // console.log("Selected Date & Time in Parent:", date);
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
    };

    const parseCustomTimestamp = (timestampStr: string): number | null => {
        // Expected format: "16/04/2025, 6:42:16 am"
        const [datePart, timePart, meridian] = timestampStr
            .replace(",", "")
            .split(" "); // ["16/04/2025", "6:42:16", "am"]
    
        const [day, month, year] = datePart.split("/").map(Number);
        let [hours, minutes, seconds] = timePart.split(":").map(Number);
    
        if (meridian.toLowerCase() === "pm" && hours !== 12) hours += 12;
        if (meridian.toLowerCase() === "am" && hours === 12) hours = 0;
    
        const formatted = new Date(year, month - 1, day, hours, minutes, seconds);
        return isNaN(formatted.getTime()) ? null : formatted.getTime();
    };
    
    const readExcelData = () => {
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
            console.log("josn data",jsonData)
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
                    if (key === "Timestamp") return;
    
                    if (!transformedData[key]) {
                        transformedData[key] = [];
                    }
    
                    let timeInfo = {};
    
                    if (index === 0 || index === jsonData.length - 1) {
                        timeInfo = { timestamp: timestampStr };
                    } else if (firstTimestamp !== null) {
                        const diffSeconds = (timestamp - firstTimestamp) / 1000;
                        timeInfo = { timestamp:timestampStr };
                    }
    
                    transformedData[key].push({
                        value: row[key],
                        ...timeInfo,
                    });
                });
            });
    
            // console.log(transformedData["TEMP"], "→ telemetry with fixed timestamps");
            console.log("TEY",transformedData)
            setTelemetryData(transformedData);
        };
    
        reader.readAsArrayBuffer(file);
    };
    
    
    
    

    const getLabelRecentData = (label: string): any => {
        const labelArray = telemetryData[label];
        if (!labelArray || labelArray.length === 0) {
            return null;
        }
        return labelArray[labelArray.length - 1].value;
    };

  
    return (
        <>
            {/* data viewer main container*/}
            <div className="dataviewer-main-container">
                <div className="calender-container">
                    <div className="dropdown-container">
                        <button
                            type="button"
                            className="dropdown-button"
                            onClick={() => setIsOpen(!isOpen)}
                        >
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
                                    {allLabels.map((item, index) => (
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
                        <p>Select Start Date : <CalendarComponent onDateChange={handleDateChange} /></p>
                        <p>Select End Date : <CalendarComponent onDateChange={handleDateChange} /></p>
                    </div>

                    <ul className="data-buttons-container" >
                        <li><input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileUpload} /> {!file && "Select Xlsx or Xls file "}</li>
                        <li>
                            {file && Object.keys(telemetryData).length == 0 && <button className="system-log-buttons" onClick={readExcelData}>Import Data</button>}

                        </li>
                        <li>
                            <button className="system-log-buttons">Export Data</button>
                        </li>

                    </ul>

                </div>
                <div className="graphs-main-container">
                    <div className="labels-container">
                        <div className="labels-data-container">
                            {selectedOptions.map((item) => (
                                <div className="labels-data">
                                    <p className="label-text">{item} </p>

                                    {/* condtionally rendering icons to handle graphs visibility */}
                                    {visibleGraphs[item].visibility ? (
                                        <i
                                            onClick={() => toggleGraph(item)}
                                            className="bi bi-eye"
                                            style={{
                                                cursor: "pointer",
                                                fontSize: "18px",
                                                color: "black",
                                            }}
                                        ></i>
                                    ) : (
                                        <i
                                            onClick={() => toggleGraph(item)}
                                            className="bi bi-eye-slash-fill"
                                            style={{
                                                cursor: "pointer",
                                                fontSize: "18px",
                                                color: "black",
                                            }}
                                        ></i>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="graphs-container">
                        <div className="graphs-data-container">
                            {/* Condtionly rendering the graphs based on visibility */}
                            {Object.entries(telemetryData).map(([label, data], index) =>
                                visibleGraphs[label]?.visibility ? (
                                    <div className="graph">
                                        <div className="graph-header">
                                            <p>{label}</p>
                                            <button
                                                onClick={() => graphOptionsButtonHandler(label)}
                                                className="view-more-button"
                                            >
                                                <i
                                                    className="bi bi-three-dots-vertical"
                                                    style={{ fontSize: "18px" }}
                                                ></i>
                                            </button>

                                            {/* conditionally rendering graph options */}
                                            {graphOptionsOpendLables[label] && (
                                                <div className="graph-options-menu">
                                                    <ul>
                                                        {graphOptions.map((item, index) => (
                                                            <li onClick={() => changeGraphOption(label, item)} className={`graph-options-menu-item ${visibleGraphs[label]?.graphOptions[item as keyof GraphOptions] ? "selected" : ""
                                                                }`}>
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                        <LineChartComponent data={data} graphOptions={visibleGraphs[label].graphOptions}  timeSlider ={true}/>
                                    </div>
                                ) : null
                            )}
                        </div>
                    </div>

                    {/*system log container */}
                    <div className="system-log-container">

                        <p>Session Log</p>
                        <div className="logs-container">
                            {systemLogs.map((data) => (
                                <p>
                                    {data.timestamp}  &nbsp; : &nbsp; {data.message}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default DataViewer;