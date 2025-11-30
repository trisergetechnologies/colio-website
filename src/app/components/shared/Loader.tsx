import React from "react";

const Loader = () => {
  return (
    <span
      className="
        ml-1.5 h-5 w-5 animate-spin 
        rounded-full border-[3px] border-solid 
        border-white/40 border-t-white 
        dark:border-white/20 dark:border-t-white
        shadow-[0_0_4px_rgba(255,255,255,0.6)]
      "
    ></span>
  );
};

export default Loader;