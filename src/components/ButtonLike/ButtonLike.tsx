import React, { useState } from "react";

type buttonType = {
  onclick?: () => void | Promise<void>;
  className?: string;
};
const ButtonLike: React.FC<buttonType> = ({ onclick, className }) => {
  return (
    <button
      onClick={onclick}
      className={`flex items-center justify-center w-10 h-10 rounded-full ${className} focus:outline-none`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-4 h-4 text-white"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </button>
  );
};

export default ButtonLike;
