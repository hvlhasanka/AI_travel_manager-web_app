import {
  createColumnHelper,
  tableFeatures,
  rowSelectionFeature,
} from "@tanstack/react-table";
import { Image as ImageIcon } from "lucide-react";
import type { Product } from "../../types/product.types";

export const features = tableFeatures({ rowSelectionFeature });
const helper = createColumnHelper<typeof features, Product>();

export const columns = helper.columns([
  helper.display({
    id: "emptyStart",
    header: "",
    cell: (info) => (
      <input
        type="checkbox"
        checked={info.row.getIsSelected()}
        onChange={info.row.getToggleSelectedHandler()}
        onClick={(e) => e.stopPropagation()}
        className="w-5 h-5 rounded-[4px] border-2 border-slate-300 text-primary-500 focus:ring-primary-500 focus:ring-offset-1 transition-all cursor-pointer hover:border-primary-400 bg-white"
      />
    ),
  }),
  helper.accessor("productId", {
    header: "Product ID",
    cell: (info) => {
      const isNew =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (info.table.options.meta as any)?.highlightedProductId ===
        info.getValue();
      const hasImage = !!info.row.original.imageUrl;
      const isImageVisible =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (info.table.options.meta as any)?.columnVisibility?.imageUrl !== false;
      return (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              {info.getValue().slice(-6).toUpperCase()}
            </span>
            {isNew && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-primary-600 bg-primary-100 rounded-md">
                NEW
              </span>
            )}
          </div>
          {hasImage && isImageVisible && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (info.table.options.meta as any)?.onImageClick?.(
                  info.row.original.imageUrl,
                );
              }}
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
              title="View Image"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      );
    },
  }),
  helper.accessor("productName", {
    header: "Product",
    cell: (info) => (
      <span className="font-semibold text-slate-800">{info.getValue()}</span>
    ),
  }),
  helper.accessor("destination", {
    header: "Destination",
    cell: (info) => info.getValue(),
  }),
  helper.accessor("description", {
    header: "Description",
    cell: (info) => (
      <div className="group/desc relative flex items-center h-full w-[150px] min-w-[150px]">
        <div className="truncate w-full cursor-pointer">{info.getValue()}</div>
        <div className="absolute left-0 top-full mt-1 hidden w-72 p-4 bg-white text-slate-700 text-sm rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] border border-slate-100 z-[100] group-hover/desc:block whitespace-normal break-words leading-relaxed pointer-events-none transition-all duration-200">
          {info.getValue()}
        </div>
      </div>
    ),
  }),
  helper.accessor("category", {
    header: "Category",
    cell: (info) => info.getValue(),
  }),
  helper.accessor("price", {
    header: "Price",
    cell: (info) =>
      `LKR ${info.getValue().toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
  }),
  helper.accessor("inventoryCount", {
    header: "Inventory",
    cell: (info) => info.getValue(),
  }),
  helper.accessor("validUntil", {
    header: "Validity",
    cell: (info) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const meta = info.table.options.meta as any;
      const showFrom = meta?.columnVisibility?.validFrom !== false;
      const showTo = meta?.columnVisibility?.validTo !== false;

      return (
        <div className="flex flex-col gap-0.5">
          {showFrom && (
            <span className="text-xs text-slate-500">
              From:{" "}
              <span className="font-semibold text-slate-700">
                {new Date(info.row.original.validFrom).toLocaleDateString()}
              </span>
            </span>
          )}
          {showTo && (
            <span className="text-xs text-slate-500">
              Until:{" "}
              <span className="font-semibold text-slate-700">
                {new Date(info.getValue()).toLocaleDateString()}
              </span>
            </span>
          )}
        </div>
      );
    },
  }),
  helper.accessor("status", {
    header: "Status",
    cell: (info) => (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full ${
          info.getValue() === "ACTIVE"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {info.getValue()}
      </span>
    ),
  }),
]);
