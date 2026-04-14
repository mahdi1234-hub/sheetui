"use client";

import { useState } from "react";
import { useSpreadsheetStore } from "@/store/spreadsheet-store";
import { X, Search, Replace } from "lucide-react";

export default function FindReplaceDialog() {
  const { sheets, activeSheetIndex, toggleFindReplace, setCellValue } = useSpreadsheetStore();
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [matchCase, setMatchCase] = useState(false);
  const [results, setResults] = useState<{ row: number; col: number }[]>([]);
  const [currentResult, setCurrentResult] = useState(-1);

  const sheet = sheets[activeSheetIndex];

  const doFind = () => {
    if (!findText || !sheet) return;
    const found: { row: number; col: number }[] = [];
    Object.entries(sheet.cells).forEach(([key, cell]) => {
      const val = String(cell.value ?? "");
      const search = matchCase ? findText : findText.toLowerCase();
      const target = matchCase ? val : val.toLowerCase();
      if (target.includes(search)) {
        const [r, c] = key.split(":").map(Number);
        found.push({ row: r, col: c });
      }
    });
    setResults(found);
    setCurrentResult(found.length > 0 ? 0 : -1);
  };

  const doReplace = () => {
    if (currentResult < 0 || !results[currentResult] || !sheet) return;
    const { row, col } = results[currentResult];
    const key = `${row}:${col}`;
    const cell = sheet.cells[key];
    if (cell) {
      const val = String(cell.value ?? "");
      const newVal = matchCase
        ? val.replace(findText, replaceText)
        : val.replace(new RegExp(findText, "i"), replaceText);
      setCellValue(row, col, newVal);
    }
    doFind(); // Re-search
  };

  const doReplaceAll = () => {
    if (!sheet || !findText) return;
    Object.entries(sheet.cells).forEach(([key, cell]) => {
      const val = String(cell.value ?? "");
      const search = matchCase ? findText : findText.toLowerCase();
      const target = matchCase ? val : val.toLowerCase();
      if (target.includes(search)) {
        const [r, c] = key.split(":").map(Number);
        const regex = new RegExp(findText, matchCase ? "g" : "gi");
        const newVal = val.replace(regex, replaceText);
        setCellValue(r, c, newVal);
      }
    });
    doFind();
  };

  return (
    <div className="fixed top-16 right-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-medium text-gray-900">Find and Replace</h3>
        <button onClick={toggleFindReplace} className="p-1 rounded hover:bg-gray-100">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Find</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doFind()}
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search..."
              autoFocus
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Replace with</label>
          <div className="relative">
            <Replace className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Replace..."
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-xs text-gray-600">
          <input
            type="checkbox"
            checked={matchCase}
            onChange={(e) => setMatchCase(e.target.checked)}
            className="rounded"
          />
          Match case
        </label>
        {results.length > 0 && (
          <p className="text-xs text-gray-500">
            {currentResult + 1} of {results.length} results
          </p>
        )}
        <div className="flex gap-2">
          <button
            onClick={doFind}
            className="flex-1 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Find
          </button>
          <button
            onClick={doReplace}
            disabled={currentResult < 0}
            className="flex-1 px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            Replace
          </button>
          <button
            onClick={doReplaceAll}
            className="flex-1 px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            All
          </button>
        </div>
      </div>
    </div>
  );
}
