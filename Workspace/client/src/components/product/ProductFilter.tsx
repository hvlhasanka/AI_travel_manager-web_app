import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { MAX_PRICE } from "../../constants";

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
      className={`w-full lg:w-[20%] h-full border-2 border-orange-200/50 rounded-3xl p-6 flex flex-col items-start overflow-y-auto ${className}`}
    >
      <div className="w-full flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800">Filter</h3>
        <button
          type="button"
          onClick={() => {
            reset();
            onReset?.();
          }}
          className="text-sm font-semibold text-slate-500 hover:text-orange-600 transition-colors cursor-pointer"
        >
          Reset
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onFilter)}
        className="w-full flex flex-col gap-4 text-left"
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-slate-700">
            Product
          </label>
          <input
            {...register("product")}
            placeholder="Product name"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-slate-700">
            Destination
          </label>
          <input
            {...register("destination")}
            placeholder="Destination"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-slate-700">
            Category
          </label>
          <input
            {...register("category")}
            placeholder="Category"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-slate-700">
            Price Range
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              {...register("minPrice")}
              placeholder="Min"
              className="w-1/2 px-2 py-1.5 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
            />
            <span className="text-slate-400">-</span>
            <input
              type="number"
              {...register("maxPrice")}
              placeholder="Max"
              className="w-1/2 px-2 py-1.5 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <input
            type="range"
            min="0"
            max={MAX_PRICE}
            {...register("maxPrice")}
            className="w-full mt-2 accent-orange-500"
          />
          <div className="text-xs text-slate-500 text-right">
            Max: LKR {maxPrice}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-slate-700">Status</label>
          <div className="flex items-center gap-2">
            {["ALL", "ACTIVE", "INACTIVE"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setValue("status", s)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                  status === s
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
        >
          Apply
        </button>
      </form>
    </div>
  );
}
