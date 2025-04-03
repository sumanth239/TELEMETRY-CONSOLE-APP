import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (data: any) => {
    if (data.length === 0) {
        console.warn("No data available for export!");
        return;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "TelemetryData");

    // ✅ Define column widths (adjust as needed)
    ws["!cols"] = [
        { wch: 20 }, // Timestamp column (wider)
        ...Object.keys(data[0]).slice(1).map(() => ({ wch: 15 })) // Other columns
    ];

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(file, "TelemetryData.xlsx");
};