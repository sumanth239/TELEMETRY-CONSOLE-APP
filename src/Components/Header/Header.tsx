import React, { useState, useEffect } from "react";
import "./Header.css";
import logo from "../../assets/logo.png"
import { settingsMenu } from "../../Utils/Constant";
import useCurrentTime from "../../Utils/useCurrentTime";


//A Header component which is placed in top most of the page
const Header: React.FC = () => {

    const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);  //to handle the calender selected date 
    const [settingsButtonIsOpen, setSettingsButtonIsOPen] = useState(false);    //state for settings button
    const [exportDataBtnIsClicked, setExportDataBtnIsClicked] = useState(false); //states for setting options

    
    const { formattedDate, formattedTime, currentUtcTime, localDate, localTime } = useCurrentTime();  //custom hook for utc date and time


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
                <p>{formattedDate} &nbsp;  | &nbsp; {formattedTime} UTC </p>
                <p> {localDate} &nbsp;  | &nbsp; {localTime} IST</p>
            </div>

            <div className="settings-help-container">
                <p id="username">Hello, [User Name]</p>
            </div>
        </div>
    );
};

export default Header;
