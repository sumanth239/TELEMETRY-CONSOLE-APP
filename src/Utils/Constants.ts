// Configuration file that contains and configures a single subsystem, e.g., AstroLink V2, AstroBeam, etc.
// BackEnd URLS
export const SERVER = "192.168.0.131:8002"
export const BASE_URL = `http://${SERVER}`
export const GET_TELEMETRY_API_URL = `${BASE_URL}/dataviewer/telemetry`;
export const GET_TELECOMMANDS_API_URL = `${BASE_URL}/dashboard/telecommands`;
export const POST_TELECOMMABD_API_URL = `${BASE_URL}/dashboard/tecommand`
export const SCITM_WEBSOCKET_URL = `ws://${SERVER}/ws/SciTM`
export const HKTM_WEBSOCKET_URL = `ws://${SERVER}/ws/HKTM`
export const TELEMETRY_WEBSOCKET_URL = `ws://${SERVER}/ws/Telemetry`

// Others
export const MAX_TIME_SLIDER_INDEX = 60;
export const DEFAULT_INITIAL_TEMP = "32.2"
export const DEFAULT_INITIAL_POWER = "0.0"
export const DEFAULT_INITIAL_SYSTEM_MODE = "Safe Mode"
export const MAX_POINTS = 10; 
export const DEFAULT_ZOOM = 1; 
export const TIMETAG_CMD_APID = 501
export const REALTIME_CMD_APID = 500
export const SCITM_MAX_INDEX = 14
export const MAX_VISIBLE_GRAPHS = 4
export const POWER_ON_CMD_ID = 5
export const SHUTDOWN_CMD_ID = 6
export const FLOAT_INPUT_COMMANDS = [31, 90];
export const NO_INPUT_COMMANDS = [6,32,5]
export const MAX_TELEMETRY_DURATION = 20

export const NO_ALERT_MESSAGE = "No Alerts Found"
export const NO_DATA_FOUND = "No Data Found"
export const NO_SESSION_LOGS_FOUND ="No Session Logs Found"
export const BIT_ERROR_ALERT = "Skipping packet, packet contains bit error."

