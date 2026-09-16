export default function BrowseProductsButton() {
  return (
    <a
      href="#products-section"
      className="absolute bottom-10 animate-bounce flex items-center justify-center bg-white/20 backdrop-blur-md px-6 py-3 rounded-full text-white font-semibold shadow-lg hover:bg-white/30 transition-all cursor-pointer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
      <span>Browse Travel Products</span>
    </a>
  );
}
