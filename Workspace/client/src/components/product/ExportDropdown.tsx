import { FileSpreadsheet, FileText } from "lucide-react";

interface ExportDropdownProps {
  selectedCount: number;
  hasFilters: boolean;
  onExportClick: (
    type: "selected" | "filtered",
    format: "excel" | "pdf",
  ) => void;
}

export default function ExportDropdown({
  selectedCount,
  hasFilters,
  onExportClick,
}: ExportDropdownProps) {
  return (
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 overflow-hidden">
      {selectedCount > 0 && (
        <>
          <button
            onClick={() => onExportClick("selected", "excel")}
            className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-slate-50 transition-colors"
          >
            <FileSpreadsheet className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-slate-700">
              Excel (Selected Rows)
            </span>
          </button>
          <button
            onClick={() => onExportClick("selected", "pdf")}
            className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-slate-50 transition-colors"
          >
            <FileText className="w-5 h-5 text-red-600" />
            <span className="text-sm font-semibold text-slate-700">
              PDF (Selected Rows)
            </span>
          </button>
        </>
      )}
      <>
        <button
          onClick={() => onExportClick("filtered", "excel")}
          className={`w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-slate-50 transition-colors ${selectedCount > 0 ? "border-t border-slate-100" : ""}`}
        >
          <FileSpreadsheet className="w-5 h-5 text-green-600" />
          <span className="text-sm font-semibold text-slate-700">
            Excel ({hasFilters ? "Filter Results" : "All Products"})
          </span>
        </button>
        <button
          onClick={() => onExportClick("filtered", "pdf")}
          className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-slate-50 transition-colors"
        >
          <FileText className="w-5 h-5 text-red-600" />
          <span className="text-sm font-semibold text-slate-700">
            PDF ({hasFilters ? "Filter Results" : "All Products"})
          </span>
        </button>
      </>
    </div>
  );
}
