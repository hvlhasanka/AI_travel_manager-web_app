import HeroSection from "@/components/hero/HeroSection";
import ProductsSection from "@/components/product/ProductsSection";
import Footer from "@/components/footer/Footer";
import FloatingBackground from "@/components/FloatingBackground";

function App() {
  return (
    <div className="relative min-h-screen w-screen p-8 bg-gradient-to-b from-primary-800 to-primary-100 flex flex-col gap-8 font-sans overflow-hidden">
      <FloatingBackground />
      <div className="relative z-10 flex flex-col gap-8">
        <HeroSection />
        <ProductsSection />
        <Footer />
      </div>
    </div>
  );
}

export default App;
