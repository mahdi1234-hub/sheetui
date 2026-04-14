"use client";

import { useState, useCallback } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { ResponsiveRadar } from "@nivo/radar";
import { ResponsiveFunnel } from "@nivo/funnel";
import { ResponsiveTreeMap } from "@nivo/treemap";
import { ResponsiveSunburst } from "@nivo/sunburst";
import { ResponsiveStream } from "@nivo/stream";
import { ResponsiveBump } from "@nivo/bump";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import { ResponsiveSwarmPlot } from "@nivo/swarmplot";
import { ResponsiveWaffle } from "@nivo/waffle";
import { ResponsiveCalendar } from "@nivo/calendar";
import { ResponsiveSankey } from "@nivo/sankey";
import { ResponsiveNetwork } from "@nivo/network";
import {
  Table2,
  GripVertical,
  Maximize2,
  Minimize2,
  ArrowLeft,
  BarChart3,
} from "lucide-react";

// Sample data
const barData = [
  { quarter: "Q1", "Product A": 45200, "Product B": 32100, "Product C": 18500 },
  { quarter: "Q2", "Product A": 52800, "Product B": 38400, "Product C": 22100 },
  { quarter: "Q3", "Product A": 61300, "Product B": 41200, "Product C": 25800 },
  { quarter: "Q4", "Product A": 58900, "Product B": 45600, "Product C": 29300 },
];

const lineData = [
  {
    id: "Revenue",
    data: [
      { x: "Jan", y: 32000 }, { x: "Feb", y: 35000 }, { x: "Mar", y: 40000 },
      { x: "Apr", y: 38000 }, { x: "May", y: 44000 }, { x: "Jun", y: 50000 },
      { x: "Jul", y: 48000 }, { x: "Aug", y: 52000 }, { x: "Sep", y: 58000 },
      { x: "Oct", y: 55000 }, { x: "Nov", y: 62000 }, { x: "Dec", y: 68000 },
    ],
  },
  {
    id: "Expenses",
    data: [
      { x: "Jan", y: 22000 }, { x: "Feb", y: 24000 }, { x: "Mar", y: 26000 },
      { x: "Apr", y: 25000 }, { x: "May", y: 28000 }, { x: "Jun", y: 32000 },
      { x: "Jul", y: 30000 }, { x: "Aug", y: 33000 }, { x: "Sep", y: 36000 },
      { x: "Oct", y: 34000 }, { x: "Nov", y: 38000 }, { x: "Dec", y: 42000 },
    ],
  },
];

const pieData = [
  { id: "Product A", label: "Product A", value: 218200 },
  { id: "Product B", label: "Product B", value: 157300 },
  { id: "Product C", label: "Product C", value: 95700 },
  { id: "Services", label: "Services", value: 64000 },
  { id: "Other", label: "Other", value: 23800 },
];

const radarData = [
  { metric: "Sales", "This Year": 95, "Last Year": 78 },
  { metric: "Marketing", "This Year": 82, "Last Year": 70 },
  { metric: "Support", "This Year": 88, "Last Year": 85 },
  { metric: "Development", "This Year": 92, "Last Year": 75 },
  { metric: "Operations", "This Year": 78, "Last Year": 80 },
  { metric: "Finance", "This Year": 85, "Last Year": 72 },
];

const funnelData = [
  { id: "Visitors", label: "Visitors", value: 12000 },
  { id: "Leads", label: "Leads", value: 8500 },
  { id: "Qualified", label: "Qualified", value: 4200 },
  { id: "Proposals", label: "Proposals", value: 2100 },
  { id: "Closed", label: "Closed Won", value: 950 },
];

const treeData = {
  name: "Revenue",
  children: [
    {
      name: "North America",
      children: [
        { name: "US East", value: 85000 },
        { name: "US West", value: 72000 },
        { name: "Canada", value: 31000 },
      ],
    },
    {
      name: "Europe",
      children: [
        { name: "UK", value: 45000 },
        { name: "Germany", value: 38000 },
        { name: "France", value: 29000 },
      ],
    },
    {
      name: "Asia",
      children: [
        { name: "Japan", value: 52000 },
        { name: "China", value: 48000 },
        { name: "India", value: 24000 },
      ],
    },
  ],
};

