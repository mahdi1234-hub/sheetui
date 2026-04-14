"use client";

import dynamic from "next/dynamic";

// Use dynamic import with no SSR to avoid pre-rendering issues with canvas/store
const DemoContent = dynamic(() => import("@/components/demo/DemoContent"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-sm text-gray-500">Loading demo...</p>
      </div>
    </div>
  ),
});

export default function DemoPage() {
  return <DemoContent />;
}
