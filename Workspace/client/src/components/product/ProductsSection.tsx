import ProductsTable from "./ProductsTable";
import CreateEditProductModal from "./CreateEditProductModal";
import AiOverlay from "./AiOverlay";
import ProductFilter, { type FilterFormValues } from "./ProductFilter";
import { Sparkles, Plus } from "lucide-react";
import { useState } from "react";

export default function ProductsSection() {
  const [isAiSearchOpen, setIsAiSearchOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const onSubmit = (data: FilterFormValues) => {
    console.log("Filter Data:", data);
  };

  return (
    <>
      <section
        id="products-section"
        className="w-full flex-1 bg-white rounded-[3rem] shadow-sm border border-slate-200 flex flex-col items-center py-16 px-[5%] text-center"
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
              onClick={() => setIsProductModalOpen(true)}
              className="flex-shrink-0 flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-full font-semibold transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Create Product</span>
            </button>
          </div>
        </div>
        <div className="w-full flex flex-col lg:flex-row gap-6 h-full min-h-[400px]">
          {/* Products Table Inner Container */}
          <div className="w-full lg:w-[80%] h-full border-2 border-orange-200/50 rounded-3xl p-8 flex flex-col overflow-hidden">
            <ProductsTable />
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
        onClose={() => setIsProductModalOpen(false)}
      />
    </>
  );
}