const heatmapData = [
  { id: "Mon", data: [{ x: "9AM", y: 12 }, { x: "10AM", y: 25 }, { x: "11AM", y: 38 }, { x: "12PM", y: 45 }, { x: "1PM", y: 32 }, { x: "2PM", y: 28 }, { x: "3PM", y: 35 }, { x: "4PM", y: 22 }] },
  { id: "Tue", data: [{ x: "9AM", y: 18 }, { x: "10AM", y: 30 }, { x: "11AM", y: 42 }, { x: "12PM", y: 50 }, { x: "1PM", y: 38 }, { x: "2PM", y: 33 }, { x: "3PM", y: 40 }, { x: "4PM", y: 28 }] },
  { id: "Wed", data: [{ x: "9AM", y: 15 }, { x: "10AM", y: 28 }, { x: "11AM", y: 35 }, { x: "12PM", y: 42 }, { x: "1PM", y: 30 }, { x: "2PM", y: 25 }, { x: "3PM", y: 32 }, { x: "4PM", y: 20 }] },
  { id: "Thu", data: [{ x: "9AM", y: 20 }, { x: "10AM", y: 35 }, { x: "11AM", y: 48 }, { x: "12PM", y: 55 }, { x: "1PM", y: 42 }, { x: "2PM", y: 38 }, { x: "3PM", y: 45 }, { x: "4PM", y: 30 }] },
  { id: "Fri", data: [{ x: "9AM", y: 10 }, { x: "10AM", y: 22 }, { x: "11AM", y: 30 }, { x: "12PM", y: 35 }, { x: "1PM", y: 25 }, { x: "2PM", y: 20 }, { x: "3PM", y: 28 }, { x: "4PM", y: 15 }] },
];

const streamData = Array.from({ length: 12 }, () => ({
  Marketing: Math.floor(Math.random() * 30 + 20),
  Sales: Math.floor(Math.random() * 40 + 30),
  Support: Math.floor(Math.random() * 20 + 10),
  Engineering: Math.floor(Math.random() * 35 + 25),
}));

const bumpData = [
  { id: "Product A", data: [{ x: "Q1", y: 1 }, { x: "Q2", y: 1 }, { x: "Q3", y: 1 }, { x: "Q4", y: 2 }] },
  { id: "Product B", data: [{ x: "Q1", y: 2 }, { x: "Q2", y: 3 }, { x: "Q3", y: 2 }, { x: "Q4", y: 1 }] },
  { id: "Product C", data: [{ x: "Q1", y: 3 }, { x: "Q2", y: 2 }, { x: "Q3", y: 3 }, { x: "Q4", y: 3 }] },
];

const calendarData = Array.from({ length: 365 }, (_, i) => {
  const date = new Date(2024, 0, 1 + i);
  return {
    value: Math.floor(Math.random() * 100),
    day: date.toISOString().split("T")[0],
  };
}).filter((d) => d.day.startsWith("2024"));

const scatterData = [
  {
    id: "Team A",
    data: Array.from({ length: 20 }, () => ({
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
    })),
  },
  {
    id: "Team B",
    data: Array.from({ length: 20 }, () => ({
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
    })),
  },
];

const circlePackData = {
  name: "root",
  children: [
    { name: "Engineering", value: 450, children: [{ name: "Frontend", value: 200 }, { name: "Backend", value: 180 }, { name: "DevOps", value: 70 }] },
    { name: "Sales", value: 320, children: [{ name: "Enterprise", value: 180 }, { name: "SMB", value: 140 }] },
    { name: "Marketing", value: 280, children: [{ name: "Digital", value: 160 }, { name: "Content", value: 120 }] },
    { name: "Support", value: 200, children: [{ name: "Tier 1", value: 120 }, { name: "Tier 2", value: 80 }] },
  ],
};

