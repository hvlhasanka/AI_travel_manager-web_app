import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface FullscreenImageOverlayProps {
  isOpen: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

export default function FullscreenImageOverlay({
  isOpen,
  imageUrl: incomingImageUrl,
  onClose,
}: FullscreenImageOverlayProps) {
  useBodyScrollLock(isOpen);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(
    incomingImageUrl,
  );

  useEffect(() => {
    if (incomingImageUrl) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalImageUrl(incomingImageUrl);
    }
  }, [incomingImageUrl]);

  if (!localImageUrl) return null;

  return (
    <div
      className={`fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-all duration-300 ease-out ${
        isOpen
          ? "opacity-100 visible"
          : "opacity-0 invisible pointer-events-none"
      }`}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 p-2.5 bg-white/10 text-white hover:bg-white/20 rounded-full transition-all cursor-pointer z-10 hover:scale-105"
      >
        <X className="w-6 h-6" />
      </button>
      <div
        className={`relative max-w-5xl max-h-screen transition-all duration-300 ease-out delay-75 ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95"
        }`}
      >
        <img
          src={localImageUrl}
          alt="Fullscreen"
          loading="lazy"
          className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