// Objects constants data
export const COLOR_MAP = [ "#446BAD","#ff7300","#387908","#F05A7E","#82ca9d","#000000"];
export const TELE_COMMAND_TYPES = ["Real Time", "Time Tagged"];
export const PRODUCTS = ["AstroLink Nano", "AstroBeam", "miniOCT"];
export const INPUT_TYPES = {
  NO_INPUT:0,
  DROPDOWN:1,
  VALUE:2
}
export const TELE_COMMANDS = [
  {
    cmd: "Power On",
    cmdId: 5,
    inputType: 0,
    inputValues: [],
  },
  {
    cmd: "Shutdown",
    cmdId: 6,
    inputType: 0,
    inputValues: [],
  },
  {
    cmd: "System Mode",
    cmdId: 7,
    inputType: 1,
    inputValues: [
      { label: "Safe Mode", value: 0 },
      { label: "Maintenance Mode", value: 1 },
      { label: "Stand-By Mode", value: 2 },
      { label: "Downlink Mode", value: 3 },
    ],
  },
  {
    cmd: "Data Transfer Toggle",
    cmdId: 8,
    inputType: 1,
    inputValues: [
      { label: "Disable", value: 0 },
      { label: "Enable", value: 1 },
    ],
  },
  {
    cmd: "Data Speed Configuration",
    cmdId: 9,
    inputType: 1,
    inputValues: [
      { label: "0.5 Gbps", value: 0 },
      { label: "1 Gbps", value: 1 },
      { label: "2.5 Gbps", value: 2 },
    ],
  },
  {
    cmd: "TEC Toggle",
    cmdId: 10,
    inputType: 1,
    inputValues: [
      { label: "Disable", value: 0 },
      { label: "Enable", value: 1 },
    ],
  },
  {
    cmd: "Laser Driver Control",
    cmdId: 11,
    inputType: 1,
    inputValues: [
      { label: "Constant Current Control", value: 0 },
      { label: "Automatic Power Control", value: 1 },
    ],
  },
  {
    cmd: "Beacon Camera Exposure",
    cmdId: 20,
    inputType: 2,
    inputValues: [{ name: "Exposure", units: "", range: [10, 20] }],
  },
  {
    cmd: "Beacon Camera ROI",
    cmdId: 21,
    inputType: 2,
    inputValues: [
      { name: "X_Start Px", units: "Px", range: [] },
      { name: "X_ROI Size", units: "", range: [] },
      { name: "Y_Start Px", units: "Px", range: [] },
      { name: "Y_ROI Size", units: "", range: [] },
    ],
  },
  {
    cmd: "FSM Driver Toggle",
    cmdId: 30,
    inputType: 1,
    inputValues: [
      { label: "Disable", value: 0 },
      { label: "Enable", value: 1 },
    ],
  },
  {
    cmd: "FSM Commanding",
    cmdId: 31,
    inputType: 2,
    inputValues: [
      { name: "X Axis", units: "Degrees", range: [-2.1, 2.1] },
      { name: "Y Axis", units: "Degrees", range: [-2.1, 2.1] },
    ],
  },
  {
    cmd: "FSM Status",
    cmdId: 32,
    inputType: 0,
    inputValues: [],
  },
  {
    cmd: "Motor Command",
    cmdId: 40,
    inputType: 2,
    inputValues: [
      { name: "Azimuth Angle", units: "Degrees", range: [-110, 110] },
      { name: "Elevation Angle", units: "Degrees", range: [-45, 45] },
    ],
  },
  {
    cmd: "Motor Driver Toggle",
    cmdId: 41,
    inputType: 1,
    inputValues: [
      { label: "Disable", value: 0 },
      { label: "Enable", value: 1 },
    ],
  },
  {
    cmd: "PAT Mode",
    cmdId: 50,
    inputType: 1,
    inputValues: [
      { label: "Stand-By", value: 0 },
      { label: "Pointing", value: 1 },
      { label: "Acquisition", value: 2 },
      { label: "Tracking", value: 3 },
    ],
  },
  {
    cmd: "EDFA Power",
    cmdId: 90,
    inputType: 2,
    inputValues: [{ name: "Power", units: "W", range: [0, 1.5] }],
  },
  {
    cmd: "EDFA Gain",
    cmdId: 91,
    inputType: 2,
    inputValues: [{ name: "Gain", units: "dB", range: [] }],
  },
  {
    cmd: "EDFA Current",
    cmdId: 92,
    inputType: 2,
    inputValues: [{ name: "Current", units: "mA", range: [] }],
  },
  {
    cmd: "EDFA Mode",
    cmdId: 93,
    inputType: 1,
    inputValues: [
      { label: "Power Control", value: 0 },
      { label: "Gain Control", value: 1 },
      { label: "Current Control", value: 2 },
      { label: "OFF", value: 3 },
    ],
  },
];

export const SYSTEM_MODES = [
  "Safe Mode",
  "Maintenance Mode",
  "Stand-By Mode",
  "Downlink Mode",
];

export const SETTINGS_MENU = ["Import Data", "Export Data", "Settings Options", "Date & Time Options", "Sign Out"];
export const GRAPH_OPTIONS = ["Remove", "Logarithmic Scale", "Axis Titles", "Gridlines"] as const;

export const ALL_LABELS = [
  { label: "System Mode", units: "", graphType: "step" },
  { label: "PAT Mode", units: "", graphType: "step" },
  { label: "Azimuth Angle", units: "deg", graphType: "monotone" },
  { label: "Elevation Angle", units: "deg", graphType: "monotoneX" },
  { label: "Quadcell Channel 1", units: "", graphType: "monotoneX" },
  { label: "Quadcell Channel 2", units: "", graphType: "monotoneX" },
  { label: "Quadcell Channel 3", units: "", graphType: "monotoneX" },
  { label: "Quadcell Channel 4", units: "", graphType: "monotoneX" },
  { label: "EDFA Power", units: "W", graphType: "monotoneX" },
  { label: "EDFA Gain", units: "dB", graphType: "monotoneX" },
  { label: "EDFA Current", units: "mA", graphType: "monotone" },
  { label: "Beacon Status", units: "", graphType: "monotoneX" },
  { label: "FSM X angle", units: "deg", graphType: "monotoneX" },
  { label: "FSM Y angle", units: "deg", graphType: "monotoneX" },
  { label: "Gimbal Current ", units: "A", graphType: "monotoneX" },
  { label: "ODT Temperature", units: "°C", graphType: "monotoneX" },
  { label: "Gimbal Temperature", units: "°C", graphType: "monotoneX" },
  { label: "EDFA Mode", units: "", graphType: "step" },
  { label: "EDFA Alarms", units: "", graphType: "monotoneX" },
  { label: "EDFA Laser Temperature", units: "°C", graphType: "monotoneX" },
  { label: "EDFA Internal Temperature", units: "°C", graphType: "monotoneX" },
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
  { label: "Total Power", units: "W", graphType: "monotoneX" },
  { label: "Software Version", units: "", graphType: null },
];

