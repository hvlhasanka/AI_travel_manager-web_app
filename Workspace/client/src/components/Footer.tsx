import GithubIcon from "@/components/icons/GithubIcon";

export default function Footer() {
  return (
    <footer className="w-full mt-auto flex justify-between items-center text-orange-900 text-sm bg-orange-50 rounded-2xl min-[1090px]:rounded-[3rem] shadow-sm py-6 px-6 min-[1090px]:px-12 border border-orange-100">
      <div className="text-left">
        &copy; {new Date().getFullYear()} Lucas (Lahiru) H. Released under the{" "}
        <a
          href="https://github.com/hvlhasanka/AI_travel_manager-web_app/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline font-semibold hover:text-orange-700 transition-colors"
        >
          MIT License
        </a>
        .
      </div>
      <div>
        <a
          href="https://github.com/hvlhasanka/AI_travel_manager-web_app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:underline font-semibold hover:text-orange-700 transition-colors"
        >
          <GithubIcon className="w-4 h-4" />
          <span>Github</span>
        </a>
      </div>
    </footer>
  );
}
