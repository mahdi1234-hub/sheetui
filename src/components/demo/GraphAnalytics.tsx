"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
} from "lucide-react";

// =============================================
// CYTOSCAPE DATA
// =============================================
const cytoscapeNodes = [
  { id: "api-gw", label: "API Gateway", type: "core", weight: 100, community: "core", x: 400, y: 300 },
  { id: "auth", label: "Auth Service", type: "core", weight: 80, community: "core", x: 250, y: 200 },
  { id: "user-svc", label: "User Service", type: "core", weight: 85, community: "core", x: 550, y: 200 },
  { id: "billing", label: "Billing", type: "core", weight: 75, community: "core", x: 300, y: 400 },
  { id: "session", label: "Session Mgr", type: "core", weight: 60, community: "core", x: 150, y: 300 },
  { id: "postgres", label: "PostgreSQL", type: "database", weight: 95, community: "data", x: 700, y: 350 },
  { id: "redis", label: "Redis Cache", type: "database", weight: 70, community: "data", x: 700, y: 200 },
  { id: "s3", label: "S3 Storage", type: "database", weight: 65, community: "data", x: 850, y: 280 },
  { id: "elastic", label: "Elasticsearch", type: "database", weight: 60, community: "data", x: 850, y: 400 },
  { id: "kafka", label: "Kafka Queue", type: "database", weight: 72, community: "data", x: 700, y: 480 },
  { id: "analytics", label: "Analytics Engine", type: "analytics", weight: 78, community: "analytics", x: 400, y: 550 },
  { id: "ml-pipe", label: "ML Pipeline", type: "analytics", weight: 68, community: "analytics", x: 550, y: 600 },
  { id: "recomm", label: "Recommender", type: "analytics", weight: 55, community: "analytics", x: 300, y: 620 },
  { id: "anomaly", label: "Anomaly Detector", type: "analytics", weight: 50, community: "analytics", x: 500, y: 700 },
  { id: "cdn", label: "CDN", type: "external", weight: 55, community: "external", x: 100, y: 100 },
  { id: "email", label: "Email Service", type: "external", weight: 45, community: "external", x: 100, y: 450 },
  { id: "stripe", label: "Stripe", type: "external", weight: 50, community: "external", x: 150, y: 500 },
  { id: "webhook", label: "Webhooks", type: "external", weight: 40, community: "external", x: 550, y: 100 },
  { id: "monitor", label: "Monitoring", type: "external", weight: 48, community: "external", x: 850, y: 550 },
];

const cytoscapeEdges = [
  { source: "api-gw", target: "auth", label: "12K rps", throughput: 12000 },
  { source: "api-gw", target: "user-svc", label: "8K rps", throughput: 8000 },
  { source: "api-gw", target: "billing", label: "3K rps", throughput: 3000 },
  { source: "api-gw", target: "cdn", label: "15K rps", throughput: 15000 },
  { source: "api-gw", target: "webhook", label: "2K rps", throughput: 2000 },
  { source: "auth", target: "redis", label: "10K rps", throughput: 10000 },
  { source: "auth", target: "session", label: "8K rps", throughput: 8000 },
  { source: "user-svc", target: "postgres", label: "5K rps", throughput: 5000 },
  { source: "user-svc", target: "redis", label: "4K rps", throughput: 4000 },
  { source: "user-svc", target: "s3", label: "1K rps", throughput: 1000 },
  { source: "billing", target: "postgres", label: "2K rps", throughput: 2000 },
  { source: "billing", target: "stripe", label: "500 rps", throughput: 500 },
  { source: "billing", target: "email", label: "200 rps", throughput: 200 },
  { source: "postgres", target: "elastic", label: "3K rps", throughput: 3000 },
  { source: "postgres", target: "kafka", label: "4K rps", throughput: 4000 },
  { source: "kafka", target: "analytics", label: "4K rps", throughput: 4000 },
  { source: "analytics", target: "ml-pipe", label: "2K rps", throughput: 2000 },
  { source: "analytics", target: "recomm", label: "1.5K rps", throughput: 1500 },
  { source: "ml-pipe", target: "anomaly", label: "800 rps", throughput: 800 },
  { source: "ml-pipe", target: "s3", label: "1K rps", throughput: 1000 },
  { source: "analytics", target: "postgres", label: "2K rps", throughput: 2000 },
  { source: "monitor", target: "api-gw", label: "probe", throughput: 100 },
  { source: "monitor", target: "postgres", label: "probe", throughput: 100 },
  { source: "monitor", target: "kafka", label: "probe", throughput: 100 },
  { source: "session", target: "redis", label: "6K rps", throughput: 6000 },
];

