import React, { useEffect } from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertPopupProps {
  message: string;
  type?: AlertType;
  duration?: number; // in ms
  onClose: () => void;
}

const getColor = (type: AlertType) => {
  switch (type) {
    case 'success':
      return '#4caf50';
    case 'error':
      return '#f44336';
    case 'warning':
      return '#ff9800';
    case 'info':
    default:
      return '#2196f3';
  }
};

const AlertPopup: React.FC<AlertPopupProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: getColor(type),
      color: '#fff',
      padding: '16px 24px',
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
      zIndex: 9999,
      minWidth: '250px',
      textAlign: 'center',
    }}>
      {message}
    </div>
  );
};

export default AlertPopup;
