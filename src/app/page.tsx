"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Table2,
  Zap,
  Users,
  Brain,
  BarChart3,
  Shield,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Globe,
} from "lucide-react";

export default function LandingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Table2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SheetUI</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition">Features</a>
              <a href="#ai" className="text-sm text-gray-600 hover:text-gray-900 transition">AI Power</a>
              <a href="#charts" className="text-sm text-gray-600 hover:text-gray-900 transition">Charts</a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition">Pricing</a>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 transition"
              >
                Sign In
              </button>
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="text-sm bg-gray-900 text-white px-5 py-2 rounded-full hover:bg-gray-800 transition shadow-sm"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            Now with AI-powered data analysis
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            The spreadsheet that
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
              thinks with you
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            A blazing-fast, collaborative spreadsheet with 400+ formulas, real-time sync,
            AI chat, beautiful charts, and enterprise-grade security. Built for modern teams.
          </p>
          <div className="flex items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-full text-base font-medium hover:bg-gray-800 transition shadow-lg shadow-gray-900/20"
            >
              Start for Free
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#features"
              className="inline-flex items-center gap-2 bg-white text-gray-700 px-8 py-3.5 rounded-full text-base font-medium border border-gray-200 hover:bg-gray-50 transition"
            >
              See Features
            </a>
          </div>

          {/* Hero Screenshot Preview */}
          <div className="mt-16 max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="bg-gray-900 rounded-xl p-1 shadow-2xl shadow-gray-900/20">
              <div className="bg-gray-800 rounded-t-lg px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 text-center text-sm text-gray-400">SheetUI - Untitled Workbook</div>
              </div>
              <div className="bg-white rounded-b-lg overflow-hidden">
                {/* Mini spreadsheet preview */}
                <div className="border-b border-gray-200 px-3 py-1.5 flex items-center gap-4 text-xs text-gray-500">
                  <span className="font-medium text-gray-700">File</span>
                  <span className="font-medium text-gray-700">Edit</span>
                  <span className="font-medium text-gray-700">View</span>
                  <span className="font-medium text-gray-700">Data</span>
                  <span className="font-medium text-gray-700">Insert</span>
                  <span className="font-medium text-gray-700">Help</span>
                  <div className="flex-1"></div>
                  <span className="text-blue-600 font-medium">AI Chat</span>
                  <span className="text-gray-700 font-medium">Data</span>
                </div>
                <div className="grid grid-cols-8 text-xs">
                  <div className="bg-gray-50 p-2 font-medium text-gray-500 border-b border-r border-gray-200"></div>
                  {["A", "B", "C", "D", "E", "F", "G"].map((col) => (
                    <div key={col} className="bg-gray-50 p-2 font-medium text-gray-500 text-center border-b border-r border-gray-200">{col}</div>
                  ))}
                  {[1, 2, 3, 4, 5, 6].map((row) => (
                    <>
                      <div key={`h-${row}`} className="bg-gray-50 p-2 font-medium text-gray-500 text-center border-b border-r border-gray-200">{row}</div>
                      {[0, 1, 2, 3, 4, 5, 6].map((col) => (
                        <div
                          key={`${row}-${col}`}
                          className={`p-2 border-b border-r border-gray-100 ${row === 1 && col === 0 ? "ring-2 ring-blue-500 ring-inset" : ""} ${row === 1 ? "bg-blue-50/30 font-medium text-gray-700" : "text-gray-500"}`}
                        >
                          {row === 1 && col === 0 && "Revenue"}
                          {row === 1 && col === 1 && "Q1"}
                          {row === 1 && col === 2 && "Q2"}
                          {row === 1 && col === 3 && "Q3"}
                          {row === 1 && col === 4 && "Q4"}
                          {row === 2 && col === 0 && "Product A"}
                          {row === 2 && col === 1 && "$45,200"}
                          {row === 2 && col === 2 && "$52,800"}
                          {row === 2 && col === 3 && "$61,300"}
                          {row === 2 && col === 4 && "$58,900"}
                          {row === 3 && col === 0 && "Product B"}
                          {row === 3 && col === 1 && "$32,100"}
                          {row === 3 && col === 2 && "$38,400"}
                          {row === 3 && col === 3 && "$41,200"}
                          {row === 3 && col === 4 && "$45,600"}
                          {row === 4 && col === 0 && "Total"}
                          {row === 4 && col === 1 && "=SUM(B2:B3)"}
                        </div>
                      ))}
                    </>
                  ))}
                </div>
                <div className="flex items-center border-t border-gray-200 px-2 py-1 text-xs text-gray-500">
                  <div className="px-3 py-1 bg-white border-b-2 border-blue-500 font-medium text-gray-700">Sheet0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built from the ground up to be fast, powerful, and delightful. Every feature
              is thoughtfully crafted.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Blazing Fast",
                description: "Canvas-based rendering with Glide Data Grid handles millions of cells at 60fps. No lag, ever.",
                color: "text-yellow-500",
                bg: "bg-yellow-50",
              },
              {
                icon: Users,
                title: "Real-time Collaboration",
                description: "See live cursors, edits, and presence of your team. Powered by Y.js and PartyKit WebSocket.",
                color: "text-blue-500",
                bg: "bg-blue-50",
              },
              {
                icon: Brain,
                title: "AI-Powered",
                description: "Chat with your data using Cerebras LLM. Generate formulas, analyze trends, and get instant insights.",
                color: "text-purple-500",
                bg: "bg-purple-50",
              },
              {
                icon: Table2,
                title: "400+ Formulas",
                description: "Full HyperFormula engine with Excel-compatible functions. SUM, VLOOKUP, INDEX/MATCH, and more.",
                color: "text-green-500",
                bg: "bg-green-50",
              },
              {
                icon: BarChart3,
                title: "Beautiful Charts",
                description: "20+ chart types powered by Nivo. Bar, line, pie, heatmap, radar, sankey, and many more.",
                color: "text-orange-500",
                bg: "bg-orange-50",
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Google OAuth, row-level permissions, share links with granular access control.",
                color: "text-red-500",
                bg: "bg-red-50",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-5`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section id="ai" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <Brain className="w-4 h-4" />
                AI-Powered
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Chat with your spreadsheet
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Ask questions about your data in plain English. Our AI understands your spreadsheet
                context and can generate formulas, create charts, and provide analysis instantly.
              </p>
              <ul className="space-y-4">
                {[
                  "Generate complex formulas from natural language",
                  "Analyze trends and patterns in your data",
                  "Create charts based on data descriptions",
                  "Get instant data summaries and insights",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-blue-700">U</span>
                  </div>
                  <div className="bg-white rounded-xl rounded-tl-none p-3 text-sm text-gray-700 border border-gray-100">
                    What&apos;s the total revenue for Q3 across all products?
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="bg-blue-600 rounded-xl rounded-tr-none p-3 text-sm text-white max-w-xs">
                    Based on your data, the total Q3 revenue is <strong>$102,500</strong>.
                    Product A contributed $61,300 (59.8%) and Product B contributed $41,200 (40.2%).
                    This represents a 12.3% increase from Q2.
                  </div>
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-purple-700" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-blue-700">U</span>
                  </div>
                  <div className="bg-white rounded-xl rounded-tl-none p-3 text-sm text-gray-700 border border-gray-100">
                    Create a formula for the yearly growth rate
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="bg-blue-600 rounded-xl rounded-tr-none p-3 text-sm text-white">
                    <code className="bg-blue-700/50 px-1.5 py-0.5 rounded text-xs">=((E2-B2)/B2)*100</code>
                    <p className="mt-1 text-blue-100 text-xs">This calculates the growth from Q1 to Q4 as a percentage.</p>
                  </div>
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-purple-700" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section id="charts" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            20+ chart types to visualize your data
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-16">
            From simple bar charts to complex Sankey diagrams. All powered by Nivo with
            drag-and-drop dashboard builder.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              "Bar Chart", "Line Chart", "Pie Chart", "Scatter Plot",
              "Heatmap", "Radar Chart", "Funnel Chart", "Treemap",
              "Sunburst", "Sankey", "Network", "Stream Chart",
              "Bump Chart", "Calendar", "Circle Pack", "Swarm Plot",
              "Waffle Chart", "Area Chart", "Bubble Chart", "Chord",
            ].map((chart, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all text-sm font-medium text-gray-700"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                {chart}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to supercharge your data?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join thousands of teams who have already switched to SheetUI.
            Start for free, no credit card required.
          </p>
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition shadow-lg shadow-gray-900/20"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Table2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-gray-900">SheetUI</span>
              </div>
              <p className="text-sm text-gray-500">
                Modern spreadsheet for modern teams. Fast, collaborative, and AI-powered.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#features" className="hover:text-gray-700">Features</a></li>
                <li><a href="#charts" className="hover:text-gray-700">Charts</a></li>
                <li><a href="#ai" className="hover:text-gray-700">AI Chat</a></li>
                <li><a href="#pricing" className="hover:text-gray-700">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-gray-700">Documentation</a></li>
                <li><a href="#" className="hover:text-gray-700">API Reference</a></li>
                <li><a href="#" className="hover:text-gray-700">Keyboard Shortcuts</a></li>
                <li><a href="#" className="hover:text-gray-700">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-gray-700">About</a></li>
                <li><a href="#" className="hover:text-gray-700">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gray-700">Terms of Service</a></li>
                <li><a href="#" className="hover:text-gray-700">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-500">
              Made With Love By Louati Mahdi
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <a href="https://github.com/mahdi1234-hub/sheetui" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
