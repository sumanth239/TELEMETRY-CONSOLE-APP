import React, { useState, useEffect } from "react";
import "./Header.css";
import logo from "../../assets/logo.png"
import { settingsMenu } from "../../Utils/Constant";
import useCurrentTime from "../../Utils/useCurrentTime";
import CalendarComponent from "../Calender";


//A Header component which is placed in top most of the page
const Header: React.FC = () => {

    const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);  //to handle the calender selected date 
    const [settingsButtonIsOpen, setSettingsButtonIsOPen] = useState(false);    //state for settings button
    const [exportDataBtnIsClicked, setExportDataBtnIsClicked] = useState(false); //states for setting options

    
    const { formattedDate, formattedTime , currentUtcTime } = useCurrentTime();  //custom hook for utc date and time


    //handlar functions

    const handleDateChange = (date: Date | null) => {   //to handle date change in child component
        setSelectedDateTime(date);
        console.log("Selected Date & Time in Parent:", date);
    };

    const SettingsButtonHandler = () => {       //settings button handlar function 
        setSettingsButtonIsOPen(!settingsButtonIsOpen);
    }

    const SettingOptionsHandlers = (name: string) => { //settings button options handlar function
        if (name == "Export Data") {
            setExportDataBtnIsClicked(!exportDataBtnIsClicked);
        }
    }

    return (
        <div className="header-main-container">

            {/* Logo contianer*/}
            <div className="logo-container">
                <img id="astro-logo-image" src={logo} alt="AstroLink Logo" />
                <p id="logo-text">AstroLink 10G ODT</p>
            </div>

            {/* Date and time contianer */}
            <div className="date-time-container">
                <div className="date">{formattedDate}</div>
                <div className="time">{formattedTime} UTC</div>
            </div>

            <div className="settings-help-container">
                <p id="username">Hello, [User Name]</p>
                <button className="settings-button" onClick={SettingsButtonHandler}>
                    <i className="bi bi-gear-fill" style={{ fontSize: "25px" }}  ></i>
                </button>

                {/*settings button conditional render */}
                {settingsButtonIsOpen &&
                    <div className="settings-menu">
                        <ul>
                            {settingsMenu.map((item, index) => (
                                <li><button onClick={() => SettingOptionsHandlers(item)} className="settings-menu-item">{item}</button></li>
                            ))}
                        </ul>
                    </div>
                }
                {settingsButtonIsOpen && exportDataBtnIsClicked &&
                    <div className="export-data-container">
                        <div className="export-options-container">
                            <span>Export Data</span>
                            <label>
                                <input type="radio" name="exportOption" value="All TeleCmds" /> All TeleCmds
                            </label>
                            <label>
                                <input type="radio" name="exportOption" value="Selected TeleCmds" /> Selected TeleCmds
                            </label>
                        </div>

                        <div className="export-calender-container">
                            <CalendarComponent onDateChange={handleDateChange} />
                            <CalendarComponent onDateChange={handleDateChange} />

                        </div>
                        <button > Export Data</button>
                    </div>
                }

                {/* Help icon*/}
                <button className="help-button"><i className="bi bi-question-circle-fill" style={{ fontSize: "25px" }} ></i></button>
            </div>
        </div>
    );
};

export default Header;
