import { X, Sparkles, ArrowDown } from "lucide-react";
import placeholderImage from "@/assets/images/polaroid-white-photo.jpg";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  updateProduct,
  aiGenerateProduct,
  aiGenerateImage,
} from "@/services/product.service";
import AiOverlay from "@/components/product/AiOverlay";
import FullscreenImageOverlay from "@/components/FullscreenImageOverlay";
import DiscardConfirmModal from "@/components/product/DiscardConfirmModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { Product } from "@/types/product.types";

export type CreateEditProductModalData = {
  productId?: string;
  productName: string;
  destination: string;
  category: string;
  description: string;
  imageUrl?: string;
  price: number | "";
  inventoryCount: number | "";
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
      imageUrl: "",
      price: "",
      inventoryCount: "",
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
    imageUrl: prod.imageUrl || "",
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
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [isFullscreenImageOpen, setIsFullscreenImageOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { dirtyFields, errors },
  } = useForm<CreateEditProductModalData>({
    defaultValues: getDefaultValues(product),
  });

  const handleAiGenerateImage = async () => {
    const { productName, description, destination, category } = getValues();
    if (!productName || !description || !destination || !category) {
      if (onError)
        onError(
          "Please enter a Product Name, Destination, Category, and Description first.",
        );
      return;
    }

    setIsImageGenerating(true);
    try {
      const response = await aiGenerateImage({
        productName,
        description,
        destination,
        category,
      });
      if (response.imageUrl) {
        setValue("imageUrl", response.imageUrl, { shouldDirty: true });
        if (onSuccess) onSuccess("Product image generated successfully!");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("AI Image Generation failed:", error);
      if (onError) onError(error.message || "Failed to generate image.");
    } finally {
      setIsImageGenerating(false);
    }
  };

  const handleAiGenerate = async (query: string) => {
    setIsAiGenerating(true);
    try {
      const generated = await aiGenerateProduct(query);

      const newData: CreateEditProductModalData = {
        productName: generated.productName || "",
        destination: generated.destination || "",
        category: generated.category || "",
        description: generated.description || "",
        price: generated.price ?? "",
        inventoryCount: generated.inventoryCount ?? "",
        validFrom: generated.validFrom ? new Date(generated.validFrom) : null,
        validUntil: generated.validUntil
          ? new Date(generated.validUntil)
          : null,
        status: generated.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
      };

      reset(newData, { keepDefaultValues: true });
      setIsAiGenerateOpen(false);
    } catch (error) {
      console.error("AI Generation failed:", error);
      if (onError)
        onError("Failed to generate product via AI. Please try again.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (data: Product | undefined) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["productStats"] });
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
    onSuccess: (updatedProduct: Product | undefined) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["productStats"] });
      onClose();
      if (!updatedProduct) return;
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
    if (Object.keys(dirtyFields).length > 0) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  const onSubmit = (data: CreateEditProductModalData) => {
    const payload = {
      ...data,
      imageUrl: data.imageUrl || null,
      price: Number(data.price) || 0,
      inventoryCount: Number(data.inventoryCount) || 0,
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

  const status = watch("status");

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
        <div
          className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-slide-down flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800">
              {isEdit ? "Edit Product" : "Create Product"}
            </h2>
            <div className="flex items-center gap-6">
              {!isEdit && (
                <button
                  type="button"
                  onClick={() => setIsAiGenerateOpen(true)}
                  disabled={isImageGenerating}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate with AI
                </button>
              )}
              <button
                type="button"
                onClick={handleClose}
                disabled={
                  isImageGenerating ||
                  createMutation.isPending ||
                  updateMutation.isPending
                }
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors -mr-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
              {/* Left Column: Form Inputs */}
              <div className="flex-1 p-6 flex flex-col gap-8 overflow-y-auto">
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
                        className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${errors.productName ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-primary-500"}`}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-600">
                        Destination <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register("destination", { required: true })}
                        className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${errors.destination ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-primary-500"}`}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-600">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register("category", { required: true })}
                        className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${errors.category ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-primary-500"}`}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-600">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        {...register("description", { required: true })}
                        rows={3}
                        className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 resize-none ${errors.description ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-primary-500"}`}
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
                        <Controller
                          name="price"
                          control={control}
                          rules={{ required: true, min: 0 }}
                          render={({
                            field: { onChange, onBlur, value, ref },
                          }) => {
                            let formattedValue = "";
                            if (
                              value !== "" &&
                              value !== null &&
                              value !== undefined
                            ) {
                              const parts = value.toString().split(".");
                              parts[0] = parts[0].replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                ",",
                              );
                              formattedValue = parts.join(".");
                            }

                            return (
                              <input
                                type="text"
                                ref={ref}
                                value={formattedValue}
                                onChange={(e) => {
                                  const rawValue = e.target.value.replace(
                                    /,/g,
                                    "",
                                  );
                                  if (rawValue === "") {
                                    onChange("");
                                    return;
                                  }
                                  if (/^\d*\.?\d*$/.test(rawValue)) {
                                    onChange(rawValue);
                                  }
                                }}
                                onBlur={() => {
                                  if (value !== "" && !isNaN(Number(value))) {
                                    onChange(Number(value).toFixed(2));
                                  }
                                  onBlur();
                                }}
                                className={`w-full pl-12 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${errors.price ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-primary-500"}`}
                              />
                            );
                          }}
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
                        className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${errors.inventoryCount ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-primary-500"}`}
                      />
                    </div>
                  </div>
                </section>

                {/* Validity */}
                <section className="flex flex-col gap-4">
                  <h3 className="text-lg font-semibold text-slate-700">
                    Validity
                  </h3>
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
                            onChange={(date: Date | null) =>
                              field.onChange(date)
                            }
                            dateFormat="dd-MM-yyyy"
                            placeholderText="DD-MM-YYYY"
                            strictParsing={true}
                            className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${errors.validFrom ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-primary-500"}`}
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
                        rules={{
                          required: true,
                          validate: (value) => {
                            // eslint-disable-next-line react-hooks/incompatible-library
                            const from = watch("validFrom");
                            if (from && value && value < from) {
                              return "Cannot be before Valid From";
                            }
                            return true;
                          },
                        }}
                        render={({ field }) => (
                          <DatePicker
                            selected={field.value}
                            onChange={(date: Date | null) =>
                              field.onChange(date)
                            }
                            minDate={watch("validFrom") || undefined}
                            dateFormat="dd-MM-yyyy"
                            placeholderText="DD-MM-YYYY"
                            strictParsing={true}
                            className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 ${errors.validUntil ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-primary-500"}`}
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
                        onClick={() =>
                          setValue("status", "ACTIVE", { shouldDirty: true })
                        }
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                          status === "ACTIVE"
                            ? "bg-white text-primary-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        Active
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setValue("status", "INACTIVE", { shouldDirty: true })
                        }
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                          status === "INACTIVE"
                            ? "bg-white text-primary-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        Inactive
                      </button>
                    </div>
                  </div>
                </section>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-slate-200" />

              {/* Right Column: Product Image */}
              <div className="w-full md:w-[320px] lg:w-[380px] p-6 flex flex-col gap-4 bg-slate-50/50 overflow-y-auto">
                <h3 className="text-lg font-semibold text-slate-700">
                  Product Image
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="w-48 sm:w-64 md:w-full mx-auto">
                    {watch("imageUrl") ? (
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                        <img
                          src={watch("imageUrl")}
                          alt="Product"
                          loading="lazy"
                          className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
                          onClick={() => setIsFullscreenImageOpen(true)}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setValue("imageUrl", "", { shouldDirty: true })
                          }
                          className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg hover:bg-red-50 text-red-600 transition-colors z-10"
                        >
                          <X className="w-4 h-4" />
                        </button>
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
                        <span className="text-sm font-semibold text-primary-600 mb-2">
                          We can generate an image
                        </span>
                        <ArrowDown className="w-5 h-5 text-primary-600 animate-bounce" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleAiGenerateImage}
                    disabled={isImageGenerating}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isImageGenerating ? (
                      "Generating..."
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        {watch("imageUrl")
                          ? "Re-generate Image"
                          : "Generate Image"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 p-6 pt-4 border-t border-slate-100 bg-white">
              <button
                type="button"
                onClick={handleClose}
                disabled={
                  isImageGenerating ||
                  createMutation.isPending ||
                  updateMutation.isPending
                }
                className="px-6 py-2.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  isImageGenerating
                }
                className="px-6 py-2.5 font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-sm cursor-pointer"
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
        loadingButtonText="Generating..."
        suggestions={[
          "Create a Dinner Buffet at Cinnamon Grand Colombo available until the end of this month.",
          "Add a Guided City Tour in Kandy for 5000 LKR, starting next week with 20 spots.",
          "List a Luxury Spa Retreat in Nuwara Eliya categorized as Wellness, priced at 15000 LKR.",
          "Create a VIP Airport Transfer to Ella for 8500 LKR with 5 available bookings.",
        ]}
        onSubmit={handleAiGenerate}
        isLoading={isAiGenerating}
        discardTitle="Discard prompt?"
        discardDescription="You have entered a product prompt. Are you sure you want to discard it?"
      />

      {isFullscreenImageOpen && watch("imageUrl") && (
        <FullscreenImageOverlay
          imageUrl={watch("imageUrl") as string}
          onClose={() => setIsFullscreenImageOpen(false)}
        />
      )}
    </>
  );
}
