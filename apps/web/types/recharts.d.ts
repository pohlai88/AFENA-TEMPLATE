/**
 * Recharts 2.x + @types/react 19 compatibility shim.
 *
 * React 19 removed the implicit `props` property from class components,
 * causing TS2786/TS2607 when recharts class components are used as JSX.
 * This module augmentation re-declares the affected components as
 * functional components so TypeScript accepts them as JSX elements.
 */
declare module 'recharts' {
  import type { FC, SVGProps } from 'react';

  export interface CommonProps {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export const XAxis: FC<Record<string, unknown>>;
  export const YAxis: FC<Record<string, unknown>>;
  export const ZAxis: FC<Record<string, unknown>>;
  export const Tooltip: FC<Record<string, unknown>>;
  export const Legend: FC<Record<string, unknown>>;
  export const CartesianGrid: FC<Record<string, unknown>>;
  export const Line: FC<Record<string, unknown>>;
  export const Bar: FC<Record<string, unknown>>;
  export const Area: FC<Record<string, unknown>>;
  export const Pie: FC<Record<string, unknown>>;
  export const Cell: FC<Record<string, unknown>>;
  export const ReferenceLine: FC<Record<string, unknown>>;
  export const ReferenceArea: FC<Record<string, unknown>>;
  export const ReferenceDot: FC<Record<string, unknown>>;
  export const Brush: FC<Record<string, unknown>>;
  export const Scatter: FC<Record<string, unknown>>;
  export const RadialBar: FC<Record<string, unknown>>;
  export const Radar: FC<Record<string, unknown>>;
  export const PolarGrid: FC<Record<string, unknown>>;
  export const PolarAngleAxis: FC<Record<string, unknown>>;
  export const PolarRadiusAxis: FC<Record<string, unknown>>;
  export const ResponsiveContainer: FC<Record<string, unknown>>;
  export const LineChart: FC<Record<string, unknown>>;
  export const BarChart: FC<Record<string, unknown>>;
  export const AreaChart: FC<Record<string, unknown>>;
  export const PieChart: FC<Record<string, unknown>>;
  export const ScatterChart: FC<Record<string, unknown>>;
  export const RadarChart: FC<Record<string, unknown>>;
  export const RadialBarChart: FC<Record<string, unknown>>;
  export const ComposedChart: FC<Record<string, unknown>>;
  export const Treemap: FC<Record<string, unknown>>;
  export const Funnel: FC<Record<string, unknown>>;
  export const FunnelChart: FC<Record<string, unknown>>;
  export const Sankey: FC<Record<string, unknown>>;
  export const Label: FC<Record<string, unknown>>;
  export const LabelList: FC<Record<string, unknown>>;
  export const ErrorBar: FC<Record<string, unknown>>;
  export const Cross: FC<Record<string, unknown>>;
  export const Curve: FC<Record<string, unknown>>;
  export const Dot: FC<Record<string, unknown>>;
  export const Rectangle: FC<Record<string, unknown>>;
  export const Sector: FC<Record<string, unknown>>;
  export const Symbol: FC<Record<string, unknown>>;
  export const Text: FC<Record<string, unknown>>;
  export const Trapezoid: FC<Record<string, unknown>>;
  export const Triangle: FC<Record<string, unknown>>;
  export const DefaultLegendContent: FC<Record<string, unknown>>;
  export const DefaultTooltipContent: FC<Record<string, unknown>>;
}
