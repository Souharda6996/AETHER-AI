import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export const downloadAsText = (content: string, filename: string = "AetherAI_Response.txt") => {
  const element = document.createElement("a");
  const file = new Blob([content], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const downloadAsPDF = async (elementId: string, filename: string = "AetherAI_Response.pdf") => {
  const element = document.getElementById(elementId);
  if (!element) return false;

  try {
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    
    // Calculate PDF dimensions to fit the image
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    // Default margin of 10mm
    const margin = 10;
    const contentWidth = pdfWidth - margin * 2;
    
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * contentWidth) / imgProps.width;
    
    // If the content is longer than one page, we might want a different approach, 
    // but for simple chat bubbles this is perfectly fine.
    // If it's *very* long, we just add it and it might cut off, or we can calculate pages.
    // For now, simple single-image generation is fine.
    
    pdf.addImage(imgData, "PNG", margin, margin, contentWidth, pdfHeight);
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};

export const downloadAsImage = async (elementId: string, filename: string = "AetherAI_Response.png") => {
  const element = document.getElementById(elementId);
  if (!element) return false;

  try {
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    
    const link = document.createElement("a");
    link.href = imgData;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error("Error generating Image:", error);
    return false;
  }
};
