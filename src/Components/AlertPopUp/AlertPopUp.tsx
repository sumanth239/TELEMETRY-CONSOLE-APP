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
  const [alertsData, setAlertsData] = useState<{ TimeStamp: any;  Alert: string; Action: boolean }[]>(() => { //state to log the data 
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
    <div 
      className='alert-overlay-container' 
      onClick={(e) => {
      // Ensure the click is on the overlay and not on the alerts container
      if (e.target === e.currentTarget) {
        onClose();
      }
      }}
    >
      <div className='alerts-main-container'>
      <div className='alerts-header-container'>
        <p>ACTIVE ALERTS  </p>
       
        {alertsData.filter((item) => !item.Action).length !== 0 && (
        <button 
          className='acknowledge-all-button' 
          onClick={() => {
          helperFunctions.updateAlertsAction(-1);
          helperFunctions.updateSessionLogs(`acknowledged the all active alerts`);
          }}
        >
          ACK ALL
        </button>)}
      </div>

      <div className='alerts-container'>
        {alertsData.filter((item) => !item.Action).length === 0 ? (
        <div className="no-alerts">There are no active alerts</div>
        ) : (
        alertsData.map((item, index) =>
          item.Action ? null : (
          <div className='alerts' key={index}>
            <div className="alert-item">
            <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: "25px", color: "#FF6666" }} ></i>
            <span>{item?.Alert} </span>
            </div>
            <span className='alert-timestamp'>{item?.TimeStamp}</span>
            <button 
            className='acknowledge-button' 
            onClick={() => {
              helperFunctions.updateAlertsAction(index);
              helperFunctions.updateSessionLogs(`acknowledged the alert: ${item.Alert}`);
            }}
            >
            ACK
            </button>
          </div>
          )
        )
        )}
      </div>

      </div>
    </div>
  );
};

export default AlertPopup;
