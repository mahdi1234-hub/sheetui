"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { ResponsiveNetwork } from "@nivo/network";
import { ResponsiveSankey } from "@nivo/sankey";
import {
  Table2,
  ArrowLeft,
  Network,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  Info,
  Eye,
  EyeOff,
} from "lucide-react";

// =============================================
// GRAPH DATA: SaaS Infrastructure & Analytics
// =============================================

// Cytoscape graph: Full infrastructure with communities
const cytoscapeElements = [
  // Core Services (blue cluster)
  { data: { id: "api-gw", label: "API Gateway", type: "core", weight: 100, community: "core" }, position: { x: 400, y: 300 } },
  { data: { id: "auth", label: "Auth Service", type: "core", weight: 80, community: "core" }, position: { x: 250, y: 200 } },
  { data: { id: "user-svc", label: "User Service", type: "core", weight: 85, community: "core" }, position: { x: 550, y: 200 } },
  { data: { id: "billing", label: "Billing", type: "core", weight: 75, community: "core" }, position: { x: 300, y: 400 } },
  { data: { id: "session", label: "Session Mgr", type: "core", weight: 60, community: "core" }, position: { x: 150, y: 300 } },

  // Data Layer (green cluster)
  { data: { id: "postgres", label: "PostgreSQL", type: "database", weight: 95, community: "data" }, position: { x: 700, y: 350 } },
  { data: { id: "redis", label: "Redis Cache", type: "database", weight: 70, community: "data" }, position: { x: 700, y: 200 } },
  { data: { id: "s3", label: "S3 Storage", type: "database", weight: 65, community: "data" }, position: { x: 850, y: 280 } },
  { data: { id: "elastic", label: "Elasticsearch", type: "database", weight: 60, community: "data" }, position: { x: 850, y: 400 } },
  { data: { id: "kafka", label: "Kafka Queue", type: "database", weight: 72, community: "data" }, position: { x: 700, y: 480 } },

  // Analytics (purple cluster)
  { data: { id: "analytics", label: "Analytics Engine", type: "analytics", weight: 78, community: "analytics" }, position: { x: 400, y: 550 } },
  { data: { id: "ml-pipe", label: "ML Pipeline", type: "analytics", weight: 68, community: "analytics" }, position: { x: 550, y: 600 } },
  { data: { id: "recomm", label: "Recommender", type: "analytics", weight: 55, community: "analytics" }, position: { x: 300, y: 620 } },
  { data: { id: "anomaly", label: "Anomaly Detector", type: "analytics", weight: 50, community: "analytics" }, position: { x: 500, y: 700 } },

  // External (orange cluster)
  { data: { id: "cdn", label: "CDN", type: "external", weight: 55, community: "external" }, position: { x: 100, y: 100 } },
  { data: { id: "email", label: "Email Service", type: "external", weight: 45, community: "external" }, position: { x: 100, y: 450 } },
  { data: { id: "stripe", label: "Stripe", type: "external", weight: 50, community: "external" }, position: { x: 150, y: 500 } },
  { data: { id: "webhook", label: "Webhooks", type: "external", weight: 40, community: "external" }, position: { x: 550, y: 100 } },
  { data: { id: "monitor", label: "Monitoring", type: "external", weight: 48, community: "external" }, position: { x: 850, y: 550 } },

  // Edges with throughput data
  { data: { source: "api-gw", target: "auth", label: "12K rps", throughput: 12000 } },
  { data: { source: "api-gw", target: "user-svc", label: "8K rps", throughput: 8000 } },
  { data: { source: "api-gw", target: "billing", label: "3K rps", throughput: 3000 } },
  { data: { source: "api-gw", target: "cdn", label: "15K rps", throughput: 15000 } },
  { data: { source: "api-gw", target: "webhook", label: "2K rps", throughput: 2000 } },
  { data: { source: "auth", target: "redis", label: "10K rps", throughput: 10000 } },
  { data: { source: "auth", target: "session", label: "8K rps", throughput: 8000 } },
  { data: { source: "user-svc", target: "postgres", label: "5K rps", throughput: 5000 } },
  { data: { source: "user-svc", target: "redis", label: "4K rps", throughput: 4000 } },
  { data: { source: "user-svc", target: "s3", label: "1K rps", throughput: 1000 } },
  { data: { source: "billing", target: "postgres", label: "2K rps", throughput: 2000 } },
  { data: { source: "billing", target: "stripe", label: "500 rps", throughput: 500 } },
  { data: { source: "billing", target: "email", label: "200 rps", throughput: 200 } },
  { data: { source: "postgres", target: "elastic", label: "3K rps", throughput: 3000 } },
  { data: { source: "postgres", target: "kafka", label: "4K rps", throughput: 4000 } },
  { data: { source: "kafka", target: "analytics", label: "4K rps", throughput: 4000 } },
  { data: { source: "analytics", target: "ml-pipe", label: "2K rps", throughput: 2000 } },
  { data: { source: "analytics", target: "recomm", label: "1.5K rps", throughput: 1500 } },
  { data: { source: "ml-pipe", target: "anomaly", label: "800 rps", throughput: 800 } },
  { data: { source: "ml-pipe", target: "s3", label: "1K rps", throughput: 1000 } },
  { data: { source: "analytics", target: "postgres", label: "2K rps", throughput: 2000 } },
  { data: { source: "monitor", target: "api-gw", label: "probe", throughput: 100 } },
  { data: { source: "monitor", target: "postgres", label: "probe", throughput: 100 } },
  { data: { source: "monitor", target: "kafka", label: "probe", throughput: 100 } },
  { data: { source: "session", target: "redis", label: "6K rps", throughput: 6000 } },
];

