import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface CellData {
  value: string | number | boolean | null;
  formula?: string;
  format?: CellFormat;
}

export interface CellFormat {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number;
  fontFamily?: string;
  textColor?: string;
  bgColor?: string;
  horizontalAlign?: "left" | "center" | "right";
  verticalAlign?: "top" | "middle" | "bottom";
  numberFormat?: string;
  borders?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
}

export interface SheetData {
  id: string;
  name: string;
  cells: Record<string, CellData>;
  columnWidths: Record<number, number>;
  rowHeights: Record<number, number>;
  frozenRows: number;
  frozenCols: number;
  showGridlines: boolean;
  zoom: number;
  color?: string;
}

export interface SpreadsheetState {
  workbookId: string | null;
  workbookName: string;
  sheets: SheetData[];
  activeSheetIndex: number;
  selectedCell: { row: number; col: number } | null;
  selectedRange: { startRow: number; startCol: number; endRow: number; endCol: number } | null;
  isEditing: boolean;
  editValue: string;
  clipboard: { cells: Record<string, CellData>; range: { startRow: number; startCol: number; endRow: number; endCol: number } } | null;
  undoStack: Array<{ sheetIndex: number; cells: Record<string, CellData> }>;
  redoStack: Array<{ sheetIndex: number; cells: Record<string, CellData> }>;
  showSidebar: boolean;
  sidebarPanel: "ai" | "data" | "code" | "comments" | null;
  showFindReplace: boolean;
  isSaving: boolean;
  lastSaved: Date | null;

  // Actions
  setWorkbook: (id: string, name: string) => void;
  setWorkbookName: (name: string) => void;
  setSheets: (sheets: SheetData[]) => void;
  setActiveSheet: (index: number) => void;
  addSheet: (name?: string) => void;
  removeSheet: (index: number) => void;
  renameSheet: (index: number, name: string) => void;
  setSheetColor: (index: number, color: string) => void;

  selectCell: (row: number, col: number) => void;
  selectRange: (startRow: number, startCol: number, endRow: number, endCol: number) => void;

  setCellValue: (row: number, col: number, value: string | number | boolean | null, formula?: string) => void;
  setCellFormat: (row: number, col: number, format: Partial<CellFormat>) => void;
  setRangeFormat: (startRow: number, startCol: number, endRow: number, endCol: number, format: Partial<CellFormat>) => void;

  startEditing: (value?: string) => void;
  setEditValue: (value: string) => void;
  stopEditing: () => void;

  copy: () => void;
  cut: () => void;
  paste: () => void;
  undo: () => void;
  redo: () => void;

  setColumnWidth: (col: number, width: number) => void;
  setRowHeight: (row: number, height: number) => void;
  setFrozenRows: (count: number) => void;
  setFrozenCols: (count: number) => void;
  setZoom: (zoom: number) => void;
  toggleGridlines: () => void;

  setSidebarPanel: (panel: "ai" | "data" | "code" | "comments" | null) => void;
  toggleFindReplace: () => void;
  setIsSaving: (saving: boolean) => void;
  setLastSaved: (date: Date) => void;
}

function cellKey(row: number, col: number): string {
  return `${row}:${col}`;
}

function createDefaultSheet(name: string = "Sheet0"): SheetData {
  return {
    id: crypto.randomUUID(),
    name,
    cells: {},
    columnWidths: {},
    rowHeights: {},
    frozenRows: 0,
    frozenCols: 0,
    showGridlines: true,
    zoom: 100,
  };
}

