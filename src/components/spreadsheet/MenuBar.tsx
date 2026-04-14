"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSpreadsheetStore } from "@/store/spreadsheet-store";
import {
  FilePlus,
  RotateCcw,
  Copy,
  Upload,
  Share2,
  Pencil,
  Download,
  Clock,
  Trash2,
  Settings,
  ArrowLeft,
  Undo2,
  Redo2,
  Scissors,
  ClipboardCopy,
  Image,
  Search,
  EyeOff,
  Code2,
  MessageSquare,
  Columns,
  ZoomIn,
  ArrowUpDown,
  Filter,
  XCircle,
  SplitSquareHorizontal,
  ShieldCheck,
  RefreshCw,
  Clock4,
  Lock,
  FileUp,
  Link2,
  Database,
  BarChart3,
  Table2,
  Layers,
  CheckSquare,
  ExternalLink,
  BookOpen,
  Keyboard,
  Bell,
  MessageCircle,
  Activity,
  ChevronRight,
} from "lucide-react";

type MenuId = "file" | "edit" | "view" | "data" | "insert" | "help" | null;

interface MenuItem {
  label: string;
  icon?: React.ElementType;
  shortcut?: string;
  action?: () => void;
  separator?: boolean;
  submenu?: MenuItem[];
  external?: boolean;
}

