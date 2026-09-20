import { X, Pencil, Trash2, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import type { Product } from "@/types/product.types";
import FullscreenImageOverlay from "@/components/FullscreenImageOverlay";
import ExportLoadingOverlay from "@/components/ExportLoadingOverlay";
import placeholderImage from "@/assets/images/polaroid-white-photo.jpg";
interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onExportPdf: (product: Product) => Promise<void> | void;
  hideActions?: boolean;
}

export default function ViewProductModal({
  isOpen,
  onClose,
  product: incomingProduct,
  onEdit,
  onDelete,
  onExportPdf,
  hideActions,
}: ViewProductModalProps) {
  const [isFullscreenImageOpen, setIsFullscreenImageOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [localProduct, setLocalProduct] = useState<Product | null>(
    incomingProduct,
  );
  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (incomingProduct) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalProduct(incomingProduct);
    }
  }, [incomingProduct]);

  const handleExportPdf = async () => {
    if (!localProduct) return;
    setIsExporting(true);
    try {
      await onExportPdf(localProduct);
    } finally {
      setIsExporting(false);
    }
  };

  if (!localProduct) return null;

  const product = localProduct;

  return (
    <>
      <ExportLoadingOverlay isOpen={isExporting} />
      <div
        className={`fixed inset-0 z-50 flex justify-center items-start pt-[5vh] sm:pt-[10vh] pb-4 bg-slate-900/40 backdrop-blur-sm px-4 sm:px-6 transition-all duration-300 ease-out ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={onClose}
      >
        <div
          className={`bg-white rounded-3xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden transition-all duration-300 ease-out delay-75 ${
            isOpen
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-95"
          }`}
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
                  <div className="w-full aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center bg-white p-4 text-center">
                    <img
                      src={placeholderImage}
                      alt="No image placeholder"
                      className="w-3/5 object-contain mb-4 opacity-90 rounded-xl mix-blend-multiply"
                    />
                    <span className="text-sm text-slate-400 font-medium mb-1">
                      Seems like there's no image
                    </span>
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
              {!hideActions && (
                <>
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
                </>
              )}
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

      <FullscreenImageOverlay
        isOpen={isFullscreenImageOpen}
        imageUrl={product.imageUrl || null}
        onClose={() => setIsFullscreenImageOpen(false)}
      />
    </>
  );
}
