import React from "react";
import { ResponsiveContainer } from "recharts";

/**
 * Higher-Order Component to wrap charts with a consistent container style.
 *
 * @param {React.Component} ChartComponent - The Recharts chart component (e.g. LineChart, BarChart)
 * @param {string} title - default title
 */
const withChartContainer = (
  ChartComponent,
  defaultTitle = "Chart Analysis"
) => {
  return ({ title, data, height = 300, children, ...props }) => {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800">
            {title || defaultTitle}
          </h3>
        </div>
        <div className="flex-1 min-h-[300px]" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            {/* We clone the ChartComponent element if passed as a prop, or render it if it's a wrapper */}
            {/* Actually, a standard HOC usually wraps a component class/function.
                 Here we want to accept Recharts children (Lines, Bars) as children of this HoC component.
              */}
            <ChartComponent data={data} {...props}>
              {children}
            </ChartComponent>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
};

export default withChartContainer;
