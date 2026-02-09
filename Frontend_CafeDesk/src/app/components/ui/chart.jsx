"use client";

import * as React from "react";
import * as Recharts from "recharts";

import { cn } from "./utils";

/* -------------------------------------------------------------------------- */
/*                                    THEME                                   */
/* -------------------------------------------------------------------------- */

const THEMES = {
  light: "",
  dark: ".dark",
};

/* -------------------------------------------------------------------------- */
/*                                   CONTEXT                                  */
/* -------------------------------------------------------------------------- */

const ChartContext = React.createContext(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within <ChartContainer />");
  }
  return context;
}

/* -------------------------------------------------------------------------- */
/*                               CHART CONTAINER                               */
/* -------------------------------------------------------------------------- */

function ChartContainer({ id, className, children, config = {}, ...props }) {
  const reactId = React.useId();
  const chartId = `chart-${id || reactId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn("w-full h-full", className)}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        {children}
      </div>
    </ChartContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  CHART CSS                                 */
/* -------------------------------------------------------------------------- */

function ChartStyle({ id, config }) {
  const entries = Object.entries(config).filter(
    ([, v]) => v?.color || v?.theme,
  );

  if (!entries.length) return null;

  const css = Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const vars = entries
        .map(([key, cfg]) => {
          const color = cfg.theme?.[theme] || cfg.color;
          return color ? `  --color-${key}: ${color};` : "";
        })
        .join("\n");

      return `${prefix} [data-chart="${id}"] {\n${vars}\n}`;
    })
    .join("\n");

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

/* -------------------------------------------------------------------------- */
/*                                 TOOLTIP                                    */
/* -------------------------------------------------------------------------- */

const ChartTooltip = Recharts.Tooltip;

function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  hideLabel = false,
  hideIndicator = false,
}) {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "rounded-lg border bg-background p-3 shadow-sm text-sm",
        className,
      )}
    >
      {!hideLabel && <div className="mb-2 font-medium">{label}</div>}

      <div className="space-y-1">
        {payload.map((item, i) => {
          const key = item.dataKey || item.name;
          const cfg = config[key] || {};
          const color = item.color || cfg.color;

          return (
            <div key={i} className="flex items-center gap-2">
              {!hideIndicator && (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
              )}
              <span className="flex-1 text-muted-foreground">
                {cfg.label || item.name}
              </span>
              <span className="font-mono font-medium">
                {item.value?.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  LEGEND                                    */
/* -------------------------------------------------------------------------- */

const ChartLegend = Recharts.Legend;

function ChartLegendContent({ payload, className, hideIcon = false }) {
  const { config } = useChart();
  if (!payload?.length) return null;

  return (
    <div className={cn("flex flex-wrap gap-4", className)}>
      {payload.map((item) => {
        const key = item.dataKey || item.value;
        const cfg = config[key] || {};

        return (
          <div key={key} className="flex items-center gap-2 text-sm">
            {!hideIcon && (
              <span
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
            )}
            <span>{cfg.label || item.value}</span>
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   EXPORTS                                  */
/* -------------------------------------------------------------------------- */

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