export default function MenuBar() {
  const [openMenu, setOpenMenu] = useState<MenuId>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const store = useSpreadsheetStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fileMenuItems: MenuItem[] = [
    { label: "New", icon: FilePlus, shortcut: "Ctrl N", action: () => createNewWorkbook() },
    { label: "Restart", icon: RotateCcw },
    { label: "Make a copy", icon: Copy, external: true, action: () => duplicateWorkbook() },
    { label: "Import", icon: Upload },
    { separator: true, label: "" },
    { label: "Share", icon: Share2 },
    { label: "Rename", icon: Pencil, action: () => renameWorkbook() },
    { label: "Download as CSV", icon: Download, action: () => downloadCSV() },
    { label: "Version history", icon: Clock, submenu: [] },
    { label: "Delete", icon: Trash2, action: () => deleteWorkbook() },
    { separator: true, label: "" },
    { label: "Settings", icon: Settings },
    { separator: true, label: "" },
    { label: "Back to Workbooks", icon: ArrowLeft, action: () => router.push("/dashboard") },
  ];

  const editMenuItems: MenuItem[] = [
    { label: "Undo", icon: Undo2, shortcut: "Ctrl Z", action: () => store.undo() },
    { label: "Redo", icon: Redo2, shortcut: "Ctrl Y", action: () => store.redo() },
    { separator: true, label: "" },
    { label: "Cut", icon: Scissors, shortcut: "Ctrl X", action: () => store.cut() },
    { label: "Copy", icon: ClipboardCopy, shortcut: "Ctrl C", action: () => store.copy() },
    { label: "Copy as image", icon: Image },
    { separator: true, label: "" },
    { label: "Find and replace", icon: Search, shortcut: "Ctrl H", action: () => store.toggleFindReplace() },
  ];

  const viewMenuItems: MenuItem[] = [
    {
      label: store.sheets[store.activeSheetIndex]?.showGridlines ? "Hide gridlines" : "Show gridlines",
      icon: EyeOff,
      action: () => store.toggleGridlines(),
    },
    { label: "Show sidebar", icon: Code2, action: () => store.setSidebarPanel("ai") },
    { label: "AI Chat", icon: MessageSquare, action: () => store.setSidebarPanel("ai") },
    { label: "Freeze", icon: Columns, submenu: [
      { label: "Freeze 1 row", action: () => store.setFrozenRows(1) },
      { label: "Freeze 2 rows", action: () => store.setFrozenRows(2) },
      { label: "Unfreeze rows", action: () => store.setFrozenRows(0) },
      { label: "Freeze 1 column", action: () => store.setFrozenCols(1) },
      { label: "Unfreeze columns", action: () => store.setFrozenCols(0) },
    ]},
    { label: "Comments", icon: MessageCircle, submenu: [] },
    { label: "Zoom", icon: ZoomIn, submenu: [
      { label: "50%", action: () => store.setZoom(50) },
      { label: "75%", action: () => store.setZoom(75) },
      { label: "100%", action: () => store.setZoom(100) },
      { label: "125%", action: () => store.setZoom(125) },
      { label: "150%", action: () => store.setZoom(150) },
      { label: "200%", action: () => store.setZoom(200) },
    ]},
  ];

  const dataMenuItems: MenuItem[] = [
    { label: "Sort", icon: ArrowUpDown },
    { label: "Filter", icon: Filter },
    { separator: true, label: "" },
    { label: "Remove duplicates", icon: XCircle },
    { label: "Split text to columns", icon: SplitSquareHorizontal },
    { label: "Data validation", icon: ShieldCheck },
    { label: "Recalculate this sheet", icon: RefreshCw },
    { label: "Recalculate all", icon: RefreshCw },
    { label: "Sync time functions", icon: Clock4 },
    { label: "Lock cells", icon: Lock, submenu: [] },
    { separator: true, label: "" },
    { label: "Import file", icon: FileUp },
    { label: "Import from URL", icon: Link2 },
    { label: "Import from Amazon S3", icon: Database },
  ];

  const insertMenuItems: MenuItem[] = [
    { label: "Chart", icon: BarChart3 },
    { label: "Pivot table", icon: Table2 },
    { label: "Slicer", icon: Layers },
    { label: "Dropdown", icon: CheckSquare },
    { label: "Connected table", icon: Database },
  ];

  const helpMenuItems: MenuItem[] = [
    { label: "Documentation", icon: BookOpen, external: true },
    { label: "Keyboard shortcuts", icon: Keyboard, external: true },
    { label: "Product updates", icon: Bell, external: true },
    { label: "Submit feedback", icon: MessageCircle, external: true },
    { label: "Diagnostics", icon: Activity },
  ];

  const menus: { id: MenuId; label: string; items: MenuItem[] }[] = [
    { id: "file", label: "File", items: fileMenuItems },
    { id: "edit", label: "Edit", items: editMenuItems },
    { id: "view", label: "View", items: viewMenuItems },
    { id: "data", label: "Data", items: dataMenuItems },
    { id: "insert", label: "Insert", items: insertMenuItems },
    { id: "help", label: "Help", items: helpMenuItems },
  ];

  const createNewWorkbook = async () => {
    try {
      const res = await fetch("/api/workbooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Untitled Workbook" }),
      });
      if (res.ok) {
        const wb = await res.json();
        router.push(`/workbook/${wb.id}`);
      }
    } catch (err) {
      console.error(err);
    }
    setOpenMenu(null);
  };

  const duplicateWorkbook = async () => {
    if (!store.workbookId) return;
    try {
      const res = await fetch(`/api/workbooks/${store.workbookId}/duplicate`, { method: "POST" });
      if (res.ok) {
        const wb = await res.json();
        router.push(`/workbook/${wb.id}`);
      }
    } catch (err) {
      console.error(err);
    }
    setOpenMenu(null);
  };

  const renameWorkbook = () => {
    const newName = prompt("Rename workbook:", store.workbookName);
    if (newName && store.workbookId) {
      store.setWorkbookName(newName);
      fetch(`/api/workbooks/${store.workbookId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
    }
    setOpenMenu(null);
  };

  const deleteWorkbook = async () => {
    if (!store.workbookId) return;
    if (confirm("Are you sure you want to delete this workbook?")) {
      await fetch(`/api/workbooks/${store.workbookId}`, { method: "DELETE" });
      router.push("/dashboard");
    }
    setOpenMenu(null);
  };

  const downloadCSV = () => {
    const sheet = store.sheets[store.activeSheetIndex];
    if (!sheet) return;

    let maxRow = 0;
    let maxCol = 0;
    Object.keys(sheet.cells).forEach((key) => {
      const [r, c] = key.split(":").map(Number);
      maxRow = Math.max(maxRow, r);
      maxCol = Math.max(maxCol, c);
    });

    const rows: string[][] = [];
    for (let r = 0; r <= maxRow; r++) {
      const row: string[] = [];
      for (let c = 0; c <= maxCol; c++) {
        const cell = sheet.cells[`${r}:${c}`];
        row.push(String(cell?.value ?? ""));
      }
      rows.push(row);
    }

    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${store.workbookName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setOpenMenu(null);
  };

  const [hoveredSubmenu, setHoveredSubmenu] = useState<string | null>(null);

  return (
    <div className="flex items-center h-9 bg-white border-b border-gray-200 px-2" ref={menuRef}>
      {/* Logo */}
      <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded flex items-center justify-center mr-2 flex-shrink-0">
        <Table2 className="w-4 h-4 text-white" />
      </div>

      {/* Menu triggers */}
      {menus.map((menu) => (
        <div key={menu.id} className="relative">
          <button
            className={`menu-trigger ${openMenu === menu.id ? "bg-gray-100" : ""}`}
            onClick={() => setOpenMenu(openMenu === menu.id ? null : menu.id)}
            onMouseEnter={() => openMenu && setOpenMenu(menu.id)}
          >
            {menu.label}
          </button>

          {openMenu === menu.id && (
            <div className="absolute left-0 top-full mt-0.5 menu-content animate-fade-in" style={{ animationDuration: "0.1s" }}>
              {menu.items.map((item, i) =>
                item.separator ? (
                  <div key={i} className="menu-separator" />
                ) : (
                  <div
                    key={i}
                    className="menu-item relative"
                    onClick={() => {
                      if (item.action && !item.submenu) {
                        item.action();
                        setOpenMenu(null);
                      }
                    }}
                    onMouseEnter={() => item.submenu ? setHoveredSubmenu(item.label) : setHoveredSubmenu(null)}
                    onMouseLeave={() => setHoveredSubmenu(null)}
                  >
                    <div className="flex items-center">
                      {item.icon && <item.icon className="menu-item-icon" />}
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.shortcut && <span className="menu-shortcut">{item.shortcut}</span>}
                      {item.external && <ExternalLink className="w-3 h-3 text-gray-400" />}
                      {item.submenu && <ChevronRight className="w-3 h-3 text-gray-400" />}
                    </div>

                    {/* Submenu */}
                    {item.submenu && hoveredSubmenu === item.label && (
                      <div className="absolute left-full top-0 ml-0.5 menu-content">
                        {item.submenu.map((sub, j) => (
                          <div
                            key={j}
                            className="menu-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              sub.action?.();
                              setOpenMenu(null);
                            }}
                          >
                            <span>{sub.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      ))}

      {/* Workbook name (center) */}
      <div className="flex-1 flex items-center justify-center">
        <span className="text-sm font-medium text-gray-700">{store.workbookName}</span>
        <button
          onClick={renameWorkbook}
          className="ml-1 p-0.5 rounded hover:bg-gray-100"
        >
          <Pencil className="w-3 h-3 text-gray-400" />
        </button>
      </div>

      {/* Right side buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => store.setSidebarPanel("ai")}
          className={`px-3 py-1 text-xs font-medium rounded ${
            store.sidebarPanel === "ai" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          AI Chat
        </button>
        <button
          onClick={() => store.setSidebarPanel("data")}
          className={`px-3 py-1 text-xs font-medium rounded ${
            store.sidebarPanel === "data" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Data
        </button>
        <button
          onClick={() => store.setSidebarPanel("code")}
          className={`px-3 py-1 text-xs font-medium rounded ${
            store.sidebarPanel === "code" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          &lt;/&gt; Code
        </button>
      </div>

      {/* Share button */}
      <button className="ml-2 px-4 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition">
        Share
      </button>

      {/* Settings & avatar */}
      <button className="ml-2 p-1.5 rounded hover:bg-gray-100">
        <Settings className="w-4 h-4 text-gray-500" />
      </button>
      <div className="ml-1 w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center">
        <span className="text-xs text-gray-600 font-medium">U</span>
      </div>
    </div>
  );
}
