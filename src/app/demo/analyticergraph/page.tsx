"use client";

import dynamic from "next/dynamic";

const GraphAnalytics = dynamic(
  () => import("@/components/demo/GraphAnalytics"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm text-gray-400">Loading graph analytics...</p>
        </div>
      </div>
    ),
  }
);

export default function GraphAnalyticsPage() {
  return <GraphAnalytics />;
}
