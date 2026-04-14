"use client";

import { useEffect } from "react";
import { useSpreadsheetStore } from "@/store/spreadsheet-store";
import SpreadsheetApp from "@/components/spreadsheet/SpreadsheetApp";

export default function DemoPage() {
  const { setWorkbook, setSheets, setCellValue } = useSpreadsheetStore();

  useEffect(() => {
    // Set up demo workbook with sample data
    setWorkbook("demo", "Demo Workbook - SheetUI");
    setSheets([
      {
        id: "demo-sheet-1",
        name: "Sheet0",
        cells: {},
        columnWidths: { 0: 140, 1: 100, 2: 100, 3: 100, 4: 100 },
        rowHeights: {},
        frozenRows: 0,
        frozenCols: 0,
        showGridlines: true,
        zoom: 100,
      },
    ]);

    // Add sample data
    const sampleData: [number, number, string | number][] = [
      [0, 0, "Revenue"],
      [0, 1, "Q1"],
      [0, 2, "Q2"],
      [0, 3, "Q3"],
      [0, 4, "Q4"],
      [1, 0, "Product A"],
      [1, 1, 45200],
      [1, 2, 52800],
      [1, 3, 61300],
      [1, 4, 58900],
      [2, 0, "Product B"],
      [2, 1, 32100],
      [2, 2, 38400],
      [2, 3, 41200],
      [2, 4, 45600],
      [3, 0, "Product C"],
      [3, 1, 18500],
      [3, 2, 22100],
      [3, 3, 25800],
      [3, 4, 29300],
      [4, 0, "Total"],
      [5, 0, ""],
      [6, 0, "Expenses"],
      [6, 1, "Q1"],
      [6, 2, "Q2"],
      [6, 3, "Q3"],
      [6, 4, "Q4"],
      [7, 0, "Marketing"],
      [7, 1, 12000],
      [7, 2, 14500],
      [7, 3, 16000],
      [7, 4, 15200],
      [8, 0, "Operations"],
      [8, 1, 8500],
      [8, 2, 9200],
      [8, 3, 10100],
      [8, 4, 10800],
      [9, 0, "R&D"],
      [9, 1, 22000],
      [9, 2, 24000],
      [9, 3, 26500],
      [9, 4, 28000],
    ];

    // Small delay to ensure store is ready
    setTimeout(() => {
      sampleData.forEach(([row, col, value]) => {
        setCellValue(row, col, value);
      });
    }, 100);
  }, [setWorkbook, setSheets, setCellValue]);

  return <SpreadsheetApp />;
}
