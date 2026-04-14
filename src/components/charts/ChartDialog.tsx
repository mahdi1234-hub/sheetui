"use client";

import { useState, useMemo } from "react";
import { useSpreadsheetStore } from "@/store/spreadsheet-store";
import { X, BarChart3 } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic imports for Nivo charts to avoid SSR issues
const ResponsiveBar = dynamic(() => import("@nivo/bar").then((m) => m.ResponsiveBar), { ssr: false });
const ResponsiveLine = dynamic(() => import("@nivo/line").then((m) => m.ResponsiveLine), { ssr: false });
const ResponsivePie = dynamic(() => import("@nivo/pie").then((m) => m.ResponsivePie), { ssr: false });
const ResponsiveScatterPlot = dynamic(() => import("@nivo/scatterplot").then((m) => m.ResponsiveScatterPlot), { ssr: false });
const ResponsiveHeatMap = dynamic(() => import("@nivo/heatmap").then((m) => m.ResponsiveHeatMap), { ssr: false });
const ResponsiveRadar = dynamic(() => import("@nivo/radar").then((m) => m.ResponsiveRadar), { ssr: false });
const ResponsiveFunnel = dynamic(() => import("@nivo/funnel").then((m) => m.ResponsiveFunnel), { ssr: false });
const ResponsiveTreeMap = dynamic(() => import("@nivo/treemap").then((m) => m.ResponsiveTreeMap), { ssr: false });
const ResponsiveSunburst = dynamic(() => import("@nivo/sunburst").then((m) => m.ResponsiveSunburst), { ssr: false });
const ResponsiveNetwork = dynamic(() => import("@nivo/network").then((m) => m.ResponsiveNetwork), { ssr: false });
const ResponsiveStream = dynamic(() => import("@nivo/stream").then((m) => m.ResponsiveStream), { ssr: false });
const ResponsiveBump = dynamic(() => import("@nivo/bump").then((m) => m.ResponsiveBump), { ssr: false });
const ResponsiveCalendar = dynamic(() => import("@nivo/calendar").then((m) => m.ResponsiveCalendar), { ssr: false });
const ResponsiveCirclePacking = dynamic(() => import("@nivo/circle-packing").then((m) => m.ResponsiveCirclePacking), { ssr: false });
const ResponsiveSwarmPlot = dynamic(() => import("@nivo/swarmplot").then((m) => m.ResponsiveSwarmPlot), { ssr: false });
const ResponsiveWaffle = dynamic(() => import("@nivo/waffle").then((m) => m.ResponsiveWaffle), { ssr: false });
const ResponsiveSankey = dynamic(() => import("@nivo/sankey").then((m) => m.ResponsiveSankey), { ssr: false });

const CHART_TYPES = [
  "bar", "line", "pie", "scatter", "heatmap", "radar", "funnel",
  "treemap", "sunburst", "network", "stream", "bump", "calendar",
  "circle-packing", "swarmplot", "waffle", "sankey",
] as const;

type ChartType = (typeof CHART_TYPES)[number];

interface ChartDialogProps {
  onClose: () => void;
  onInsert?: (chartConfig: { type: ChartType; data: unknown }) => void;
}

