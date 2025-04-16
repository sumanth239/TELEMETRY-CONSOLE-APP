import { useState, useEffect } from "react";
import { convertToUtcFormat } from "../Utils/Constant";

// Custom hook to handle current UTC and local time
const useCurrentTime = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    // Format UTC date as DD-MM-YYYY
    const formattedDate = currentTime.toLocaleDateString("en-GB").replace(/\//g, "-");

    // Format UTC time as HH:MM:SS AM/PM
    const formattedTime = currentTime.toLocaleTimeString("en-GB", {
        timeZone: "UTC",
        hour12: true,
    });

    const currentUtcTime = convertToUtcFormat(currentTime);

    // Format local date as DD-MM-YYYY
    const localDate = currentTime.toLocaleDateString("en-GB").replace(/\//g, "-");

    // Format local time as HH:MM:SS (24-hour)
    const localTime = currentTime
        .toLocaleTimeString("en-GB", { hour12: true });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, []);

    return { formattedDate, formattedTime, currentUtcTime, localDate, localTime };
};

export default useCurrentTime;
