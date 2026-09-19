import openAiLogo from "@/assets/images/openai_white.png";

export default function PoweredByOpenAi() {
  return (
    <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-10 lg:right-10 flex items-center gap-1.5 sm:gap-2 pointer-events-none drop-shadow-xl">
      <span className="text-sm sm:text-base md:text-lg font-bold text-white/90 tracking-wider">
        Powered by
      </span>
      <img
        src={openAiLogo}
        alt="OpenAI"
        className="h-6 sm:h-8 md:h-10 lg:h-12 object-contain opacity-90"
      />
    </div>
  );
}
