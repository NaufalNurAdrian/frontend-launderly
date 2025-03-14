// components/dashboard/report/downloadReport.tsx
"use client"

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download, FileText, FileSpreadsheet, ChevronDown, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";
import { exportToPdf } from "@/utils/robustPdfExport";

interface DownloadReportProps {
  activeTab: string;
  reportData: any; 
  timeframe: string;
  dateRange?: { from: Date; to: Date };
  outletId?: string;
  selectedMonth?: string;
  selectedYear?: string;
}

type ExportingStatus = "pdf" | "excel" | null;

const DownloadReport: React.FC<DownloadReportProps> = ({
  activeTab,
  reportData,
  timeframe,
  dateRange,
  outletId,
  selectedMonth = "",
  selectedYear = "",
}) => {
  const [isExporting, setIsExporting] = useState<ExportingStatus>(null);

  const getFileName = () => {
    const datePart = timeframe === "custom" && dateRange 
      ? `${dateRange.from.toISOString().split('T')[0]}_to_${dateRange.to.toISOString().split('T')[0]}`
      : timeframe;
    
    const outletPart = outletId && outletId !== "all" ? `_outlet_${outletId}` : "";
    const tabPart = activeTab ? `_${activeTab}` : "";
    
    return `report_${datePart}${outletPart}${tabPart}`;
  };

  const exportAsPDF = async () => {
    try {
      setIsExporting("pdf");
      
      // Find the active tab content element
      const contentElement = document.querySelector(`[data-value="${activeTab}"]`);
      if (!contentElement) {
        toast.error("Could not find content to export");
        return;
      }
      
      // Add a temporary ID to the content element
      const originalId = contentElement.id;
      const tempId = `export-content-${Date.now()}`;
      contentElement.id = tempId;
      
      // Get report title
      let title = "Outlet Transaction Report";
      
      if (activeTab) {
        title += ` - ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`;
      }
      
      if (timeframe === "custom" && dateRange) {
        title += ` (${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()})`;
      } else {
        title += ` (${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)})`;
      }
      
      // Create sequential toasts for export progress
      toast.loading("Starting PDF export...", { id: "pdf-export" });
      
      // Define smaller, specific steps with progress indicators
      const steps = [
        "Preparing document (1/4)",
        "Processing charts and tables (2/4)",
        "Capturing content (3/4)",
        "Generating PDF file (4/4)"
      ];
      
      // Update toast with first step
      setTimeout(() => {
        toast.loading(steps[0], { id: "pdf-export" });
      }, 500);
      
      // Attempt pre-processing for better chart rendering
      try {
        const charts = contentElement.querySelectorAll('.recharts-wrapper, .recharts-responsive-container');
        charts.forEach(chart => {
          if (chart instanceof HTMLElement) {
            // Force visibility and repaint
            chart.style.visibility = 'visible';
            chart.style.display = 'block';
            
            // Force SVG rendering
            const svg = chart.querySelector('svg');
            if (svg instanceof SVGElement) {
              svg.style.visibility = 'visible';
              void svg.getBoundingClientRect(); // Force layout calculation
            }
          }
        });
        
        // Show second step
        setTimeout(() => {
          toast.loading(steps[1], { id: "pdf-export" });
        }, 1500);
      } catch (prepError) {
        console.warn("Chart preparation warning:", prepError);
        // Continue despite errors
      }
      
      // Update to the capturing step
      setTimeout(() => {
        toast.loading(steps[2], { id: "pdf-export" });
      }, 3000);
      
      // Use our robust PDF export function with a timeout
      const exportPromise = new Promise<boolean>(async (resolve) => {
        try {
          // Show final step
          setTimeout(() => {
            toast.loading(steps[3], { id: "pdf-export" });
          }, 5000);
          
          const result = await exportToPdf(tempId, title, getFileName());
          resolve(result);
        } catch (err) {
          console.error("Export promise error:", err);
          resolve(false);
        }
      });
      
      // Set a reasonable timeout
      const timeoutPromise = new Promise<boolean>((_, reject) => {
        setTimeout(() => reject(new Error("PDF export timed out after 45 seconds")), 45000);
      });
      
      // Race the export against the timeout
      const success = await Promise.race([exportPromise, timeoutPromise])
        .catch(error => {
          console.error("Export race error:", error);
          return false;
        });
      
      // Restore the original ID
      if (originalId) {
        contentElement.id = originalId;
      }
      
      if (success) {
        toast.success("PDF Export Complete!", { id: "pdf-export" });
      } else {
        toast.error("PDF export failed - using Excel format instead", { id: "pdf-export" });
        
        // Short delay then automatically try Excel export
        setTimeout(async () => {
          try {
            toast.loading("Switching to Excel export...");
            await exportAsExcel();
          } catch (fallbackError) {
            console.error("Excel fallback error:", fallbackError);
            toast.error("Excel export also failed. Please try again later.");
          }
        }, 1500);
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
      
      // Provide more detailed error message if possible
      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // For specific error conditions, provide more helpful messages
        if (errorMessage.includes('canvas') || errorMessage.includes('size')) {
          errorMessage = "Report is too large for PDF format";
        } else if (errorMessage.includes('timeout')) {
          errorMessage = "Export process timed out";
        } else if (errorMessage.includes('security') || errorMessage.includes('cross-origin')) {
          errorMessage = "Security restriction prevented export";
        }
      }
      
      toast.error(`Export failed: ${errorMessage}. Trying Excel...`, { id: "pdf-export" });
      
      // Automatically try Excel export after error
      setTimeout(async () => {
        try {
          await exportAsExcel();
        } catch (fallbackError) {
          toast.error("Excel export also failed. Please try again later.");
        }
      }, 2000);
    } finally {
      setIsExporting(null);
    }
  };

  // Helper function to preprocess the DOM for better PDF export
  const preprocessDOM = async (element: Element): Promise<void> => {
    try {
      // Force all charts to be visible
      const charts = element.querySelectorAll('.recharts-wrapper, .recharts-responsive-container');
      charts.forEach(chart => {
        if (chart instanceof HTMLElement) {
          chart.style.visibility = 'visible';
          chart.style.display = 'block';
          chart.style.height = chart.style.height || '400px';
        }
      });
      
      // Force tables to be visible
      const tables = element.querySelectorAll('table');
      tables.forEach(table => {
        if (table instanceof HTMLElement) {
          table.style.visibility = 'visible';
          table.style.display = 'table';
          table.style.width = '100%';
        }
      });
      
      // Give time for DOM changes to take effect
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error preprocessing DOM:", error);
      // Continue despite errors
    }
  };

  const exportAsExcel = async () => {
    try {
      setIsExporting("excel");
      toast.loading("Preparing Excel export...");
      
      if (!reportData) {
        toast.dismiss();
        toast.error("No data to export");
        return;
      }
      
      // Create a new workbook
      const wb = XLSX.utils.book_new();
      
      // Process data for each tab
      const processedData = processReportDataForExcel(reportData, activeTab);
      
      // Create worksheets for each data set
      Object.entries(processedData).forEach(([sheetName, data]) => {
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      });
      
      // Generate filename
      const filename = `${getFileName()}.xlsx`;
      
      // Export the Excel file
      XLSX.writeFile(wb, filename);
      
      toast.dismiss();
      toast.success("Excel Export Successful!");
    } catch (error) {
      console.error("Error exporting Excel:", error);
      toast.dismiss();
      toast.error(`Excel export failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsExporting(null);
    }
  };

  // Process report data for Excel export
  const processReportDataForExcel = (reportData: any, activeTab: string): Record<string, any[]> => {
    const result: Record<string, any[]> = {};
    
    try {
      // Basic info sheet
      result["Report Info"] = [
        { Key: "Report Type", Value: activeTab.charAt(0).toUpperCase() + activeTab.slice(1) },
        { Key: "Time Period", Value: timeframe.charAt(0).toUpperCase() + timeframe.slice(1) },
        { Key: "Generated On", Value: new Date().toLocaleString() }
      ];
      
      if (dateRange) {
        result["Report Info"].push({ 
          Key: "Date Range", 
          Value: `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}` 
        });
      }
      
      // Process tab-specific data
      switch (activeTab) {
        case "overview":
          if (reportData.revenue) {
            result["Revenue"] = [
              { Category: "Total", Amount: reportData.revenue.total },
              { Category: "Laundry", Amount: reportData.revenue.breakdown?.laundry || 0 },
              { Category: "Pickup", Amount: reportData.revenue.breakdown?.pickup || 0 },
              { Category: "Delivery", Amount: reportData.revenue.breakdown?.delivery || 0 }
            ];
          }
          
          if (reportData.transactions?.paymentMethods) {
            result["Payment Methods"] = reportData.transactions.paymentMethods.map((pm: any) => ({
              Method: pm.paymentMethode || "Unknown",
              Count: pm._count,
              Percentage: ((pm._count / reportData.transactions.count.total) * 100).toFixed(1) + "%"
            }));
          }
          
          if (reportData.orders?.popularItems) {
            result["Popular Items"] = reportData.orders.popularItems
              .slice(0, 20)
              .map((item: any) => ({
                Name: item.name,
                Quantity: item.quantity
              }));
          }
          break;
          
        case "transactions":
          if (reportData.transactions) {
            result["Transaction Summary"] = [
              { Metric: "Total Transactions", Value: reportData.transactions.count.total },
              { Metric: "Successful Transactions", Value: reportData.transactions.count.successful },
              { Metric: "Pending Transactions", Value: reportData.transactions.count.pending },
              { Metric: "Failed Transactions", Value: reportData.transactions.count.failed },
              { Metric: "Conversion Rate", Value: (reportData.transactions.conversionRate * 100).toFixed(1) + "%" },
              { Metric: "Average Transaction Value", Value: reportData.transactions.averageValue },
              { Metric: "Highest Transaction Value", Value: reportData.transactions.highestValue }
            ];
          }
          break;
          
        case "orders":
          if (reportData.orders?.byStatus) {
            result["Orders By Status"] = reportData.orders.byStatus.map((status: any) => ({
              Status: status.orderStatus,
              Count: status._count,
              Percentage: ((status._count / reportData.orders.byStatus.reduce((sum: number, s: any) => sum + s._count, 0)) * 100).toFixed(1) + "%"
            }));
          }
          break;
          
        case "customers":
          if (reportData.customers) {
            result["Customer Summary"] = [
              { Metric: "Active Customers", Value: reportData.customers.active },
              { Metric: "New Customers", Value: reportData.customers.new },
              { Metric: "Returning Customers", Value: reportData.customers.returning }
            ];
          }
          break;
          
        // Add other tabs as needed...
      }
      
      // Add a catch-all for any data we didn't specifically process
      result["Raw Data"] = flattenReportData(reportData);
      
    } catch (error) {
      console.error("Error processing data for Excel:", error);
      result["Error"] = [{ Message: "Error processing data for Excel export" }];
    }
    
    return result;
  };

  // Helper function to flatten complex objects for Excel export
  const flattenReportData = (data: any, prefix = ""): any[] => {
    if (!data) return [];
    
    const result: Record<string, any>[] = [];
    
    try {
      if (typeof data === 'object' && !Array.isArray(data)) {
        Object.entries(data).forEach(([key, value]) => {
          const newKey = prefix ? `${prefix}.${key}` : key;
          
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            result.push(...flattenReportData(value, newKey));
          } else if (Array.isArray(value)) {
            // Skip arrays for simplicity
            result.push({ Key: newKey, Value: `[Array with ${value.length} items]` });
          } else {
            result.push({ Key: newKey, Value: value });
          }
        });
      } else if (Array.isArray(data)) {
        // For arrays, create a simplified representation
        data.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            Object.entries(item).forEach(([key, value]) => {
              result.push({ 
                Index: index, 
                Key: key, 
                Value: typeof value === 'object' ? JSON.stringify(value) : value 
              });
            });
          } else {
            result.push({ Index: index, Value: item });
          }
        });
      }
    } catch (error) {
      console.error("Error flattening report data:", error);
    }
    
    return result;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          <span>Export</span>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem 
          onClick={exportAsPDF}
          disabled={isExporting !== null}
          className="cursor-pointer"
        >
          <FileText className="h-4 w-4 mr-2 text-blue-600" />
          <span>Export as PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={exportAsExcel}
          disabled={isExporting !== null}
          className="cursor-pointer"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
          <span>Export as Excel</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DownloadReport;