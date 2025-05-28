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
    });

    const currentUtcTime = convertToUtcFormat(currentTime);

    // Abbreviation to IANA Timezone Map
    const timezoneMap: { [key: string]: string }  = {
        UTC: 'Etc/UTC',
        IST: 'Asia/Kolkata',
        PST: 'America/Los_Angeles',
        EST: 'America/New_York',
        CST: 'America/Chicago',
        MST: 'America/Denver',
        GMT: 'Etc/GMT',
        CET: 'Europe/Paris',
        EET: 'Europe/Bucharest',
        JST: 'Asia/Tokyo',
        AEST: 'Australia/Sydney'
    };

    // Convert abbreviation to full IANA timezone, fallback to UTC
    const timeZone = timezoneMap[timezone] || 'Etc/UTC';

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
