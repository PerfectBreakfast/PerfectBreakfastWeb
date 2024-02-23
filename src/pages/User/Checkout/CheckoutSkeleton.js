import React from "react";

const CheckoutSkeleton = () => {
  return (
    <div>
      <div className="animate-pulse">
        <div className="text-lg mb-2 bg-gray-300 h-6 w-3/4 rounded"></div>
        <div className="text-lg mb-2 bg-gray-300 h-6 w-1/2 rounded"></div>
        <div className="bg-gray-400 h-px mt-2 mb-2"></div>{" "}
        {/* Custom Divider */}
        <div className="text-lg mb-2 bg-gray-300 h-6 w-3/5 rounded"></div>
        <div className="bg-gray-400 h-px mt-2 mb-2"></div>{" "}
        {/* Custom Divider */}
      </div>
    </div>
  );
};

export default CheckoutSkeleton;
