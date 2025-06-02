import { useState, useEffect } from "react";
import { convertToUtcFormat } from "../Utils/Constant";
import { useSettings } from "../SettingsSceen/SettingScreen";

// Custom hook to handle current UTC and local time
const useCurrentTime = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const { timezone, frequency } = useSettings(); // You get 'IST', 'PST', etc. here

    // Format UTC date as DD-MM-YYYY
    const formattedDate = currentTime.toLocaleDateString("en-GB", {
        timeZone: "UTC"
    }).replace(/\//g, "-");

    // Format UTC time as HH:MM:SS AM/PM
    const formattedTime = currentTime.toLocaleTimeString("en-GB", {
        timeZone: "UTC",
        hour12: true,
    }).replace(/am|pm/, (match) => match.toUpperCase());

    const currentUtcTime = convertToUtcFormat(currentTime);

    // Convert abbreviation to full IANA timezone, fallback to UTC
    const timeZone = timezone

    // Format local date as DD-MM-YYYY
    const localDate = currentTime.toLocaleDateString('en-GB', { timeZone }).replace(/\//g, '-');

    // Format local time as HH:MM:SS (24-hour format)
    const localTime = currentTime.toLocaleTimeString('en-GB', { timeZone, hour12: false });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, []);

    return {
        formattedDate,     // UTC Date
        formattedTime,     // UTC Time
        currentUtcTime,    // Custom UTC Format
        localDate,         // Local Date based on selected timezone
        localTime          // Local Time based on selected timezone
    };
};

export default useCurrentTime;
