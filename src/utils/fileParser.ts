/**
 * fileParser.ts — All heavy parsing libs (mammoth, pdfjs-dist, papaparse) are
 * dynamically imported only when the relevant file type is actually processed.
 * This keeps ~1.5MB of parsing libraries out of the initial bundle.
 */

export const extractTextFromFile = async (file: File): Promise<string> => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    // 1. PDF Files
    if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      return await parsePDF(file);
    }

    // 2. DOCX Files
    if (
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.endsWith(".docx")
    ) {
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

    // 6. Fallback — try to read as plain text
    try {
      return await parseText(file);
    } catch {
      throw new Error(`Unsupported file type: ${file.type} (${file.name})`);
    }
  } catch (error) {
    console.error("Error parsing file:", error);
    throw new Error(
      `Failed to read ${file.name}: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

const parsePDF = async (file: File): Promise<string> => {
  try {
    // Dynamic import — pdfjs-dist is ~1MB; only load when a PDF is uploaded
    const pdfjsLib = await import("pdfjs-dist");

    // Use the LOCAL worker copy from public/ — no CDN dependency
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

    const arrayBuffer = await file.arrayBuffer();

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
    });

    // Hard timeout on PDF loading (20 seconds)
    const pdf = await Promise.race([
      loadingTask.promise,
      new Promise<never>((_, reject) =>
        setTimeout(() => {
          loadingTask.destroy();
          reject(new Error("PDF loading timed out"));
        }, 20000)
      ),
    ]);

    let fullText = "";
    const maxPages = Math.min(pdf.numPages, 50); // Cap at 50 pages

    for (let i = 1; i <= maxPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: { str?: string }) => item.str ?? "")
          .join(" ");
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
    return `[Could not extract text from ${file.name}: ${error instanceof Error ? error.message : "Unknown error"}]`;
  }
};

const parseDocx = async (file: File): Promise<string> => {
  try {
    // Dynamic import — mammoth is ~300KB; only load when a .docx is uploaded
    const mammoth = await import("mammoth");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value || "[Document contained no extractable text]";
  } catch (error) {
    console.error("DOCX parsing failed:", error);
    return `[Could not extract text from ${file.name}]`;
  }
};

const parseCSV = (file: File): Promise<string> => {
  // Dynamic import — papaparse is ~45KB; only load when a .csv is uploaded
  return new Promise(async (resolve) => {
    const Papa = (await import("papaparse")).default;
    Papa.parse(file, {
      complete: (results: { data: string[][] }) => {
        const rows = results.data.map((row) => row.join(" | ")).join("\n");
        resolve(rows || "[CSV was empty]");
      },
      error: (error: { message: string }) => {
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
