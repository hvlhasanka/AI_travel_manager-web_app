import ProductsTable from "./ProductsTable";
import CreateEditProductModal from "./CreateEditProductModal";
import ViewProductModal from "./ViewProductModal";
import AiOverlay from "./AiOverlay";
import ProductFilter, { type FilterFormValues } from "./ProductFilter";
import { Plus, Sparkles, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import Banner from "../Banner";
import { type RowSelectionState } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "../../services/product.service";
import DeleteConfirmModal from "./DeleteConfirmModal";
import type { Product } from "../../types/product.types";

export default function ProductsSection() {
  const [isAiSearchOpen, setIsAiSearchOpen] = useState(false);
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

  const onSubmit = (data: FilterFormValues) => {
    console.log("Filter Data:", data);
  };

  return (
    <>
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
          duration={3000}
          onClose={() => setBanner(null)}
        />
      )}
      <section
        id="products-section"
        className="w-full min-h-[95vh] flex-1 bg-white rounded-[3rem] shadow-sm border border-slate-200 flex flex-col items-center py-16 px-16 min-[1600px]:px-[5%] text-center"
      >
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 text-left">
          <div className="flex flex-col md:flex-row md:items-baseline gap-4">
            <h2 className="text-3xl font-bold text-slate-800">
              Travel Products
            </h2>
            <span className="text-slate-400 font-medium">
              Search, create, edit or remove products
            </span>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {selectedCount > 1 && (
              <div className="flex items-center px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-sm font-semibold text-slate-600">
                {selectedCount} items selected
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
            <div className="relative w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Sparkles className="h-5 w-5 text-orange-500" />
              </div>
              <input
                type="text"
                readOnly
                onClick={() => setIsAiSearchOpen(true)}
                placeholder="Search any product in your own words ..."
                className="w-full md:w-80 lg:w-96 xl:w-[32rem] pl-10 pr-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all cursor-pointer"
              />
            </div>
            <button
              onClick={handleCreate}
              className="flex-shrink-0 flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full font-semibold transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Create Product</span>
            </button>
          </div>
        </div>
        <div className="w-full flex flex-col lg:flex-row gap-6 h-full min-h-[400px]">
          {/* Products Table Inner Container */}
          <div className="w-full lg:w-[80%] min-h-[78vh] border-2 border-orange-200/50 rounded-3xl p-8 flex flex-col overflow-hidden">
            <ProductsTable
              highlightedProductId={highlightedProductId}
              animatedProductId={animatedProductId}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              onRowClick={handleRowClick}
            />
          </div>
          {/* Filter Inner Container */}
          <ProductFilter onFilter={onSubmit} />
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
        onSubmit={(query) => {
          console.log("Search with AI query:", query);
          setIsAiSearchOpen(false);
        }}
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
            setHighlightedProductId(productId);
            setAnimatedProductId(productId);
            setTimeout(() => setAnimatedProductId(null), 5000);
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
      />
    </>
  );
}
