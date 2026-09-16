import heroCoverImage from "../../assets/images/hero-cover-image.jpg";
import StatCardSection from "./StatCardSection";
import BrowseProductsButton from "./BrowseProductsButton";
import HeroHeader from "./HeroHeader";

export default function HeroSection() {
  return (
    <section
      className="w-full h-[55vh] shrink-0 rounded-[3rem] shadow-xl border border-orange-700 bg-cover bg-center relative overflow-hidden flex flex-col items-center justify-end pb-32"
      style={{ backgroundImage: `url(${heroCoverImage})` }}
    >
      <HeroHeader />

      <StatCardSection />

      <BrowseProductsButton />
    </section>
  );
}
