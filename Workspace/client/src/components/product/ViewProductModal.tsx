import { X, Pencil, Trash2 } from "lucide-react";
import type { Product } from "../../types/product.types";

interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ViewProductModal({
  isOpen,
  onClose,
  product,
  onEdit,
  onDelete,
}: ViewProductModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden animate-slide-down"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 sm:px-8 border-b border-slate-100 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <h2 className="text-2xl font-bold text-slate-800">
              Product Details
            </h2>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-sm font-medium text-slate-600 bg-slate-100 rounded-full">
                {product.productId}
              </span>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  product.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {product.status === "ACTIVE" ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors focus:outline-none absolute top-6 right-6 sm:relative sm:top-auto sm:right-auto"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:px-8 overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Product Name</p>
                  <p className="font-medium text-slate-800">
                    {product.productName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Destination</p>
                  <p className="font-medium text-slate-800">
                    {product.destination}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Category</p>
                  <p className="font-medium text-slate-800">
                    {product.category}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-slate-500 mb-1">Description</p>
                  <p className="font-medium text-slate-800 break-words whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                Pricing & Inventory
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Price</p>
                  <p className="font-medium text-slate-800">
                    LKR {product.price.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Inventory Count</p>
                  <p className="font-medium text-slate-800">
                    {product.inventoryCount}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                Validity
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Valid From</p>
                  <p className="font-medium text-slate-800">
                    {new Date(product.validFrom).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Valid Until</p>
                  <p className="font-medium text-slate-800">
                    {new Date(product.validUntil).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 sm:px-8 border-t border-slate-100 flex flex-col sm:flex-row gap-3 justify-end bg-slate-50/50 mt-auto">
          <button
            onClick={() => onDelete(product)}
            className="w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2 border border-slate-300 text-slate-700 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-full font-semibold transition-colors shadow-sm focus:outline-none"
          >
            <Trash2 className="w-5 h-5" />
            <span>Delete Product</span>
          </button>
          <button
            onClick={() => onEdit(product)}
            className="w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-semibold transition-colors shadow-sm focus:outline-none"
          >
            <Pencil className="w-5 h-5" />
            <span>Edit Details</span>
          </button>
        </div>
      </div>
    </div>
  );
}
