import { create } from 'zustand';
import * as CONSTANTS from "../Utils/Constants";
import * as helperFunctions from "../Utils/HelperFunctions";
import * as types from "../Utils/types";

// Initialize dropdown options from constants
const initialDropdownOptions: string[] = CONSTANTS.ALL_LABELS.filter((item) => item.graphType).map(item => helperFunctions.getFullLabelWithUnits(item.label));

// Intialize graphs visblity and adding graphoptions to it
const initialVisibleGraphs: { [label: string]: types.GraphState } = CONSTANTS.ALL_LABELS.filter(label => label.graphType)
    .reduce((acc, item, index) => {
        const fullLabel = helperFunctions.getFullLabelWithUnits(item.label);
        acc[fullLabel] = {
            visibility: index < CONSTANTS.MAX_VISIBLE_GRAPHS ? true : false,
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

// GlobalStore type definition
type GlobalStore = {

    // DropDown Options
    initialDropdownOptions: string[];                   //i.e all labels 

    dropdownOptions: string[];                          //Dropdown options based on the import mode (Database,File) ,if Database All labels else choosen labels
    setDropdownOptions :(options: string[]) => void;

    selectedOptions: string[];              //selected dropdown options
    setSelectedOptions: (options: string[]) => void;

    // Graph Options
    initialGraphOptionsState: { [key: string]: boolean };
    graphOptionsOpendLables: { [key: string]: boolean };
    setGraphOptionsOpendLables: (data: { [key: string]: boolean }) => void;

    // Data Imports
    isImported: boolean;
    setIsImported: (val: boolean) => void;

    file?: File;
    setFile: (file?: File) => void;

    // Graphs Visibilitty
    initialVisibleGraphs: { [label: string]: types.GraphState };
    visibleGraphs: { [label: string]: types.GraphState };
    setVisibleGraphs: (graphs: { [label: string]: types.GraphState }) => void;

    //Time Slider States
    selectedDateRange: { startDate: Date | null; endDate: Date | null };
    setSelectedDateRange: (range: { startDate: Date | null; endDate: Date | null }) => void;

    startIndex: number;         // For graphs
    setStartIndex: (index: number) => void;

    endIndex: number;           // For graphs
    setEndIndex: (index: number) => void;

    timeSliderData: any[];
    setTimeSliderData: (data: any[]) => void;

    // Session Logs
    sessionLogsData: { [key: string]: any }[];
    setSessionLogsData: (data: { [key: string]: any }[]) => void;

    // Telemetry Data
    telemetryData: { [key: string]: { value: number; timestamp: string }[] };
    setTelemetryData: (data: { [key: string]: { value: number; timestamp: string }[] }) => void;

};

// Zustand store
export const useDataViewerStore = create<GlobalStore>((set) => ({

    // DropDown Options
    initialDropdownOptions: initialDropdownOptions,

    dropdownOptions: initialDropdownOptions,            // default dropdown  selections
    setDropdownOptions:(options) => set({  dropdownOptions: options }),

    selectedOptions: [...initialDropdownOptions], // default initial selection
    setSelectedOptions: (options) => set({ selectedOptions: options }),

    // Graph Options
    initialGraphOptionsState: initialGraphOptionsState,
    graphOptionsOpendLables: initialGraphOptionsState,
    setGraphOptionsOpendLables: (data: any) => set({ graphOptionsOpendLables: data }),

    // Data Imports
    isImported: false,
    setIsImported: (val: any) => set({ isImported: val }),

    file: undefined,
    setFile: (file) => set({ file }),

    // Graphs Visibilitty
    initialVisibleGraphs: initialVisibleGraphs,
    visibleGraphs: initialVisibleGraphs,
    setVisibleGraphs: (graphs: any) => set({ visibleGraphs: graphs }),

    //Time Slider States
    selectedDateRange: { startDate: null, endDate: null },
    setSelectedDateRange: (range: any) => set({ selectedDateRange: range }),

    startIndex: 5,
    setStartIndex: (index: any) => set({ startIndex: index }),

    endIndex: 10,
    setEndIndex: (index: any) => set({ endIndex: index }),

    timeSliderData: [],
    setTimeSliderData: (data: any) => set({ timeSliderData: data }),

    // Session Logs
    sessionLogsData: [],
    setSessionLogsData: (data: any) => set({ sessionLogsData: data }),

    // Telemetry Data
    telemetryData: {},
    setTelemetryData: (data: any) => set({ telemetryData: data }),


}));