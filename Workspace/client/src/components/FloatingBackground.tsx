import React from "react";

const FloatingBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top Left Circle (Light Orange) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-200/40 rounded-full blur-[80px] animate-float" />

      {/* Top Right Circle (Light Orange) */}
      <div className="absolute top-[-5%] right-[-10%] w-[30rem] h-[30rem] bg-primary-300/30 rounded-full blur-[100px] animate-float-delayed" />

      {/* Middle Left Circle (Mid Orange) */}
      <div className="absolute top-[45%] left-[-8%] w-72 h-72 bg-primary-400/30 rounded-full blur-[70px] animate-float-slow" />

      {/* Middle Right Circle (Mid Orange) */}
      <div className="absolute top-[55%] right-[-8%] w-80 h-80 bg-primary-500/20 rounded-full blur-[80px] animate-float" />

      {/* Bottom Left Circle (Darker Orange) */}
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-primary-600/30 rounded-full blur-[80px] animate-float-slow" />

      {/* Bottom Right Circle (Darker Orange) */}
      <div className="absolute bottom-[-5%] right-[-10%] w-[28rem] h-[28rem] bg-primary-700/20 rounded-full blur-[90px] animate-float-delayed" />
    </div>
  );
};

export default FloatingBackground;
