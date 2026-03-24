import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";
import Papa from "papaparse";

// Use the LOCAL worker copy from public/ folder — no CDN dependency.
// This file is copied from node_modules/pdfjs-dist/build/pdf.worker.min.mjs
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export const extractTextFromFile = async (file: File): Promise<string> => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    // 1. PDF Files
    if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      return await parsePDF(file);
    }
    
    // 2. DOCX Files
    if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || fileName.endsWith(".docx")) {
      return await parseDocx(file);
    }

    // 3. CSV / Spreadsheets
    if (fileType === "text/csv" || fileName.endsWith(".csv")) {
      return await parseCSV(file);
    }

    // 4. Plain Text / Code / JSON / HTML / Markdown
    if (
      fileType.startsWith("text/") || 
      fileType === "application/json" ||
      fileName.match(/\.(txt|md|js|ts|py|html|css|json|yaml|xml)$/)
    ) {
      return await parseText(file);
    }

    // 5. Images (Returns Base64 directly)
    if (fileType.startsWith("image/")) {
      return await fileToBase64(file);
    }

    // 6. Fallback - Try to read as plain text
    try {
      return await parseText(file);
    } catch {
      throw new Error(`Unsupported file type: ${file.type} (${file.name})`);
    }
  } catch (error) {
    console.error("Error parsing file:", error);
    throw new Error(`Failed to read ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const parsePDF = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Load PDF with worker disabled as fallback for reliability
    const loadingTask = pdfjsLib.getDocument({ 
      data: new Uint8Array(arrayBuffer),
      // If the CDN worker fails, this ensures it still works
      useWorkerFetch: false,
    });

    // Add a hard timeout to the PDF loading itself (20 seconds)
    const pdf = await Promise.race([
      loadingTask.promise,
      new Promise<never>((_, reject) => 
        setTimeout(() => {
          loadingTask.destroy();
          reject(new Error("PDF loading timed out"));
        }, 20000)
      )
    ]);

    let fullText = "";
    const maxPages = Math.min(pdf.numPages, 50); // Cap at 50 pages

    for (let i = 1; i <= maxPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
      } catch (pageErr) {
        console.warn(`Failed to parse page ${i}:`, pageErr);
        fullText += `--- Page ${i} --- [Could not extract text]\n\n`;
      }
    }

    if (pdf.numPages > 50) {
      fullText += `\n[Note: Only first 50 of ${pdf.numPages} pages were extracted]\n`;
    }

    return fullText || "[PDF contained no extractable text]";
  } catch (error) {
    console.error("PDF parsing failed:", error);
    // Return a useful message instead of throwing, so the user still gets a response
    return `[Could not extract text from ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}]`;
  }
};

const parseDocx = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value || "[Document contained no extractable text]";
  } catch (error) {
    console.error("DOCX parsing failed:", error);
    return `[Could not extract text from ${file.name}]`;
  }
};

const parseCSV = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      complete: (results) => {
        const rows = results.data.map((row: any) => row.join(" | ")).join("\n");
        resolve(rows || "[CSV was empty]");
      },
      error: (error) => {
        console.error("CSV parsing failed:", error);
        resolve(`[Could not parse CSV: ${error.message}]`);
      },
    });
  });
};

const parseText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || "[File was empty]");
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
