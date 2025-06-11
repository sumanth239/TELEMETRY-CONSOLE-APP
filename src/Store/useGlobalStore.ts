// store/useGlobalStore.ts
import { create } from 'zustand';

type GraphState = {
  visibility: boolean;
  graphOptions: {
    Remove: boolean;
    "Logarithmic Scale": boolean;
    "Axis Titles": boolean;
    "Gridlines": boolean;
  };
};

type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

type GlobalStore = {
  selectedOptions: string[];
  setSelectedOptions: (options: string[]) => void;

  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;

  isImported: boolean;
  setIsImported: (val: boolean) => void;

  visibleGraphs: { [label: string]: GraphState };
  setVisibleGraphs: (graphs: { [label: string]: GraphState }) => void;

  selectedDateRange: DateRange;
  setSelectedDateRange: (range: DateRange) => void;

  telemetryData: { [key: string]: { value: number; timestamp: string }[] };
  setTelemetryData: (data: { [key: string]: { value: number; timestamp: string }[] }) => void;

  timeSliderData: any[];
  setTimeSliderData: (data: any[]) => void;

  startIndex: number;
  setStartIndex: (index: number) => void;

  endIndex: number;
  setEndIndex: (index: number) => void;

  graphOptionsOpendLables: { [key: string]: boolean };
  setGraphOptionsOpendLables: (data: { [key: string]: boolean }) => void;

  sessionLogsData: { [key: string]: any }[];
  setSessionLogsData: (data: { [key: string]: any }[]) => void;

  file?: File;
  setFile: (file?: File) => void;
};

export const useGlobalStore = create<GlobalStore>((set:any) => ({
  selectedOptions: [],
  setSelectedOptions: (options:any) => set({ selectedOptions: options }),

  isOpen: false,
  setIsOpen: (val:any) => set({ isOpen: val }),

  isImported: false,
  setIsImported: (val:any) => set({ isImported: val }),

  visibleGraphs: {},
  setVisibleGraphs: (graphs:any) => set({ visibleGraphs: graphs }),

  selectedDateRange: { startDate: null, endDate: null },
  setSelectedDateRange: (range:any) => set({ selectedDateRange: range }),

  telemetryData: {},
  setTelemetryData: (data:any) => set({ telemetryData: data }),

  timeSliderData: [],
  setTimeSliderData: (data:any) => set({ timeSliderData: data }),

  startIndex: 0,
  setStartIndex: (index:any) => set({ startIndex: index }),

  endIndex: 0,
  setEndIndex: (index:any) => set({ endIndex: index }),

  graphOptionsOpendLables: {},
  setGraphOptionsOpendLables: (data:any) => set({ graphOptionsOpendLables: data }),

  sessionLogsData: [],
  setSessionLogsData: (data:any) => set({ sessionLogsData: data }),

  file: undefined,
  setFile: (file) => set({ file }),
}));
