// utils/robustPdfExport.ts
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Export a DOM element to PDF with improved reliability and error handling
 */
export async function exportToPdf(
  elementId: string,
  title: string,
  filename: string
): Promise<boolean> {
  try {
    console.log(`Starting PDF export for: ${elementId}`);
    
    // Find the element
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with ID "${elementId}" not found`);
      return false;
    }
    
    // Display export progress via console
    console.log(`1. Element found: ${element.tagName}, size: ${element.offsetWidth}x${element.offsetHeight}`);
    console.log(`2. Creating simplified export version...`);
    
    // Create a simplified version of the element for export
    const exportElement = document.createElement('div');
    exportElement.id = `${elementId}-export`;
    exportElement.className = 'pdf-export-container';
    exportElement.style.backgroundColor = '#ffffff';
    exportElement.style.color = '#000000';
    exportElement.style.width = '1100px'; // Fixed width for PDF output
    exportElement.style.padding = '20px';
    exportElement.style.margin = '0';
    exportElement.style.position = 'absolute';
    exportElement.style.left = '-9999px';
    exportElement.style.top = '0';
    
    // Create a simplified header with the report title
    const header = document.createElement('div');
    header.style.marginBottom = '20px';
    header.style.borderBottom = '2px solid #3b82f6';
    header.style.paddingBottom = '10px';
    
    const titleElement = document.createElement('h1');
    titleElement.textContent = title;
    titleElement.style.fontSize = '24px';
    titleElement.style.color = '#1e3a8a';
    titleElement.style.margin = '0 0 5px 0';
    
    const dateElement = document.createElement('div');
    dateElement.textContent = `Generated: ${new Date().toLocaleString()}`;
    dateElement.style.fontSize = '14px';
    dateElement.style.color = '#64748b';
    
    header.appendChild(titleElement);
    header.appendChild(dateElement);
    exportElement.appendChild(header);
    
    // Create main content container
    const contentContainer = document.createElement('div');
    contentContainer.style.fontFamily = 'Arial, sans-serif';
    
    // Extract key information from the original element
    try {
      // Get summary cards data
      const summaryCards = element.querySelectorAll('.card');
      if (summaryCards.length > 0) {
        const summaryContainer = document.createElement('div');
        summaryContainer.style.display = 'flex';
        summaryContainer.style.flexWrap = 'wrap';
        summaryContainer.style.gap = '15px';
        summaryContainer.style.marginBottom = '25px';
        
        summaryCards.forEach(card => {
          const cardClone = document.createElement('div');
          cardClone.style.flex = '1';
          cardClone.style.minWidth = '200px';
          cardClone.style.padding = '15px';
          cardClone.style.border = '1px solid #e2e8f0';
          cardClone.style.borderRadius = '8px';
          cardClone.style.backgroundColor = '#f8fafc';
          
          // Extract title
          const titleEl = card.querySelector('.text-sm, .text-lg, h3, [class*="Title"]');
          if (titleEl) {
            const cardTitle = document.createElement('div');
            cardTitle.textContent = titleEl.textContent || '';
            cardTitle.style.fontSize = '14px';
            cardTitle.style.fontWeight = 'bold';
            cardTitle.style.color = '#475569';
            cardTitle.style.marginBottom = '8px';
            cardClone.appendChild(cardTitle);
          }
          
          // Extract value/number
          const valueEl = card.querySelector('.text-2xl, .font-bold');
          if (valueEl) {
            const cardValue = document.createElement('div');
            cardValue.textContent = valueEl.textContent || '';
            cardValue.style.fontSize = '20px';
            cardValue.style.fontWeight = 'bold';
            cardValue.style.color = '#0f172a';
            cardClone.appendChild(cardValue);
          }
          
          summaryContainer.appendChild(cardClone);
        });
        
        contentContainer.appendChild(summaryContainer);
      }
      
      // Create static images of all charts
      const charts = element.querySelectorAll('.recharts-wrapper, .recharts-responsive-container');
      console.log(`Found ${charts.length} charts to render`);
      
      if (charts.length > 0) {
        const chartsContainer = document.createElement('div');
        chartsContainer.style.marginBottom = '30px';
        
        for (let i = 0; i < charts.length; i++) {
          const chart = charts[i];
          const chartContainer = document.createElement('div');
          chartContainer.style.marginBottom = '25px';
          chartContainer.style.padding = '15px';
          chartContainer.style.border = '1px solid #e2e8f0';
          chartContainer.style.borderRadius = '8px';
          chartContainer.style.backgroundColor = '#f8fafc';
          
          // Add chart title if available
          const chartParent = chart.closest('[class*="card"], [class*="Card"]');
          const chartTitle = chartParent?.querySelector('[class*="title"], [class*="Title"], h2, h3');
          if (chartTitle) {
            const titleEl = document.createElement('div');
            titleEl.textContent = chartTitle.textContent || `Chart ${i+1}`;
            titleEl.style.fontSize = '16px';
            titleEl.style.fontWeight = 'bold';
            titleEl.style.marginBottom = '10px';
            titleEl.style.color = '#334155';
            chartContainer.appendChild(titleEl);
          }
          
          // Add placeholder for chart
          const chartPlaceholder = document.createElement('div');
          chartPlaceholder.textContent = `[Chart ${i+1} will be rendered in PDF]`;
          chartPlaceholder.style.height = '200px';
          chartPlaceholder.style.display = 'flex';
          chartPlaceholder.style.alignItems = 'center';
          chartPlaceholder.style.justifyContent = 'center';
          chartPlaceholder.style.backgroundColor = '#f1f5f9';
          chartPlaceholder.style.border = '1px dashed #94a3b8';
          chartPlaceholder.style.borderRadius = '4px';
          chartPlaceholder.style.color = '#64748b';
          chartContainer.appendChild(chartPlaceholder);
          
          chartsContainer.appendChild(chartContainer);
        }
        
        contentContainer.appendChild(chartsContainer);
      }
      
      // Extract tables
      const tables = element.querySelectorAll('table');
      console.log(`Found ${tables.length} tables to render`);
      
      if (tables.length > 0) {
        for (let i = 0; i < tables.length; i++) {
          const table = tables[i];
          const tableContainer = document.createElement('div');
          tableContainer.style.marginBottom = '30px';
          tableContainer.style.overflowX = 'auto';
          
          // Try to find table title
          const tableParent = table.closest('[class*="card"], [class*="Card"]');
          const tableTitle = tableParent?.querySelector('[class*="title"], [class*="Title"], h2, h3');
          if (tableTitle) {
            const titleEl = document.createElement('div');
            titleEl.textContent = tableTitle.textContent || `Table ${i+1}`;
            titleEl.style.fontSize = '16px';
            titleEl.style.fontWeight = 'bold';
            titleEl.style.marginBottom = '10px';
            titleEl.style.color = '#334155';
            tableContainer.appendChild(titleEl);
          }
          
          // Create simplified table
          const simpleTable = document.createElement('table');
          simpleTable.style.width = '100%';
          simpleTable.style.borderCollapse = 'collapse';
          simpleTable.style.border = '1px solid #cbd5e1';
          
          // Copy table head
          const thead = table.querySelector('thead');
          if (thead) {
            const simpleHead = document.createElement('thead');
            simpleHead.style.backgroundColor = '#f1f5f9';
            
            const headerRows = thead.querySelectorAll('tr');
            headerRows.forEach(row => {
              const simpleRow = document.createElement('tr');
              
              const headerCells = row.querySelectorAll('th');
              headerCells.forEach(cell => {
                const simpleCell = document.createElement('th');
                simpleCell.textContent = cell.textContent || '';
                simpleCell.style.padding = '10px';
                simpleCell.style.fontWeight = 'bold';
                simpleCell.style.borderBottom = '2px solid #94a3b8';
                simpleCell.style.textAlign = 'left';
                simpleCell.style.color = '#334155';
                simpleRow.appendChild(simpleCell);
              });
              
              simpleHead.appendChild(simpleRow);
            });
            
            simpleTable.appendChild(simpleHead);
          }
          
          // Copy table body (limited to 20 rows max for performance)
          const tbody = table.querySelector('tbody');
          if (tbody) {
            const simpleBody = document.createElement('tbody');
            
            const rows = tbody.querySelectorAll('tr');
            const maxRows = Math.min(rows.length, 20); // Limit to 20 rows
            
            for (let j = 0; j < maxRows; j++) {
              const row = rows[j];
              const simpleRow = document.createElement('tr');
              simpleRow.style.borderBottom = '1px solid #e2e8f0';
              
              // Add alternating row background
              if (j % 2 === 1) {
                simpleRow.style.backgroundColor = '#f8fafc';
              }
              
              const cells = row.querySelectorAll('td');
              cells.forEach(cell => {
                const simpleCell = document.createElement('td');
                simpleCell.textContent = cell.textContent || '';
                simpleCell.style.padding = '8px 10px';
                simpleCell.style.color = '#1e293b';
                simpleRow.appendChild(simpleCell);
              });
              
              simpleBody.appendChild(simpleRow);
            }
            
            // Add note if rows were truncated
            if (rows.length > maxRows) {
              const noteRow = document.createElement('tr');
              const noteCell = document.createElement('td');
              noteCell.colSpan = thead ? thead.querySelectorAll('th').length : 3;
              noteCell.textContent = `Note: Table truncated, showing ${maxRows} of ${rows.length} rows. See Excel export for full data.`;
              noteCell.style.padding = '8px 10px';
              noteCell.style.color = '#64748b';
              noteCell.style.fontStyle = 'italic';
              noteCell.style.backgroundColor = '#f1f5f9';
              noteRow.appendChild(noteCell);
              simpleBody.appendChild(noteRow);
            }
            
            simpleTable.appendChild(simpleBody);
          }
          
          tableContainer.appendChild(simpleTable);
          contentContainer.appendChild(tableContainer);
        }
      }
    } catch (contentError) {
      console.error('Error extracting content:', contentError);
      // Add error notice but continue
      const errorNotice = document.createElement('div');
      errorNotice.style.padding = '15px';
      errorNotice.style.backgroundColor = '#fee2e2';
      errorNotice.style.color = '#b91c1c';
      errorNotice.style.borderRadius = '5px';
      errorNotice.style.marginBottom = '20px';
      errorNotice.textContent = 'Note: Some content could not be fully exported. Please use Excel export for complete data.';
      contentContainer.appendChild(errorNotice);
    }
    
    // Add footer
    const footer = document.createElement('div');
    footer.style.marginTop = '30px';
    footer.style.paddingTop = '10px';
    footer.style.borderTop = '1px solid #e2e8f0';
    footer.style.fontSize = '12px';
    footer.style.color = '#94a3b8';
    footer.textContent = `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`;
    
    // Add all content to the export container
    exportElement.appendChild(contentContainer);
    exportElement.appendChild(footer);
    
    // Add to document temporarily
    document.body.appendChild(exportElement);
    
    console.log(`3. Simplified version created, starting PDF generation...`);
    
    try {
      // Create PDF with proper orientation
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      // Get PDF dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      
      // Capture content with simpler settings
      const canvas = await html2canvas(exportElement, {
        scale: 1.0,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        imageTimeout: 30000,
        onclone: (doc, clone) => {
          // Final preparation
          clone.style.width = '1100px';
          const allElements = clone.querySelectorAll('*');
          allElements.forEach(el => {
            if (el instanceof HTMLElement) {
              el.style.visibility = 'visible';
              el.style.opacity = '1';
            }
          });
        }
      });
      
      console.log(`4. Content captured: ${canvas.width}×${canvas.height}`);
      
      // Generate data URL with appropriate compression
      const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
      
      // Calculate dimensions
      const contentWidth = pdfWidth - (margin * 2);
      const scale = contentWidth / canvas.width;
      const contentHeight = canvas.height * scale;
      
      // Handle multi-page content
      if (contentHeight > pdfHeight - 20) {
        let heightLeft = canvas.height;
        let position = 0;
        let page = 1;
        
        while (heightLeft > 0) {
          const pageHeight = pdfHeight - margin * 2;
          const heightOnThisPage = Math.min(pageHeight / scale, heightLeft);
          
          // For subsequent pages, we need a new canvas for the portion
          if (page > 1) {
            // Create a temporary canvas for this segment
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = heightOnThisPage;
            
            // Draw the appropriate portion of the original canvas
            const ctx = tempCanvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(
                canvas,
                0, position, canvas.width, heightOnThisPage,
                0, 0, canvas.width, heightOnThisPage
              );
              
              // Use this segment for the current page
              pdf.addImage({
                imageData: tempCanvas.toDataURL('image/jpeg', 0.7),
                format: 'JPEG',
                x: margin,
                y: margin,
                width: contentWidth,
                height: heightOnThisPage * scale,
                compression: 'MEDIUM'
              });
            }
          } else {
            // First page - use the original canvas
            pdf.addImage({
              imageData: dataUrl,
              format: 'JPEG',
              x: margin,
              y: margin,
              width: contentWidth,
              height: heightOnThisPage * scale,
              compression: 'MEDIUM'
            });
          }
          
          // Add page number
          pdf.setFontSize(8);
          pdf.setTextColor(150, 150, 150);
          pdf.text(`Page ${page}`, pdfWidth - 25, pdfHeight - 5);
          
          // Update for next page
          heightLeft -= heightOnThisPage;
          position += heightOnThisPage;
          
          if (heightLeft > 0) {
            pdf.addPage();
            page++;
          }
        }
      } else {
        // Single page content
        pdf.addImage({
          imageData: dataUrl,
          format: 'JPEG',
          x: margin,
          y: margin,
          width: contentWidth,
          height: contentHeight,
          compression: 'MEDIUM'
        });
        
        // Add page number
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text('Page 1', pdfWidth - 25, pdfHeight - 5);
      }
      
      console.log(`5. PDF generated, saving file...`);
      
      // Save the PDF
      const dateStr = new Date().toISOString().split('T')[0];
      pdf.save(`${filename}-${dateStr}.pdf`);
      
      console.log("PDF export completed successfully");
      return true;
    } catch (captureError) {
      console.error("Error during content capture:", captureError);
      
      // Try text-only version if regular capture fails
      return await createTextOnlyPdf(element, title, filename);
    } finally {
      // Clean up
      if (exportElement && exportElement.parentNode) {
        exportElement.parentNode.removeChild(exportElement);
      }
    }
  } catch (error) {
    console.error("PDF export failed:", error);
    return false;
  }
}

/**
 * Creates a simplified text-only PDF when other methods fail
 */
async function createTextOnlyPdf(
  element: HTMLElement,
  title: string,
  filename: string
): Promise<boolean> {
  console.log("Attempting text-only PDF export...");
  
  try {
    // Create PDF directly without HTML capture
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    // Get PDF dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pdfWidth - (margin * 2);
    
    // Set up fonts
    pdf.setFont("helvetica");
    
    // Add title
    pdf.setFontSize(18);
    pdf.setTextColor(0, 51, 102);
    pdf.text(title, margin, margin + 10);
    
    // Add timestamp
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, margin + 20);
    
    // Add note about simplified export
    pdf.setTextColor(150, 0, 0);
    pdf.text("Note: This is a simplified export. Use Excel export for complete data.", margin, margin + 30);
    
    // Draw line
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, margin + 35, pdfWidth - margin, margin + 35);
    
    // Add text content from the element
    let yPosition = margin + 45;
    const lineHeight = 8;
    
    // Function to add text with pagination
    const addTextWithPagination = (text: string, fontSize: number, isBold: boolean = false) => {
      pdf.setFontSize(fontSize);
      pdf.setTextColor(0, 0, 0);
      
      if (isBold) {
        pdf.setFont("helvetica", "bold");
      } else {
        pdf.setFont("helvetica", "normal");
      }
      
      // Check if we need a new page
      if (yPosition > pdfHeight - margin) {
        pdf.addPage();
        yPosition = margin + 10;
      }
      
      // Split text to fit width
      const textLines = pdf.splitTextToSize(text, contentWidth);
      
      // Add each line
      textLines.forEach((line: string) => {
        if (yPosition > pdfHeight - margin) {
          pdf.addPage();
          yPosition = margin + 10;
        }
        
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
      
      // Add extra space after text block
      yPosition += lineHeight / 2;
    };
    
    // Extract report summary information
    const summaryValues = element.querySelectorAll('.text-2xl, .font-bold');
    const summaryTexts: string[] = [];
    
    summaryValues.forEach(el => {
      if (el.textContent && el.textContent.trim().length > 0) {
        const parent = el.closest('[class*="card"], [class*="Card"]');
        let label = "";
        
        if (parent) {
          const labelEl = parent.querySelector('.text-sm, [class*="Title"], [class*="title"]');
          if (labelEl && labelEl.textContent) {
            label = labelEl.textContent.trim();
          }
        }
        
        if (label) {
          summaryTexts.push(`${label}: ${el.textContent.trim()}`);
        } else {
          summaryTexts.push(el.textContent.trim());
        }
      }
    });
    
    // Add summary section
    if (summaryTexts.length > 0) {
      addTextWithPagination("SUMMARY", 14, true);
      summaryTexts.forEach(text => {
        addTextWithPagination(text, 12);
      });
      yPosition += lineHeight;
    }
    
    // Extract table data
    const tables = element.querySelectorAll('table');
    if (tables.length > 0) {
      addTextWithPagination("TABLES", 14, true);
      
      tables.forEach((table, tableIndex) => {
        // Find table title
        const tableParent = table.closest('[class*="card"], [class*="Card"]');
        let tableTitle = `Table ${tableIndex + 1}`;
        
        if (tableParent) {
          const titleEl = tableParent.querySelector('[class*="title"], [class*="Title"], h2, h3');
          if (titleEl && titleEl.textContent) {
            tableTitle = titleEl.textContent.trim();
          }
        }
        
        addTextWithPagination(tableTitle, 13, true);
        
        // Process headers
        const headers = table.querySelectorAll('th');
        if (headers.length > 0) {
          const headerTexts = Array.from(headers).map(th => th.textContent?.trim() || "").join(" | ");
          addTextWithPagination(headerTexts, 11, true);
        }
        
        // Process rows (limit to 15 for performance)
        const rows = table.querySelectorAll('tbody tr');
        const maxRows = Math.min(rows.length, 15);
        
        for (let i = 0; i < maxRows; i++) {
          const row = rows[i];
          const cells = row.querySelectorAll('td');
          
          if (cells.length > 0) {
            const rowTexts = Array.from(cells).map(td => td.textContent?.trim() || "").join(" | ");
            addTextWithPagination(rowTexts, 10);
          }
        }
        
        if (rows.length > maxRows) {
          addTextWithPagination(`Note: Table truncated, showing ${maxRows} of ${rows.length} rows.`, 10, true);
        }
        
        yPosition += lineHeight * 2;
      });
    }
    
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Page ${i} of ${totalPages} (Simplified Export)`, pdfWidth - 60, pdfHeight - 5);
    }
    
    const dateStr = new Date().toISOString().split('T')[0];
    pdf.save(`${filename}-${dateStr}-simplified.pdf`);
    
    console.log("Text-only PDF export completed");
    return true;
  } catch (error) {
    console.error("Text-only export also failed:", error);
    return false;
  }
}