import React from "react";
import "./Header.css";
import logo from "../../assets/logo.png"
import useCurrentTime from "../../Utils/useCurrentTime";
import {useSettings}  from "../../SettingsSceen/SettingScreen"
import * as helperFunctions from "../../Utils/HelperFunctions";


//A Header component which is placed in top most of the page
const Header: React.FC = () => {
    const { timezone } = useSettings();
    const { formattedDate, formattedTime, localDate, localTime } = useCurrentTime();  //custom hook for utc date and time
    const productName = helperFunctions.getSessionStorageKey("product") || "AstroLink 10G ODT"; // Get product name from session storage
    const userName = (helperFunctions.getSessionStorageKey("userName") || "User") // Get user name from session storage
    return (
        <div className="header-main-container">

            {/* Logo contianer*/}
            <div className="logo-container">
                <img id="astro-logo-image" src={logo} alt="AstroLink Logo" />
                <p id="logo-text">{productName}</p>
            </div>

            {/* Date and time contianer */}
            <div className="date-time-container">
                <p>{formattedDate}&nbsp;&nbsp;|&nbsp;&nbsp;{formattedTime}&nbsp;&nbsp;UTC </p>
                <p> {localDate}&nbsp;&nbsp;|&nbsp;&nbsp;{localTime}&nbsp;&nbsp;{timezone}</p>
            </div>

            <div className="settings-help-container">
                <p id="username">Hello, {userName}</p>
            </div>
        </div>
    );
};

export default Header;
