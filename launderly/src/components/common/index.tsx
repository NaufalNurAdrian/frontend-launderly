import React, { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Loading state component
export const LoadingState: React.FC<{ message?: string }> = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center h-64">
    <div className="flex flex-col items-center">
      <div className="animate-spin w-12 h-12 border-4 border-t-primary rounded-full mb-4" />
      <p className="text-primary font-medium">{message}</p>
    </div>
  </div>
);

// Error state component
export const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div className="flex items-center justify-center h-64 text-red-500">
    <div className="bg-red-50 p-6 rounded-lg border border-red-200">
      <h3 className="font-bold mb-2">Error loading report data</h3>
      <p>{error}</p>
    </div>
  </div>
);

// Metric card component with consistent styling
interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
  icon?: ReactNode;
  extras?: ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, color, icon, extras }) => (
  <Card className={`overflow-hidden border-none shadow-md bg-gradient-to-br from-${color}-50 to-white`}>
    <CardHeader className={`pb-2 border-b border-${color}-100`}>
      <CardTitle className={`text-sm font-medium text-${color}-700 flex items-center`}>
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-4">
      <div className={`text-2xl font-bold text-${color}-700`}>{value}</div>
      {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      {extras}
    </CardContent>
  </Card>
);

// Chart card component with consistent styling
interface ChartCardProps {
  title: string;
  color: string;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, color, icon, children, className }) => (
  <Card className={`border-none shadow-md overflow-hidden ${className || ""}`}>
    <CardHeader className={`bg-gradient-to-r from-${color}-50 to-${color}-100 border-b`}>
      <CardTitle className={`text-${color}-700 font-medium flex items-center`}>
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-4 h-64 sm:h-80">{children}</CardContent>
  </Card>
);

// Table card component with consistent styling
interface TableCardProps {
  title: string;
  color: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const TableCard: React.FC<TableCardProps> = ({ title, color, icon, children, className }) => (
  <Card className={`border-none shadow-md overflow-hidden ${className || ""}`}>
    <CardHeader className={`bg-gradient-to-r from-${color}-50 to-${color}-100 border-b`}>
      <CardTitle className={`text-${color}-700 font-medium flex items-center`}>
        {icon}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        {children}
      </div>
    </CardContent>
  </Card>
);