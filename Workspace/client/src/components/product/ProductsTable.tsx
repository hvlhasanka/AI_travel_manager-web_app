import {
  createColumnHelper,
  tableFeatures,
  useTable,
  rowSelectionFeature,
  type RowSelectionState,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../../services/product.service";
import type { Product } from "../../types/product.types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import type { FilterFormValues } from "./ProductFilter";

const features = tableFeatures({ rowSelectionFeature });
const helper = createColumnHelper<typeof features, Product>();

const columns = helper.columns([
  helper.display({
    id: "emptyStart",
    header: "",
    cell: (info) => (
      <input
        type="checkbox"
        checked={info.row.getIsSelected()}
        onChange={info.row.getToggleSelectedHandler()}
        onClick={(e) => e.stopPropagation()}
        className="w-5 h-5 rounded-[4px] border-2 border-slate-300 text-orange-500 focus:ring-orange-500 focus:ring-offset-1 transition-all cursor-pointer hover:border-orange-400 bg-white"
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
      return (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {info.getValue().slice(-6).toUpperCase()}
          </span>
          {isNew && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-orange-600 bg-orange-100 rounded-md">
              NEW
            </span>
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
      <div className="w-[150px] min-w-[150px] truncate" title={info.getValue()}>
        {info.getValue()}
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
    cell: (info) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-slate-500">
          From:{" "}
          <span className="font-semibold text-slate-700">
            {new Date(info.row.original.validFrom).toLocaleDateString()}
          </span>
        </span>
        <span className="text-xs text-slate-500">
          Until:{" "}
          <span className="font-semibold text-slate-700">
            {new Date(info.getValue()).toLocaleDateString()}
          </span>
        </span>
      </div>
    ),
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

export default function ProductsTable({
  highlightedProductId,
  animatedProductId,
  rowSelection,
  setRowSelection,
  onRowClick,
  filters,
}: {
  highlightedProductId?: string | null;
  animatedProductId?: string | null;
  rowSelection: RowSelectionState;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  onRowClick?: (product: Product) => void;
  filters?: FilterFormValues | null;
}) {
  const [page, setPage] = useState(1);
  const [prevFilters, setPrevFilters] = useState(filters);
  const limit = 10;

  if (filters !== prevFilters) {
    setPage(1);
    setPrevFilters(filters);
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", page, filters],
    queryFn: () => fetchProducts(page, limit, filters),
    // Prevent immediate background refetches by keeping data fresh for 1 minute
    staleTime: 60 * 1000,
  });

  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isLoading) {
      timer = setTimeout(() => setShowSkeleton(true), 0);
    } else {
      timer = setTimeout(() => setShowSkeleton(false), 600);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  const totalCount = data?.totalCount || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  const table = useTable({
    data: data?.products || [],
    columns,
    features,
    getRowId: (row) => row.productId,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    meta: {
      highlightedProductId,
    },
  });

  return (
    <div className="w-full flex flex-col h-full">
      <div className="w-full overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b-2 border-slate-200">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`${header.id === "emptyStart" ? "px-0 text-center" : "px-4"} py-3 text-sm font-semibold text-slate-600 uppercase tracking-wider ${
                      header.id === "emptyStart"
                        ? "sticky left-0 bg-white z-10 w-6 min-w-[1.5rem]"
                        : header.id === "productId"
                          ? "sticky left-6 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                          : header.id === "description"
                            ? "w-[150px] min-w-[150px]"
                            : ""
                    }`}
                  >
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {showSkeleton ? (
              Array.from({ length: limit }).map((_, index) => (
                <tr
                  key={`skeleton-${index}`}
                  className="border-b border-slate-100"
                >
                  {table.getHeaderGroups()[0]?.headers.map((header) => {
                    const columnId = header.column.id;
                    return (
                      <td
                        key={header.id}
                        className={`${columnId === "emptyStart" ? "px-0 text-center" : "px-4"} py-4 ${
                          columnId === "emptyStart"
                            ? "sticky left-0 z-10 w-6 min-w-[1.5rem] bg-white"
                            : columnId === "productId"
                              ? "sticky left-6 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] bg-white"
                              : ""
                        }`}
                      >
                        <div
                          className={`bg-slate-200 animate-pulse ${
                            columnId === "emptyStart"
                              ? "w-5 h-5 mx-auto rounded-[4px]"
                              : columnId === "productId"
                                ? "w-16 h-4 rounded"
                                : columnId === "productName"
                                  ? "w-32 h-4 rounded"
                                  : columnId === "description"
                                    ? "w-40 h-4 rounded"
                                    : columnId === "validUntil"
                                      ? "w-24 h-8 rounded"
                                      : columnId === "status"
                                        ? "w-16 h-5 rounded-full"
                                        : "w-20 h-4 rounded"
                          }`}
                        ></div>
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : isError ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-red-600 bg-red-50"
                >
                  Failed to load products.
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  No products found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => {
                const isAnimated = row.original.productId === animatedProductId;
                return (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick?.(row.original)}
                    className={`group border-b border-slate-100 transition-colors ${onRowClick ? "cursor-pointer" : ""} ${
                      isAnimated
                        ? "bg-orange-100/50 animate-bounce-horizontal"
                        : row.getIsSelected()
                          ? "bg-orange-50 hover:bg-orange-100"
                          : "hover:bg-slate-50"
                    }`}
                  >
                    {row.getAllCells().map((cell) => (
                      <td
                        key={cell.id}
                        onClick={(e) => {
                          if (cell.column.id === "emptyStart") {
                            e.stopPropagation();
                          }
                        }}
                        className={`${cell.column.id === "emptyStart" ? "px-0 text-center" : "px-4"} py-4 text-sm text-slate-700 ${
                          cell.column.id === "emptyStart"
                            ? `sticky left-0 z-10 w-6 min-w-[1.5rem] ${
                                isAnimated
                                  ? "bg-orange-100"
                                  : row.getIsSelected()
                                    ? "bg-orange-50 group-hover:bg-orange-100"
                                    : "bg-white group-hover:bg-slate-50"
                              }`
                            : cell.column.id === "productId"
                              ? `sticky left-6 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] ${
                                  isAnimated
                                    ? "bg-orange-100"
                                    : row.getIsSelected()
                                      ? "bg-orange-50 group-hover:bg-orange-100"
                                      : "bg-white group-hover:bg-slate-50"
                                }`
                              : ""
                        }`}
                      >
                        <table.FlexRender cell={cell} />
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!showSkeleton && !isError && totalCount > 0 && (
        <div className="flex items-center justify-between px-4 py-4 border-t border-slate-100 mt-auto">
          <div className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {(page - 1) * limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-700">
              {Math.min(page * limit, totalCount)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">{totalCount}</span>{" "}
            results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold text-slate-700 px-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1 rounded-md text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
