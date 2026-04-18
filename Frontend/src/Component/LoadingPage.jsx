import React from "react";

const LoadingPage = ({ text = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 border-opacity-50"></div>
        
        {/* Text */}
        <p className="mt-4 text-gray-700 font-medium text-lg">{text}</p>
      </div>
    </div>
  );
};

export default LoadingPage;
