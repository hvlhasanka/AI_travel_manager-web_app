import { Sparkles, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import DiscardConfirmModal from "@/components/product/DiscardConfirmModal";

interface AiOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  buttonText: string;
  loadingButtonText?: string;
  suggestions: string[];
  onSubmit: (query: string) => void;
  discardTitle: string;
  discardDescription: string;
  isLoading?: boolean;
}

type AiFormData = {
  query: string;
};

export default function AiOverlay({
  isOpen,
  onClose,
  title,
  buttonText,
  loadingButtonText = "Searching...",
  suggestions,
  onSubmit,
  discardTitle,
  discardDescription,
  isLoading = false,
}: AiOverlayProps) {
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const { register, handleSubmit, watch, setValue, reset } =
    useForm<AiFormData>({
      defaultValues: { query: "" },
    });

  // eslint-disable-next-line react-hooks/incompatible-library
  const aiQuery = watch("query");

  // Reset query when closed
  useEffect(() => {
    if (!isOpen) {
      reset({ query: "" });
      setShowDiscardConfirm(false);
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (aiQuery && aiQuery.trim().length > 0) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  const handleFormSubmit = (data: AiFormData) => {
    onSubmit(data.query);
  };

  // We need to extract the register props to add our own focus handlers
  const {
    ref: queryRef,
    onChange: queryOnChange,
    onBlur: queryOnBlur,
    ...queryRest
  } = register("query", { required: true });

  return (
    <>
      <div
        className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-all"
        onClick={handleClose}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          type="button"
          className="absolute top-6 right-6 lg:top-10 lg:right-10 p-2 text-white/70 hover:text-white bg-slate-800/40 hover:bg-slate-800/80 rounded-full transition-all z-10"
        >
          <X className="w-8 h-8" />
        </button>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="w-full flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full max-w-3xl mb-6 animate-slide-down">
            <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg text-center md:text-left">
              {title}
            </h2>
          </div>
          <div className="w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl p-4 flex items-center gap-4 animate-slide-down border border-slate-100">
            <div className="bg-primary-100 p-3 rounded-full flex-shrink-0">
              <Sparkles className="h-8 w-8 text-primary-500" />
            </div>
            <textarea
              autoFocus
              ref={queryRef}
              onChange={queryOnChange}
              onBlur={queryOnBlur}
              {...queryRest}
              rows={2}
              className="w-full text-2xl font-medium bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 resize-none py-2"
            />
            {aiQuery && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.stopPropagation();
                  setValue("query", "");
                }}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors flex-shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div
              className="w-full max-w-3xl mt-4 bg-white rounded-3xl shadow-xl p-6 animate-slide-down border border-slate-100"
              onMouseDown={(e) => e.preventDefault()}
            >
              <div className="text-sm font-semibold text-slate-400 mb-4 px-2">
                Suggestions
              </div>
              <div className="flex flex-col gap-2">
                {suggestions.map((suggestion, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setValue("query", suggestion)}
                    className="text-left w-full px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 font-medium flex items-center gap-3 border border-transparent hover:border-slate-200 cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4 text-slate-400" />
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="w-full max-w-3xl flex mt-12 animate-slide-down">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-3 font-bold text-xl px-8 py-4 rounded-[2rem] shadow-lg transition-transform ${
                isLoading
                  ? "bg-primary-400 text-white/80 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700 text-white hover:scale-[1.02] active:scale-95"
              }`}
            >
              {isLoading ? (
                <>
                  {loadingButtonText}
                  <div className="w-5 h-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
                </>
              ) : (
                <>
                  {buttonText}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>

        <DiscardConfirmModal
          isOpen={showDiscardConfirm}
          onClose={() => setShowDiscardConfirm(false)}
          onConfirm={() => {
            setShowDiscardConfirm(false);
            onClose();
          }}
          title={discardTitle}
          description={discardDescription}
        />
      </div>
    </>
  );
}
