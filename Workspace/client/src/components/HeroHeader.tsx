import logoImage from "../../assets/logo/logo.png";

export default function HeroHeader() {
  return (
    <div className="absolute top-10 flex items-center justify-center gap-8 px-4">
      <div className="bg-[#ededed] pt-1 rounded-2xl shadow-lg flex items-center justify-center overflow-hidden">
        <img
          src={logoImage}
          alt="Logo"
          className="h-16 md:h-20 w-auto object-contain"
        />
      </div>
      <h1 className="text-white text-4xl md:text-5xl font-black tracking-widest uppercase drop-shadow-xl">
        Travel Manager
      </h1>
    </div>
  );
}
