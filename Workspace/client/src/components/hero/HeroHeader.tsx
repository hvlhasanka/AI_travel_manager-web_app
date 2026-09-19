import logoImage from "@/assets/logo/logo.png";

export default function HeroHeader() {
  return (
    <div className="absolute top-6 md:top-10 flex flex-row items-center justify-between md:justify-center gap-4 md:gap-8 px-6 text-center w-full">
      <div className="bg-[#ededed] pt-1 rounded-xl md:rounded-2xl shadow-lg flex items-center justify-center overflow-hidden shrink-0">
        <img
          src={logoImage}
          alt="Logo"
          className="h-10 md:h-20 w-auto object-contain"
        />
      </div>
      <h1 className="text-white text-xl sm:text-2xl md:text-5xl font-bold tracking-widest uppercase drop-shadow-xl text-right md:text-center leading-tight">
        Travel Manager
      </h1>
    </div>
  );
}
