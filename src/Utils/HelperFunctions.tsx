import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import * as CONSTANTS from "./Constants";
import * as types from "../Utils/types"

export const exportToExcel = ({ telemetryData,logsData ,fileName }: types.ExportToExcelProps): void => {    //function to export the data into excel sheet
  if (telemetryData.length === 0 || logsData.length === 0) {
    console.warn("No data available for export!");
    return;
  }

  const productName = getSessionStorageKey('product');
  const FileName = fileName?.replace(/\s+/g, '') || `${productName}_${getFormattedDateTime()}.xlsx`;
  updateSessionLogs(`User choose ${FileName} filename for exported excel sheet`);

  const ws = XLSX.utils.json_to_sheet(telemetryData);
  const ws2 = XLSX.utils.json_to_sheet(logsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "TelemetryData");
  XLSX.utils.book_append_sheet(wb, ws2, "LogsData");



  // ✅ Define column widths
  ws["!cols"] = Object.keys(telemetryData[0]).map((key) => {
    const maxLength = Math.max(
      key.length, // Header length
      ...telemetryData.map((row: any) => (row[key] ? row[key].toString().length : 0)) // Max length of data in the column
    );
    return { wch: Math.min(maxLength + 5, 50) }; // Add padding and set a max width limit
  });

  ws2["!cols"] = [            //for logs data
    {wch : 25},
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
  const labelData = CONSTANTS.ALL_LABELS.find((item) => item.label === label);
  return labelData?.units;
}

export function getFullLabelWithUnits(label: string): string {      //function to get the units of label
  const labelData = CONSTANTS.ALL_LABELS.find((item) => item.label === label);
  if (!labelData) {
    return label; // Return the label itself if no data found
  }
  return `${labelData.label}${labelData.units && `(${labelData.units})`}`
}
export function getLabelGraphType(label: string): string {      //function to get the graph type of label
  const labelData = CONSTANTS.ALL_LABELS.find((item) => item.label === label);
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
  const mappings = CONSTANTS.LABEL_VALUE_MAPPINGS[label];
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
  const userName = getSessionStorageKey("userName");// Get user name from session storage
  sessionData.Logs.push({
    TimeStamp: new Date().toLocaleString("en-GB", { 
      timeZone: "UTC", 
      hour12: true 
    }).replace(/(\b\d\b)/g, "0$1").replace(/am|pm/, (match) => match.toUpperCase()) + " UTC",
    Action: `${userName} ${action}`,
  });

  localStorage.setItem("sessionStorage", JSON.stringify(sessionData));
  // 🔥 Dispatch custom event
  window.dispatchEvent(new Event("sessionLogsUpdated"));
}

export function updateAlerts(alert: any,action:any) {     //to handle the alerts
  const sessionStr: any = localStorage.getItem("sessionStorage");
  if (!sessionStr) {
    return
  };

  const sessionData = JSON.parse(sessionStr);

  if (!Array.isArray(sessionData.alerts)) {
    sessionData.alerts = [];
  }
  
  sessionData.alerts.push({
    TimeStamp: new Date().toLocaleString("en-GB", { timeZone: "UTC", hour12: true }).replace(/am|pm/, (match) => match.toUpperCase()) + " UTC",
    Alert: alert,
    Action: action,
  });

  localStorage.setItem("sessionStorage", JSON.stringify(sessionData));
  // 🔥 Dispatch custom event
  window.dispatchEvent(new Event("sessionAlertsUpdated"));
}

export function roundToTwoDecimals(value:Number) {
  return parseFloat(value.toFixed(2));
}

export function getSessionStorageKey(key: string): string | null {
  const data = localStorage.getItem("sessionStorage");
  if (!data) return null;

  try {
    const parsed = JSON.parse(data);
    return parsed[key] || null;
  } catch {
    return null;
  }
}


export function formatDateToReadableString(date: Date): string {
  const utcDate = new Date(date); // Ensure the date is treated as UTC
  const day = String(utcDate.getUTCDate()).padStart(2, "0");
  const month = String(utcDate.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = utcDate.getUTCFullYear();
  const hours = utcDate.getUTCHours() % 12 || 12; // Convert to 12-hour format
  const minutes = String(utcDate.getUTCMinutes()).padStart(2, "0");
  const seconds = String(utcDate.getUTCSeconds()).padStart(2, "0");
  const amPm = utcDate.getUTCHours() >= 12 ? "PM" : "AM";

  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds} ${amPm} UTC`;
}

export function updateAlertsAction(index: number): void {
  const sessionStr: any = localStorage.getItem("sessionStorage");
  if (!sessionStr) {
    return;
  }

  const sessionData = JSON.parse(sessionStr);

  if (!Array.isArray(sessionData.alerts)) {
    sessionData.alerts = [];
  }

  if (index === -1) {
    sessionData.alerts.forEach((alert: any) => {
      alert.Action = true;
    });
  } else if (index >= 0 && index < sessionData.alerts.length) {
    console.log("Updating alert at index:", index);
    sessionData.alerts[index].Action = true;
  }

  localStorage.setItem("sessionStorage", JSON.stringify(sessionData));
  // 🔥 Dispatch custom event
  window.dispatchEvent(new Event("sessionAlertsUpdated"));
}

export function getActiveAlertsCount(): number {
  const sessionStr: any = localStorage.getItem("sessionStorage");
  if (!sessionStr) {
    return 0;
  }

  const sessionData = JSON.parse(sessionStr);

  if (!Array.isArray(sessionData.alerts)) {
    return 0;
  }

  return sessionData.alerts.filter((alert: any) => !alert.Action).length;
}

export function mergeTelemetryByTimestamp(labels: string[], telemetryData: any) {          //to merge the data points of combined graphs ,to single object
    const mergedMap: { [timestamp: string]: any } = {};

    labels.forEach(label => {
        telemetryData[label]?.forEach((point: any) => {
            const { timestamp, value } = point;
            if (!mergedMap[timestamp]) {
                mergedMap[timestamp] = { timestamp };
            }
            mergedMap[timestamp][label] = value;
        });
    });

    // Convert map to sorted array
    const mergedArray = Object.values(mergedMap);
    console.log(mergedArray,",merged data")
    return mergedArray;
}

export function isArrayEmpty(arr:any) {
  return Array.isArray(arr) && arr.length === 0;
}

export function parseTimeToMillis(timestamp: string): number {
  if (!timestamp || typeof timestamp !== 'string') {
    console.error("Invalid timestamp format");
    return NaN;
  }

  const [datePart, timePart] = timestamp.split(', ');
  if (!timePart) {
    console.error("Timestamp missing time part");
    return NaN;
  }

  const [time, meridian] = timePart.split(' ');
  if (!time || !meridian) {
    console.error("Invalid time or meridian format");
    return NaN;
  }

  const [hoursStr, minutesStr, secondsStr] = time.split(':');
  if (!hoursStr || !minutesStr || !secondsStr) {
    console.error("Invalid time format");
    return NaN;
  }

  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  const [seconds, milliseconds = 0] = secondsStr.split('.').map(Number);

  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) || isNaN(milliseconds)) {
    console.error("Invalid numeric values in timestamp");
    return NaN;
  }

  if (meridian.toLowerCase() === 'pm' && hours !== 12) hours += 12;
  if (meridian.toLowerCase() === 'am' && hours === 12) hours = 0;

  return hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds;
}



export const systemModeIcon = (mode: string) => {
  if (mode === "Safe Mode") return <i className="bi bi-pause-circle"></i>
  else if (mode === "Maintenance Mode") return <i className="bi bi-tools"></i>
  else if (mode === "Stand-By Mode") return <i className="bi bi-hourglass-split"></i>
  else if (mode === "Downlink Mode") return <i className="bi bi-cloud-arrow-down"></i>
}

export const getLatestLabelValue = (telemetryData: any, label: string) => {
  const labelData = telemetryData[label];
  if (!labelData || !Array.isArray(labelData) || labelData.length === 0) {
    return ""; // Return null if no data is found
  }
  const latestDataPoint = labelData[labelData.length - 1];
  return resolveLabelValue(label, latestDataPoint.value); // Resolve and return the latest value
};

export function hasGraphType(label: string): boolean {
  const labelData = CONSTANTS.ALL_LABELS.find((item) => item.label === label);
  return !!labelData?.graphType;
}

export function updatePowerOnStatus(isPowerOn: boolean): void {
  const sessionStr: any = localStorage.getItem("sessionStorage");
  if (!sessionStr) {
    return;
  }

  const sessionData = JSON.parse(sessionStr);
  sessionData.powerOn = isPowerOn;

  localStorage.setItem("sessionStorage", JSON.stringify(sessionData));
  // 🔥 Dispatch custom event
  window.dispatchEvent(new Event("powerOnStatusUpdated"));
}

export function getUTCTimestampWithMilliseconds(): string {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    hour12: true,
  });
  console.log(" getUTCTimestampWithMilliseconds()",formatter.format(new Date()))
  return formatter.format(new Date());
}

export function getTimeDifferenceInMinutes(date1:any, date2:any) {
  const d1:any = new Date(date1);
  const d2:any = new Date(date2);
  const diffInMs = Math.abs(d2 - d1);
  return Math.floor(diffInMs / (1000 * 60));
}
