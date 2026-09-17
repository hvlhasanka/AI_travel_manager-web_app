import { ArrowDown } from "lucide-react";

export default function BrowseProductsButton() {
  return (
    <a
      href="#products-section"
      className="absolute bottom-10 flex items-center justify-center bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-white font-semibold shadow-lg hover:bg-white/30 transition-all cursor-pointer"
    >
      <ArrowDown className="h-5 w-5 mr-2" />
      <span>Browse Travel Products</span>
    </a>
  );
}
