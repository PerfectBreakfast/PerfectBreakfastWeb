import React from "react";

const OrderHistoryListSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 7 }).map((_, index) => (
        <div key={index} className="p-4 bg-white rounded-lg shadow">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-300 h-16 w-16"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-gray-300 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-gray-300 rounded col-span-2"></div>
                  <div className="h-2 bg-gray-300 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistoryListSkeleton;
