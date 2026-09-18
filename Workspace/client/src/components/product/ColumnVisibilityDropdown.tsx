import { Check } from "lucide-react";

export interface ColumnOption {
  id: string;
  label: string;
  children?: ColumnOption[];
}

interface ColumnVisibilityDropdownProps {
  columns: ColumnOption[];
  visibility: Record<string, boolean>;
  onToggle: (id: string) => void;
}

export default function ColumnVisibilityDropdown({
  columns,
  visibility,
  onToggle,
}: ColumnVisibilityDropdownProps) {
  return (
    <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 overflow-hidden">
      <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
        Show Columns
      </div>
      <div className="max-h-60 overflow-y-auto">
        {columns.map((col) => (
          <div key={col.id}>
            <button
              onClick={() => onToggle(col.id)}
              className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-slate-50 transition-colors"
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  visibility[col.id] !== false
                    ? "bg-orange-500 border-orange-500"
                    : "bg-white border-slate-300"
                }`}
              >
                {visibility[col.id] !== false && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="text-sm font-semibold text-slate-700">
                {col.label}
              </span>
            </button>
            {col.children && visibility[col.id] !== false && (
              <div className="pl-6 bg-slate-50/50">
                {col.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => onToggle(child.id)}
                    className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <div
                      className={`w-3 h-3 rounded-sm border flex items-center justify-center transition-colors ${
                        visibility[child.id] !== false
                          ? "bg-orange-500 border-orange-500"
                          : "bg-white border-slate-300"
                      }`}
                    >
                      {visibility[child.id] !== false && (
                        <Check className="w-2 h-2 text-white" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-slate-600">
                      {child.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
