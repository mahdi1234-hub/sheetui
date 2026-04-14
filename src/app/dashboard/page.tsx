"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Plus,
  Table2,
  MoreHorizontal,
  Trash2,
  Copy,
  Pencil,
  Share2,
  Clock,
  Search,
  LogOut,
  Settings,
  Grid3X3,
  List,
} from "lucide-react";

interface Workbook {
  id: string;
  name: string;
  updatedAt: string;
  createdAt: string;
  thumbnail?: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [workbooks, setWorkbooks] = useState<Workbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchWorkbooks();
    }
  }, [session]);

  const fetchWorkbooks = async () => {
    try {
      const res = await fetch("/api/workbooks");
      if (res.ok) {
        const data = await res.json();
        setWorkbooks(data);
      }
    } catch (error) {
      console.error("Failed to fetch workbooks:", error);
    } finally {
      setLoading(false);
    }
  };

  const createWorkbook = async () => {
    try {
      const res = await fetch("/api/workbooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Untitled Workbook" }),
      });
      if (res.ok) {
        const workbook = await res.json();
        router.push(`/workbook/${workbook.id}`);
      }
    } catch (error) {
      console.error("Failed to create workbook:", error);
    }
  };

  const deleteWorkbook = async (id: string) => {
    try {
      await fetch(`/api/workbooks/${id}`, { method: "DELETE" });
      setWorkbooks((prev) => prev.filter((w) => w.id !== id));
      setContextMenu(null);
    } catch (error) {
      console.error("Failed to delete workbook:", error);
    }
  };

  const duplicateWorkbook = async (id: string) => {
    try {
      const res = await fetch(`/api/workbooks/${id}/duplicate`, { method: "POST" });
      if (res.ok) {
        fetchWorkbooks();
      }
      setContextMenu(null);
    } catch (error) {
      console.error("Failed to duplicate workbook:", error);
    }
  };

  const filteredWorkbooks = workbooks.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" onClick={() => setContextMenu(null)}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Table2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">SheetUI</span>
            </div>

            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search workbooks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={createWorkbook}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                <Plus className="w-4 h-4" />
                New Workbook
              </button>
              <div className="relative group">
                <button className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium text-sm">
                  {session?.user?.name?.[0] || "U"}
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 hidden group-hover:block">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                    <p className="text-xs text-gray-500">{session?.user?.email}</p>
                  </div>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Workbooks</h1>
            <p className="text-sm text-gray-500 mt-1">
              {filteredWorkbooks.length} workbook{filteredWorkbooks.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            >
              <Grid3X3 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg ${viewMode === "list" ? "bg-gray-200" : "hover:bg-gray-100"}`}
            >
              <List className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {filteredWorkbooks.length === 0 && !loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Table2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No workbooks yet</h3>
            <p className="text-gray-500 mb-6">Create your first workbook to get started.</p>
            <button
              onClick={createWorkbook}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              Create Workbook
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* New workbook card */}
            <button
              onClick={createWorkbook}
              className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-blue-400 hover:bg-blue-50/30 transition min-h-[200px]"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">New Workbook</span>
            </button>

            {filteredWorkbooks.map((workbook) => (
              <div
                key={workbook.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-gray-300 transition cursor-pointer group"
                onClick={() => router.push(`/workbook/${workbook.id}`)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setContextMenu({ id: workbook.id, x: e.clientX, y: e.clientY });
                }}
              >
                <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <div className="grid grid-cols-4 gap-px w-20 h-16">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="bg-white border border-gray-200"></div>
                    ))}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 text-sm truncate">{workbook.name}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setContextMenu({ id: workbook.id, x: e.clientX, y: e.clientY });
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-100"
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {new Date(workbook.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
            {filteredWorkbooks.map((workbook) => (
              <div
                key={workbook.id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/workbook/${workbook.id}`)}
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Table2 className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm truncate">{workbook.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Last modified {new Date(workbook.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setContextMenu({ id: workbook.id, x: e.clientX, y: e.clientY });
                  }}
                  className="p-2 rounded hover:bg-gray-100"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-1 w-48 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              router.push(`/workbook/${contextMenu.id}`);
              setContextMenu(null);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Pencil className="w-4 h-4" />
            Open
          </button>
          <button
            onClick={() => duplicateWorkbook(contextMenu.id)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Copy className="w-4 h-4" />
            Duplicate
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <div className="border-t border-gray-100 my-1"></div>
          <button
            onClick={() => deleteWorkbook(contextMenu.id)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
