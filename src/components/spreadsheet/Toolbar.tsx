"use client";

import { useState } from "react";
import { useSpreadsheetStore } from "@/store/spreadsheet-store";
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Type,
  Paintbrush,
  AlignLeft,
  AlignCenter,
  AlignRight,
  WrapText,
  Merge,
  DollarSign,
  Percent,
  Hash,
  Minus,
  Plus,
  MoreHorizontal,
  Grid3X3,
  ChevronDown,
  BarChart3,
  MessageSquare,
} from "lucide-react";

export default function Toolbar() {
  const store = useSpreadsheetStore();
  const [fontSize, setFontSize] = useState(13);
  const [numberFormat, setNumberFormat] = useState("Automatic");
  const zoom = store.sheets[store.activeSheetIndex]?.zoom || 100;

  const getCurrentCellFormat = () => {
    if (!store.selectedCell) return {};
    const sheet = store.sheets[store.activeSheetIndex];
    const key = `${store.selectedCell.row}:${store.selectedCell.col}`;
    return sheet?.cells[key]?.format || {};
  };

  const format = getCurrentCellFormat();

  const applyFormat = (fmt: Record<string, unknown>) => {
    if (!store.selectedCell) return;
    if (store.selectedRange) {
      store.setRangeFormat(
        store.selectedRange.startRow,
        store.selectedRange.startCol,
        store.selectedRange.endRow,
        store.selectedRange.endCol,
        fmt
      );
    } else {
      store.setCellFormat(store.selectedCell.row, store.selectedCell.col, fmt);
    }
  };

  return (
    <div className="flex items-center h-9 bg-white border-b border-gray-200 px-2 gap-0.5 overflow-x-auto">
      {/* Undo/Redo */}
      <button className="toolbar-btn" onClick={() => store.undo()} title="Undo (Ctrl+Z)">
        <Undo2 className="w-4 h-4" />
      </button>
      <button className="toolbar-btn" onClick={() => store.redo()} title="Redo (Ctrl+Y)">
        <Redo2 className="w-4 h-4" />
      </button>

      <div className="toolbar-separator" />

      {/* Zoom */}
      <div className="flex items-center px-1">
        <select
          value={zoom}
          onChange={(e) => store.setZoom(Number(e.target.value))}
          className="text-xs bg-transparent border border-gray-300 rounded px-1.5 py-0.5 text-gray-600 cursor-pointer"
        >
          <option value={50}>50%</option>
          <option value={75}>75%</option>
          <option value={100}>100%</option>
          <option value={125}>125%</option>
          <option value={150}>150%</option>
          <option value={200}>200%</option>
        </select>
      </div>

      <div className="toolbar-separator" />

      {/* Text formatting */}
      <button
        className={`toolbar-btn ${format.bold ? "active" : ""}`}
        onClick={() => applyFormat({ bold: !format.bold })}
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        className={`toolbar-btn ${format.italic ? "active" : ""}`}
        onClick={() => applyFormat({ italic: !format.italic })}
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        className={`toolbar-btn ${format.underline ? "active" : ""}`}
        onClick={() => applyFormat({ underline: !format.underline })}
        title="Underline (Ctrl+U)"
      >
        <Underline className="w-4 h-4" />
      </button>

      <div className="toolbar-separator" />

      {/* Font size */}
      <div className="flex items-center gap-0.5">
        <button
          className="toolbar-btn"
          onClick={() => {
            const newSize = Math.max(6, fontSize - 1);
            setFontSize(newSize);
            applyFormat({ fontSize: newSize });
          }}
        >
          <Minus className="w-3 h-3" />
        </button>
        <input
          type="number"
          value={fontSize}
          onChange={(e) => {
            const v = parseInt(e.target.value) || 13;
            setFontSize(v);
            applyFormat({ fontSize: v });
          }}
          className="w-8 text-center text-xs border border-gray-300 rounded py-0.5"
        />
        <button
          className="toolbar-btn"
          onClick={() => {
            const newSize = Math.min(72, fontSize + 1);
            setFontSize(newSize);
            applyFormat({ fontSize: newSize });
          }}
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      <div className="toolbar-separator" />

      {/* Text color */}
      <div className="relative group">
        <button className="toolbar-btn flex items-center gap-0.5" title="Text color">
          <Type className="w-4 h-4" />
          <ChevronDown className="w-2.5 h-2.5" />
        </button>
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 hidden group-hover:grid grid-cols-8 gap-1 z-50">
          {[
            "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#ffffff",
            "#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff",
            "#9900ff", "#ff00ff", "#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3",
            "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc",
          ].map((color) => (
            <button
              key={color}
              className="w-5 h-5 rounded border border-gray-200 hover:scale-110 transition"
              style={{ backgroundColor: color }}
              onClick={() => applyFormat({ textColor: color })}
            />
          ))}
        </div>
      </div>

      {/* Background color */}
      <div className="relative group">
        <button className="toolbar-btn flex items-center gap-0.5" title="Fill color">
          <Paintbrush className="w-4 h-4" />
          <ChevronDown className="w-2.5 h-2.5" />
        </button>
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 hidden group-hover:grid grid-cols-8 gap-1 z-50">
          {[
            "#ffffff", "#f3f3f3", "#e8e8e8", "#d9d9d9", "#cccccc", "#b7b7b7", "#999999", "#666666",
            "#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3",
            "#d9d2e9", "#ead1dc", "#dd7e6b", "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9",
            "#a4c2f4", "#9fc5e8", "#b4a7d6", "#d5a6bd",
          ].map((color) => (
            <button
              key={color}
              className="w-5 h-5 rounded border border-gray-200 hover:scale-110 transition"
              style={{ backgroundColor: color }}
              onClick={() => applyFormat({ bgColor: color })}
            />
          ))}
        </div>
      </div>

      {/* Borders */}
      <button className="toolbar-btn" title="Borders">
        <Grid3X3 className="w-4 h-4" />
      </button>

      <div className="toolbar-separator" />

      {/* Number formatting */}
      <button className="toolbar-btn" title="Currency" onClick={() => applyFormat({ numberFormat: "$#,##0.00" })}>
        <DollarSign className="w-4 h-4" />
      </button>
      <button className="toolbar-btn" title="Percent" onClick={() => applyFormat({ numberFormat: "0.00%" })}>
        <Percent className="w-4 h-4" />
      </button>
      <button className="toolbar-btn" title="Decrease decimal">
        <Hash className="w-4 h-4" />
      </button>

      <div className="toolbar-separator" />

      {/* Number format dropdown */}
      <select
        value={numberFormat}
        onChange={(e) => setNumberFormat(e.target.value)}
        className="text-xs bg-transparent border border-gray-300 rounded px-1.5 py-0.5 text-gray-600 cursor-pointer"
      >
        <option>Automatic</option>
        <option>Number</option>
        <option>Currency</option>
        <option>Percent</option>
        <option>Date</option>
        <option>Time</option>
        <option>Text</option>
      </select>

      <div className="toolbar-separator" />

      {/* Alignment */}
      <button
        className={`toolbar-btn ${format.horizontalAlign === "left" ? "active" : ""}`}
        onClick={() => applyFormat({ horizontalAlign: "left" })}
        title="Align left"
      >
        <AlignLeft className="w-4 h-4" />
      </button>
      <button
        className={`toolbar-btn ${format.horizontalAlign === "center" ? "active" : ""}`}
        onClick={() => applyFormat({ horizontalAlign: "center" })}
        title="Align center"
      >
        <AlignCenter className="w-4 h-4" />
      </button>
      <button
        className={`toolbar-btn ${format.horizontalAlign === "right" ? "active" : ""}`}
        onClick={() => applyFormat({ horizontalAlign: "right" })}
        title="Align right"
      >
        <AlignRight className="w-4 h-4" />
      </button>

      <div className="toolbar-separator" />

      {/* Wrap & Merge */}
      <button className="toolbar-btn" title="Wrap text">
        <WrapText className="w-4 h-4" />
      </button>
      <button className="toolbar-btn" title="Merge cells">
        <Merge className="w-4 h-4" />
      </button>

      <div className="toolbar-separator" />

      {/* More */}
      <button className="toolbar-btn" title="More formatting">
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {/* Floating toolbar icons (right side from screenshot) */}
      <div className="ml-auto flex items-center gap-1 border-l border-gray-200 pl-2">
        <button className="toolbar-btn" title="Insert chart">
          <BarChart3 className="w-4 h-4" />
        </button>
        <button className="toolbar-btn" title="Comments">
          <MessageSquare className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


