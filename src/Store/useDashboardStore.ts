import { create } from 'zustand';
import * as CONSTANTS from "../Utils/Constants";
import * as helperFunctions from "../Utils/HelperFunctions";
import * as types from "../Utils/types";

// Initialize dropdown options from constants
const initialDropdownOptions: string[] = CONSTANTS.ALL_LABELS.map(item => helperFunctions.getFullLabelWithUnits(item.label));

// Intialize graphs visblity and adding graphoptions to it
const initialVisibleGraphs: { [label: string]: types.GraphState } = CONSTANTS.ALL_LABELS.filter(label => label.graphType)
    .reduce((acc, item, index) => {
        acc[item.label] = {
            visibility: false,
            graphOptions: {
                "Remove": false,
                "Logarithmic Scale": false,
                "Axis Titles": false,
                "Gridlines": true,
            } as const,
        };
        return acc;
    }, {} as { [label: string]: types.GraphState });

// Intialize graph otpions selection 
const initialGraphOptionsState: { [key: string]: boolean } = CONSTANTS.ALL_LABELS.filter(label => label.graphType)
    .reduce((acc, item) => {
        const graphObject = CONSTANTS.COMBINED_LABEL_GROUPS.find(graph =>
            graph.labels.includes(item.label)
        );
        const key = graphObject ? graphObject.title : item.label;
        acc[key] = false;
        return acc;
    }, {} as { [key: string]: boolean });

// Initialize telemetry data 
const intialTelemeteryData: { [key: string]: { value: number, timestamp: string }[] } = {};


//Modifying intial state of graphs as visible
CONSTANTS.ALL_LABELS.forEach((item) => {
  intialTelemeteryData[item.label] = [];

});

// Intialize System Status Lables
const initialSystemStatusLabels: { [key: string]: string | number } = {
    "SystemMode": CONSTANTS.DEFAULT_INITIAL_SYSTEM_MODE,
    "Temperature": CONSTANTS.DEFAULT_INITIAL_TEMP,
    "TotalPowerConsumption": CONSTANTS.DEFAULT_INITIAL_POWER
};

// GlobalStore type definition
type GlobalStore = {

    // DropDown Options
    initialDropdownOptions: string[];
    selectedOptions: string[];
    setSelectedOptions: (options: string[]) => void;

    // Graph Options
    initialGraphOptionsState: { [key: string]: boolean };
    graphOptionsOpendLables: { [key: string]: boolean };
    setGraphOptionsOpendLables: (data: { [key: string]: boolean }) => void;

    // Graphs Visibilitty
    initialVisibleGraphs: { [label: string]: types.GraphState };
    visibleGraphs: { [label: string]: types.GraphState };
    setVisibleGraphs: (
        updater:
          | { [label: string]: types.GraphState }
          | ((prev: { [label: string]: types.GraphState }) => { [label: string]: types.GraphState })
      ) => void;
      

    // Telemetry Data
    initialTelemetryData: { [key: string]: { value: number; timestamp: string }[] }
    telemetryData: { [key: string]: { value: number; timestamp: string }[] };
    setTelemetryData: (
        updater: { [key: string]: { value: number; timestamp: string }[] } |
                 ((prev: { [key: string]: { value: number; timestamp: string }[] }) => { [key: string]: { value: number; timestamp: string }[] })
      ) => void;
    processedTelemetryData : types.TelemetryData
    setProcessedTelemetryData : (telemetryData :types.TelemetryData) => void
    isLogging:boolean;
    setIsLogging: (val:boolean) => void;

    exportTelemetryData : { [key: string]: any }[] ;
    setExportTelemetryData : (telemetryData : { [key: string]: any }[] ) => void

    systemStatusLabels : { [key: string]: string | number };
    setSystemStatusLabels : (data:{ [key: string]: string | number }) => void

    labelOrder : string[];
    setLabelOrder:(data: string[] ) => void 

    scheduledTimeTagCmds: { id: number; command: string; timeStamp: Date | null ;values: any[]}[];
    setScheduledTimeTagCmds: (
        updater:
          | { id: number; command: string; timeStamp: Date | null;values: any[] }[]
          | ((prev: { id: number; command: string; timeStamp: Date | null ;values: any[]}[]) => { id: number; command: string; timeStamp: Date | null ; values: any[]}[])
      ) => void

};

// Zustand store
export const useDashboardStore = create<GlobalStore>((set) => ({

    // DropDown Options
    initialDropdownOptions: initialDropdownOptions,
    selectedOptions: [...initialDropdownOptions], // default initial selection
    setSelectedOptions: (options) => set({ selectedOptions: options }),

    // Graph Options
    initialGraphOptionsState: initialGraphOptionsState,
    graphOptionsOpendLables: initialGraphOptionsState,
    setGraphOptionsOpendLables: (data: any) => set({ graphOptionsOpendLables: data }),


    // Graphs Visibilitty
    initialVisibleGraphs: initialVisibleGraphs,
    visibleGraphs: initialVisibleGraphs,
    setVisibleGraphs: (
        updater:
          | { [label: string]: types.GraphState }
          | ((prev: { [label: string]: types.GraphState }) => { [label: string]: types.GraphState })
      ) =>
        set((state) => ({
          visibleGraphs:
            typeof updater === 'function' ? updater(state.visibleGraphs) : updater,
        })),
      

    // Telemetry Data
    initialTelemetryData: intialTelemeteryData,
    telemetryData: intialTelemeteryData,
    setTelemetryData: (updater) =>
        set((state) => ({
          telemetryData: typeof updater === 'function' ? updater(state.telemetryData) : updater,
        })),
    processedTelemetryData: intialTelemeteryData,
    setProcessedTelemetryData: (telemetryData : types.TelemetryData) => set({processedTelemetryData:telemetryData}),

    isLogging:false,
    setIsLogging:((val:boolean )=> set({isLogging:val})),

    exportTelemetryData:[],
    setExportTelemetryData : (telemetryData) => set({telemetryData:{}}),

    systemStatusLabels : initialSystemStatusLabels,
    setSystemStatusLabels : (data :{ [key: string]: string | number }) => set({systemStatusLabels: data}),

    labelOrder: Object.keys(intialTelemeteryData),
    setLabelOrder: (data: string[]) => set({ labelOrder: data }),

    scheduledTimeTagCmds: [],
    setScheduledTimeTagCmds: (
        updater:
          | { id: number; command: string; timeStamp: Date | null ;values: any[] }[]
          | ((prev: { id: number; command: string; timeStamp: Date | null ;values: any[]}[]) => { id: number; command: string; timeStamp: Date | null ;values: any[]}[])
      ) =>
        set((state) => ({
          scheduledTimeTagCmds:
            typeof updater === 'function' ? updater(state.scheduledTimeTagCmds) : updater,
        })),
      
    

}));