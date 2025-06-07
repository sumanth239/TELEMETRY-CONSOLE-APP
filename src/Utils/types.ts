//types 

export type LabelInfo = {
    label: string;
    units: string | null;
  };


export type GraphOptions = {
    "Remove": boolean;
    "Logarithmic Scale": boolean;
    "Axis Titles": boolean;
    "Gridlines": boolean;
  };

export type ExcelDataPoint = {
  [key:string]:any
}
export  type  ExportToExcelProps  = {
  telemetryData: any[];
  logsData:any[];
  fileName: string | undefined;
}

export type GraphState = {
  visibility: boolean;
  graphOptions: GraphOptions;
};

export interface FormData {
  name: string;
  email: string;
  password: string;
}

export interface CommandLabel {
  label: string;
  units: string;
  description?: string;
}

export interface DataPoint {
  "value": number,
  "timestamp": string
}
export type TelemetryData = {
  [key: string]: { value: number; timestamp: string }[];
};