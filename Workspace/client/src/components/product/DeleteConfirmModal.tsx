import type { Product } from "../../types/product.types";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedProducts: Product[];
  isPending?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  selectedProducts,
  isPending,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white rounded-2xl p-6 max-w-3xl w-full shadow-2xl animate-slide-down border border-slate-100 flex flex-col max-h-[90vh]">
        <h3 className="text-xl font-bold text-slate-800 mb-4">
          Delete Confirmation
        </h3>

        <hr className="border-slate-200 mb-4" />

        <div className="overflow-y-auto mb-4 border border-slate-200 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0">
              <tr>
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
                  Validity
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600 border-b border-slate-200">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((p) => (
                <tr
                  key={p.productId}
                  className="hover:bg-slate-50 transition-colors"
                >
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
                    colSpan={5}
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
