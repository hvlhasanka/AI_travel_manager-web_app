import heroCoverImage from "../../../assets/images/hero-cover-image.jpg";
import StatCardSection from "./StatCardSection";
import BrowseProductsButton from "./BrowseProductsButton";
import HeroHeader from "./HeroHeader";

export default function HeroSection() {
  return (
    <section
      className="w-full min-h-[55vh] shrink-0 rounded-2xl min-[1090px]:rounded-[3rem] shadow-xl bg-cover bg-center relative overflow-hidden flex flex-col items-center justify-end pt-28 md:pt-32 pb-24 md:pb-32 gap-8 md:gap-0"
      style={{ backgroundImage: `url(${heroCoverImage})` }}
    >
      <HeroHeader />

      <StatCardSection />

      <BrowseProductsButton />
    </section>
  );
}