// Cytoscape stylesheet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cytoscapeStylesheet: any[] = [
  {
    selector: "node",
    style: {
      label: "data(label)",
      "text-valign": "bottom",
      "text-halign": "center",
      "font-size": "11px",
      color: "#e5e7eb",
      "text-margin-y": 8,
      width: "mapData(weight, 40, 100, 30, 60)",
      height: "mapData(weight, 40, 100, 30, 60)",
      "border-width": 2,
      "border-color": "#374151",
    } as cytoscape.Css.Node,
  },
  {
    selector: "node[community='core']",
    style: { "background-color": "#3b82f6", "border-color": "#60a5fa" } as cytoscape.Css.Node,
  },
  {
    selector: "node[community='data']",
    style: { "background-color": "#10b981", "border-color": "#34d399" } as cytoscape.Css.Node,
  },
  {
    selector: "node[community='analytics']",
    style: { "background-color": "#8b5cf6", "border-color": "#a78bfa" } as cytoscape.Css.Node,
  },
  {
    selector: "node[community='external']",
    style: { "background-color": "#f59e0b", "border-color": "#fbbf24" } as cytoscape.Css.Node,
  },
  {
    selector: "node:selected",
    style: { "border-width": 4, "border-color": "#fff", "overlay-opacity": 0.2, "overlay-color": "#fff" } as cytoscape.Css.Node,
  },
  {
    selector: "edge",
    style: {
      width: "mapData(throughput, 100, 15000, 1, 6)",
      "line-color": "#4b5563",
      "target-arrow-color": "#4b5563",
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
      opacity: 0.6,
      label: "data(label)",
      "font-size": "8px",
      color: "#9ca3af",
      "text-rotation": "autorotate",
      "text-margin-y": -8,
    } as cytoscape.Css.Edge,
  },
  {
    selector: "edge:selected",
    style: { "line-color": "#60a5fa", "target-arrow-color": "#60a5fa", opacity: 1, width: 4 } as cytoscape.Css.Edge,
  },
];

// Nivo Network data
const nivoNetworkData = {
  nodes: [
    { id: "Users", radius: 20 },
    { id: "CDN", radius: 14 },
    { id: "Load Balancer", radius: 16 },
    { id: "API v1", radius: 12 },
    { id: "API v2", radius: 12 },
    { id: "Auth", radius: 12 },
    { id: "Cache", radius: 10 },
    { id: "DB Primary", radius: 14 },
    { id: "DB Replica", radius: 10 },
    { id: "Queue", radius: 10 },
    { id: "Workers", radius: 12 },
    { id: "ML", radius: 10 },
  ],
  links: [
    { source: "Users", target: "CDN", distance: 60 },
    { source: "CDN", target: "Load Balancer", distance: 50 },
    { source: "Load Balancer", target: "API v1", distance: 50 },
    { source: "Load Balancer", target: "API v2", distance: 50 },
    { source: "API v1", target: "Auth", distance: 40 },
    { source: "API v2", target: "Auth", distance: 40 },
    { source: "API v1", target: "Cache", distance: 40 },
    { source: "API v2", target: "Cache", distance: 40 },
    { source: "API v1", target: "DB Primary", distance: 50 },
    { source: "API v2", target: "DB Primary", distance: 50 },
    { source: "DB Primary", target: "DB Replica", distance: 40 },
    { source: "API v1", target: "Queue", distance: 40 },
    { source: "Queue", target: "Workers", distance: 40 },
    { source: "Workers", target: "ML", distance: 40 },
    { source: "Workers", target: "DB Primary", distance: 50 },
  ],
};

