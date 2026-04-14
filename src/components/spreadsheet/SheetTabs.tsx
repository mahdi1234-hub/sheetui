"use client";

import { useState } from "react";
import { useSpreadsheetStore } from "@/store/spreadsheet-store";
import { Plus, Menu, MoreHorizontal, X } from "lucide-react";

export default function SheetTabs() {
  const { sheets, activeSheetIndex, setActiveSheet, addSheet, removeSheet, renameSheet } =
    useSpreadsheetStore();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [contextMenu, setContextMenu] = useState<{ index: number; x: number; y: number } | null>(null);

  const handleDoubleClick = (index: number) => {
    setEditingIndex(index);
    setEditName(sheets[index].name);
  };

  const handleRename = (index: number) => {
    if (editName.trim()) {
      renameSheet(index, editName.trim());
    }
    setEditingIndex(null);
  };

  return (
    <div className="flex items-center h-8 bg-gray-50 border-t border-gray-200 relative">
      {/* Add sheet button */}
      <button
        onClick={() => addSheet()}
        className="px-2 h-full flex items-center justify-center hover:bg-gray-100 border-r border-gray-200"
        title="Add sheet"
      >
        <Plus className="w-4 h-4 text-gray-500" />
      </button>

      {/* Menu button */}
      <button className="px-2 h-full flex items-center justify-center hover:bg-gray-100 border-r border-gray-200">
        <Menu className="w-4 h-4 text-gray-500" />
      </button>

      {/* Sheet tabs */}
      <div className="flex-1 flex items-center overflow-x-auto">
        {sheets.map((sheet, index) => (
          <div
            key={sheet.id}
            className={`sheet-tab flex items-center gap-1 ${
              index === activeSheetIndex ? "active" : ""
            }`}
            style={sheet.color ? { borderBottomColor: sheet.color } : undefined}
            onClick={() => setActiveSheet(index)}
            onDoubleClick={() => handleDoubleClick(index)}
            onContextMenu={(e) => {
              e.preventDefault();
              setContextMenu({ index, x: e.clientX, y: e.clientY });
            }}
          >
            {editingIndex === index ? (
              <input
                autoFocus
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={() => handleRename(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename(index);
                  if (e.key === "Escape") setEditingIndex(null);
                }}
                className="w-20 text-xs bg-white border border-blue-400 rounded px-1 outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="text-xs">{sheet.name}</span>
            )}
          </div>
        ))}
      </div>

      {/* Scrollbar placeholder */}
      <div className="flex-1 h-full bg-gray-100" />

      {/* Context menu */}
      {contextMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setContextMenu(null)}
          />
          <div
            className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-1 w-40 z-50"
            style={{ left: contextMenu.x, top: contextMenu.y - 120 }}
          >
            <button
              className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => {
                handleDoubleClick(contextMenu.index);
                setContextMenu(null);
              }}
            >
              Rename
            </button>
            <button
              className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => {
                addSheet(`${sheets[contextMenu.index].name} (Copy)`);
                setContextMenu(null);
              }}
            >
              Duplicate
            </button>
            {sheets.length > 1 && (
              <button
                className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                onClick={() => {
                  removeSheet(contextMenu.index);
                  setContextMenu(null);
                }}
              >
                Delete
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
