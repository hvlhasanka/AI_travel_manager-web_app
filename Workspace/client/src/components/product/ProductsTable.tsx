import { useTable, type RowSelectionState } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/product.service";
import type { Product } from "@/types/product.types";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import type { FilterFormValues } from "@/components/product/ProductFilter";
import FullscreenImageOverlay from "@/components/product/FullscreenImageOverlay";

import { columns, features } from "@/components/product/productsTableColumns";
import emptyImage from "@/assets/images/empty-suitcase.jpg";

export default function ProductsTable({
  highlightedProductId,
  animatedProductId,
  rowSelection,
  setRowSelection,
  onRowClick,
  filters,
  columnVisibility,
  onCreateProduct,
}: {
  highlightedProductId?: string | null;
  animatedProductId?: string | null;
  rowSelection: RowSelectionState;
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>;
  onRowClick?: (product: Product) => void;
  filters?: FilterFormValues | null;
  columnVisibility?: Record<string, boolean>;
  onCreateProduct?: () => void;
}) {
  const [page, setPage] = useState(1);
  const [prevFilters, setPrevFilters] = useState(filters);
  const [fullscreenImageUrl, setFullscreenImageUrl] = useState<string | null>(
    null,
  );
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
    columns: columnVisibility
      ? columns.filter((col) => {
          if (col.id === "emptyStart") return true;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const colId = col.id || (col as any).accessorKey;
          return columnVisibility[colId as string] !== false;
        })
      : columns,
    features,
    getRowId: (row) => row.productId,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    meta: {
      highlightedProductId,
      onImageClick: (url: string) => setFullscreenImageUrl(url),
      columnVisibility,
    },
  });

  return (
    <div className="w-full flex flex-col h-full">
      <div className="w-full overflow-x-auto flex-1 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden">
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
                  className="px-4 h-[45vh] align-middle border-b-0"
                >
                  <div className="flex flex-col items-center justify-center text-slate-500 sticky left-1/2 -translate-x-1/2 w-max">
                    <img
                      src={emptyImage}
                      alt="Empty suitcase"
                      className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 mb-4 object-contain transition-all duration-300"
                    />
                    <p className="text-sm text-slate-500 max-w-sm mb-1">
                      Seems like there're no products
                    </p>
                    <p className="text-base font-semibold text-slate-800 mb-6">
                      Let's create the first product
                    </p>
                    {onCreateProduct && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCreateProduct();
                        }}
                        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-full font-semibold transition-colors shadow-sm"
                      >
                        <Plus className="w-5 h-5" />
                        Create Product
                      </button>
                    )}
                  </div>
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
                        ? "bg-primary-100/50 animate-bounce-horizontal"
                        : row.getIsSelected()
                          ? "bg-primary-50 hover:bg-primary-100"
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
                                  ? "bg-primary-100"
                                  : row.getIsSelected()
                                    ? "bg-primary-50 group-hover:bg-primary-100"
                                    : "bg-white group-hover:bg-slate-50"
                              }`
                            : cell.column.id === "productId"
                              ? `sticky left-6 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] ${
                                  isAnimated
                                    ? "bg-primary-100"
                                    : row.getIsSelected()
                                      ? "bg-primary-50 group-hover:bg-primary-100"
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-slate-100 mt-auto text-center sm:text-left">
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

      {fullscreenImageUrl && (
        <FullscreenImageOverlay
          imageUrl={fullscreenImageUrl}
          onClose={() => setFullscreenImageUrl(null)}
        />
      )}
    </div>
  );
}
