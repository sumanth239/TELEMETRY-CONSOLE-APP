import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { allLabels ,labelValueMappings} from "./Constant";
import * as types from "../Utils/types"


export const exportToExcel = ({ data, fileName }: types.ExportToExcelProps): void => {
  if (data.length === 0) {
    console.warn("No data available for export!");
    return;
  }

  const FileName = fileName?.replace(/\s+/g, '')  || `astrolink_${getFormattedDateTime()}.xlsx`;


  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "TelemetryData");

  // ✅ Define column widths
  ws["!cols"] = [
    { wch: 20 }, // First column (e.g., timestamp)
    ...Object.keys(data[0]).slice(1).map(() => ({ wch: 15 })) // Rest
  ];

  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const file = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(file, FileName);
};

export function getLabelUnits(label: string): string | undefined {
  const labelData = allLabels.find((item) => item.label === label);
  return labelData?.units;
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