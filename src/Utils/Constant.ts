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
        { "label": "Pointing", "value": 0 },
        { "label": "Acquisition", "value": 1 },
        { "label": "Tracking", "value": 2 },
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
  
  

  export const teleCommands2 = [
    {"cmd": "Shutdown", "cmdId": 6},
    {"cmd": "System Mode", "cmdId": 7},
    {"cmd": "Data Transfer Toggle", "cmdId": 8},
    {"cmd": "Data Speed Configuration", "cmdId": 9},
  
    {"cmd": "TEC Toggle", "cmdId": 10},
    {"cmd": "Laser Driver Control", "cmdId": 11},
  
    {"cmd": "Beacon Camera Exposure", "cmdId": 20},
    {"cmd": "Beacon Camera ROI", "cmdId": 21},
  
    {"cmd": "FSM Driver Toggle", "cmdId": 30},
    {"cmd": "FSM Commanding", "cmdId": 31},
    {"cmd": "FSM Status", "cmdId": 32},
  
    {"cmd": "Motor Command", "cmdId": 40},
    {"cmd": "Motor Driver Toggle", "cmdId": 41},
  
    {"cmd": "Pat Mode", "cmdId": 50},
  
    {"cmd": "EDFA Power", "cmdId": 90},
    {"cmd": "EDFA Gain", "cmdId": 91},
    {"cmd": "EDFA Current", "cmdId": 92},
    {"cmd": "EDFA Mode", "cmdId": 93}
  ]

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
export const graphOptions = ["Remove","Logarithmic Scale","Axis Titles","Gridlines","[Graph Option]"]


export const  allLables = [
    "System Mode",
    "Azimuth Angle",
    "Elevation Angle",
    "Motor Current Comsumption",
    "ODT Temperature",
    "Gimbal Temperature",
    "Quadcell Channel 1",
    "Quadcell Channel 2",
    "Quadcell Channel 3",
    "Quadcell Channel 4",
    "EDFA Mode",
    "EDFA Power",
    "EDFA Gain",
    "EDFA Current",
    "EDFA Alarms",
    "EDFA Laser Temperature",
    "EDFA Internal Temperature",
    "Beacon Status",
    "Beacon Exposure Time",
    "Beacon Sensor Temperature",
    "TEC Laser Temperature",
    "TEC Voltage",
    "TEC Current",
    "ODT 5V Rail",
    "SOC 3.3V Rail",
    "SOC 1.8V Rail",
    "SOC 1.35V Rail",
    "SOC 1V Rail",
    "SOC Temperature"
  ];


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