export default function ChartDialog({ onClose, onInsert }: ChartDialogProps) {
  const { sheets, activeSheetIndex } = useSpreadsheetStore();
  const [selectedType, setSelectedType] = useState<ChartType>("bar");
  const sheet = sheets[activeSheetIndex];

  // Extract data from spreadsheet for chart
  const chartData = useMemo(() => {
    if (!sheet) return { labels: [], values: [] };
    const labels: string[] = [];
    const values: number[] = [];

    // Try to extract from first two columns
    for (let r = 0; r < 20; r++) {
      const labelCell = sheet.cells[`${r}:0`];
      const valueCell = sheet.cells[`${r}:1`];
      if (labelCell?.value && valueCell?.value) {
        labels.push(String(labelCell.value));
        values.push(Number(valueCell.value) || 0);
      }
    }

    if (labels.length === 0) {
      // Demo data
      return {
        labels: ["Product A", "Product B", "Product C", "Product D", "Product E"],
        values: [45, 62, 38, 71, 55],
      };
    }

    return { labels, values };
  }, [sheet]);

  const getBarData = () =>
    chartData.labels.map((label, i) => ({
      id: label,
      label,
      value: chartData.values[i] || 0,
    }));

  const getLineData = () => [
    {
      id: "Series 1",
      data: chartData.labels.map((label, i) => ({
        x: label,
        y: chartData.values[i] || 0,
      })),
    },
  ];

  const getPieData = () =>
    chartData.labels.map((label, i) => ({
      id: label,
      label,
      value: chartData.values[i] || 0,
    }));

  const renderChart = () => {
    const commonProps = { animate: true, motionConfig: "gentle" as const };

    switch (selectedType) {
      case "bar":
        return (
          <ResponsiveBar
            data={getBarData()}
            keys={["value"]}
            indexBy="label"
            margin={{ top: 30, right: 30, bottom: 50, left: 60 }}
            padding={0.3}
            colors={{ scheme: "nivo" }}
            {...commonProps}
          />
        );
      case "line":
        return (
          <ResponsiveLine
            data={getLineData()}
            margin={{ top: 30, right: 30, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: "auto", max: "auto" }}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            enableArea
            {...commonProps}
          />
        );
      case "pie":
        return (
          <ResponsivePie
            data={getPieData()}
            margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={{ scheme: "nivo" }}
            {...commonProps}
          />
        );
      case "scatter":
        return (
          <ResponsiveScatterPlot
            data={[
              {
                id: "Series",
                data: chartData.labels.map((_, i) => ({
                  x: i + 1,
                  y: chartData.values[i] || 0,
                })),
              },
            ]}
            margin={{ top: 30, right: 30, bottom: 50, left: 60 }}
            xScale={{ type: "linear", min: 0, max: "auto" }}
            yScale={{ type: "linear", min: 0, max: "auto" }}
            colors={{ scheme: "nivo" }}
            {...commonProps}
          />
        );
      case "radar":
        return (
          <ResponsiveRadar
            data={chartData.labels.map((label, i) => ({
              label,
              value: chartData.values[i] || 0,
            }))}
            keys={["value"]}
            indexBy="label"
            margin={{ top: 40, right: 60, bottom: 40, left: 60 }}
            colors={{ scheme: "nivo" }}
            {...commonProps}
          />
        );
      case "funnel":
        return (
          <ResponsiveFunnel
            data={chartData.labels.map((label, i) => ({
              id: label,
              label,
              value: chartData.values[i] || 0,
            }))}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            colors={{ scheme: "nivo" }}
            {...commonProps}
          />
        );
      case "treemap":
        return (
          <ResponsiveTreeMap
            data={{
              name: "root",
              children: chartData.labels.map((label, i) => ({
                name: label,
                value: chartData.values[i] || 0,
              })),
            }}
            identity="name"
            value="value"
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            colors={{ scheme: "nivo" }}
            {...commonProps}
          />
        );
      case "sunburst":
        return (
          <ResponsiveSunburst
            data={{
              name: "root",
              children: chartData.labels.map((label, i) => ({
                name: label,
                value: chartData.values[i] || 0,
              })),
            }}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            colors={{ scheme: "nivo" }}
            {...commonProps}
          />
        );
      case "waffle":
        return (
          <ResponsiveWaffle
            total={chartData.values.reduce((a, b) => a + b, 0)}
            data={chartData.labels.map((label, i) => ({
              id: label,
              label,
              value: chartData.values[i] || 0,
            }))}
            rows={10}
            columns={10}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            colors={{ scheme: "nivo" }}
            {...commonProps}
          />
        );
      case "stream":
        return (
          <ResponsiveStream
            data={chartData.labels.map((_, i) => ({
              "Series A": chartData.values[i] || 0,
              "Series B": (chartData.values[i] || 0) * 0.7,
            }))}
            keys={["Series A", "Series B"]}
            margin={{ top: 30, right: 30, bottom: 50, left: 60 }}
            colors={{ scheme: "nivo" }}
            {...commonProps}
          />
        );
      case "bump":
        return (
          <ResponsiveBump
            data={[
              {
                id: "Series A",
                data: chartData.labels.map((label, i) => ({
                  x: label,
                  y: i + 1,
                })),
              },
              {
                id: "Series B",
                data: chartData.labels.map((label, i) => ({
                  x: label,
                  y: chartData.labels.length - i,
                })),
              },
            ]}
            margin={{ top: 30, right: 100, bottom: 50, left: 60 }}
            colors={{ scheme: "nivo" }}
            {...commonProps}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>Chart preview for {selectedType}</p>
              <p className="text-xs mt-1">Add data to your sheet to see a preview</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[900px] max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Insert Chart</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex">
          {/* Chart type selector */}
          <div className="w-48 border-r border-gray-200 p-3 max-h-[60vh] overflow-y-auto">
            <p className="text-xs font-medium text-gray-500 uppercase mb-2">Chart Types</p>
            {CHART_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm capitalize mb-0.5 ${
                  selectedType === type
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {type.replace("-", " ")}
              </button>
            ))}
          </div>

          {/* Chart preview */}
          <div className="flex-1 p-6">
            <div className="h-[400px] bg-gray-50 rounded-xl border border-gray-100 p-2">
              {renderChart()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onInsert?.({ type: selectedType, data: chartData });
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Insert Chart
          </button>
        </div>
      </div>
    </div>
  );
}
