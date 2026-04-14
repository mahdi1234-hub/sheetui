"use client";

import { useCallback, useMemo, useRef, useEffect, useState } from "react";
import DataEditor, {
  GridCellKind,
  GridCell,
  GridColumn,
  Item,
  EditableGridCell,
  CompactSelection,
} from "@glideapps/glide-data-grid";
import "@glideapps/glide-data-grid/dist/index.css";
import { useSpreadsheetStore } from "@/store/spreadsheet-store";
import { columnIndexToLetter } from "@/lib/utils";
import HyperFormula from "hyperformula";

const NUM_ROWS = 1000;
const NUM_COLS = 26;

export default function Grid() {
  const store = useSpreadsheetStore();
  const sheet = store.sheets[store.activeSheetIndex];
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Initialize HyperFormula
  const hfEngine = useMemo(() => {
    const hf = HyperFormula.buildEmpty({ licenseKey: "gpl-v3" });
    if (hf.getSheetName(0) === undefined) {
      hf.addSheet("Sheet0");
    }
    return hf;
  }, []);

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Sync cells to HyperFormula when they change
  useEffect(() => {
    if (!sheet || !hfEngine) return;
    try {
      const sheetName = hfEngine.getSheetName(0);
      if (!sheetName) return;
      const sheetId = hfEngine.getSheetId(sheetName);
      if (sheetId === undefined) return;

      Object.entries(sheet.cells).forEach(([key, cell]) => {
        const [r, c] = key.split(":").map(Number);
        try {
          if (cell.formula) {
            hfEngine.setCellContents({ sheet: sheetId, row: r, col: c }, cell.formula);
          } else if (cell.value !== null && cell.value !== undefined) {
            hfEngine.setCellContents({ sheet: sheetId, row: r, col: c }, cell.value as string | number | boolean);
          }
        } catch {
          // ignore formula errors
        }
      });
    } catch {
      // ignore HF errors
    }
  }, [sheet?.cells, hfEngine, sheet]);

  const columns: GridColumn[] = useMemo(() => {
    return Array.from({ length: NUM_COLS }, (_, i) => ({
      title: columnIndexToLetter(i),
      id: String(i),
      width: sheet?.columnWidths[i] || 100,
    }));
  }, [sheet?.columnWidths]);

  const getSheetId = useCallback(() => {
    try {
      const sheetName = hfEngine.getSheetName(0);
      if (!sheetName) return undefined;
      return hfEngine.getSheetId(sheetName);
    } catch {
      return undefined;
    }
  }, [hfEngine]);

  const getCellContent = useCallback(
    ([col, row]: Item): GridCell => {
      if (!sheet) {
        return { kind: GridCellKind.Text, data: "", displayData: "", allowOverlay: true };
      }

      const key = `${row}:${col}`;
      const cell = sheet.cells[key];

      if (!cell) {
        return { kind: GridCellKind.Text, data: "", displayData: "", allowOverlay: true };
      }

      let displayValue = String(cell.value ?? "");

      // If there's a formula, try to evaluate it
      if (cell.formula) {
        try {
          const sheetId = getSheetId();
          if (sheetId !== undefined) {
            const result = hfEngine.getCellValue({ sheet: sheetId, row, col });
            if (result !== null && result !== undefined && typeof result !== "object") {
              displayValue = String(result);
            }
          }
        } catch {
          displayValue = cell.formula;
        }
      }

      // Format number
      if (cell.format?.numberFormat && typeof cell.value === "number") {
        if (cell.format.numberFormat.includes("$")) {
          displayValue = `$${cell.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
        } else if (cell.format.numberFormat.includes("%")) {
          displayValue = `${(cell.value * 100).toFixed(2)}%`;
        }
      }

      return {
        kind: GridCellKind.Text,
        data: cell.formula || String(cell.value ?? ""),
        displayData: displayValue,
        allowOverlay: true,
        themeOverride: {
          ...(cell.format?.bold && { baseFontStyle: "bold" }),
          ...(cell.format?.textColor && { textDark: cell.format.textColor }),
          ...(cell.format?.bgColor && { bgCell: cell.format.bgColor }),
        },
      };
    },
    [sheet, hfEngine, getSheetId]
  );

  const onCellEdited = useCallback(
    ([col, row]: Item, newValue: EditableGridCell) => {
      if (newValue.kind !== GridCellKind.Text) return;
      const val = newValue.data;

      if (val.startsWith("=")) {
        // It's a formula
        try {
          const sheetId = getSheetId();
          if (sheetId !== undefined) {
            hfEngine.setCellContents({ sheet: sheetId, row, col }, val);
            const result = hfEngine.getCellValue({ sheet: sheetId, row, col });
            const safeResult = (result !== null && result !== undefined && typeof result !== "object") ? result : val;
            store.setCellValue(row, col, safeResult as string | number | boolean, val);
          }
        } catch {
          store.setCellValue(row, col, val, val);
        }
      } else {
        const numVal = Number(val);
        store.setCellValue(row, col, val === "" ? null : isNaN(numVal) ? val : numVal);
        try {
          const sheetId = getSheetId();
          if (sheetId !== undefined) {
            hfEngine.setCellContents({ sheet: sheetId, row, col }, val === "" ? null : isNaN(numVal) ? val : numVal);
          }
        } catch {
          // ignore
        }
      }
    },
    [store, hfEngine, getSheetId]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onGridSelectionChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (selection: any) => {
      if (selection.current) {
        const [col, row] = selection.current.cell;
        store.selectCell(row, col);
        if (selection.current.range) {
          const r = selection.current.range;
          if (r.width > 1 || r.height > 1) {
            store.selectRange(r.y, r.x, r.y + r.height - 1, r.x + r.width - 1);
          }
        }
      }
    },
    [store]
  );

  const onColumnResize = useCallback(
    (column: GridColumn, newSize: number) => {
      const idx = parseInt(column.id || "0");
      store.setColumnWidth(idx, newSize);
    },
    [store]
  );

  const gridSelection = useMemo(() => {
    if (!store.selectedCell) return undefined;
    return {
      columns: CompactSelection.empty(),
      rows: CompactSelection.empty(),
      current: {
        cell: [store.selectedCell.col, store.selectedCell.row] as Item,
        range: {
          x: store.selectedCell.col,
          y: store.selectedCell.row,
          width: 1,
          height: 1,
        },
        rangeStack: [],
      },
    };
  }, [store.selectedCell]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <DataEditor
        width={dimensions.width}
        height={dimensions.height}
        getCellContent={getCellContent}
        onCellEdited={onCellEdited}
        columns={columns}
        rows={NUM_ROWS}
        rowMarkers="both"
        smoothScrollX
        smoothScrollY
        overscrollX={0}
        overscrollY={0}
        getCellsForSelection={true}
        onGridSelectionChange={onGridSelectionChange}
        gridSelection={gridSelection}
        onColumnResize={onColumnResize}
        freezeColumns={sheet?.frozenCols || 0}
        freezeTrailingRows={0}
        theme={{
          accentColor: "#2563eb",
          accentLight: "#dbeafe",
          headerFontStyle: "600 13px",
          baseFontStyle: "13px",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          bgCell: "#ffffff",
          bgHeader: "#f8f9fa",
          bgHeaderHasFocus: "#e8f0fe",
          borderColor: "#e2e8f0",
          headerBottomBorderColor: "#d1d5db",
          textDark: "#1f2937",
          textHeader: "#374151",
          cellHorizontalPadding: 8,
          cellVerticalPadding: 3,
        }}
      />
    </div>
  );
}
