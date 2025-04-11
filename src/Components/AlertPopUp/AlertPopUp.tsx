import React, { useEffect } from 'react';
import "./AlertPopUp.css"

interface AlertPopupProps {
  alerts: string[];
  onClose: () => void;
}


const AlertPopup: React.FC<AlertPopupProps> = ({ alerts, onClose }) => {

  return (
    <div className='alert-overlay-container'>
      <div className='alerts-main-container'>
        <div className='alerts-header-container'>
          <p>ACTIVE ALERTS  </p>
          <i className="bi bi-x" style={{fontSize:"25px"}} onClick={() => onClose()}></i>
        </div>

        <div className='alerts-container'>
          {alerts.map((item, index) => (
            <div className='alerts'>
              <div className="alert-item">
                <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: "25px", color: "#FF6666" }} ></i>
                <span>{item}</span>
              </div>
              <span className='alert-timestamp'>00:00:00 UTC</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AlertPopup;
