//types 

export type LabelInfo = {
    label: string;
    units: string | null;
  };


export type GraphOptions = {
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
