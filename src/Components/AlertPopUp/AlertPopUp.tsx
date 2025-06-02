//default imports
import React from 'react';
import { useEffect, useState } from 'react';

//style sheet imports
import "./AlertPopUp.css"

import * as helperFunctions from "../../Utils/HelperFunctions";

interface AlertPopupProps {
  onClose: () => void;
}


const AlertPopup: React.FC<AlertPopupProps> = ({ onClose }) => {
  const [alertsData, setAlertsData] = useState<{ Timestamp: any;  Alert: string; Acknowledged: boolean }[]>(() => { //state to log the data 
    const sessionStr = localStorage.getItem("sessionStorage");
    if (!sessionStr) return [];

    try {
      const sessionData = JSON.parse(sessionStr);
      if (Array.isArray(sessionData.alerts)) {
        console.log("sessionData.alerts", sessionData.alerts);
        return sessionData.alerts;
      }
    } catch (err) {
      console.error("FAILED to parse session logs:", err);
    }

    return [];
  });

  useEffect(() => {   // to update session logs
    const handleSessionAlertsUpdated = () => {
      const sessionStr = localStorage.getItem("sessionStorage");
      if (!sessionStr) return;

      try {
        const sessionData = JSON.parse(sessionStr);
        if (Array.isArray(sessionData.alerts)) {
          setAlertsData(sessionData.alerts);
        }
      } catch (err) {
        console.error("FAILED to parse session logs:", err);
      }
    };

    // 👂 Listen for custom event
    window.addEventListener("sessionAlertsUpdated", handleSessionAlertsUpdated);

    // Cleanup
    return () => {
      window.removeEventListener("sessionAlertsUpdated", handleSessionAlertsUpdated);
    };
  }, []);

  return (
    <div className='alert-overlay-container'>
      <div className='alerts-main-container'>
        <div className='alerts-header-container'>
          <p>ACTIVE ALERTS  </p>
          <div className='acknowledge-and-close-container'>
            <button className='acknowledge-all-button'>ACK ALL</button>
          </div>
        </div>

        <div className='alerts-container'>
          {alertsData.map((item, index) => (
            <div className='alerts' key={index}>
              <div className="alert-item">
                <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: "25px", color: "#FF6666" }} ></i>
                <span>{item?.Alert}</span>
              </div>
              <span className='alert-timestamp'>{item.Timestamp }</span>
              <button className='acknowledge-button'>ACK</button>
            </div>
          ))}
        </div>
        <button className='close-button' onClick={onClose}>Close</button>
      </div>

    </div>
  );
};

export default AlertPopup;
