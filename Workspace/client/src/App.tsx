import HeroSection from "@/components/hero/HeroSection";
import ProductsSection from "@/components/product/ProductsSection";

function App() {
  return (
    <div className="min-h-screen w-screen p-8 bg-gradient-to-b from-primary-800 to-primary-100 flex flex-col gap-8 font-sans">
      <HeroSection />
      <ProductsSection />
    </div>
  );
}

export default App;
