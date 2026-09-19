import { X } from "lucide-react";

interface FullscreenImageOverlayProps {
  imageUrl: string;
  onClose: () => void;
}

export default function FullscreenImageOverlay({
  imageUrl,
  onClose,
}: FullscreenImageOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 p-2.5 bg-white/10 text-white hover:bg-white/20 rounded-full transition-all cursor-pointer z-10 hover:scale-105"
      >
        <X className="w-6 h-6" />
      </button>
      <div className="relative max-w-5xl max-h-screen animate-slide-down">
        <img
          src={imageUrl}
          alt="Fullscreen"
          loading="lazy"
          className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
