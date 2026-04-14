"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useSpreadsheetStore } from "@/store/spreadsheet-store";
import SpreadsheetApp from "@/components/spreadsheet/SpreadsheetApp";

export default function WorkbookPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setWorkbook, setSheets } = useSpreadsheetStore();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session && params.id) {
      loadWorkbook(params.id as string);
    }
  }, [session, params.id]);

  const loadWorkbook = async (id: string) => {
    try {
      const res = await fetch(`/api/workbooks/${id}`);
      if (!res.ok) {
        setError("Workbook not found");
        return;
      }
      const data = await res.json();
      setWorkbook(data.id, data.name);
      
      if (data.sheets && data.sheets.length > 0) {
        setSheets(
          data.sheets.map((s: { id: string; name: string; columnWidths: Record<number, number>; rowHeights: Record<number, number>; frozenRows: number; frozenCols: number; showGridlines: boolean; zoom: number; color?: string }) => ({
            id: s.id,
            name: s.name,
            cells: {},
            columnWidths: s.columnWidths || {},
            rowHeights: s.rowHeights || {},
            frozenRows: s.frozenRows || 0,
            frozenCols: s.frozenCols || 0,
            showGridlines: s.showGridlines !== false,
            zoom: s.zoom || 100,
            color: s.color,
          }))
        );
      }
    } catch (err) {
      console.error("Failed to load workbook:", err);
      setError("Failed to load workbook");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading workbook...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900 mb-2">Error</p>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <SpreadsheetApp />;
}
