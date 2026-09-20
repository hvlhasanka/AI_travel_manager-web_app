import type { Product } from "@/types/product.types";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedProducts: Product[];
  isPending?: boolean;
  onRowClick?: (product: Product) => void;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  selectedProducts,
  isPending,
  onRowClick,
}: DeleteConfirmModalProps) {
  useBodyScrollLock(isOpen);
  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-all duration-300 ease-out ${
        isOpen
          ? "opacity-100 visible"
          : "opacity-0 invisible pointer-events-none"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={`bg-white rounded-2xl p-6 max-w-3xl w-full shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] transition-all duration-300 ease-out delay-75 ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95"
        }`}
      >
        <h3 className="text-xl font-bold text-slate-800 mb-4">
          Delete Confirmation
        </h3>

        <hr className="border-slate-200 mb-4" />

        <div className="overflow-y-auto mb-4 border border-slate-200 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0">
              <tr>
                <th />
                <th className="px-4 py-3 text-sm font-semibold text-slate-600 border-b border-slate-200">
                  Product ID
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600 border-b border-slate-200">
                  Product
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600 border-b border-slate-200">
                  Price
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600 border-b border-slate-200">
                  Valid Until
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600 border-b border-slate-200">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((p, index) => (
                <tr
                  key={p.productId}
                  className={`hover:bg-slate-50 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                  onClick={() => onRowClick?.(p)}
                >
                  <td className="px-2 py-3 text-sm text-slate-500 border-b border-slate-100 text-center">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500 border-b border-slate-100">
                    {p.productId.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-800 border-b border-slate-100">
                    {p.productName}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 border-b border-slate-100">
                    LKR {p.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500 border-b border-slate-100">
                    {new Date(p.validUntil).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 border-b border-slate-100">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        p.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
              {selectedProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-4 text-center text-slate-500 text-sm"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <hr className="border-slate-200 mb-4" />

        <p className="text-slate-700 mb-6 font-medium">
          Are you sure you want to delete {selectedProducts.length} selected
          product(s)? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3 mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="px-4 py-2 font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
