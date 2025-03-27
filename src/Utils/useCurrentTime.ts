import { useState, useEffect } from "react";
import {convertToUtcFormat} from "../Utils/Constant";

//custom hook to handle the current utc time and current data
const useCurrentTime = () => {

    //states
    const [currentTime, setCurrentTime] = useState(new Date());     //to handle the current time
    const formattedDate = currentTime.toLocaleDateString("en-GB").replace(/\//g, "-");      // Format date as DD-MM-YYYY (UTC)
    const formattedTime = currentTime.toLocaleTimeString("en-GB", { timeZone: "UTC", hour12: false });   // Format time as HH-MM-SS (UTC)
    const currentUtcTime = convertToUtcFormat(currentTime)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);       // Update every second

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return { formattedDate, formattedTime ,currentUtcTime };



};

export default useCurrentTime;
