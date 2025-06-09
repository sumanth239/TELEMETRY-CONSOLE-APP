import React from "react";
import "./NoData.css";
import noDataFoundImg from "../assets/no-data.webp"

interface NoDataFoundProps {
  message: string;
}

const NoDataFound: React.FC<NoDataFoundProps> = ({ message }) => {
  return (
    <div className="no-data-wrapper">
      <img
        src={noDataFoundImg}// place your image at public/assets/no-data.png
        alt="No data"
        className="no-data-image"
      />
      <p className="no-data-message">{message}</p>
    </div>
  );
};

export default NoDataFound;
