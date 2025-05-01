import { title } from "process";

export const teleCommandType = ["Real Time","Time Tagged"]
export const teleCommands = [
    {
      "cmd"  : "Shutdown",
      "cmdId": 6,
      "inputType": 0,
      "inputValues" :[]
    },
    {
      "cmd"  : "System Mode",
      "cmdId": 7,
      "inputType": 1,
      "inputValues": [
        { "label": "Safe Mode", "value": 0 },
        { "label": "Maintenance Mode", "value": 1 },
        { "label": "Stand-By Mode", "value": 2 },
        { "label": "Downlink Mode", "value": 3 },
      ],
    },
    {
      "cmd"  : "Data Transfer Toggle",
      "cmdId": 8,
      "inputType": 1,
      "inputValues": [
        { "label": "Enable", "value": 0 },
        { "label": "Disable", "value": 1 },
      ],
    },
    {
      "cmd"  : "Data Speed Configuration",
      "cmdId": 9,
      "inputType": 1,
      "inputValues": [
        { "label": "0.5 Gbps", "value": 0 },
        { "label": "1 Gbps", "value": 1 },
        { "label": "2.5 Gbps", "value": 2 },
      ],
    },
    {
      "cmd"  : "TEC Toggle",
      "cmdId": 10,
      "inputType": 1,
      "inputValues": [
        { "label": "Enable", "value": 0 },
        { "label": "Disable", "value": 1 },
      ],
    },
    {
      "cmd"  : "Laser Driver Control",
      "cmdId": 11,
      "inputType": 1,
      "inputValues": [
        { "label": "Constant Current Control", "value": 0 },
        { "label": "Automatic Power Control", "value": 1 },
      ],
    },
    {
      "cmd"  : "Beacon Camera Exposure",
      "cmdId": 20,
      "inputType": 2,
      "inputValues": [{ "name": "Exposure", "units": "", "range": [10,20] }],
    },
    {
      "cmd"  : "Beacon Camera ROI",
      "cmdId": 21,
      "inputType": 2,
      "inputValues": [{ "name": "Start Px", "units": "Px", "range": [] },{ "name": "ROI Size", "units": "", "range": [] }],
    },
    {
      "cmd"  : "FSM Driver Toggle",
      "cmdId": 30,
      "inputType": 1,
      "inputValues": [
        { "label": "Enable", "value": 0 },
        { "label": "Disable", "value": 1 },
      ],
    },
    {
      "cmd"  : "FSM Commanding",
      "cmdId": 31,
      "inputType": 2,
      "inputValues": [
        { "name": "X Axis", "units": "Degrees", "range": [-2.1, 2.1] },
        { "name": "Y Axis", "units": "Degrees", "range": [-2.1, 2.1] },
      ],
    },
    {
      "cmd"  : "FSM Status",
      "cmdId": 32,
      "inputType": 0,
      "inputValues" :[]
    },
    {
      "cmd"  : "Motor Command",
      "cmdId": 40,
      "inputType": 2,
      "inputValues": [
        { "name": "Azimuth Angle", "units": "Degrees", "range": [-110, 110] },
        { "name": "Elevation Angle", "units": "Degrees", "range": [-45, 45] },
      ],
    },
    {
      "cmd"  : "Motor Driver Toggle",
      "cmdId": 41,
      "inputType": 1,
      "inputValues": [
        { "label": "Enable", "value": 0 },
        { "label": "Disable", "value": 1 },
      ],
    },
    {
      "cmd"  : "Pat Mode",
      "cmdId": 50,
      "inputType": 1,
      "inputValues": [
        { "label": "Stand-By", "value": 0 },
        { "label": "Pointing", "value": 1 },
        { "label": "Acquisition", "value": 2 },
        { "label": "Tracking", "value": 3 },
      ],
    },
    {
      "cmd"  : "EDFA Power",
      "cmdId": 90,
      "inputType": 2,
      "inputValues": [{ "name": "Power", "units": "W", "range": [0, 1.5] }],
    },
    {
      "cmd"  : "EDFA Gain",
      "cmdId": 91,
      "inputType": 2,
      "inputValues": [{ "name": "Gain", "units": "dB", "range": [] }],
    },
    {
      "cmd"  : "EDFA Current",
      "cmdId": 92,
      "inputType": 2,
      "inputValues": [{ "name": "Current", "units": "mA", "range": [] }],
    },
    {
      "cmd"  : "EDFA Mode",
      "cmdId": 93,
      "inputType": 1,
      "inputValues": [
        { "label": "Power Control", "value": 0 },
        { "label": "Gain Control", "value": 1 },
        { "label": "Current Control", "value": 2 },
        { "label": "OFF", "value": 3 },
      ],
    },
  ];
  

