import { X, Pencil, Trash2, FileText } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/types/product.types";
import FullscreenImageOverlay from "@/components/product/FullscreenImageOverlay";
import ExportLoadingOverlay from "@/components/product/ExportLoadingOverlay";
interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onExportPdf: (product: Product) => Promise<void> | void;
}

export default function ViewProductModal({
  isOpen,
  onClose,
  product,
  onEdit,
  onDelete,
  onExportPdf,
}: ViewProductModalProps) {
  const [isFullscreenImageOpen, setIsFullscreenImageOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen || !product) return null;

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      await onExportPdf(product);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <ExportLoadingOverlay isOpen={isExporting} />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6 transition-opacity duration-300"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden animate-slide-down"
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
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Left Column: Details */}
            <div className="flex-1 p-6 sm:px-8 overflow-y-auto custom-scrollbar flex flex-col gap-6">
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
                      LKR{" "}
                      {product.price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">
                      Inventory Count
                    </p>
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

            {/* Divider */}
            <div className="hidden md:block w-px bg-slate-200" />

            {/* Right Column: Product Image */}
            <div className="w-full md:w-[320px] lg:w-[380px] p-6 sm:px-8 flex flex-col gap-4 bg-slate-50/50 overflow-y-auto">
              <h3 className="text-lg font-semibold text-slate-700">
                Product Image
              </h3>
              <div className="w-full">
                {product.imageUrl ? (
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                    <img
                      src={product.imageUrl}
                      alt={product.productName}
                      className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
                      onClick={() => setIsFullscreenImageOpen(true)}
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center bg-white text-slate-500 p-4 text-center">
                    <span className="text-sm">No image available</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 sm:px-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white mt-auto">
            <div className="flex flex-col text-xs text-slate-400 w-full sm:w-auto text-center sm:text-left order-2 sm:order-1">
              {product.createdAt && (
                <p>
                  <span className="font-semibold">Created:</span>{" "}
                  {new Date(product.createdAt).toLocaleDateString()}{" "}
                  {new Date(product.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              )}
              {product.updatedAt && (
                <p>
                  <span className="font-semibold">Last Updated:</span>{" "}
                  {new Date(product.updatedAt).toLocaleDateString()}{" "}
                  {new Date(product.updatedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto order-1 sm:order-2">
              <button
                onClick={() => onDelete(product)}
                className="flex items-center justify-center w-11 h-11 border border-slate-300 text-slate-700 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl transition-colors shadow-sm focus:outline-none cursor-pointer flex-shrink-0"
                title="Delete Product"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onEdit(product)}
                className="w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors shadow-sm focus:outline-none cursor-pointer"
              >
                <Pencil className="w-5 h-5" />
                <span>Edit Details</span>
              </button>
              <button
                onClick={handleExportPdf}
                className="w-full sm:w-auto px-6 py-2.5 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold transition-colors shadow-sm focus:outline-none cursor-pointer"
              >
                <FileText className="w-5 h-5" />
                <span>Export to PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isFullscreenImageOpen && product.imageUrl && (
        <FullscreenImageOverlay
          imageUrl={product.imageUrl}
          onClose={() => setIsFullscreenImageOpen(false)}
        />
      )}
    </>
  );
}
