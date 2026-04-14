"use client";

import { useSpreadsheetStore } from "@/store/spreadsheet-store";
import { coordsToCellRef } from "@/lib/utils";
import { FunctionSquare } from "lucide-react";

export default function FormulaBar() {
  const {
    selectedCell,
    sheets,
    activeSheetIndex,
    isEditing,
    editValue,
    setEditValue,
    startEditing,
    stopEditing,
    setCellValue,
  } = useSpreadsheetStore();

  const cellRef = selectedCell
    ? coordsToCellRef(selectedCell.row, selectedCell.col)
    : "";

  const sheet = sheets[activeSheetIndex];
  const cellKey = selectedCell ? `${selectedCell.row}:${selectedCell.col}` : "";
  const cell = sheet?.cells[cellKey];
  const displayValue = isEditing
    ? editValue
    : cell?.formula || String(cell?.value ?? "");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedCell) {
        if (editValue.startsWith("=")) {
          setCellValue(selectedCell.row, selectedCell.col, editValue, editValue);
        } else {
          const numVal = Number(editValue);
          setCellValue(
            selectedCell.row,
            selectedCell.col,
            isNaN(numVal) ? editValue : numVal
          );
        }
      }
      stopEditing();
    } else if (e.key === "Escape") {
      stopEditing();
    }
  };

  return (
    <div className="formula-bar">
      {/* Cell reference */}
      <div className="w-16 h-full flex items-center justify-center border-r border-gray-200 text-xs font-medium text-gray-700 flex-shrink-0">
        {cellRef}
      </div>

      {/* fx icon */}
      <div className="w-8 h-full flex items-center justify-center border-r border-gray-200 flex-shrink-0">
        <FunctionSquare className="w-4 h-4 text-gray-400" />
      </div>

      {/* Formula input */}
      <input
        type="text"
        className="flex-1 h-full px-2 text-sm outline-none bg-white"
        value={displayValue}
        onChange={(e) => {
          if (!isEditing) startEditing(e.target.value);
          else setEditValue(e.target.value);
        }}
        onFocus={() => {
          if (!isEditing) startEditing();
        }}
        onKeyDown={handleKeyDown}
        placeholder="Enter a value or formula..."
      />
    </div>
  );
}
