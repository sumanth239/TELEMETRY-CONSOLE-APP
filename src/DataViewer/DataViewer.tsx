import React from "react";
import "./DataViewer.css";
import { labelsData, graphOptions } from "../Utils/Constant";
import { useState } from "react";
import LineChartComponent from "../Components/Charts/LineChart";
import CalendarComponent from "../Components/Calender";

//Interfaces

interface LabelsData {
    [key: string]: { value: string }[];
}

interface MultiSelectDropdownProps {
    labelsData: LabelsData;
}

//Intials states of useState
const initialVisibility: { [key: string]: boolean } = {};
const initialGraphOptionsState: { [key: string]: boolean } = {};
const initialDropdownOptions: string[] = [];

//Modifying intial states  
Object.keys(labelsData).forEach((label) => {    //graphs visiblilty
    initialVisibility[label] = true;
});

Object.keys(labelsData).forEach((label) => {    //graph options
    initialGraphOptionsState[label] = false;
});

Object.keys(labelsData).forEach((label) => (    //dropdown options
    initialDropdownOptions.push(label)
))

const DataViewer: React.FC = () => {

    //states 
    const [selectedOptions, setSelectedOptions] = useState<string[]>(initialDropdownOptions);   //to handle label selections
    const [isOpen, setIsOpen] = useState<boolean>(false);   //to handle label selections
    const [visibleGraphs, setVisibleGraphs] = useState(initialVisibility);      //to handle the  graphs visibility 
    const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);    //to handle the calender selected date
    const [graphOptionsOpendLables, setgraphOptionsOpendLables] = useState(     //to handle the graph options visibility
        initialGraphOptionsState
    );


    //handler functions
    const toggleGraph = (label: string) => {        // to Toggle graph visibility
        setVisibleGraphs((prev) => ({ ...prev, [label]: !prev[label] }));
    };

    const removeGraph = (label: string, option: string) => {    //toggle  graph visibility through graph option
        if (option === "Remove") {
            setVisibleGraphs((prev) => ({ ...prev, [label]: false }));
            setgraphOptionsOpendLables((prev) => ({
                ...prev,
                [label]: !prev[label],
            }));
        }
    };


    const graphOptionsButtonHandler = (label: string) => {      //for Graph options visibilty
        setgraphOptionsOpendLables((prev) => ({ ...prev, [label]: !prev[label] }));
    };


    const handleCheckboxChange = (label: string) => {   //for labels dropdown selection
        setSelectedOptions((prev) =>
            prev.includes(label)
                ? prev.filter((item) => item !== label)
                : [label, ...prev]
        );
        setVisibleGraphs((prev) => ({ ...prev, [label]: !prev[label] }));
    };


    const handleAllSelectbBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {     //for dorpdown all selector
        if (event.target.checked) {
            setSelectedOptions(initialDropdownOptions);     // Select all labels and show all graphs
            setVisibleGraphs(initialVisibility);        // Select all labels and show all graphs
        } else {
            setSelectedOptions([]);      // Clear selection and hide all graphs
            setVisibleGraphs({});        // Clear selection and hide all graphs
        }
    };

    const handleDateChange = (date: Date | null) => {       //to handle date change in child component
        setSelectedDateTime(date);
        console.log("Selected Date & Time in Parent:", date);
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
                                    {Object.entries(labelsData).map(([label, data], index) => (
                                        <li key={label} className="dropdown-item">
                                            <label>{label}</label>
                                            <input
                                                type="checkbox"
                                                checked={selectedOptions.includes(label)}
                                                onChange={() => handleCheckboxChange(label)}
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
                    <ul className="data-buttons-container">
                        <li>
                            <button className="system-log-buttons">Show Data</button>
                        </li>
                        <li>
                            <button className="system-log-buttons">Export Data</button>
                        </li>
                    </ul>

                </div>
                <div className="graphs-main-container">
                    <div className="labels-container">
                        <div className="labels-data-container">
                            {selectedOptions.map((label: any) => (
                                <div className="labels-data">
                                    <p className="label-text">{label}</p>
                                    <div>
                                        <p className="label-text">800</p>
                                    </div>

                                    {/* condtionally rendering icons to handle graphs visibility */}
                                    {visibleGraphs[label] ? (
                                        <i
                                            onClick={() => toggleGraph(label)}
                                            className="bi bi-eye"
                                            style={{
                                                cursor: "pointer",
                                                fontSize: "18px",
                                                color: "black",
                                            }}
                                        ></i>
                                    ) : (
                                        <i
                                            onClick={() => toggleGraph(label)}
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
                            {Object.entries(labelsData).map(([label, data], index) =>
                                visibleGraphs[label] ? (
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
                                                            <li>
                                                                <button
                                                                    onClick={() => removeGraph(label, item)}
                                                                    className="graph-options-menu-item"
                                                                >
                                                                    {item}
                                                                </button>
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
                    </div>
                </div>
            </div>

        </>
    )
}

export default DataViewer;