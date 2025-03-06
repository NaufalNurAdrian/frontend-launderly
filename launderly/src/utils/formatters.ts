/**
 * Utility functions for data formatting in reports
 */

/**
 * Format a number as Indonesian Rupiah currency
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format a number as Indonesian Rupiah currency for charts
 */
export const currencyFormatter = (value: number): string => formatCurrency(value);

/**
 * Format a number as a string
 */
export const numberFormatter = (value: number): string => value.toString();

/**
 * Format a percentage with one decimal place
 */
export const percentFormatter = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

/**
 * Format a number with appropriate suffix for large values (K, M, B)
 */
export const compactNumberFormatter = (value: number): string => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

/**
 * Format a date to a string in localized format
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Get a list of months for dropdowns
 */
export const getMonthsList = () => [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" }
];

/**
 * Get a list of recent years (current year and n previous years)
 */
export const getYearsList = (numberOfYears: number = 5) => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: numberOfYears }, (_, i) => (currentYear - i).toString());
};