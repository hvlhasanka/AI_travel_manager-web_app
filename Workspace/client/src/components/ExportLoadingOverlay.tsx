import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
interface ExportLoadingOverlayProps {
  isOpen: boolean;
}

export default function ExportLoadingOverlay({
  isOpen,
}: ExportLoadingOverlayProps) {
  useBodyScrollLock(isOpen);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="text-center flex items-center justify-center text-2xl sm:text-3xl font-bold text-white tracking-wide">
        Preparing Export
        <span className="ml-2 flex items-center text-4xl sm:text-5xl leading-none">
          <span className="animate-bounce">.</span>
          <span className="animate-bounce" style={{ animationDelay: "150ms" }}>
            .
          </span>
          <span className="animate-bounce" style={{ animationDelay: "300ms" }}>
            .
          </span>
        </span>
      </div>
    </div>
  );
}
