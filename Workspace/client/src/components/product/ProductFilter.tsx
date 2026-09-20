import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { MAX_PRICE } from "@/constants";

export type FilterFormValues = {
  product: string;
  destination: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  status: string;
};

interface ProductFilterProps {
  onFilter: (data: FilterFormValues) => void;
  onReset?: () => void;
  className?: string;
  externalFilters?: FilterFormValues | null;
}

export default function ProductFilter({
  onFilter,
  onReset,
  className = "",
  externalFilters = null,
}: ProductFilterProps) {
  const { register, handleSubmit, watch, setValue, reset } =
    useForm<FilterFormValues>({
      defaultValues: externalFilters || {
        product: "",
        destination: "",
        category: "",
        minPrice: 0,
        maxPrice: MAX_PRICE,
        status: "ALL",
      },
    });

  useEffect(() => {
    if (externalFilters) {
      reset(externalFilters);
    } else {
      reset({
        product: "",
        destination: "",
        category: "",
        minPrice: 0,
        maxPrice: MAX_PRICE,
        status: "ALL",
      });
    }
  }, [externalFilters, reset]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const status = watch("status");
  const maxPrice = watch("maxPrice");

  return (
    <div
      id="product-filter-container"
      className={`w-full border-2 border-primary-200/50 rounded-3xl p-6 flex flex-col gap-4 ${className}`}
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-slate-800">Filter</h3>
          <button
            type="button"
            onClick={() => {
              reset({
                product: "",
                destination: "",
                category: "",
                minPrice: 0,
                maxPrice: MAX_PRICE,
                status: "ALL",
              });
              onReset?.();
            }}
            className="text-sm font-semibold text-slate-500 hover:text-primary-600 transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
        <button
          type="submit"
          form="product-filter-form"
          className="py-2 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          Apply
        </button>
      </div>

      <form
        id="product-filter-form"
        onSubmit={handleSubmit(onFilter)}
        className="w-full flex flex-row flex-wrap items-start gap-6 text-left"
      >
        <div className="flex flex-col gap-1 w-full md:w-auto md:flex-1 md:min-w-[150px]">
          <label className="text-sm font-semibold text-slate-700">
            Product
          </label>
          <input
            {...register("product")}
            placeholder="Product name"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[120px] md:min-w-[150px]">
          <label className="text-sm font-semibold text-slate-700">
            Destination
          </label>
          <input
            {...register("destination")}
            placeholder="Destination"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[120px] md:min-w-[150px]">
          <label className="text-sm font-semibold text-slate-700">
            Category
          </label>
          <input
            {...register("category")}
            placeholder="Category"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[200px] md:-mt-5">
          <label className="text-sm font-semibold text-slate-700 flex justify-between items-center">
            <span>Price Range</span>
            <span className="text-xs text-slate-500 font-normal">
              Max: LKR {maxPrice}
            </span>
          </label>
          <input
            type="range"
            min="0"
            max={MAX_PRICE}
            value={maxPrice || 0}
            onChange={(e) => setValue("maxPrice", Number(e.target.value))}
            className="w-full accent-primary-500 mb-1"
          />
          <div className="flex items-center gap-2">
            <input
              type="number"
              {...register("minPrice", { valueAsNumber: true })}
              placeholder="Min"
              className="w-1/2 px-2 py-1.5 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
            />
            <span className="text-slate-400">-</span>
            <input
              type="number"
              {...register("maxPrice", { valueAsNumber: true })}
              placeholder="Max"
              className="w-1/2 px-2 py-1.5 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-sm font-semibold text-slate-700">Status</label>
          <div className="flex items-center gap-2">
            {["ALL", "ACTIVE", "INACTIVE"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setValue("status", s)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                  status === s
                    ? "bg-primary-500 text-white border-primary-500"
                    : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