export const systemLogs = [
    { timestamp: "21-02-2025 10:07 UTC", message: "System is undergoing software update" },
    { timestamp: "21-02-2025 10:06 UTC", message: "CRC pass for Boot Image. System is ready for Software Update" },
    { timestamp: "21-02-2025 10:05 UTC", message: "System is ready to receive Boot Image" },
    { timestamp: "21-02-2025 10:00 UTC", message: "System Mode changed to Maintenance" },
    { timestamp: "21-02-2025 09:51 UTC", message: "System Mode changed to Stand-By" },
    
];
export const systemModes = [
    "Safe Mode",
    "Maintenance Mode",
    "Stand-By Mode",
    "Downlink Mode"
]


  
export const settingsMenu = ["Import Data","Export Data","Settings Options","Date & Time Options","Sign Out"]
export const graphOptions = ["Remove","Logarithmic Scale","Axis Titles","Gridlines"]  as const;


export const allLabels = [
  { label: "System Mode", units: "", graphType: "step" },
  { label: "Azimuth Angle", units: "dg", graphType: "monotone" },
  { label: "Elevation Angle", units: "dg", graphType: "monotoneX" },
  { label: "PAT Mode", units: "", graphType: "step" },
  // { label: "FSM X angle", units: "dg", graphType: "monotoneX" },
  // { label: "FSM Y angle", units: "dg", graphType: "monotoneX" },
  { label: "Gimbal Current Comsumption", units: "A", graphType: "monotoneX" },
  { label: "ODT Temperature", units: "°C", graphType: "monotoneX" },
  { label: "Gimbal Temperature", units: "°C", graphType: "monotoneX" },
  { label: "Quadcell Channel 1", units: "", graphType: "monotoneX" },
  { label: "Quadcell Channel 2", units: "", graphType: "monotoneX" },
  { label: "Quadcell Channel 3", units: "", graphType: "monotoneX" },
  { label: "Quadcell Channel 4", units: "", graphType: "monotoneX" },
  { label: "EDFA Mode", units: "", graphType: "step" },
  { label: "EDFA Power", units: "W", graphType: "monotoneX" },
  { label: "EDFA Gain", units: "dB", graphType: "monotoneX" },
  { label: "EDFA Current", units: "mA", graphType: "monotone" },
  { label: "EDFA Alarms", units: "", graphType: "monotoneX" },
  { label: "EDFA Laser Temperature", units: "°C", graphType: "monotoneX" },
  { label: "EDFA Internal Temperature", units: "°C", graphType: "monotoneX" },
  { label: "Beacon Status", units: "", graphType: "monotoneX" },
  { label: "Beacon Exposure", units: "°C", graphType: "monotoneX" },
  { label: "Beacon Sensor Temperature", units: "°C", graphType: "monotoneX" },
  { label: "TEC Laser Temperature", units: "°C", graphType: "monotoneX" },
  { label: "TEC Voltage", units: "V", graphType: "monotoneX" },
  { label: "TEC Current", units: "A", graphType: "monotoneX" },
  { label: "ODT 5V Rail", units: "V", graphType: "monotoneX" },
  { label: "SOC 3.3V Rail", units: "V", graphType: "monotoneX" },
  { label: "SOC 1.8V Rail", units: "V", graphType: "monotoneX" },
  { label: "SOC 1.35V Rail", units: "V", graphType: "monotoneX" },
  { label: "SOC 1V Rail", units: "V", graphType: "monotoneX" },
  { label: "SOC Temperature", units: "°C", graphType: "monotoneX" },
  { label: "Software Version", units: "", graphType: null }
];

export const combinedLabelGroups = [
  { title: "Motor Angles", labels: ["Azimuth Angle", "Elevation Angle"] },
  { title: "Quadcell Channels", labels: ["Quadcell Channel 1", "Quadcell Channel 2", "Quadcell Channel 3", "Quadcell Channel 4"] },
  {title : "FSM Angles",labels:["FSM X angle","FSM Y angle"]}
];

export const combinedLabelGroupsWithUnits = [
  { title: "Motor Angles", labels: ["Azimuth Angle(dg)", "Elevation Angle(dg)"] },
  { title: "Quadcell Channels", labels: ["Quadcell Channel 1", "Quadcell Channel 2", "Quadcell Channel 3", "Quadcell Channel 4"] },
  {title : "FSM Angles",labels:["FSM X angle","FSM Y angle"]}
];

export const labelValueMappings: Record<string, Record<number | string, string>> = {
  "System Mode": {
    0: "Safe",
    1: "Maintenance",
    2: "Stand-By",
    3: "Downlink"
  },
  "PAT Mode": {
    0: "Standby",
    1: "Pointing",
    2: "Acquisition",
    3: "Tracking"
  },
  "EDFA Mode": {
    0: "PC",
    1: "GC",
    2: "CC",
    3: "OFF"
  },
  "Beacon Status": {
    0: "Not Detected",
    1: "Detected"
  }
  // Add more mappings as needed
};


export function convertToUtcFormat(date: Date): string {
    const utcDate = new Date(date.getTime() - 5.5 * 60 * 60 * 1000); // Convert to UTC

    const day = String(utcDate.getDate()).padStart(2, "0");
    const month = String(utcDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = utcDate.getFullYear();
    const hours = utcDate.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = String(utcDate.getMinutes()).padStart(2, "0");
    const seconds = String(utcDate.getSeconds()).padStart(2, "0");
    const ampm = utcDate.getHours() >= 12 ? "PM" : "AM";

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

// export default const systemModes 