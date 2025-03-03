"use client";

import React, { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SalesReportApiResponse, SalesReportResult } from "@/types/reportSales.type";
import { getReportSales } from "@/services/reportService";
import { GiWashingMachine } from "react-icons/gi";

// Sales Report Chart Component
export function ReportSalesChart({
  filterOutlet,
  filterMonth,
  filterYear
}: {
  filterOutlet: string;
  filterMonth: string;
  filterYear: string;
}) {
  // Time range options: "daily", "monthly", or "yearly"
  const [timeRange, setTimeRange] = useState<"daily" | "monthly" | "yearly">("daily");
  const [series, setSeries] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalIncome, setTotalIncome] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data: SalesReportApiResponse = await getReportSales(filterOutlet, filterMonth, filterYear);
        const report: SalesReportResult = data.result.result;

        let labels: string[] = [];
        let incomeData: number[] = [];
        let total = 0;

        // Format data based on selected time range
        if (timeRange === "daily") {
          const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
          ];
          
          report.incomeDaily.forEach((income, index) => {
            total += income;
            const day = index + 1;
            const monthIndex = parseInt(filterMonth) - 1;
            const monthName = monthNames[monthIndex >= 0 && monthIndex < 12 ? monthIndex : 0];
            labels.push(`${day} ${monthName}`);
            incomeData.push(income);
          });
        } else if (timeRange === "monthly") {
          const monthNames = [
            "January", "February", "March", "April", "May", "June", 
            "July", "August", "September", "October", "November", "December"
          ];
          
          report.incomeMonthly.forEach((income, index) => {
            total += income;
            labels.push(monthNames[index]);
            incomeData.push(income);
          });
        } else if (timeRange === "yearly") {
          report.incomeYearly.forEach((income, index) => {
            total += income;
            labels.push(`${report.pastYears[index]}`);
            incomeData.push(income);
          });
        }

        setCategories(labels);
        setSeries([{
          name: 'Revenue',
          data: incomeData
        }]);
        setTotalIncome(total);
      } catch (err: any) {
        console.error("Error fetching sales report:", err);
        setError(err.message || "Failed to fetch sales report");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange, filterOutlet, filterMonth, filterYear]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value);
  };

  // ApexCharts options
  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'area',
      toolbar: {
        show: false
      },
      fontFamily: 'Inter, sans-serif',
      height: 380,
      width: '100%',
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 3,
        color: '#3b82f6',
        opacity: 0.1
      },
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#3b82f6'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          colors: '#6b7280'
        },
        rotate: 0,
        trim: true,
        hideOverlappingLabels: true
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      labels: {
        formatter: function(val: number) {
          return val.toLocaleString('id-ID');
        },
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          colors: '#6b7280'
        }
      }
    },
    tooltip: {
      y: {
        formatter: function(val: number) {
          return formatCurrency(val);
        }
      },
      theme: 'light',
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif'
      }
    },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false
        }
      }
    },
    markers: {
      size: 5,
      colors: ['#3b82f6'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 7
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '14px',
      fontFamily: 'Inter, sans-serif',
      offsetY: 5,
      itemMargin: {
        horizontal: 10
      }
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300
          }
        }
      },
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 280
          },
          markers: {
            size: 4
          }
        }
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 250
          },
          markers: {
            size: 3
          }
        }
      }
    ]
  };

  return (
    <Card className="shadow-lg border border-blue-100 rounded-xl overflow-hidden bg-white w-full sm:mx-4 md:mx-5 lg:mx-6 max-w-7xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <GiWashingMachine size={24} className="text-blue-100" />
            <div>
              <CardTitle className="text-xl font-bold">Sales Report</CardTitle>
              <CardDescription className="text-blue-100 opacity-90">
                {timeRange === "daily" ? "Daily" : timeRange === "monthly" ? "Monthly" : "Yearly"} revenue overview
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">View by:</span>
            <Select 
              value={timeRange} 
              onValueChange={(val: "daily" | "monthly" | "yearly") => setTimeRange(val)}
            >
              <SelectTrigger className="w-32 bg-white/10 border-blue-300/30 text-white hover:bg-white/20 focus:ring-blue-300">
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-blue-100">
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                <GiWashingMachine className="w-10 h-10 text-blue-500" />
              </div>
              <div className="mt-4 text-blue-500 font-medium">Loading sales data...</div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-center">No data available for the selected filters</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-600 mb-2 sm:mb-0">
                {filterOutlet === "all" ? "All Outlets" : "Selected Outlet"} • 
                {filterMonth !== "" ? ` Month ${filterMonth}` : ""} • 
                {filterYear !== "" ? ` Year ${filterYear}` : ""}
              </div>
              <div className="font-bold text-xl text-blue-700">
                {formatCurrency(totalIncome)}
                <span className="text-sm font-normal text-gray-600 ml-1">total</span>
              </div>
            </div>
            
            <div className="border border-blue-100 rounded-xl p-2 md:p-4 bg-blue-50/50 w-full">
              {typeof window !== 'undefined' && (
                <div className="w-full min-h-[350px] md:min-h-[380px]">
                  <Chart 
                    options={options} 
                    series={series} 
                    type="area" 
                    width="100%"
                    height="100%"
                  />
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}