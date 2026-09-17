import { X, Sparkles } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct } from "../../services/product.service";
import AiOverlay from "./AiOverlay";
import DiscardConfirmModal from "./DiscardConfirmModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { Product } from "../../types/product.types";

export type CreateEditProductModalData = {
  productId?: string;
  productName: string;
  destination: string;
  category: string;
  description: string;
  price: number;
  inventoryCount: number;
  validFrom: Date | null;
  validUntil: Date | null;
  status: "ACTIVE" | "INACTIVE";
};

interface CreateEditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSuccess?: (message: string, productId?: string, product?: Product) => void;
  onError?: (message: string) => void;
}

const getDefaultValues = (
  prod?: Product | null,
): CreateEditProductModalData => {
  if (!prod) {
    return {
      productName: "",
      destination: "",
      category: "",
      description: "",
      price: 0,
      inventoryCount: 0,
      validFrom: null,
      validUntil: null,
      status: "ACTIVE",
    };
  }
  return {
    productId: prod.productId,
    productName: prod.productName,
    destination: prod.destination,
    category: prod.category,
    description: prod.description,
    price: prod.price,
    inventoryCount: prod.inventoryCount,
    validFrom: prod.validFrom ? new Date(prod.validFrom) : null,
    validUntil: prod.validUntil ? new Date(prod.validUntil) : null,
    status: prod.status as "ACTIVE" | "INACTIVE",
  };
};

export default function CreateEditProductModal({
  isOpen,
  onClose,
  onSuccess,
  onError,
  product,
}: CreateEditProductModalProps) {
  const [isAiGenerateOpen, setIsAiGenerateOpen] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isDirty },
  } = useForm<CreateEditProductModalData>({
    defaultValues: getDefaultValues(product),
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onClose();
      const newProductId =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data as any)?.data?.productId || (data as any)?.productId;
      if (onSuccess)
        onSuccess("Product created successfully!", newProductId, data);
    },
    onError: (error: Error) => {
      console.error("Failed to create product:", error);
      if (onError) onError(error.message || "Failed to create product");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: Parameters<typeof updateProduct>[1];
    }) => updateProduct(productId, data),
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onClose();
      if (onSuccess)
        onSuccess(
          "Product updated successfully!",
          updatedProduct.productId,
          updatedProduct,
        );
    },
    onError: (error: Error) => {
      console.error("Failed to update product:", error);
      if (onError) onError(error.message || "Failed to update product");
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset(getDefaultValues(product));
      setShowDiscardConfirm(false);
    }
  }, [isOpen, product, reset]);

  if (!isOpen) return null;

  const isEdit = !!product;

  const handleClose = () => {
    if (isDirty) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  const onSubmit = (data: CreateEditProductModalData) => {
    console.log("Saving Product:", data);

    const payload = {
      ...data,
      validFrom: data.validFrom ? data.validFrom.toISOString() : "",
      validUntil: data.validUntil ? data.validUntil.toISOString() : "",
    };

    if (isEdit && data.productId) {
      updateMutation.mutate({
        productId: data.productId,
        data: payload as Parameters<typeof updateProduct>[1],
      });
    } else {
      createMutation.mutate(payload as Parameters<typeof createProduct>[0]);
    }
  };

  // eslint-disable-next-line react-hooks/incompatible-library
  const status = watch("status");

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
        onClick={handleClose}
      >
        <div
          className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-down flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800">
              {isEdit ? "Edit Product" : "Create Product"}
            </h2>
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setIsAiGenerateOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Generate with AI
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors -mr-2 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 flex flex-col gap-8 flex-1"
          >
            {/* Basic Information */}
            <section className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-slate-700">
                Basic Information
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-600">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("productName", { required: true })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-600">
                    Destination <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("destination", { required: true })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-600">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("category", { required: true })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-600">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register("description", { required: true })}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Pricing & Inventory */}
            <section className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-slate-700">
                Pricing & Inventory
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-600">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-slate-400 text-sm font-medium">
                        LKR
                      </span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      {...register("price", {
                        required: true,
                        min: 0,
                        valueAsNumber: true,
                        onBlur: (e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val)) {
                            e.target.value = val.toFixed(2);
                          }
                        },
                      })}
                      className="w-full pl-12 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-600">
                    Inventory Count <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register("inventoryCount", {
                      required: true,
                      min: 0,
                      valueAsNumber: true,
                    })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </section>

            {/* Validity */}
            <section className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-slate-700">Validity</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-600">
                    Valid From <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="validFrom"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={(date: Date | null) => field.onChange(date)}
                        dateFormat="dd-MM-yyyy"
                        placeholderText="DD-MM-YYYY"
                        strictParsing={true}
                        className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                        wrapperClassName="w-full"
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-600">
                    Valid Until <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="validUntil"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={(date: Date | null) => field.onChange(date)}
                        dateFormat="dd-MM-yyyy"
                        placeholderText="DD-MM-YYYY"
                        strictParsing={true}
                        className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                        wrapperClassName="w-full"
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <label className="text-sm font-semibold text-slate-600">
                  Status
                </label>
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-max">
                  <button
                    type="button"
                    onClick={() => setValue("status", "ACTIVE")}
                    className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                      status === "ACTIVE"
                        ? "bg-white text-orange-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("status", "INACTIVE")}
                    className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                      status === "INACTIVE"
                        ? "bg-white text-orange-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    Inactive
                  </button>
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-6 py-2.5 font-semibold text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : isEdit
                    ? "Save Changes"
                    : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <DiscardConfirmModal
        isOpen={showDiscardConfirm}
        onClose={() => setShowDiscardConfirm(false)}
        onConfirm={() => {
          setShowDiscardConfirm(false);
          onClose();
        }}
        title="Discard changes?"
        description="You have unsaved changes. Are you sure you want to close and discard them?"
        cancelText="Cancel"
      />

      <AiOverlay
        isOpen={isAiGenerateOpen}
        onClose={() => setIsAiGenerateOpen(false)}
        title="Describe the new product in your own words..."
        buttonText="Generate"
        suggestions={[
          "Create a Dinner Buffet at Cinnamon Grand Colombo available until the end of this month.",
          "Add a Guided City Tour in Kandy for 5000 LKR, starting next week with 20 spots.",
          "List a Luxury Spa Retreat in Nuwara Eliya categorized as Wellness, priced at 15000 LKR.",
          "Create a VIP Airport Transfer to Ella for 8500 LKR with 5 available bookings.",
        ]}
        onSubmit={(query) => {
          console.log("Generating with AI query:", query);
          setIsAiGenerateOpen(false);
        }}
        discardTitle="Discard prompt?"
        discardDescription="You have entered a product prompt. Are you sure you want to discard it?"
      />
    </>
  );
}
