// src/components/common/LoadingState.tsx
import React from "react";

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Loading..." 
}) => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center">
        <div className="animate-spin w-12 h-12 border-4 border-t-indigo-500 rounded-full mb-4" />
        <p className="text-indigo-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

// src/components/common/ErrorState.tsx

interface ErrorStateProps {
  error: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <h3 className="font-bold mb-2">Error loading report data</h3>
        <p className="text-red-500">{error}</p>
      </div>
    </div>
  );
};