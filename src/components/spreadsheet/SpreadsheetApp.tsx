"use client";

import { useCallback, useEffect } from "react";
import { useSpreadsheetStore } from "@/store/spreadsheet-store";
import MenuBar from "./MenuBar";
import Toolbar from "./Toolbar";
import FormulaBar from "./FormulaBar";
import Grid from "./Grid";
import SheetTabs from "./SheetTabs";
import StatusBar from "./StatusBar";
import AIChat from "./AIChat";
import FindReplaceDialog from "../dialogs/FindReplaceDialog";

export default function SpreadsheetApp() {
  const {
    showSidebar,
    sidebarPanel,
    showFindReplace,
    undo,
    redo,
    copy,
    cut,
    paste,
    toggleFindReplace,
  } = useSpreadsheetStore();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "z":
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case "y":
            e.preventDefault();
            redo();
            break;
          case "c":
            e.preventDefault();
            copy();
            break;
          case "x":
            e.preventDefault();
            cut();
            break;
          case "v":
            e.preventDefault();
            paste();
            break;
          case "h":
            e.preventDefault();
            toggleFindReplace();
            break;
        }
      }
    },
    [undo, redo, copy, cut, paste, toggleFindReplace]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <MenuBar />
      <Toolbar />
      <FormulaBar />
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <Grid />
        </div>
        {showSidebar && sidebarPanel === "ai" && (
          <div className="w-96 border-l border-gray-200 flex-shrink-0">
            <AIChat />
          </div>
        )}
      </div>
      <SheetTabs />
      <StatusBar />
      {showFindReplace && <FindReplaceDialog />}
    </div>
  );
}