// Sankey data flow
const dataFlowSankey = {
  nodes: [
    { id: "HTTP Requests" }, { id: "WebSocket" }, { id: "Webhooks" },
    { id: "API Gateway" },
    { id: "Authentication" }, { id: "Rate Limiter" },
    { id: "Business Logic" }, { id: "Real-time" },
    { id: "PostgreSQL" }, { id: "Redis" }, { id: "Kafka" },
    { id: "Analytics" }, { id: "ML Processing" },
    { id: "Client Response" },
  ],
  links: [
    { source: "HTTP Requests", target: "API Gateway", value: 50000 },
    { source: "WebSocket", target: "API Gateway", value: 12000 },
    { source: "Webhooks", target: "API Gateway", value: 5000 },
    { source: "API Gateway", target: "Authentication", value: 67000 },
    { source: "Authentication", target: "Rate Limiter", value: 60000 },
    { source: "Rate Limiter", target: "Business Logic", value: 55000 },
    { source: "Rate Limiter", target: "Real-time", value: 5000 },
    { source: "Business Logic", target: "PostgreSQL", value: 30000 },
    { source: "Business Logic", target: "Redis", value: 20000 },
    { source: "Business Logic", target: "Kafka", value: 8000 },
    { source: "Real-time", target: "Redis", value: 5000 },
    { source: "Kafka", target: "Analytics", value: 6000 },
    { source: "Kafka", target: "ML Processing", value: 2000 },
    { source: "Business Logic", target: "Client Response", value: 50000 },
    { source: "Real-time", target: "Client Response", value: 5000 },
  ],
};

