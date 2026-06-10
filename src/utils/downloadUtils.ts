/**
 * downloadUtils.ts — All heavy export libs (jsPDF, html2canvas) are
 * dynamically imported ONLY when the user actually triggers an export.
 * This keeps them out of the initial JS bundle entirely.
 */

export const downloadAsText = (
  content: string,
  filename: string = "AetherAI_Response.txt"
) => {
  const element = document.createElement("a");
  const file = new Blob([content], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const downloadAsPDF = async (
  elementId: string,
  filename: string = "AetherAI_Response.pdf"
): Promise<boolean> => {
  const element = document.getElementById(elementId);
  if (!element) return false;

  try {
    // Dynamic imports — loaded only on first PDF export, then cached by browser
    const [{ jsPDF }, html2canvas] = await Promise.all([
      import("jspdf"),
      import("html2canvas").then((m) => m.default),
    ]);

    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    // Calculate PDF dimensions to fit the image
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const margin = 10;
    const contentWidth = pdfWidth - margin * 2;

    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * contentWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", margin, margin, contentWidth, pdfHeight);
    pdf.save(filename);
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};

export const downloadAsImage = async (
  elementId: string,
  filename: string = "AetherAI_Response.png"
): Promise<boolean> => {
  const element = document.getElementById(elementId);
  if (!element) return false;

  try {
    // Dynamic import — loaded only on first image export
    const html2canvas = await import("html2canvas").then((m) => m.default);

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
