import ProductsTable from "@/components/product/ProductsTable";
import { columns as tableColumns } from "@/components/product/productsTableColumns";
import CreateEditProductModal from "@/components/product/CreateEditProductModal";
import ViewProductModal from "@/components/product/ViewProductModal";
import AiOverlay from "@/components/product/AiOverlay";
import ProductFilter, {
  type FilterFormValues,
} from "@/components/product/ProductFilter";
import ExportDropdown from "@/components/product/ExportDropdown";
import ExportLoadingOverlay from "@/components/ExportLoadingOverlay";
import ColumnVisibilityDropdown, {
  type ColumnOption,
} from "@/components/product/ColumnVisibilityDropdown";
import {
  Plus,
  Sparkles,
  Pencil,
  Trash2,
  Filter,
  Download,
  ChevronDown,
  Columns,
} from "lucide-react";
import { MAX_PRICE } from "@/constants";
import { useState, useRef, useEffect, useMemo } from "react";
import Banner from "@/components/Banner";
import { type RowSelectionState } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteProduct,
  aiSearchProducts,
  exportProducts,
  exportProductsPdf,
} from "@/services/product.service";
import DeleteConfirmModal from "@/components/product/DeleteConfirmModal";
import type { Product } from "@/types/product.types";

export default function ProductsSection() {
  const [isAiSearchOpen, setIsAiSearchOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({});

  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const columnDropdownRef = useRef<HTMLDivElement>(null);

  const columnOptions = useMemo<ColumnOption[]>(() => {
    const opts = tableColumns
      .filter((col) => col.id !== "emptyStart")
      .map((col) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const id = (col.id || (col as any).accessorKey) as string;
        const label = (col.header as string) || id;
        if (id === "validUntil") {
          return {
            id,
            label,
            children: [
              { id: "validFrom", label: "Valid From" },
              { id: "validTo", label: "Valid Until" },
            ],
          };
        }
        return { id, label };
      });

    opts.splice(1, 0, { id: "imageUrl", label: "Image" });
    return opts;
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        exportDropdownRef.current &&
        !exportDropdownRef.current.contains(event.target as Node)
      ) {
        setIsExportDropdownOpen(false);
      }
      if (
        columnDropdownRef.current &&
        !columnDropdownRef.current.contains(event.target as Node)
      ) {
        setIsColumnDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToView, setProductToView] = useState<Product | null>(null);
  const [returnToViewOnClose, setReturnToViewOnClose] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [banner, setBanner] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [highlightedProductId, setHighlightedProductId] = useState<
    string | null
  >(null);
  const [animatedProductId, setAnimatedProductId] = useState<string | null>(
    null,
  );

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) => deleteProduct(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["productStats"] });
      setBanner({ type: "success", message: "Products deleted successfully!" });
      setRowSelection({});
      setIsDeleteModalOpen(false);
      setReturnToViewOnClose(false);
      setProductToView(null);
    },
    onError: (error: Error) => {
      setBanner({ type: "error", message: error.message });
      setIsDeleteModalOpen(false);
    },
  });

  const selectedIds = Object.keys(rowSelection).filter(
    (key) => rowSelection[key],
  );
  const selectedCount = selectedIds.length;

  const getSelectedProducts = (): Product[] => {
    if (selectedIds.length === 0) return [];
    const allQueries = queryClient.getQueriesData({ queryKey: ["products"] });
    const allProducts = allQueries.flatMap(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ([, data]: any) => data?.products || [],
    );
    return allProducts.filter((p: Product) =>
      selectedIds.includes(p.productId),
    );
  };

  const handleDelete = () => {
    if (selectedCount > 0) {
      setIsDeleteModalOpen(true);
    }
  };

  const handleEdit = () => {
    if (selectedCount === 1) {
      setProductToEdit(getSelectedProducts()[0]);
      setIsProductModalOpen(true);
    }
  };

  const handleRowClick = (product: Product) => {
    setProductToView(product);
    setIsViewModalOpen(true);
  };

  const handleCreate = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCount > 0) {
      deleteMutation.mutate(selectedIds);
    }
  };

  const [filters, setFilters] = useState<FilterFormValues | null>(null);
  const [isAiSearching, setIsAiSearching] = useState(false);

  const onSubmit = (data: FilterFormValues) => {
    setFilters(data);
  };

  const handleAiSearch = async (query: string) => {
    setIsAiSearching(true);
    try {
      const response = await aiSearchProducts(query);

      const rawFilters = response.appliedFilters as Partial<FilterFormValues>;
      const newFilters: FilterFormValues = {
        product: rawFilters.product || "",
        destination: rawFilters.destination || "",
        category: rawFilters.category || "",
        minPrice: rawFilters.minPrice ?? 0,
        maxPrice: rawFilters.maxPrice ?? MAX_PRICE,
        status: rawFilters.status || "ALL",
      };

      setFilters(newFilters);

      queryClient.setQueryData(["products", 1, newFilters], {
        products: response.data,
        totalCount: response.pagination.total,
      });

      setIsAiSearchOpen(false);
      setIsFilterOpen(true);
      setBanner({
        type: "success",
        message: "AI Search applied successfully!",
      });
    } catch {
      setBanner({
        type: "error",
        message: "Failed to perform AI search. Please try again.",
      });
    } finally {
      setIsAiSearching(false);
    }
  };

  const [isExporting, setIsExporting] = useState(false);

  const handleExportClick = async (
    type: "selected" | "filtered",
    format: "excel" | "pdf",
  ) => {
    setIsExportDropdownOpen(false);
    setIsExporting(true);
    try {
      const ids = type === "selected" ? selectedIds : [];
      const appliedFilters = type === "filtered" ? filters : null;
      if (format === "excel") {
        await exportProducts(ids, appliedFilters, columnVisibility);
      } else {
        await exportProductsPdf(ids, appliedFilters, columnVisibility);
      }
      setBanner({
        type: "success",
        message: `${format === "excel" ? "Excel" : "PDF"} document ready to download`,
      });
    } catch (error) {
      console.error("Error:", error);
      setBanner({
        type: "error",
        message: `Failed to export ${format === "excel" ? "Excel" : "PDF"} document`,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <ExportLoadingOverlay isOpen={isExporting} />
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          if (returnToViewOnClose) {
            setIsViewModalOpen(true);
            setReturnToViewOnClose(false);
          } else {
            setProductToView(null);
          }
        }}
        onConfirm={confirmDelete}
        selectedProducts={getSelectedProducts()}
        isPending={deleteMutation.isPending}
      />
      {banner && (
        <Banner
          key={banner.message}
          type={banner.type}
          message={banner.message}
          duration={5000}
          onClose={() => setBanner(null)}
        />
      )}
      <section
        id="products-section"
        className="w-full flex-1 bg-white rounded-2xl min-[1090px]:rounded-[3rem] shadow-sm border border-slate-200 flex flex-col items-center py-6 px-4 min-[1090px]:py-16 min-[1090px]:px-16 min-[1600px]:px-[5%] text-center"
      >
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 text-left">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold text-slate-800">
              Travel Products
            </h2>
            <span className="text-slate-400 font-medium">
              Search, create, edit or remove products
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {selectedCount > 0 && (
              <div className="flex items-center px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-sm font-semibold text-slate-600">
                {selectedCount} {selectedCount === 1 ? "item" : "items"}{" "}
                selected
              </div>
            )}

            {(selectedCount > 0 || filters) && (
              <div className="relative" ref={exportDropdownRef}>
                <button
                  onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-full text-slate-600 hover:text-green-600 hover:border-green-600 hover:bg-green-50 transition-colors cursor-pointer font-semibold text-sm"
                  title="Export Data"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isExportDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isExportDropdownOpen && (
                  <ExportDropdown
                    selectedCount={selectedCount}
                    hasFilters={!!filters}
                    onExportClick={handleExportClick}
                  />
                )}
              </div>
            )}

            {selectedCount === 1 && (
              <button
                onClick={handleEdit}
                className="flex-shrink-0 flex items-center justify-center w-10 h-10 border border-slate-300 rounded-full text-slate-600 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                title="Edit Selected Product"
              >
                <Pencil className="w-5 h-5" />
              </button>
            )}
            {selectedCount > 0 && (
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex-shrink-0 flex items-center justify-center w-10 h-10 border border-slate-300 rounded-full text-slate-600 hover:text-red-600 hover:border-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete Selected Products"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}

            <div className="relative w-full order-last md:order-none md:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Sparkles className="h-5 w-5 text-primary-500" />
              </div>
              <input
                type="text"
                readOnly
                onClick={() => setIsAiSearchOpen(true)}
                placeholder="Search any product in your own words..."
                className="w-full md:w-[17rem] lg:w-[19rem] xl:w-[22rem] pl-10 pr-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer"
              />
            </div>
            <div className="relative" ref={columnDropdownRef}>
              <button
                onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
                className={`flex-shrink-0 flex items-center justify-center w-10 h-10 border rounded-full transition-colors cursor-pointer ${
                  isColumnDropdownOpen
                    ? "bg-primary-100 text-primary-600 border-primary-200"
                    : "bg-white text-slate-600 border-slate-300 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50"
                }`}
                title="Toggle Columns"
              >
                <Columns className="w-5 h-5" />
              </button>
              {isColumnDropdownOpen && (
                <ColumnVisibilityDropdown
                  columns={columnOptions}
                  visibility={columnVisibility}
                  onToggle={(id) =>
                    setColumnVisibility((prev) => ({
                      ...prev,
                      [id]: prev[id] === false ? true : false,
                    }))
                  }
                />
              )}
            </div>
            <button
              onClick={() => {
                const newState = !isFilterOpen;
                setIsFilterOpen(newState);
                if (newState) {
                  setTimeout(() => {
                    document
                      .getElementById("product-filter-container")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }
              }}
              className={`flex-shrink-0 flex items-center justify-center w-10 h-10 border rounded-full transition-colors cursor-pointer ${
                isFilterOpen
                  ? "bg-primary-100 text-primary-600 border-primary-200"
                  : "bg-white text-slate-600 border-slate-300 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50"
              }`}
              title="Toggle Filters"
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={handleCreate}
              className="flex-shrink-0 flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-full font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Create Product</span>
            </button>
          </div>
        </div>
        <div className="w-full flex flex-col gap-6 h-full min-h-[400px]">
          {/* Filter Inner Container */}
          <ProductFilter
            onFilter={onSubmit}
            onReset={() => setFilters(null)}
            className={isFilterOpen ? "flex" : "hidden"}
            externalFilters={filters}
          />
          {/* Products Table Inner Container */}
          <div
            className={`w-full min-h-[65vh] border-2 border-primary-200/50 rounded-2xl min-[1090px]:rounded-3xl p-4 min-[1090px]:p-8 flex flex-col overflow-hidden transition-all duration-300 ease-in-out`}
          >
            <ProductsTable
              highlightedProductId={highlightedProductId}
              animatedProductId={animatedProductId}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              onRowClick={handleRowClick}
              filters={filters}
              columnVisibility={columnVisibility}
              onCreateProduct={handleCreate}
            />
          </div>
        </div>
      </section>

      <AiOverlay
        isOpen={isAiSearchOpen}
        onClose={() => setIsAiSearchOpen(false)}
        title="Search any product in your own words..."
        buttonText="Search"
        suggestions={[
          "Show me dinner buffets in Colombo",
          "Show active family packages",
          "Show products below LKR 10,000",
          "Show airport transfer services",
        ]}
        onSubmit={handleAiSearch}
        isLoading={isAiSearching}
        discardTitle="Discard query?"
        discardDescription="You have entered a search query. Are you sure you want to discard it?"
      />

      <CreateEditProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
          if (returnToViewOnClose) {
            setIsViewModalOpen(true);
            setReturnToViewOnClose(false);
          } else {
            setProductToView(null);
          }
        }}
        product={productToEdit}
        onSuccess={(msg, productId, updatedProduct) => {
          setBanner({ type: "success", message: msg });
          setReturnToViewOnClose(false);
          if (productId) {
            if (!productToEdit) {
              setHighlightedProductId(productId);
              setAnimatedProductId(productId);
              setTimeout(() => setAnimatedProductId(null), 5000);
            }
          }
          if (
            updatedProduct &&
            productToView &&
            productToView.productId === updatedProduct.productId
          ) {
            setProductToView(updatedProduct);
            setIsViewModalOpen(true);
          }
        }}
        onError={(msg) => setBanner({ type: "error", message: msg })}
      />

      <ViewProductModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setProductToView(null);
        }}
        product={productToView}
        onEdit={(product) => {
          setIsViewModalOpen(false);
          setProductToEdit(product);
          setReturnToViewOnClose(true);
          setIsProductModalOpen(true);
        }}
        onDelete={(product) => {
          setIsViewModalOpen(false);
          // Set selection just to this product so confirm modal deletes it
          setRowSelection({ [product.productId]: true });
          setReturnToViewOnClose(true);
          setIsDeleteModalOpen(true);
        }}
        onExportPdf={async (product) => {
          try {
            await exportProductsPdf(
              [product.productId],
              null,
              undefined,
              "single",
            );
            setBanner({
              type: "success",
              message: "PDF document ready to download",
            });
          } catch (error) {
            console.error("Error exporting PDF:", error);
            setBanner({
              type: "error",
              message: "Failed to export product to PDF",
            });
          }
        }}
      />
    </>
  );
}
