import HeroSection from "./components/HeroSection";
import ProductsSection from "./components/ProductsSection";

function App() {
  return (
    <div className="min-h-screen w-screen p-8 bg-gradient-to-b from-orange-800 to-orange-100 flex flex-col gap-8 font-sans">
      <HeroSection />
      <ProductsSection />
    </div>
  );
}

export default App;
