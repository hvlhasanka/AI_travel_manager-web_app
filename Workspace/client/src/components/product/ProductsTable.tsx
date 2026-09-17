import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../../services/product.service";
import type { Product } from "../../types/product.types";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const features = tableFeatures({});
const helper = createColumnHelper<typeof features, Product>();

const columns = helper.columns([
  helper.accessor("productId", {
    header: "Product ID",
    cell: (info) => (
      <span className="text-xs text-slate-500">
        {info.getValue().slice(-6).toUpperCase()}
      </span>
    ),
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
      <div className="max-w-[200px] truncate" title={info.getValue()}>
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
    cell: (info) => `LKR ${info.getValue().toFixed(2)}`,
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
          <span className="font-semibold text-slate-700 ml-1">
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

export default function ProductsTable() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", page],
    queryFn: () => fetchProducts(page, limit),
  });

  const totalCount = data?.totalCount || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  const table = useTable({
    data: data?.products || [],
    columns,
    features,
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
                    className="px-4 py-3 text-sm font-semibold text-slate-600 uppercase tracking-wider"
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
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                  </div>
                </td>
              </tr>
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
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  {row.getAllCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-4 text-sm text-slate-700"
                    >
                      <table.FlexRender cell={cell} />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && !isError && totalCount > 0 && (
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
