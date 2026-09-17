import { X, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import AiOverlay from "./AiOverlay";
import DiscardConfirmModal from "./DiscardConfirmModal";

export type CreateEditProductModalData = {
  productName: string;
  destination: string;
  category: string;
  price: number;
  inventoryCount: number;
  validFrom: string;
  validUntil: string;
  status: "ACTIVE" | "INACTIVE";
};

interface CreateEditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: CreateEditProductModalData | null; // If provided, it's edit mode
}

export default function CreateEditProductModal({
  isOpen,
  onClose,
  product,
}: CreateEditProductModalProps) {
  const [isAiGenerateOpen, setIsAiGenerateOpen] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isDirty },
  } = useForm<CreateEditProductModalData>({
    defaultValues: product || {
      productName: "",
      destination: "",
      category: "",
      price: 0,
      inventoryCount: 0,
      validFrom: "",
      validUntil: "",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset(
        product || {
          productName: "",
          destination: "",
          category: "",
          price: 0,
          inventoryCount: 0,
          validFrom: "",
          validUntil: "",
          status: "ACTIVE",
        },
      );
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
    onClose();
  };

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
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Generate with AI
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors -mr-2"
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
                  <textarea
                    {...register("category")}
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
                  <input
                    type="date"
                    {...register("validFrom", { required: true })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-600">
                    Valid Until <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register("validUntil", { required: true })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${
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
                    className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${
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
                className="px-6 py-2.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-colors shadow-sm"
              >
                Save Product
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
        cancelText="Keep Editing"
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