const communityColors: Record<string, string> = {
  core: "#3b82f6",
  data: "#10b981",
  analytics: "#8b5cf6",
  external: "#f59e0b",
};

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

// Sankey data
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
// CANVAS GRAPH COMPONENT (replaces Cytoscape)
// =============================================
interface NodeState {
  id: string;
  label: string;
  community: string;
  weight: number;
  type: string;
  x: number;
  y: number;
}

function CanvasGraph({ width, height }: { width: number; height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<NodeState[]>(
    cytoscapeNodes.map((n) => ({ ...n }))
  );
  const [dragNode, setDragNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodeState | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.85);

  const getNodeRadius = (weight: number) => Math.max(12, weight / 5);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw edges
    cytoscapeEdges.forEach((edge) => {
      const src = nodes.find((n) => n.id === edge.source);
      const tgt = nodes.find((n) => n.id === edge.target);
      if (!src || !tgt) return;

      const lineWidth = Math.max(1, edge.throughput / 3000);
      ctx.beginPath();
      ctx.moveTo(src.x, src.y);
      ctx.lineTo(tgt.x, tgt.y);
      ctx.strokeStyle = "rgba(75, 85, 99, 0.5)";
      ctx.lineWidth = lineWidth;
      ctx.stroke();

      // Arrow
      const angle = Math.atan2(tgt.y - src.y, tgt.x - src.x);
      const tgtR = getNodeRadius(tgt.weight);
      const arrowX = tgt.x - Math.cos(angle) * (tgtR + 4);
      const arrowY = tgt.y - Math.sin(angle) * (tgtR + 4);
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(arrowX - 8 * Math.cos(angle - 0.3), arrowY - 8 * Math.sin(angle - 0.3));
      ctx.lineTo(arrowX - 8 * Math.cos(angle + 0.3), arrowY - 8 * Math.sin(angle + 0.3));
      ctx.closePath();
      ctx.fillStyle = "rgba(75, 85, 99, 0.6)";
      ctx.fill();

      // Edge label
      const midX = (src.x + tgt.x) / 2;
      const midY = (src.y + tgt.y) / 2;
      ctx.font = "9px sans-serif";
      ctx.fillStyle = "#6b7280";
      ctx.textAlign = "center";
      ctx.fillText(edge.label, midX, midY - 6);
    });

    // Draw nodes
    nodes.forEach((node) => {
      const r = getNodeRadius(node.weight);
      const color = communityColors[node.community] || "#6b7280";

      // Glow for selected
      if (selectedNode?.id === node.id) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 6, 0, Math.PI * 2);
        ctx.fillStyle = `${color}33`;
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = `${color}cc`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.font = "11px -apple-system, sans-serif";
      ctx.fillStyle = "#e5e7eb";
      ctx.textAlign = "center";
      ctx.fillText(node.label, node.x, node.y + r + 14);
    });

    ctx.restore();
  }, [nodes, selectedNode, pan, zoom, width, height]);

  useEffect(() => {
    draw();
  }, [draw]);

  const getCanvasPoint = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top - pan.y) / zoom,
    };
  };

  const findNodeAt = (x: number, y: number) => {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      const r = getNodeRadius(n.weight);
      if (Math.hypot(x - n.x, y - n.y) <= r) return n;
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pt = getCanvasPoint(e);
    const node = findNodeAt(pt.x, pt.y);
    if (node) {
      setDragNode(node.id);
      setSelectedNode(node);
      setOffset({ x: pt.x - node.x, y: pt.y - node.y });
    } else {
      setSelectedNode(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragNode) return;
    const pt = getCanvasPoint(e);
    setNodes((prev) =>
      prev.map((n) =>
        n.id === dragNode ? { ...n, x: pt.x - offset.x, y: pt.y - offset.y } : n
      )
    );
  };

  const handleMouseUp = () => {
    setDragNode(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.95 : 1.05;
    setZoom((z) => Math.max(0.3, Math.min(3, z * delta)));
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
      {/* Selected node info overlay */}
      {selectedNode && (
        <div className="absolute top-3 right-3 bg-gray-800 border border-gray-700 rounded-lg p-3 w-52">
          <h3 className="text-sm font-semibold text-white mb-2">{selectedNode.label}</h3>
          <div className="space-y-1 text-xs text-gray-400">
            <div className="flex justify-between"><span>ID:</span><span className="text-gray-300">{selectedNode.id}</span></div>
            <div className="flex justify-between"><span>Type:</span><span className="text-gray-300">{selectedNode.type}</span></div>
            <div className="flex justify-between"><span>Weight:</span><span className="text-gray-300">{selectedNode.weight}</span></div>
            <div className="flex justify-between"><span>Community:</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: communityColors[selectedNode.community] }}></span>
                <span className="text-gray-300">{selectedNode.community}</span>
              </span>
            </div>
            <div className="flex justify-between"><span>Connections:</span>
              <span className="text-gray-300">{cytoscapeEdges.filter((e) => e.source === selectedNode.id || e.target === selectedNode.id).length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================
// MAIN COMPONENT
// =============================================
export default function GraphAnalytics() {
  const [graphSize, setGraphSize] = useState({ width: 960, height: 500 });
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null);

  useEffect(() => {
    const updateSize = () => {
      if (graphContainerRef.current) {
        setGraphSize({
          width: graphContainerRef.current.offsetWidth,
          height: expandedPanel === "main" ? window.innerHeight - 140 : 500,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [expandedPanel]);

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
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Nodes", value: cytoscapeNodes.length, color: "text-blue-400" },
            { label: "Edges", value: cytoscapeEdges.length, color: "text-green-400" },
            { label: "Graph Density", value: (2 * cytoscapeEdges.length / (cytoscapeNodes.length * (cytoscapeNodes.length - 1))).toFixed(3), color: "text-purple-400" },
            { label: "Avg Degree", value: (2 * cytoscapeEdges.length / cytoscapeNodes.length).toFixed(1), color: "text-orange-400" },
          ].map((s) => (
            <div key={s.label} className="bg-gray-900 rounded-xl border border-gray-800 px-4 py-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Main Canvas Graph */}
        <div className={`bg-gray-900 rounded-xl border border-gray-800 overflow-hidden ${expandedPanel === "main" ? "fixed inset-4 z-50" : ""}`}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-white">Infrastructure Network Graph</h2>
              <span className="text-xs bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded">Canvas + Drag per Node</span>
              <span className="text-xs text-gray-500">Click and drag individual nodes</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setExpandedPanel(expandedPanel === "main" ? null : "main")} className="p-1.5 rounded hover:bg-gray-800">
                {expandedPanel === "main" ? <Minimize2 className="w-3.5 h-3.5 text-gray-400" /> : <Maximize2 className="w-3.5 h-3.5 text-gray-400" />}
              </button>
            </div>
          </div>

          <div className="flex">
            <div ref={graphContainerRef} className="flex-1">
              <CanvasGraph width={graphSize.width - 240} height={graphSize.height} />
            </div>

            {/* Side panel */}
            <div className="w-60 border-l border-gray-800 p-4 space-y-4 overflow-y-auto">
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

              <div>
                <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Top Connections</h3>
                {cytoscapeNodes
                  .map((n) => ({
                    ...n,
                    degree: cytoscapeEdges.filter((e) => e.source === n.id || e.target === n.id).length,
                  }))
                  .sort((a, b) => b.degree - a.degree)
                  .slice(0, 5)
                  .map((n) => (
                    <div key={n.id} className="flex items-center justify-between py-1">
                      <span className="text-xs text-gray-300">{n.label}</span>
                      <span className="text-xs bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">{n.degree}</span>
                    </div>
                  ))}
              </div>

              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-start gap-2 text-gray-500 text-xs">
                  <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span>Click and drag individual nodes to reposition them. Scroll to zoom. Node size = service importance. Edge width = throughput.</span>
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
          Made With Love By Louati Mahdi | Powered by Canvas + Nivo
        </div>
      </footer>

      {expandedPanel && <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setExpandedPanel(null)} />}
    </div>
  );
}
