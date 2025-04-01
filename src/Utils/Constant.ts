export const teleCommandType = ["Real Time","Time Tagged"]
export const teleCommands = [{"cmd":"PAT mode","cmdId":10},{"cmd":"Shut Down","cmdId":20},{"cmd":"Reset System","cmdId":50},{"cmd":"PAT mode2","cmdId":80}]
export const systemLogs = [
    { timestamp: "21-02-2025 10:07 UTC", message: "System is undergoing software update" },
    { timestamp: "21-02-2025 10:06 UTC", message: "CRC pass for Boot Image. System is ready for Software Update" },
    { timestamp: "21-02-2025 10:05 UTC", message: "System is ready to receive Boot Image" },
    { timestamp: "21-02-2025 10:00 UTC", message: "System Mode changed to Maintenance" },
    { timestamp: "21-02-2025 09:51 UTC", message: "System Mode changed to Stand-By" },
    
];
const data = [
    { value: 400.7481},
    { value: 300.98758 },
    { value: 500 },
    { value: 700 },
    { value: 400 },
    { value: 300 },
    { value: 500 },
    { value: 700 },
    { value: 600 },
    { value: 800 },
    { value: 600 },
    { value: 800 },
    { value: 400 },
    { value: 300 },
    { value: 500 },
    { value: 700 },
    { value: 600 },
    { value: 800 },
    { value: 400 },
    { value: 300 },
    { value: 500 },
    { value: 700 },
    { value: 600 },
    { value: 800 },
  ];
export const labelsData = {
    "Al Angle": data,
    "En Angle": data,
    "Label1": data,
    "Label2": data,
    "Label3": data,
    "Temparature ewruthqwrejitpoa ieoij oae58yhwirjyij": data,
    "Label4": data,
    "Label5": data,
    "Label6": data,
    "Temparature":data,
    "Al Angle1": data,
    "En Angle2": data,
    "Label11": data,
    "Label22": data,
    "Label33": data,
    "Tempaature ewruthqwrejitpoa ieoij oae58yhwirjyij": data,
    "Label55": data,
    "Label10": data,
    "Labe": data,
    "Temparaure":data
  };



  
export const settingsMenu = ["Import Data","Export Data","Settings Options","Date & Time Options","Sign Out"]
export const graphOptions = ["Remove","Logarithmic Scale","Axis Titles","Gridlines","[Graph Option]"]


export const allLables = ["System Mode","Azimuth Angle","Elevation Angle","Optical Bench Temperature","Gimbal Driver System Temperature","lable1","lable2","lable3" , "label6", "label7", "label8", "label9", "label10"]
export const tempTelemetryData: string = "$100*,$200*,$300*,$400,$500*";

export interface TelemetryData {
    label1: { value: number }[];
}

export const modifiedTelemetryData: TelemetryData = { label1: [] };

// Split data by comma
const dataArray: string[] = tempTelemetryData.split(",");

// Loop through the array and extract valid values
for (let i = 0; i < dataArray.length; i++) {
    let item: string = dataArray[i];
    if (item.startsWith("$") && item.endsWith("*")) {
        // Extract numeric value between $ and *
        const numericValue = parseInt(item.slice(1, -1), 10);
        modifiedTelemetryData.label1.push({ value: numericValue });
    }
}

console.log(modifiedTelemetryData);



// Function to generate random telemetry data
// function generateTelemetryData(labels:string[], packets:number) {
//     let tempStr = "";
//     for (let i = 0; i < packets; i++) {
//         let values = labels.map(() => Math.floor(Math.random() * 500)); // Random values for each label
//         tempStr += `$ER${i % 10},${values.join(",")}*`;
//     }
//     return tempStr;
// }

interface telemetryData {
    [key: string]: { value: number }[];
}

// Function to generate random telemetry data
function generateTelemetryData(labels: string[], packets: number): string {
    let tempStr = "";
    for (let i = 0; i < packets; i++) {
        let values = labels.map(() => Math.floor(Math.random() * 500)); // Random values for each label
        tempStr += `$ER${i % 10},${values.join(",")}*`;
    }
    return tempStr;
}

// Function to parse telemetry data
function parseTelemetryData(tempStr: string, labels: string[]): telemetryData {
    let dataStore: telemetryData = {};
    labels.forEach(label => dataStore[label] = []);
    
    let packets = tempStr.split("$").filter(packet => packet.includes("*"));
    
    for (let packet of packets) {
        let cleanPacket = packet.replace("*", "");
        let parts:any = cleanPacket.split(",");
        let erIdentifier = parseInt(parts.shift().replace("ER", "")); // Convert ER4 to 4
        
        dataStore[labels[0]].push({ value: erIdentifier }); // Store ER identifier under first label
        
        parts.forEach((value:any, index:number) => {
            if (index < labels.length - 1) {
                dataStore[labels[index + 1]].push({ value: parseInt(value) });
            }
        });
    }
    return dataStore;
}

// Define labels and generate random data
let labels: string[] = ["label1", "label2", "label3", "label4", "label5", "label6", "label7", "label8", "label9", "label10"];
let tempStr = generateTelemetryData(labels, 20);
console.log("Generated Telemetry Data:", tempStr);

// Parse the telemetry data
export let parsedData = parseTelemetryData(tempStr, labels);
console.log("Parsed Data:", JSON.stringify(parsedData, null, 2));


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