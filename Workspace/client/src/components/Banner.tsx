import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

interface BannerProps {
  type: "success" | "error";
  message: string;
  duration?: number;
  onClose?: () => void;
}

export default function Banner({
  type,
  message,
  duration = 8000,
  onClose,
}: BannerProps) {
  const [showBanner, setShowBanner] = useState(true);
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    if (showBanner && !isHiding) {
      const timer = setTimeout(() => {
        setIsHiding(true);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [showBanner, isHiding, duration]);

  const handleClose = () => setIsHiding(true);

  const handleAnimationEnd = () => {
    if (isHiding) {
      setShowBanner(false);
      if (onClose) onClose();
    }
  };

  if (!showBanner) return null;

  const isSuccess = type === "success";

  return (
    <div
      className={`fixed top-4 left-4 right-4 z-[100] ${isHiding ? "animate-slide-up" : "animate-slide-down"}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <div
        className={`relative px-4 py-5 flex items-center justify-center gap-3 rounded-xl shadow-lg ${isSuccess ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
      >
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 shrink-0" />
        )}
        <span className="font-medium text-sm sm:text-base md:text-lg text-center pr-6 sm:pr-0">
          {message}
        </span>
        <button
          onClick={handleClose}
          className={`absolute right-4 p-1 rounded-md transition-colors ${isSuccess ? "hover:bg-green-100" : "hover:bg-red-100"}`}
          aria-label="Close banner"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
