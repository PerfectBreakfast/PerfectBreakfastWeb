import React from "react";

const OrderDetailSkeleton = () => {
  return (
    <div className="flex flex-col max-w-md mx-auto px-4 py-4">
      {/* Order Summary Skeleton */}
      <div className="rounded-lg mb-1">
        <h2 className="text-lg font-semibold mb-2 bg-gray-300 rounded h-6 w-1/3 animate-pulse"></h2>
        {Array.from({ length: 1 }).map((_, index) => (
          <div
            key={index}
            className="bg-white shadow rounded-2xl p-3 mb-2 last:mb-0 animate-pulse"
          >
            <div className="flex justify-between">
              <div className="flex ">
                <div className="h-20 w-20 bg-gray-300 object-cover rounded-lg mr-2"></div>
                <div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment and Total Skeleton */}
      <div className="mb-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex justify-between mt-2 animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
        ))}
      </div>

      {/* QR Code Skeleton */}
      <div className="flex flex-col items-center animate-pulse">
        <div className="h-40 w-40 bg-gray-300 rounded-lg"></div>
        <div className="h-6 bg-gray-300 rounded w-1/2 mt-3"></div>
      </div>
    </div>
  );
};

export default OrderDetailSkeleton;