// =============================================
// COMPONENT
// =============================================
export default function GraphAnalytics() {
  const cyRef = useRef<cytoscape.Core | null>(null);
  const [selectedNode, setSelectedNode] = useState<{ id: string; label: string; type: string; weight: number; community: string } | null>(null);
  const [layout, setLayout] = useState("preset");
  const [showLabels, setShowLabels] = useState(true);
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ nodes: 0, edges: 0, density: 0, avgDegree: 0 });

  // Calculate graph stats
  useEffect(() => {
    if (cyRef.current) {
      const cy = cyRef.current;
      const nodes = cy.nodes().length;
      const edges = cy.edges().length;
      const maxEdges = (nodes * (nodes - 1)) / 2;
      setStats({
        nodes,
        edges,
        density: parseFloat((edges / maxEdges).toFixed(3)),
        avgDegree: parseFloat((2 * edges / nodes).toFixed(1)),
      });
    }
  }, []);

  const handleCyInit = useCallback((cy: cytoscape.Core) => {
    cyRef.current = cy;

    const nodes = cy.nodes().length;
    const edges = cy.edges().length;
    const maxEdges = (nodes * (nodes - 1)) / 2;
    setStats({
      nodes,
      edges,
      density: parseFloat((edges / maxEdges).toFixed(3)),
      avgDegree: parseFloat((2 * edges / nodes).toFixed(1)),
    });

    cy.on("tap", "node", (evt) => {
      const node = evt.target;
      setSelectedNode({
        id: node.id(),
        label: node.data("label"),
        type: node.data("type"),
        weight: node.data("weight"),
        community: node.data("community"),
      });
    });

    cy.on("tap", (evt) => {
      if (evt.target === cy) setSelectedNode(null);
    });

    // Enable individual node dragging (nodes are draggable by default in Cytoscape)
    cy.nodes().ungrabify();
    cy.nodes().grabify();
  }, []);

  const applyLayout = (name: string) => {
    if (!cyRef.current) return;
    setLayout(name);
    const layoutConfig: Record<string, object> = {
      preset: { name: "preset" },
      circle: { name: "circle", padding: 40 },
      concentric: { name: "concentric", concentric: (n: cytoscape.NodeSingular) => n.data("weight"), levelWidth: () => 2, padding: 30 },
      breadthfirst: { name: "breadthfirst", directed: true, padding: 30 },
      grid: { name: "grid", padding: 30 },
      cose: { name: "cose", idealEdgeLength: 100, nodeRepulsion: 5000, animate: true },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cyRef.current.layout((layoutConfig[name] || { name }) as any).run();
  };

  const zoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.2);
  const zoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  const resetView = () => cyRef.current?.fit(undefined, 40);

  const highlightSearch = () => {
    if (!cyRef.current || !searchQuery) return;
    const cy = cyRef.current;
    cy.nodes().style({ opacity: 0.2 });
    cy.edges().style({ opacity: 0.1 });
    cy.nodes().filter((n) => n.data("label").toLowerCase().includes(searchQuery.toLowerCase()))
      .style({ opacity: 1 })
      .connectedEdges().style({ opacity: 0.8 });
  };

  const clearHighlight = () => {
    if (!cyRef.current) return;
    cyRef.current.nodes().style({ opacity: 1 });
    cyRef.current.edges().style({ opacity: 0.6 });
    setSearchQuery("");
  };

  const toggleLabels = () => {
    if (!cyRef.current) return;
    setShowLabels(!showLabels);
    cyRef.current.nodes().style({ label: showLabels ? "" : "data(label)" });
  };

  const communities = [
    { name: "Core Services", color: "#3b82f6", count: 5 },
    { name: "Data Layer", color: "#10b981", count: 5 },
    { name: "Analytics", color: "#8b5cf6", count: 4 },
    { name: "External", color: "#f59e0b", count: 5 },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-[1800px] mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Table2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">SheetUI</span>
            </a>
            <span className="text-gray-600">|</span>
            <Network className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-gray-300">Graph Network Analytics</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/demo/analytics" className="text-sm text-gray-400 hover:text-white">Analytics</a>
            <a href="/demo/dashboard" className="text-sm text-gray-400 hover:text-white">Charts</a>
            <a href="/demo" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4" /> Spreadsheet
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-[1800px] mx-auto px-6 py-6 space-y-6">
        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Nodes", value: stats.nodes, color: "text-blue-400" },
            { label: "Edges", value: stats.edges, color: "text-green-400" },
            { label: "Graph Density", value: stats.density, color: "text-purple-400" },
            { label: "Avg Degree", value: stats.avgDegree, color: "text-orange-400" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900 rounded-xl border border-gray-800 px-4 py-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Main Cytoscape Graph */}
        <div className={`bg-gray-900 rounded-xl border border-gray-800 overflow-hidden ${expandedPanel === "cytoscape" ? "fixed inset-4 z-50" : ""}`}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-white">Infrastructure Network Graph</h2>
              <span className="text-xs bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded">Cytoscape.js</span>
              <span className="text-xs text-gray-500">Drag individual nodes to rearrange</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && highlightSearch()}
                  placeholder="Search nodes..."
                  className="pl-7 pr-2 py-1 w-36 text-xs bg-gray-800 border border-gray-700 rounded text-gray-300 focus:outline-none focus:border-blue-500"
                />
              </div>
              {searchQuery && (
                <button onClick={clearHighlight} className="text-xs text-gray-400 hover:text-white">Clear</button>
              )}

              {/* Layout selector */}
              <select
                value={layout}
                onChange={(e) => applyLayout(e.target.value)}
                className="text-xs bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-300"
              >
                <option value="preset">Preset</option>
                <option value="circle">Circle</option>
                <option value="concentric">Concentric</option>
                <option value="breadthfirst">Hierarchical</option>
                <option value="grid">Grid</option>
                <option value="cose">Force-Directed</option>
              </select>

              {/* Toggle labels */}
              <button onClick={toggleLabels} className="p-1.5 rounded hover:bg-gray-800" title={showLabels ? "Hide labels" : "Show labels"}>
                {showLabels ? <Eye className="w-3.5 h-3.5 text-gray-400" /> : <EyeOff className="w-3.5 h-3.5 text-gray-400" />}
              </button>

              {/* Zoom controls */}
              <button onClick={zoomIn} className="p-1.5 rounded hover:bg-gray-800"><ZoomIn className="w-3.5 h-3.5 text-gray-400" /></button>
              <button onClick={zoomOut} className="p-1.5 rounded hover:bg-gray-800"><ZoomOut className="w-3.5 h-3.5 text-gray-400" /></button>
              <button onClick={resetView} className="p-1.5 rounded hover:bg-gray-800"><RotateCcw className="w-3.5 h-3.5 text-gray-400" /></button>
              <button onClick={() => setExpandedPanel(expandedPanel === "cytoscape" ? null : "cytoscape")} className="p-1.5 rounded hover:bg-gray-800">
                {expandedPanel === "cytoscape" ? <Minimize2 className="w-3.5 h-3.5 text-gray-400" /> : <Maximize2 className="w-3.5 h-3.5 text-gray-400" />}
              </button>
            </div>
          </div>

          <div className="flex">
            {/* Graph */}
            <div className={expandedPanel === "cytoscape" ? "flex-1 h-[calc(100vh-140px)]" : "flex-1 h-[500px]"}>
              <CytoscapeComponent
                elements={cytoscapeElements}
                stylesheet={cytoscapeStylesheet}
                style={{ width: "100%", height: "100%" }}
                cy={handleCyInit}
                userZoomingEnabled
                userPanningEnabled
                boxSelectionEnabled
                autoungrabify={false}
              />
            </div>

            {/* Side panel */}
            <div className="w-64 border-l border-gray-800 p-4 space-y-4 overflow-y-auto">
              {/* Communities */}
              <div>
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Communities</h3>
                {communities.map((c) => (
                  <div key={c.name} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }}></div>
                      <span className="text-xs text-gray-300">{c.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{c.count}</span>
                  </div>
                ))}
              </div>

              {/* Selected node info */}
              {selectedNode && (
                <div className="bg-gray-800 rounded-lg p-3">
                  <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Selected Node</h3>
                  <p className="text-sm font-semibold text-white mb-1">{selectedNode.label}</p>
                  <div className="space-y-1 text-xs text-gray-400">
                    <p>ID: <span className="text-gray-300">{selectedNode.id}</span></p>
                    <p>Type: <span className="text-gray-300">{selectedNode.type}</span></p>
                    <p>Weight: <span className="text-gray-300">{selectedNode.weight}</span></p>
                    <p>Community: <span className="text-gray-300">{selectedNode.community}</span></p>
                    <p>Connections: <span className="text-gray-300">{
                      cyRef.current ? cyRef.current.$(`#${selectedNode.id}`).connectedEdges().length : 0
                    }</span></p>
                  </div>
                </div>
              )}

              {!selectedNode && (
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <Info className="w-3.5 h-3.5" />
                    Click a node to see details. Drag individual nodes to reposition.
                  </div>
                </div>
              )}

              {/* Legend */}
              <div>
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Edge Width</h3>
                <div className="space-y-1 text-xs text-gray-500">
                  <p>Thin = Low throughput</p>
                  <p>Thick = High throughput</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Nivo Network + Sankey */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white">Request Flow Network</h2>
                <span className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded">Nivo</span>
              </div>
            </div>
            <div className="h-96 p-2">
              <ResponsiveNetwork
                data={nivoNetworkData}
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                repulsivity={100}
                iterations={120}
                nodeColor={(n: { id: string }) => {
                  if (n.id === "Users") return "#f59e0b";
                  if (n.id.includes("DB")) return "#10b981";
                  if (n.id === "ML" || n.id === "Workers") return "#8b5cf6";
                  return "#3b82f6";
                }}
                nodeBorderWidth={2}
                nodeBorderColor={{ from: "color", modifiers: [["darker", 0.4]] }}
                linkThickness={2}
                linkColor={{ from: "source.color", modifiers: [["opacity", 0.3]] }}
                motionConfig="gentle"
              />
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white">Data Flow Pipeline</h2>
                <span className="text-xs bg-purple-900/50 text-purple-400 px-2 py-0.5 rounded">Sankey</span>
              </div>
            </div>
            <div className="h-96 p-2">
              <ResponsiveSankey
                data={dataFlowSankey}
                margin={{ top: 20, right: 140, bottom: 20, left: 20 }}
                colors={{ scheme: "category10" }}
                nodeOpacity={1}
                nodeThickness={16}
                nodeSpacing={14}
                linkOpacity={0.3}
                enableLinkGradient
                labelPosition="outside"
                labelPadding={10}
                labelTextColor="#e5e7eb"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900 py-4 mt-8">
        <div className="max-w-[1800px] mx-auto px-6 text-center text-xs text-gray-500">
          Made With Love By Louati Mahdi | Powered by Cytoscape.js + Nivo + Graphology
        </div>
      </footer>

      {/* Fullscreen overlay */}
      {expandedPanel && <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setExpandedPanel(null)} />}
    </div>
  );
}
