import React from "react";

const ComboDetailSkeleton = () => {
  return (
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-lg">
      <div class="animate-pulse max-h-64 w-full mt-2 border-2 border-white rounded-xl shadow-md overflow-hidden">
        <div class="bg-gray-300 h-64 w-full"></div>
      </div>

      <div class="text-center mt-5">
        <div class="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
        <div class="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
        <div class="h-4 bg-gray-300 rounded w-5/6 mx-auto mb-2"></div>
        <div class="h-4 bg-gray-300 rounded w-5/6 mx-auto mb-2"></div>

        <div class="mb-5 fixed bottom-0 left-0 w-full bg-white">
          <div class="flex items-center justify-center py-2.5 space-x-2">
            <div class="bg-gray-300 rounded-full h-8 w-8"></div>
            <div class="bg-gray-300 rounded h-6 w-10"></div>
            <div class="bg-gray-300 rounded-full h-8 w-8"></div>
          </div>

          <div class="bg-gray-300 h-10 rounded-3xl w-5/6 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default ComboDetailSkeleton;
