"use client";

import { useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveRadar } from "@nivo/radar";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { ResponsiveSankey } from "@nivo/sankey";
import { ResponsiveNetwork } from "@nivo/network";
import { ResponsiveTreeMap } from "@nivo/treemap";
import { ResponsiveFunnel } from "@nivo/funnel";
import { ResponsiveStream } from "@nivo/stream";
import { ResponsiveBump } from "@nivo/bump";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import { ResponsiveWaffle } from "@nivo/waffle";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import { ResponsiveSunburst } from "@nivo/sunburst";
import { ResponsiveCalendar } from "@nivo/calendar";
import { ResponsiveSwarmPlot } from "@nivo/swarmplot";
import {
  Table2,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Activity,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";

// =============================================
// UNIFIED DATA: SaaS Company Analytics
// =============================================
const REVENUE = { q1: 95800, q2: 113300, q3: 128300, q4: 133800 };
const TOTAL_REVENUE = Object.values(REVENUE).reduce((a, b) => a + b, 0);
const MRR = 44600;
const CUSTOMERS = 1247;
const CHURN_RATE = 3.2;
const GROWTH_RATE = 18.5;

// KPI Cards
const kpis = [
  { label: "Total Revenue", value: `$${(TOTAL_REVENUE / 1000).toFixed(0)}K`, change: "+18.5%", up: true, icon: DollarSign, color: "blue" },
  { label: "Monthly MRR", value: `$${(MRR / 1000).toFixed(1)}K`, change: "+12.3%", up: true, icon: TrendingUp, color: "green" },
  { label: "Active Customers", value: CUSTOMERS.toLocaleString(), change: "+156", up: true, icon: Users, color: "purple" },
  { label: "Churn Rate", value: `${CHURN_RATE}%`, change: "-0.8%", up: false, icon: Activity, color: "orange" },
];

// Revenue by Product (Bar)
const revenueByProduct = [
  { quarter: "Q1", Enterprise: 52000, Pro: 28000, Starter: 15800 },
  { quarter: "Q2", Enterprise: 61000, Pro: 33500, Starter: 18800 },
  { quarter: "Q3", Enterprise: 68000, Pro: 38200, Starter: 22100 },
  { quarter: "Q4", Enterprise: 72000, Pro: 39500, Starter: 22300 },
];

// MRR Growth (Line)
const mrrGrowth = [
  {
    id: "MRR",
    data: [
      { x: "Jan", y: 28400 }, { x: "Feb", y: 30100 }, { x: "Mar", y: 32800 },
      { x: "Apr", y: 34500 }, { x: "May", y: 36200 }, { x: "Jun", y: 38100 },
      { x: "Jul", y: 39800 }, { x: "Aug", y: 41200 }, { x: "Sep", y: 42500 },
      { x: "Oct", y: 43200 }, { x: "Nov", y: 43900 }, { x: "Dec", y: 44600 },
    ],
  },
  {
    id: "Expenses",
    data: [
      { x: "Jan", y: 18000 }, { x: "Feb", y: 18500 }, { x: "Mar", y: 19200 },
      { x: "Apr", y: 19800 }, { x: "May", y: 20500 }, { x: "Jun", y: 21000 },
      { x: "Jul", y: 21800 }, { x: "Aug", y: 22200 }, { x: "Sep", y: 22800 },
      { x: "Oct", y: 23100 }, { x: "Nov", y: 23500 }, { x: "Dec", y: 24000 },
    ],
  },
];

// Customer Segments (Pie)
const customerSegments = [
  { id: "Enterprise", label: "Enterprise", value: 312 },
  { id: "Pro", label: "Pro", value: 485 },
  { id: "Starter", label: "Starter", value: 350 },
  { id: "Free Trial", label: "Free Trial", value: 100 },
];

// Team Performance (Radar)
const teamPerformance = [
  { metric: "Revenue", Sales: 92, Marketing: 68, Product: 75, Support: 60, Engineering: 45 },
  { metric: "NPS", Sales: 78, Marketing: 82, Product: 88, Support: 95, Engineering: 70 },
  { metric: "Velocity", Sales: 85, Marketing: 72, Product: 90, Support: 65, Engineering: 95 },
  { metric: "Retention", Sales: 70, Marketing: 60, Product: 85, Support: 88, Engineering: 80 },
  { metric: "Growth", Sales: 88, Marketing: 90, Product: 78, Support: 55, Engineering: 72 },
  { metric: "Efficiency", Sales: 75, Marketing: 78, Product: 82, Support: 90, Engineering: 88 },
];

// Usage Heatmap
const usageHeatmap = [
  { id: "Mon", data: [{ x: "6AM", y: 5 }, { x: "9AM", y: 45 }, { x: "12PM", y: 72 }, { x: "3PM", y: 68 }, { x: "6PM", y: 35 }, { x: "9PM", y: 12 }] },
  { id: "Tue", data: [{ x: "6AM", y: 8 }, { x: "9AM", y: 52 }, { x: "12PM", y: 78 }, { x: "3PM", y: 74 }, { x: "6PM", y: 42 }, { x: "9PM", y: 15 }] },
  { id: "Wed", data: [{ x: "6AM", y: 6 }, { x: "9AM", y: 48 }, { x: "12PM", y: 80 }, { x: "3PM", y: 76 }, { x: "6PM", y: 38 }, { x: "9PM", y: 18 }] },
  { id: "Thu", data: [{ x: "6AM", y: 10 }, { x: "9AM", y: 55 }, { x: "12PM", y: 85 }, { x: "3PM", y: 82 }, { x: "6PM", y: 45 }, { x: "9PM", y: 20 }] },
  { id: "Fri", data: [{ x: "6AM", y: 4 }, { x: "9AM", y: 40 }, { x: "12PM", y: 65 }, { x: "3PM", y: 58 }, { x: "6PM", y: 25 }, { x: "9PM", y: 8 }] },
];

// Sales Funnel
const salesFunnel = [
  { id: "Website Visitors", label: "Website Visitors", value: 48000 },
  { id: "Signups", label: "Signups", value: 12000 },
  { id: "Active Trials", label: "Active Trials", value: 5200 },
  { id: "Paid Conversion", label: "Paid Conversion", value: 1800 },
  { id: "Enterprise Upsell", label: "Enterprise Upsell", value: 420 },
];

// Customer Journey Sankey
const customerJourney = {
  nodes: [
    { id: "Organic" }, { id: "Paid Ads" }, { id: "Referral" }, { id: "Social" },
    { id: "Free Trial" }, { id: "Direct Buy" },
    { id: "Starter" }, { id: "Pro" }, { id: "Enterprise" },
    { id: "Churned" }, { id: "Retained" },
  ],
  links: [
    { source: "Organic", target: "Free Trial", value: 3500 },
    { source: "Paid Ads", target: "Free Trial", value: 2800 },
    { source: "Referral", target: "Free Trial", value: 1500 },
    { source: "Social", target: "Free Trial", value: 900 },
    { source: "Organic", target: "Direct Buy", value: 800 },
    { source: "Paid Ads", target: "Direct Buy", value: 500 },
    { source: "Free Trial", target: "Starter", value: 3200 },
    { source: "Free Trial", target: "Pro", value: 2100 },
    { source: "Free Trial", target: "Churned", value: 3400 },
    { source: "Direct Buy", target: "Pro", value: 600 },
    { source: "Direct Buy", target: "Enterprise", value: 700 },
    { source: "Starter", target: "Pro", value: 800 },
    { source: "Starter", target: "Churned", value: 400 },
    { source: "Pro", target: "Enterprise", value: 500 },
    { source: "Pro", target: "Retained", value: 2200 },
    { source: "Enterprise", target: "Retained", value: 1100 },
    { source: "Starter", target: "Retained", value: 2000 },
  ],
};

// Infrastructure Network
const infraNetwork = {
  nodes: [
    { id: "API Gateway", radius: 16 },
    { id: "Auth Service", radius: 10 },
    { id: "User Service", radius: 10 },
    { id: "Billing Service", radius: 10 },
    { id: "Analytics", radius: 10 },
    { id: "Notification", radius: 8 },
    { id: "PostgreSQL", radius: 12 },
    { id: "Redis", radius: 10 },
    { id: "S3 Storage", radius: 8 },
    { id: "CDN", radius: 8 },
    { id: "ML Pipeline", radius: 10 },
    { id: "Queue", radius: 8 },
  ],
  links: [
    { source: "API Gateway", target: "Auth Service", distance: 60 },
    { source: "API Gateway", target: "User Service", distance: 60 },
    { source: "API Gateway", target: "Billing Service", distance: 60 },
    { source: "API Gateway", target: "Analytics", distance: 60 },
    { source: "API Gateway", target: "CDN", distance: 70 },
    { source: "User Service", target: "PostgreSQL", distance: 50 },
    { source: "Billing Service", target: "PostgreSQL", distance: 50 },
    { source: "Auth Service", target: "Redis", distance: 50 },
    { source: "Analytics", target: "PostgreSQL", distance: 50 },
    { source: "Analytics", target: "ML Pipeline", distance: 50 },
    { source: "Notification", target: "Queue", distance: 40 },
    { source: "User Service", target: "Notification", distance: 50 },
    { source: "Billing Service", target: "Notification", distance: 50 },
    { source: "User Service", target: "S3 Storage", distance: 50 },
    { source: "ML Pipeline", target: "S3 Storage", distance: 40 },
  ],
};

// Revenue Breakdown (TreeMap)
const revenueTree = {
  name: "Revenue",
  children: [
    { name: "North America", children: [
      { name: "US", value: 185000 }, { name: "Canada", value: 42000 }, { name: "Mexico", value: 12000 },
    ]},
    { name: "Europe", children: [
      { name: "UK", value: 68000 }, { name: "Germany", value: 52000 }, { name: "France", value: 38000 }, { name: "Others", value: 28000 },
    ]},
    { name: "Asia Pacific", children: [
      { name: "Japan", value: 32000 }, { name: "Australia", value: 22000 }, { name: "India", value: 18000 },
    ]},
  ],
};

// Feature Usage (Stream)
const featureUsage = Array.from({ length: 12 }, () => ({
  Spreadsheet: Math.floor(Math.random() * 40 + 60),
  Charts: Math.floor(Math.random() * 30 + 30),
  "AI Chat": Math.floor(Math.random() * 25 + 20),
  "Import/Export": Math.floor(Math.random() * 20 + 15),
  Collaboration: Math.floor(Math.random() * 15 + 10),
}));

// Product Ranking (Bump)
const productRanking = [
  { id: "Sheets", data: [{ x: "Jan", y: 1 }, { x: "Mar", y: 1 }, { x: "Jun", y: 1 }, { x: "Sep", y: 1 }, { x: "Dec", y: 1 }] },
  { id: "Charts", data: [{ x: "Jan", y: 3 }, { x: "Mar", y: 2 }, { x: "Jun", y: 2 }, { x: "Sep", y: 2 }, { x: "Dec", y: 2 }] },
  { id: "AI Chat", data: [{ x: "Jan", y: 4 }, { x: "Mar", y: 4 }, { x: "Jun", y: 3 }, { x: "Sep", y: 3 }, { x: "Dec", y: 3 }] },
  { id: "Collab", data: [{ x: "Jan", y: 2 }, { x: "Mar", y: 3 }, { x: "Jun", y: 4 }, { x: "Sep", y: 4 }, { x: "Dec", y: 4 }] },
];

// Org structure (Circle Packing)
const orgStructure = {
  name: "SheetUI",
  children: [
    { name: "Engineering", children: [
      { name: "Frontend", value: 8 }, { name: "Backend", value: 6 }, { name: "DevOps", value: 3 }, { name: "QA", value: 4 },
    ]},
    { name: "Product", children: [
      { name: "Design", value: 4 }, { name: "PM", value: 3 }, { name: "Research", value: 2 },
    ]},
    { name: "Go-to-Market", children: [
      { name: "Sales", value: 8 }, { name: "Marketing", value: 5 }, { name: "SDR", value: 6 },
    ]},
    { name: "Operations", children: [
      { name: "Support", value: 5 }, { name: "Finance", value: 3 }, { name: "HR", value: 2 },
    ]},
  ],
};

// Task completion (Waffle)
const taskCompletion = [
  { id: "Done", label: "Done", value: 72 },
  { id: "In Progress", label: "In Progress", value: 18 },
  { id: "Blocked", label: "Blocked", value: 10 },
];

// Performance scatter
const performanceScatter = [
  { id: "Enterprise", data: Array.from({ length: 15 }, () => ({ x: Math.floor(Math.random() * 50 + 50), y: Math.floor(Math.random() * 40 + 60) })) },
  { id: "Pro", data: Array.from({ length: 20 }, () => ({ x: Math.floor(Math.random() * 60 + 20), y: Math.floor(Math.random() * 50 + 30) })) },
  { id: "Starter", data: Array.from({ length: 25 }, () => ({ x: Math.floor(Math.random() * 40 + 10), y: Math.floor(Math.random() * 40 + 10) })) },
];

// Activity calendar
const activityCalendar = Array.from({ length: 365 }, (_, i) => {
  const date = new Date(2024, 0, 1 + i);
  return { value: Math.floor(Math.random() * 300 + 50), day: date.toISOString().split("T")[0] };
}).filter((d) => d.day.startsWith("2024"));

// Swarm data
const npsScores = [
  ...Array.from({ length: 40 }, (_, i) => ({ id: `e${i}`, group: "Enterprise", value: Math.floor(Math.random() * 30 + 70) })),
  ...Array.from({ length: 40 }, (_, i) => ({ id: `p${i}`, group: "Pro", value: Math.floor(Math.random() * 40 + 50) })),
  ...Array.from({ length: 40 }, (_, i) => ({ id: `s${i}`, group: "Starter", value: Math.floor(Math.random() * 50 + 30) })),
];

// =============================================
// COMPONENT
// =============================================
export default function AnalyticsDashboard() {
  const [expandedChart, setExpandedChart] = useState<string | null>(null);

  const ChartCard = ({ id, title, subtitle, children, height = "h-72" }: {
    id: string; title: string; subtitle?: string; children: React.ReactNode; height?: string;
  }) => (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${expandedChart === id ? "fixed inset-4 z-50" : ""}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        <button
          onClick={() => setExpandedChart(expandedChart === id ? null : id)}
          className="p-1 rounded hover:bg-gray-100"
        >
          {expandedChart === id ? <Minimize2 className="w-4 h-4 text-gray-400" /> : <Maximize2 className="w-4 h-4 text-gray-400" />}
        </button>
      </div>
      <div className={expandedChart === id ? "h-[calc(100%-52px)]" : height}>
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {expandedChart && <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setExpandedChart(null)} />}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Table2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">SheetUI</span>
            </a>
            <span className="text-gray-300">|</span>
            <span className="text-sm font-medium text-gray-600">Analytics Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/demo" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" /> Spreadsheet
            </a>
            <a href="/demo/dashboard" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Chart Gallery
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{kpi.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  kpi.color === "blue" ? "bg-blue-50" : kpi.color === "green" ? "bg-green-50" : kpi.color === "purple" ? "bg-purple-50" : "bg-orange-50"
                }`}>
                  <kpi.icon className={`w-4 h-4 ${
                    kpi.color === "blue" ? "text-blue-600" : kpi.color === "green" ? "text-green-600" : kpi.color === "purple" ? "text-purple-600" : "text-orange-600"
                  }`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${kpi.up ? "text-green-600" : "text-orange-600"}`}>
                {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpi.change}
              </div>
            </div>
          ))}
        </div>

        {/* Row 1: Revenue + MRR */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard id="revenue-bar" title="Revenue by Product" subtitle="Quarterly breakdown by plan tier">
            <ResponsiveBar
              data={revenueByProduct}
              keys={["Enterprise", "Pro", "Starter"]}
              indexBy="quarter"
              margin={{ top: 20, right: 110, bottom: 40, left: 60 }}
              padding={0.3}
              groupMode="grouped"
              colors={{ scheme: "nivo" }}
              enableLabel={false}
              axisLeft={{ format: (v: number) => `$${v / 1000}K` }}
              legends={[{ dataFrom: "keys", anchor: "bottom-right", direction: "column", translateX: 110, itemWidth: 80, itemHeight: 20, symbolSize: 12 }]}
            />
          </ChartCard>

          <ChartCard id="mrr-line" title="MRR Growth Trend" subtitle="Monthly recurring revenue vs expenses">
            <ResponsiveLine
              data={mrrGrowth}
              margin={{ top: 20, right: 110, bottom: 40, left: 60 }}
              xScale={{ type: "point" }}
              yScale={{ type: "linear", min: "auto", max: "auto" }}
              pointSize={6}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              enableArea
              areaOpacity={0.08}
              axisLeft={{ format: (v: number) => `$${v / 1000}K` }}
              legends={[{ anchor: "bottom-right", direction: "column", translateX: 110, itemWidth: 80, itemHeight: 20, symbolSize: 12 }]}
            />
          </ChartCard>
        </div>

        {/* Row 2: Segments + Radar + Funnel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ChartCard id="segments-pie" title="Customer Segments" subtitle="Distribution by plan">
            <ResponsivePie
              data={customerSegments}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              innerRadius={0.55}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              colors={{ scheme: "nivo" }}
              arcLinkLabelsTextColor="#333"
            />
          </ChartCard>

          <ChartCard id="team-radar" title="Team Performance" subtitle="Cross-functional metrics">
            <ResponsiveRadar
              data={teamPerformance}
              keys={["Sales", "Marketing", "Product", "Support", "Engineering"]}
              indexBy="metric"
              margin={{ top: 30, right: 60, bottom: 30, left: 60 }}
              colors={{ scheme: "nivo" }}
              fillOpacity={0.15}
              dotSize={6}
            />
          </ChartCard>

          <ChartCard id="sales-funnel" title="Sales Funnel" subtitle="Visitor to enterprise conversion">
            <ResponsiveFunnel
              data={salesFunnel}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              colors={{ scheme: "nivo" }}
              borderWidth={20}
              labelColor={{ from: "color", modifiers: [["darker", 3]] }}
            />
          </ChartCard>
        </div>

        {/* Row 3: Network + Sankey */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard id="infra-network" title="Infrastructure Network Graph" subtitle="Service dependency map with real-time connections" height="h-96">
            <ResponsiveNetwork
              data={infraNetwork}
              margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              repulsivity={80}
              iterations={120}
              nodeColor={(n: { id: string }) => {
                if (n.id === "API Gateway") return "#2563eb";
                if (n.id === "PostgreSQL" || n.id === "Redis") return "#059669";
                if (n.id === "ML Pipeline") return "#7c3aed";
                return "#6366f1";
              }}
              nodeBorderWidth={2}
              nodeBorderColor={{ from: "color", modifiers: [["darker", 0.4]] }}
              linkThickness={2}
              linkColor={{ from: "source.color", modifiers: [["opacity", 0.4]] }}
              motionConfig="gentle"
            />
          </ChartCard>

          <ChartCard id="customer-sankey" title="Customer Journey Flow" subtitle="Acquisition channel to plan conversion" height="h-96">
            <ResponsiveSankey
              data={customerJourney}
              margin={{ top: 20, right: 140, bottom: 20, left: 20 }}
              colors={{ scheme: "nivo" }}
              nodeOpacity={1}
              nodeThickness={18}
              nodeSpacing={16}
              linkOpacity={0.4}
              enableLinkGradient
              labelPosition="outside"
              labelPadding={12}
            />
          </ChartCard>
        </div>

        {/* Row 4: Heatmap + TreeMap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard id="usage-heatmap" title="Platform Usage Heatmap" subtitle="User activity by day and time">
            <ResponsiveHeatMap
              data={usageHeatmap}
              margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
              colors={{ type: "sequential", scheme: "blues" }}
            />
          </ChartCard>

          <ChartCard id="revenue-tree" title="Revenue by Region" subtitle="Geographic revenue distribution">
            <ResponsiveTreeMap
              data={revenueTree}
              identity="name"
              value="value"
              margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              colors={{ scheme: "nivo" }}
              labelSkipSize={12}
              parentLabelSize={14}
            />
          </ChartCard>
        </div>

        {/* Row 5: Stream + Bump */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard id="feature-stream" title="Feature Usage Stream" subtitle="Monthly feature adoption trends">
            <ResponsiveStream
              data={featureUsage}
              keys={["Spreadsheet", "Charts", "AI Chat", "Import/Export", "Collaboration"]}
              margin={{ top: 20, right: 110, bottom: 40, left: 50 }}
              colors={{ scheme: "nivo" }}
              legends={[{ anchor: "bottom-right", direction: "column", translateX: 110, itemWidth: 80, itemHeight: 20, symbolSize: 12 }]}
            />
          </ChartCard>

          <ChartCard id="product-bump" title="Feature Rankings" subtitle="Popularity ranking over time">
            <ResponsiveBump
              data={productRanking}
              margin={{ top: 20, right: 100, bottom: 40, left: 50 }}
              colors={{ scheme: "nivo" }}
              lineWidth={3}
              activeLineWidth={6}
              pointSize={10}
            />
          </ChartCard>
        </div>

        {/* Row 6: Circle + Waffle + Scatter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ChartCard id="org-circle" title="Organization Structure" subtitle="Team size distribution">
            <ResponsiveCirclePacking
              data={orgStructure}
              margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              colors={{ scheme: "nivo" }}
              childColor={{ from: "color", modifiers: [["brighter", 0.4]] }}
              padding={4}
              enableLabels
              labelsSkipRadius={10}
            />
          </ChartCard>

          <ChartCard id="task-waffle" title="Sprint Completion" subtitle="Current sprint task status">
            <ResponsiveWaffle
              total={100}
              data={taskCompletion}
              rows={10}
              columns={10}
              margin={{ top: 10, right: 10, bottom: 40, left: 10 }}
              colors={{ scheme: "nivo" }}
              legends={[{ anchor: "bottom", direction: "row", translateY: -10, itemWidth: 100, itemHeight: 20, symbolSize: 12 }]}
            />
          </ChartCard>

          <ChartCard id="perf-scatter" title="Customer Health Score" subtitle="Engagement vs satisfaction by plan">
            <ResponsiveScatterPlot
              data={performanceScatter}
              margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
              xScale={{ type: "linear", min: 0, max: 100 }}
              yScale={{ type: "linear", min: 0, max: 100 }}
              nodeSize={8}
              colors={{ scheme: "nivo" }}
              axisBottom={{ legend: "Engagement", legendPosition: "middle", legendOffset: 30 }}
              axisLeft={{ legend: "Satisfaction", legendPosition: "middle", legendOffset: -40 }}
            />
          </ChartCard>
        </div>

        {/* Row 7: Sunburst + Calendar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ChartCard id="revenue-sunburst" title="Revenue Sunburst" subtitle="Hierarchical revenue view">
            <ResponsiveSunburst
              data={revenueTree}
              margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              colors={{ scheme: "nivo" }}
              childColor={{ from: "color", modifiers: [["brighter", 0.4]] }}
              enableArcLabels
              arcLabelsSkipAngle={10}
            />
          </ChartCard>

          <div className="md:col-span-2">
            <ChartCard id="activity-calendar" title="Daily Active Users" subtitle="2024 activity calendar" height="h-52">
              <ResponsiveCalendar
                data={activityCalendar}
                from="2024-01-01"
                to="2024-12-31"
                margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
                colors={["#d6e685", "#8cc665", "#44a340", "#1e6823"]}
                emptyColor="#eeeeee"
                yearSpacing={40}
                monthBorderColor="#ffffff"
                dayBorderWidth={2}
                dayBorderColor="#ffffff"
              />
            </ChartCard>
          </div>
        </div>

        {/* Row 8: Swarmplot */}
        <ChartCard id="nps-swarm" title="NPS Score Distribution by Plan" subtitle="Individual customer satisfaction scores">
          <ResponsiveSwarmPlot
            data={npsScores}
            groups={["Enterprise", "Pro", "Starter"]}
            value="value"
            valueScale={{ type: "linear", min: 0, max: 100 }}
            margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
            size={5}
            colors={{ scheme: "nivo" }}
            axisBottom={{ legend: "Plan Tier", legendPosition: "middle", legendOffset: 30 }}
            axisLeft={{ legend: "NPS Score", legendPosition: "middle", legendOffset: -40 }}
          />
        </ChartCard>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-4 mt-8">
        <div className="max-w-[1600px] mx-auto px-6 text-center text-xs text-gray-500">
          Made With Love By Louati Mahdi | Powered by Nivo Charts
        </div>
      </footer>
    </div>
  );
}
