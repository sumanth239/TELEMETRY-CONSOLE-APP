// src/declarations.d.ts
declare module "uplot";
declare module "echarts-for-react" {
    import * as React from "react";
  
    interface ReactEChartsProps {
      option: any;
      style?: React.CSSProperties;
      className?: string;
      settings?: Record<string, any>;
      notMerge?: boolean;
      lazyUpdate?: boolean;
      theme?: string | object;
      onChartReady?: (echartsInstance: any) => void;
      onEvents?: Record<string, (params?: any) => void>;
    }
  
    const ReactECharts: React.FC<ReactEChartsProps>;
  
    export default ReactECharts;
  }
  