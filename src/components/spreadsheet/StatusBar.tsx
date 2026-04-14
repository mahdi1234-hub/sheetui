"use client";

import { useSpreadsheetStore } from "@/store/spreadsheet-store";
import { coordsToCellRef } from "@/lib/utils";

export default function StatusBar() {
  const { selectedCell, selectedRange, sheets, activeSheetIndex, isSaving, lastSaved } =
    useSpreadsheetStore();

  const sheet = sheets[activeSheetIndex];

  // Calculate stats for selected range
  let count = 0;
  let sum = 0;
  let hasNumbers = false;

  if (sheet && selectedRange) {
    for (let r = selectedRange.startRow; r <= selectedRange.endRow; r++) {
      for (let c = selectedRange.startCol; c <= selectedRange.endCol; c++) {
        const cell = sheet.cells[`${r}:${c}`];
        if (cell?.value !== null && cell?.value !== undefined && cell?.value !== "") {
          count++;
          if (typeof cell.value === "number") {
            sum += cell.value;
            hasNumbers = true;
          }
        }
      }
    }
  }

  return (
    <div className="flex items-center justify-between h-6 bg-gray-50 border-t border-gray-200 px-3 text-xs text-gray-500">
      <div className="flex items-center gap-4">
        {selectedCell && (
          <span>{coordsToCellRef(selectedCell.row, selectedCell.col)}</span>
        )}
        {isSaving && <span className="text-blue-500">Saving...</span>}
        {!isSaving && lastSaved && (
          <span>Last saved {lastSaved.toLocaleTimeString()}</span>
        )}
      </div>
      <div className="flex items-center gap-4">
        {selectedRange && count > 0 && (
          <>
            <span>Count: {count}</span>
            {hasNumbers && (
              <>
                <span>Sum: {sum.toLocaleString()}</span>
                <span>Avg: {(sum / count).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </>
            )}
          </>
        )}
        <span>Zoom: {sheet?.zoom || 100}%</span>
      </div>
    </div>
  );
}