const waffleData = [
  { id: "Completed", label: "Completed", value: 68 },
  { id: "In Progress", label: "In Progress", value: 18 },
  { id: "Pending", label: "Pending", value: 14 },
];

const sankeyData = {
  nodes: [
    { id: "Website" }, { id: "Social" }, { id: "Email" }, { id: "Direct" },
    { id: "Leads" }, { id: "Qualified" },
    { id: "Won" }, { id: "Lost" },
  ],
  links: [
    { source: "Website", target: "Leads", value: 40 },
    { source: "Social", target: "Leads", value: 25 },
    { source: "Email", target: "Leads", value: 20 },
    { source: "Direct", target: "Leads", value: 15 },
    { source: "Leads", target: "Qualified", value: 60 },
    { source: "Leads", target: "Lost", value: 40 },
    { source: "Qualified", target: "Won", value: 35 },
    { source: "Qualified", target: "Lost", value: 25 },
  ],
};

const networkData = {
  nodes: [
    { id: "Hub", radius: 12 },
    { id: "A", radius: 8 }, { id: "B", radius: 8 }, { id: "C", radius: 8 },
    { id: "D", radius: 6 }, { id: "E", radius: 6 }, { id: "F", radius: 6 },
  ],
  links: [
    { source: "Hub", target: "A", distance: 50 },
    { source: "Hub", target: "B", distance: 50 },
    { source: "Hub", target: "C", distance: 50 },
    { source: "A", target: "D", distance: 40 },
    { source: "B", target: "E", distance: 40 },
    { source: "C", target: "F", distance: 40 },
  ],
};

const swarmData = [
  ...Array.from({ length: 30 }, (_, i) => ({ id: `a${i}`, group: "Sales", value: Math.random() * 100 })),
  ...Array.from({ length: 30 }, (_, i) => ({ id: `b${i}`, group: "Marketing", value: Math.random() * 100 })),
  ...Array.from({ length: 30 }, (_, i) => ({ id: `c${i}`, group: "Engineering", value: Math.random() * 100 })),
];

interface ChartWidget {
  id: string;
  title: string;
  type: string;
  size: "small" | "medium" | "large";
}

const defaultWidgets: ChartWidget[] = [
  { id: "bar", title: "Revenue by Quarter", type: "bar", size: "medium" },
  { id: "line", title: "Revenue vs Expenses", type: "line", size: "medium" },
  { id: "pie", title: "Revenue Distribution", type: "pie", size: "small" },
  { id: "radar", title: "Performance Metrics", type: "radar", size: "small" },
  { id: "heatmap", title: "Activity Heatmap", type: "heatmap", size: "medium" },
  { id: "funnel", title: "Sales Funnel", type: "funnel", size: "small" },
  { id: "treemap", title: "Revenue by Region", type: "treemap", size: "medium" },
  { id: "sunburst", title: "Revenue Breakdown", type: "sunburst", size: "small" },
  { id: "stream", title: "Team Activity Stream", type: "stream", size: "medium" },
  { id: "bump", title: "Product Rankings", type: "bump", size: "medium" },
  { id: "scatter", title: "Performance Scatter", type: "scatter", size: "small" },
  { id: "calendar", title: "Daily Activity", type: "calendar", size: "large" },
  { id: "circle", title: "Team Distribution", type: "circle-packing", size: "small" },
  { id: "waffle", title: "Task Completion", type: "waffle", size: "small" },
  { id: "sankey", title: "Lead Flow", type: "sankey", size: "medium" },
  { id: "network", title: "Team Network", type: "network", size: "small" },
  { id: "swarmplot", title: "Score Distribution", type: "swarmplot", size: "medium" },
];