export const COMBINED_LABEL_GROUPS = [
  { title: "Motor Angles", labels: ["Azimuth Angle", "Elevation Angle"] },
  { title: "Quadcell Channels", labels: ["Quadcell Channel 1", "Quadcell Channel 2", "Quadcell Channel 3", "Quadcell Channel 4"] },
  { title: "FSM Angles", labels: ["FSM X angle", "FSM Y angle"] },
];

export const COMBINED_LABEL_GROUPS_WITH_UNITS = [
  { title: "Motor Angles", labels: ["Azimuth Angle(deg)", "Elevation Angle(deg)"] },
  { title: "Quadcell Channels", labels: ["Quadcell Channel 1", "Quadcell Channel 2", "Quadcell Channel 3", "Quadcell Channel 4"] },
  { title: "FSM Angles", labels: ["FSM X angle(deg)", "FSM Y angle(deg)"] },
];

export const LABEL_VALUE_MAPPINGS: Record<string, Record<number | string, string>> = {
  "System Mode": {
    0: "Safe Mode",
    1: "Maintenance Mode",
    2: "Stand-By Mode",
    3: "Downlink Mode",
  },
  "PAT Mode": {
    0: "Standby",
    1: "Pointing",
    2: "Acquisition",
    3: "Tracking",
  },
  "Beacon Status": {
    0: "Not Detected",
    1: "Detected",
  },
  "Data Transfer Toggle": {
    0: "Disable",
    1: "Enable",
  },
  "Data Speed Configuration": {
    0: "0.5 Gbps",
    1: "1 Gbps",
    2: "2.5 Gbps",
  },
  "TEC Toggle": {
    0: "Disable",
    1: "Enable",
  },
  "Laser Driver Control": {
    0: "Constant Current Control",
    1: "Automatic Power Control",
  },
  "FSM Driver Toggle": {
    0: "Disable",
    1: "Enable",
  },
  "Motor Driver Toggle": {
    0: "Disable",
    1: "Enable",
  },
  "EDFA Mode": {
    0: "Power Control",
    1: "Gain Control",
    2: "Current Control",
    3: "OFF",
  },
};
export const TELE_COMMANDS_INFO = [
  { 
    label: "System Mode", 
    units: "", 
    description: "Controls the operational state of the system. In Safe mode, all potentially harmful operations are disabled."
  },
  { 
    label: "PAT Mode", 
    units: "", 
    description: "Pointing, Acquisition and Tracking system status. Controls the laser targeting subsystem."
  },
  { 
    label: "Azimuth Angle", 
    units: "deg", 
    description: "Horizontal angle of the gimbal system. Used for coarse pointing in the initial acquisition phase."
  },
  { 
    label: "Elevation Angle", 
    units: "deg", 
    description: "Vertical angle of the gimbal system. Limited by mechanical constraints of the mounting system."
  },
  { 
    label: "Motor Current Consumption", 
    units: "A", 
    description: "Current draw of the gimbal motor system. Values above 4A trigger automatic safety shutdown."
  },
  { 
    label: "ODT Temperature", 
    units: "°C", 
    description: "Operating temperature of the Optical Data Terminal. Thermal management activates at temperatures exceeding 45°C."
  },
  { 
    label: "Gimbal Temperature", 
    units: "°C", 
    description: "Temperature of the mechanical gimbal system. Critical for maintaining pointing accuracy in varying thermal conditions."
  },
  { 
    label: "Quadcell Channel 1", 
    units: "", 
    description: "Upper-left quadrant signal strength from the quadrant detector. Used for fine pointing adjustment of the optical system."
  },
  { 
    label: "Quadcell Channel 2", 
    units: "", 
    description: "Upper-right quadrant signal strength from the quadrant detector. Values are normalized between 0-1."
  },
  { 
    label: "Quadcell Channel 3", 
    units: "", 
    description: "Lower-left quadrant signal strength from the quadrant detector. Balanced readings across all channels indicate proper alignment."
  },
  { 
    label: "Quadcell Channel 4", 
    units: "", 
    description: "Lower-right quadrant signal strength from the quadrant detector. Used together with other channels for determining pointing error."
  },
  { 
    label: "EDFA Mode", 
    units: "", 
    description: "Erbium-Doped Fiber Amplifier operational mode. Controls laser amplification."
  },
  { 
    label: "EDFA Power", 
    units: "W", 
    description: "Output power of the Erbium-Doped Fiber Amplifier. Depends on link distance and atmospheric conditions."
  },
  { 
    label: "EDFA Gain", 
    units: "dB", 
    description: "Gain setting of the optical amplifier. Higher values used for longer distance communication links."
  },
  { 
    label: "EDFA Current", 
    units: "mA", 
    description: "Current consumption of the EDFA pump laser. Provides insight into amplifier efficiency and potential degradation over time."
  },
  { 
    label: "EDFA Alarms", 
    units: "", 
    description: "Status flags for various EDFA subsystem alarms. Bitmask value where each bit represents a specific alarm condition."
  },
  { 
    label: "EDFA Laser Temperature", 
    units: "°C", 
    description: "Operating temperature of the EDFA pump laser. Critical parameter for maintaining wavelength stability."
  },
  { 
    label: "EDFA Internal Temperature", 
    units: "°C", 
    description: "Internal temperature of the EDFA housing. Monitored to prevent thermal damage to sensitive optical components."
  },
  { 
    label: "Beacon Status", 
    units: "", 
    description: "Status of beacon detection. Essential for initial acquisition and maintaining optical link."
  },
  { 
    label: "Beacon Exposure", 
    units: "°C", 
    description: "Exposure level of the beacon detector. Adjusted automatically based on ambient light conditions and signal strength."
  },
  { 
    label: "Beacon Sensor Temperature", 
    units: "°C", 
    description: "Operating temperature of the beacon detection sensor. Temperature affects sensitivity and noise characteristics."
  },
  { 
    label: "TEC Laser Temperature", 
    units: "°C", 
    description: "Temperature of the Thermoelectric Cooler for the laser system. Maintains precise wavelength by controlling laser diode temperature."
  },
  { 
    label: "TEC Voltage", 
    units: "V", 
    description: "Operating voltage of the Thermoelectric Cooler. Depends on required cooling or heating power."
  },
  { 
    label: "TEC Current", 
    units: "A", 
    description: "Current draw of the Thermoelectric Cooler. Direction indicates cooling vs. heating mode, magnitude relates to thermal load."
  },
  { 
    label: "ODT 5V Rail", 
    units: "V", 
    description: "Voltage level of the 5V power rail for the Optical Data Terminal. Critical for proper operation of digital logic circuits."
  },
  { 
    label: "SOC 3.3V Rail", 
    units: "V", 
    description: "Voltage level of the 3.3V power rail for the System-on-Chip. Powers the main processing and control components."
  },
  { 
    label: "SOC 1.8V Rail", 
    units: "V", 
    description: "Voltage level of the 1.8V power rail for the System-on-Chip. Used for memory interfaces and peripheral components."
  },
  { 
    label: "SOC 1.35V Rail", 
    units: "V", 
    description: "Voltage level of the 1.35V power rail for the System-on-Chip. Powers core CPU functionality and high-speed interfaces."
  },
  { 
    label: "SOC 1V Rail", 
    units: "V", 
    description: "Voltage level of the 1V power rail for the System-on-Chip. Critical for processor core operation at high frequencies."
  },
  { 
    label: "SOC Temperature", 
    units: "°C", 
    description: "Operating temperature of the System-on-Chip. Performance throttling begins at 85°C and emergency shutdown at 105°C."
  }
];