export const useSpreadsheetStore = create<SpreadsheetState>()(
  immer((set, get) => ({
    workbookId: null,
    workbookName: "Untitled Workbook",
    sheets: [createDefaultSheet()],
    activeSheetIndex: 0,
    selectedCell: { row: 0, col: 0 },
    selectedRange: null,
    isEditing: false,
    editValue: "",
    clipboard: null,
    undoStack: [],
    redoStack: [],
    showSidebar: false,
    sidebarPanel: null,
    showFindReplace: false,
    isSaving: false,
    lastSaved: null,

    setWorkbook: (id, name) =>
      set((state) => {
        state.workbookId = id;
        state.workbookName = name;
      }),

    setWorkbookName: (name) =>
      set((state) => {
        state.workbookName = name;
      }),

    setSheets: (sheets) =>
      set((state) => {
        state.sheets = sheets;
      }),

    setActiveSheet: (index) =>
      set((state) => {
        state.activeSheetIndex = index;
      }),

    addSheet: (name) =>
      set((state) => {
        const sheetName = name || `Sheet${state.sheets.length}`;
        state.sheets.push(createDefaultSheet(sheetName));
        state.activeSheetIndex = state.sheets.length - 1;
      }),

    removeSheet: (index) =>
      set((state) => {
        if (state.sheets.length <= 1) return;
        state.sheets.splice(index, 1);
        if (state.activeSheetIndex >= state.sheets.length) {
          state.activeSheetIndex = state.sheets.length - 1;
        }
      }),

    renameSheet: (index, name) =>
      set((state) => {
        if (state.sheets[index]) {
          state.sheets[index].name = name;
        }
      }),

    setSheetColor: (index, color) =>
      set((state) => {
        if (state.sheets[index]) {
          state.sheets[index].color = color;
        }
      }),

    selectCell: (row, col) =>
      set((state) => {
        state.selectedCell = { row, col };
        state.selectedRange = null;
        state.isEditing = false;
      }),

    selectRange: (startRow, startCol, endRow, endCol) =>
      set((state) => {
        state.selectedRange = { startRow, startCol, endRow, endCol };
      }),

    setCellValue: (row, col, value, formula) =>
      set((state) => {
        const sheet = state.sheets[state.activeSheetIndex];
        if (!sheet) return;
        const key = cellKey(row, col);

        // Save undo state
        state.undoStack.push({
          sheetIndex: state.activeSheetIndex,
          cells: JSON.parse(JSON.stringify(sheet.cells)),
        });
        state.redoStack = [];

        if (value === null && !formula) {
          delete sheet.cells[key];
        } else {
          if (!sheet.cells[key]) {
            sheet.cells[key] = { value: null };
          }
          sheet.cells[key].value = value;
          if (formula) {
            sheet.cells[key].formula = formula;
          }
        }
      }),

    setCellFormat: (row, col, format) =>
      set((state) => {
        const sheet = state.sheets[state.activeSheetIndex];
        if (!sheet) return;
        const key = cellKey(row, col);
        if (!sheet.cells[key]) {
          sheet.cells[key] = { value: null };
        }
        sheet.cells[key].format = { ...sheet.cells[key].format, ...format };
      }),

    setRangeFormat: (startRow, startCol, endRow, endCol, format) =>
      set((state) => {
        const sheet = state.sheets[state.activeSheetIndex];
        if (!sheet) return;
        for (let r = startRow; r <= endRow; r++) {
          for (let c = startCol; c <= endCol; c++) {
            const key = cellKey(r, c);
            if (!sheet.cells[key]) {
              sheet.cells[key] = { value: null };
            }
            sheet.cells[key].format = { ...sheet.cells[key].format, ...format };
          }
        }
      }),

    startEditing: (value) =>
      set((state) => {
        state.isEditing = true;
        if (value !== undefined) {
          state.editValue = value;
        } else if (state.selectedCell) {
          const sheet = state.sheets[state.activeSheetIndex];
          const key = cellKey(state.selectedCell.row, state.selectedCell.col);
          const cell = sheet?.cells[key];
          state.editValue = cell?.formula || String(cell?.value ?? "");
        }
      }),

    setEditValue: (value) =>
      set((state) => {
        state.editValue = value;
      }),

    stopEditing: () =>
      set((state) => {
        state.isEditing = false;
      }),

    copy: () =>
      set((state) => {
        if (!state.selectedCell) return;
        const sheet = state.sheets[state.activeSheetIndex];
        if (!sheet) return;
        const range = state.selectedRange || {
          startRow: state.selectedCell.row,
          startCol: state.selectedCell.col,
          endRow: state.selectedCell.row,
          endCol: state.selectedCell.col,
        };
        const cells: Record<string, CellData> = {};
        for (let r = range.startRow; r <= range.endRow; r++) {
          for (let c = range.startCol; c <= range.endCol; c++) {
            const key = cellKey(r, c);
            if (sheet.cells[key]) {
              cells[cellKey(r - range.startRow, c - range.startCol)] = JSON.parse(
                JSON.stringify(sheet.cells[key])
              );
            }
          }
        }
        state.clipboard = { cells, range };
      }),

    cut: () => {
      const s = get();
      s.copy();
      set((state) => {
        if (!state.selectedCell) return;
        const sheet = state.sheets[state.activeSheetIndex];
        if (!sheet) return;
        const range = state.selectedRange || {
          startRow: state.selectedCell.row,
          startCol: state.selectedCell.col,
          endRow: state.selectedCell.row,
          endCol: state.selectedCell.col,
        };
        for (let r = range.startRow; r <= range.endRow; r++) {
          for (let c = range.startCol; c <= range.endCol; c++) {
            delete sheet.cells[cellKey(r, c)];
          }
        }
      });
    },

    paste: () =>
      set((state) => {
        if (!state.clipboard || !state.selectedCell) return;
        const sheet = state.sheets[state.activeSheetIndex];
        if (!sheet) return;

        state.undoStack.push({
          sheetIndex: state.activeSheetIndex,
          cells: JSON.parse(JSON.stringify(sheet.cells)),
        });

        const { cells, range } = state.clipboard;
        const rowOffset = state.selectedCell.row;
        const colOffset = state.selectedCell.col;
        const height = range.endRow - range.startRow;
        const width = range.endCol - range.startCol;

        for (let r = 0; r <= height; r++) {
          for (let c = 0; c <= width; c++) {
            const sourceKey = cellKey(r, c);
            const targetKey = cellKey(r + rowOffset, c + colOffset);
            if (cells[sourceKey]) {
              sheet.cells[targetKey] = JSON.parse(JSON.stringify(cells[sourceKey]));
            }
          }
        }
      }),

    undo: () =>
      set((state) => {
        const entry = state.undoStack.pop();
        if (!entry) return;
        const sheet = state.sheets[entry.sheetIndex];
        if (!sheet) return;
        state.redoStack.push({
          sheetIndex: entry.sheetIndex,
          cells: JSON.parse(JSON.stringify(sheet.cells)),
        });
        sheet.cells = entry.cells;
      }),

    redo: () =>
      set((state) => {
        const entry = state.redoStack.pop();
        if (!entry) return;
        const sheet = state.sheets[entry.sheetIndex];
        if (!sheet) return;
        state.undoStack.push({
          sheetIndex: entry.sheetIndex,
          cells: JSON.parse(JSON.stringify(sheet.cells)),
        });
        sheet.cells = entry.cells;
      }),

    setColumnWidth: (col, width) =>
      set((state) => {
        const sheet = state.sheets[state.activeSheetIndex];
        if (sheet) sheet.columnWidths[col] = width;
      }),

    setRowHeight: (row, height) =>
      set((state) => {
        const sheet = state.sheets[state.activeSheetIndex];
        if (sheet) sheet.rowHeights[row] = height;
      }),

    setFrozenRows: (count) =>
      set((state) => {
        const sheet = state.sheets[state.activeSheetIndex];
        if (sheet) sheet.frozenRows = count;
      }),

    setFrozenCols: (count) =>
      set((state) => {
        const sheet = state.sheets[state.activeSheetIndex];
        if (sheet) sheet.frozenCols = count;
      }),

    setZoom: (zoom) =>
      set((state) => {
        const sheet = state.sheets[state.activeSheetIndex];
        if (sheet) sheet.zoom = zoom;
      }),

    toggleGridlines: () =>
      set((state) => {
        const sheet = state.sheets[state.activeSheetIndex];
        if (sheet) sheet.showGridlines = !sheet.showGridlines;
      }),

    setSidebarPanel: (panel) =>
      set((state) => {
        if (state.sidebarPanel === panel) {
          state.showSidebar = false;
          state.sidebarPanel = null;
        } else {
          state.showSidebar = true;
          state.sidebarPanel = panel;
        }
      }),

    toggleFindReplace: () =>
      set((state) => {
        state.showFindReplace = !state.showFindReplace;
      }),

    setIsSaving: (saving) =>
      set((state) => {
        state.isSaving = saving;
      }),

    setLastSaved: (date) =>
      set((state) => {
        state.lastSaved = date;
      }),
  }))
);
