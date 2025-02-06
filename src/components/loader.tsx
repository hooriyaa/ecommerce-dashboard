import React from "react";

const Loader = () => {
  return (
    <div className="ml-5 flex items-center justify-center h-screen bg-gray-100 w-[850px] sm:w-full mx-auto max-w-7xl">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#029FAE] border-solid p-14"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base text-[#029FAE] font-medium">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
