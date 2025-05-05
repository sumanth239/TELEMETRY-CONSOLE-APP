//default imports
import React, { useState } from "react";

//style sheet imports
import "react-datepicker/dist/react-datepicker.css";
import "../Dashboard/DashBoard.css";

//library imports
import DatePicker from "react-datepicker";

interface CalendarComponentProps {
  onDateChange: (date: Date | null) => void; // Prop to send selected date to parent
}


const CalendarComponent: React.FC <CalendarComponentProps> = ({onDateChange}) => {
  //This is Calener component , this component returns the calender

  //states
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(new Date().getTime() - (5.5 * 60 * 60 * 1000)));

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    onDateChange(date); // Send the selected date to the parent
  };

  return (
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        showTimeSelect
        timeFormat="HH:mm:SS"
        timeIntervals={1}
        dateFormat="dd-MM-yyyy HH:mm:SS"
        className="date-picker"
      />
  );
};

export default CalendarComponent;