function renderChart(type: string) {
  const commonColors = { scheme: "nivo" as const };

  switch (type) {
    case "bar":
      return (
        <ResponsiveBar
          data={barData}
          keys={["Product A", "Product B", "Product C"]}
          indexBy="quarter"
          margin={{ top: 20, right: 100, bottom: 40, left: 60 }}
          padding={0.3}
          groupMode="grouped"
          colors={commonColors}
          enableLabel={false}
          legends={[{ dataFrom: "keys", anchor: "bottom-right", direction: "column", translateX: 100, itemWidth: 80, itemHeight: 20, symbolSize: 12 }]}
        />
      );
    case "line":
      return (
        <ResponsiveLine
          data={lineData}
          margin={{ top: 20, right: 100, bottom: 40, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: "auto", max: "auto" }}
          pointSize={6}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          enableArea
          areaOpacity={0.1}
          legends={[{ anchor: "bottom-right", direction: "column", translateX: 100, itemWidth: 80, itemHeight: 20, symbolSize: 12 }]}
        />
      );
    case "pie":
      return (
        <ResponsivePie
          data={pieData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={commonColors}
          arcLinkLabelsTextColor="#333"
          arcLinkLabelsThickness={2}
        />
      );
    case "scatter":
      return (
        <ResponsiveScatterPlot
          data={scatterData}
          margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
          xScale={{ type: "linear", min: 0, max: 100 }}
          yScale={{ type: "linear", min: 0, max: 100 }}
          nodeSize={8}
          colors={commonColors}
        />
      );
    case "heatmap":
      return (
        <ResponsiveHeatMap
          data={heatmapData}
          margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
          colors={{ type: "sequential", scheme: "blues" }}
        />
      );
    case "radar":
      return (
        <ResponsiveRadar
          data={radarData}
          keys={["This Year", "Last Year"]}
          indexBy="metric"
          margin={{ top: 30, right: 60, bottom: 30, left: 60 }}
          colors={commonColors}
          fillOpacity={0.25}
          dotSize={8}
        />
      );
    case "funnel":
      return (
        <ResponsiveFunnel
          data={funnelData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          colors={commonColors}
          borderWidth={20}
          labelColor={{ from: "color", modifiers: [["darker", 3]] }}
        />
      );
    case "treemap":
      return (
        <ResponsiveTreeMap
          data={treeData}
          identity="name"
          value="value"
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          colors={commonColors}
          labelSkipSize={12}
          parentLabelSize={16}
        />
      );
    case "sunburst":
      return (
        <ResponsiveSunburst
          data={treeData}
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          colors={commonColors}
          childColor={{ from: "color", modifiers: [["brighter", 0.4]] }}
          enableArcLabels
          arcLabelsSkipAngle={10}
        />
      );
    case "stream":
      return (
        <ResponsiveStream
          data={streamData}
          keys={["Marketing", "Sales", "Support", "Engineering"]}
          margin={{ top: 20, right: 100, bottom: 40, left: 50 }}
          colors={commonColors}
          legends={[{ anchor: "bottom-right", direction: "column", translateX: 100, itemWidth: 80, itemHeight: 20, symbolSize: 12 }]}
        />
      );
    case "bump":
      return (
        <ResponsiveBump
          data={bumpData}
          margin={{ top: 20, right: 100, bottom: 40, left: 50 }}
          colors={commonColors}
          lineWidth={3}
          activeLineWidth={6}
          pointSize={10}
        />
      );
    case "calendar":
      return (
        <ResponsiveCalendar
          data={calendarData}
          from="2024-01-01"
          to="2024-12-31"
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          colors={["#d6e685", "#8cc665", "#44a340", "#1e6823"]}
          emptyColor="#eeeeee"
          yearSpacing={40}
          monthBorderColor="#ffffff"
          dayBorderWidth={2}
          dayBorderColor="#ffffff"
        />
      );
    case "circle-packing":
      return (
        <ResponsiveCirclePacking
          data={circlePackData}
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          colors={commonColors}
          childColor={{ from: "color", modifiers: [["brighter", 0.4]] }}
          padding={4}
          enableLabels
          labelsSkipRadius={10}
        />
      );
    case "waffle":
      return (
        <ResponsiveWaffle
          total={100}
          data={waffleData}
          rows={10}
          columns={10}
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          colors={commonColors}
          legends={[{ anchor: "bottom", direction: "row", translateY: -10, itemWidth: 100, itemHeight: 20, symbolSize: 12 }]}
        />
      );
    case "sankey":
      return (
        <ResponsiveSankey
          data={sankeyData}
          margin={{ top: 20, right: 120, bottom: 20, left: 20 }}
          colors={commonColors}
          nodeOpacity={1}
          nodeThickness={18}
          linkOpacity={0.5}
          enableLinkGradient
        />
      );
    case "network":
      return (
        <ResponsiveNetwork
          data={networkData}
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          repulsivity={50}
          iterations={60}
          nodeColor={(n: { id: string }) => (n.id === "Hub" ? "#2563eb" : "#93c5fd")}
          linkThickness={2}
        />
      );
    case "swarmplot":
      return (
        <ResponsiveSwarmPlot
          data={swarmData}
          groups={["Sales", "Marketing", "Engineering"]}
          value="value"
          valueScale={{ type: "linear", min: 0, max: 100 }}
          margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
          size={6}
          colors={commonColors}
        />
      );
    default:
      return <div className="flex items-center justify-center h-full text-gray-400">Unknown chart type</div>;
  }
}

export default function ChartDashboard() {
  const [widgets, setWidgets] = useState<ChartWidget[]>(defaultWidgets);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleDragStart = useCallback((id: string) => {
    setDraggedId(id);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;
  }, [draggedId]);

  const handleDrop = useCallback((targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    setWidgets((prev) => {
      const items = [...prev];
      const dragIndex = items.findIndex((w) => w.id === draggedId);
      const dropIndex = items.findIndex((w) => w.id === targetId);
      const [dragged] = items.splice(dragIndex, 1);
      items.splice(dropIndex, 0, dragged);
      return items;
    });
    setDraggedId(null);
  }, [draggedId]);

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "small": return "col-span-1";
      case "medium": return "col-span-1 lg:col-span-2";
      case "large": return "col-span-1 lg:col-span-3";
      default: return "col-span-1";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Table2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">SheetUI</span>
              </a>
              <span className="text-gray-300">|</span>
              <span className="text-sm font-medium text-gray-600">Chart Dashboard Demo</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/demo"
                className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Spreadsheet
              </a>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                {widgets.length} Charts
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Info bar */}
      <div className="bg-blue-50 border-b border-blue-100 px-4 py-2">
        <div className="max-w-[1600px] mx-auto flex items-center gap-2 text-sm text-blue-700">
          <BarChart3 className="w-4 h-4" />
          <span>Drag and drop charts to rearrange. All {widgets.length} Nivo chart types are displayed with sample data.</span>
        </div>
      </div>

      {/* Dashboard Grid */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {expandedId ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="font-medium text-gray-900">
                {widgets.find((w) => w.id === expandedId)?.title}
              </h3>
              <button
                onClick={() => setExpandedId(null)}
                className="p-1.5 rounded hover:bg-gray-100"
              >
                <Minimize2 className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="h-[70vh] p-4">
              {renderChart(widgets.find((w) => w.id === expandedId)?.type || "bar")}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className={`chart-widget ${getSizeClasses(widget.size)} ${
                  draggedId === widget.id ? "dragging" : ""
                }`}
                draggable
                onDragStart={() => handleDragStart(widget.id)}
                onDragOver={(e) => handleDragOver(e, widget.id)}
                onDrop={() => handleDrop(widget.id)}
                onDragEnd={() => setDraggedId(null)}
              >
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-3.5 h-3.5 text-gray-300 cursor-grab" />
                    <h3 className="text-xs font-medium text-gray-700">{widget.title}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                      {widget.type}
                    </span>
                    <button
                      onClick={() => setExpandedId(widget.id)}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <Maximize2 className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </div>
                <div className={`${widget.type === "calendar" ? "h-48" : "h-64"} p-2`}>
                  {renderChart(widget.type)}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
