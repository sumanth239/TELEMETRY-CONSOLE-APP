import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { allLabels, labelValueMappings } from "./Constant";
import * as types from "../Utils/types"


export const exportToExcel = ({ telemetryData,logsData ,fileName }: types.ExportToExcelProps): void => {    //function to export the data into excel sheet
  if (telemetryData.length === 0 || logsData.length === 0) {
    console.warn("No data available for export!");
    return;
  }

  const FileName = fileName?.replace(/\s+/g, '') || `astrolink_${getFormattedDateTime()}.xlsx`;
  updateSessionLogs(`User choose ${FileName} filename for exported excel sheet`);

  const ws = XLSX.utils.json_to_sheet(telemetryData);
  const ws2 = XLSX.utils.json_to_sheet(logsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "TelemetryData");
  XLSX.utils.book_append_sheet(wb, ws2, "LogsData");



  // ✅ Define column widths
  ws["!cols"] = [
    { wch: 20 }, // First column (e.g., timestamp)
    ...Object.keys(telemetryData[0]).slice(1).map(() => ({ wch: 20 })) // Rest
  ];

  ws2["!cols"] = [
    {wch : 23},
    {wch : 100}
  ]
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const file = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(file, FileName);
};

export function getLabelUnits(label: string): string | undefined {      //function to get the units of label
  const labelData = allLabels.find((item) => item.label === label);
  return labelData?.units;
}

export function getLabelGraphType(label: string): string {      //function to get the graph type of label
  const labelData = allLabels.find((item) => item.label === label);
  if(labelData?.graphType) {
    return labelData?.graphType
  }

  return "monotone"
}

export const getFormattedDateTime = (): string => {
  const now = new Date();

  const pad = (n: number) => n.toString().padStart(2, '0');

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1); // Months are 0-indexed
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());

  return `${year}${month}${day}${hours}${minutes}`;
};


export const resolveLabelValue = (label: string, value: number | string): string => {     //for handling and displaying names for numeric values eg. system mode 0 safe mode
  const mappings = labelValueMappings[label];
  if (mappings) {
    return mappings[value] ?? String(value); // fallback to raw value if not mapped
  }
  return String(value) ?? ""; // default case
};

export function updateSessionLogs(action: string) {     //to handle the session logs
  const sessionStr: any = localStorage.getItem("sessionStorage");
  if (!sessionStr) {
    return
  };

  const sessionData = JSON.parse(sessionStr);

  if (!Array.isArray(sessionData.Logs)) {
    sessionData.Logs = [];
  }

  sessionData.Logs.push({
    TimeStamp: new Date().toLocaleString("en-GB", { timeZone: "UTC", hour12: true }),
    Action: action
  });

  localStorage.setItem("sessionStorage", JSON.stringify(sessionData));
  // 🔥 Dispatch custom event
  window.dispatchEvent(new Event("sessionLogsUpdated"));
}

export function roundToTwoDecimals(value:Number) {
  return parseFloat(value.toFixed(2));
}

