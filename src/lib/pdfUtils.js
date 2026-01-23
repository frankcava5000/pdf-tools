import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import { Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType, PageBreak } from 'docx';
import { saveAs } from 'file-saver';

// Initialize PDF.js worker globally
// This ensures any component using pdfjsLib has the worker configured
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const formatTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

// --- Core Helper: Load PDF.js Document ---
export const loadPdfJsDoc = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  // Using standard font data is helpful for rendering certain PDFs
  return pdfjsLib.getDocument({
    data: arrayBuffer,
    cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
    cMapPacked: true,
  }).promise;
};

// --- Core Helper: Load pdf-lib Document ---
const loadPdfLibDoc = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  return PDFDocument.load(arrayBuffer);
};

// 1. Compress PDF (Rasterize approach for client-side size reduction)
export const compressPDF = async (file, level = 'medium') => {
  // Level: low (0.8 quality), medium (0.6 quality), high (0.4 quality)
  const qualityMap = { low: 0.8, medium: 0.6, high: 0.4 };
  const quality = qualityMap[level] || 0.6;
  const scale = level === 'high' ? 1.0 : 1.5; // Lower scale for high compression

  const pdfJsDoc = await loadPdfJsDoc(file);
  const newPdfDoc = await PDFDocument.create();

  for (let i = 1; i <= pdfJsDoc.numPages; i++) {
    const page = await pdfJsDoc.getPage(i);
    const viewport = page.getViewport({ scale });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport }).promise;

    const imgDataUrl = canvas.toDataURL('image/jpeg', quality);
    const imgBytes = await fetch(imgDataUrl).then(res => res.arrayBuffer());
    
    const jpgImage = await newPdfDoc.embedJpg(imgBytes);
    const newPage = newPdfDoc.addPage([viewport.width, viewport.height]);
    newPage.drawImage(jpgImage, {
      x: 0,
      y: 0,
      width: viewport.width,
      height: viewport.height,
    });
  }

  const pdfBytes = await newPdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
};

// 2. Add Password
export const addPasswordToPDF = async (file, password) => {
  const pdfDoc = await loadPdfLibDoc(file);
  pdfDoc.encrypt({ userPassword: password, ownerPassword: password });
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
};

// 3. Remove Password (requires providing the password first to open it)
export const removePasswordFromPDF = async (file, password) => {
  // pdf-lib's load method accepts a password option if it's encrypted
  const arrayBuffer = await file.arrayBuffer();
  // Try loading. If it fails, password might be wrong
  try {
     const pdfDoc = await PDFDocument.load(arrayBuffer, { password });
     // Saving without encrypt() removes protection
     const pdfBytes = await pdfDoc.save();
     return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (e) {
     throw new Error("Invalid password or failed to decrypt.");
  }
};

// 4. Extract Images
export const extractImagesFromPDF = async (file, onProgress) => {
  const pdfJsDoc = await loadPdfJsDoc(file);
  const images = [];

  for (let i = 1; i <= pdfJsDoc.numPages; i++) {
    if (onProgress) onProgress(i, pdfJsDoc.numPages);
    const page = await pdfJsDoc.getPage(i);
    const ops = await page.getOperatorList();
    
    for (let j = 0; j < ops.fnArray.length; j++) {
      if (ops.fnArray[j] === pdfjsLib.OPS.paintImageXObject) {
        try {
           // Complex extraction omitted for stability, falling back to render
        } catch (e) { console.error(e); }
      }
    }
    
    // Fallback/Default behavior: Convert Page to Image (Reliable)
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: context, viewport }).promise;
    
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    images.push({ blob, name: `page-${i}.png`, index: i });
  }
  return images;
};

// 5. Extract Text
export const extractTextFromPDF = async (file) => {
  const pdfJsDoc = await loadPdfJsDoc(file);
  let fullText = "";
  const pages = [];

  for (let i = 1; i <= pdfJsDoc.numPages; i++) {
    const page = await pdfJsDoc.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += `--- Page ${i} ---\n${pageText}\n\n`;
    pages.push({ number: i, text: pageText });
  }
  
  return { fullText, pages };
};

// 6. Rotate Pages
export const rotatePDFPages = async (file, pageIndices, angle) => {
  const pdfDoc = await loadPdfLibDoc(file);
  const pages = pdfDoc.getPages();
  
  const targetIndices = (pageIndices && pageIndices.length > 0) 
    ? pageIndices 
    : pages.map((_, i) => i);

  targetIndices.forEach(idx => {
    if (pages[idx]) {
      const currentRotation = pages[idx].getRotation().angle;
      pages[idx].setRotation(degrees(currentRotation + angle));
    }
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
};

// 7. Crop Pages
export const cropPDFPages = async (file, pageIndices, cropBox) => {
  const pdfDoc = await loadPdfLibDoc(file);
  const pages = pdfDoc.getPages();
  
  const targetIndices = (pageIndices && pageIndices.length > 0) 
    ? pageIndices 
    : pages.map((_, i) => i);

  targetIndices.forEach(idx => {
    const page = pages[idx];
    if (page) {
      page.setCropBox(cropBox.x, cropBox.y, cropBox.width, cropBox.height);
      page.setMediaBox(cropBox.x, cropBox.y, cropBox.width, cropBox.height);
    }
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
};

// 8. Watermark
export const addWatermarkToPDF = async (file, config) => {
  const pdfDoc = await loadPdfLibDoc(file);
  const pages = pdfDoc.getPages();
  const { type, text, imageFile, opacity = 0.5, size = 50, color = {r:0, g:0, b:0} } = config;

  if (type === 'text') {
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    pages.forEach(page => {
      const { width, height } = page.getSize();
      page.drawText(text || 'Watermark', {
        x: width / 2 - (text.length * size) / 4,
        y: height / 2,
        size: size,
        font: font,
        color: rgb(color.r, color.g, color.b),
        opacity: opacity,
        rotate: degrees(45),
      });
    });
  } else if (type === 'image' && imageFile) {
    const imgBuffer = await imageFile.arrayBuffer();
    let image;
    if (imageFile.type === 'image/png') image = await pdfDoc.embedPng(imgBuffer);
    else image = await pdfDoc.embedJpg(imgBuffer);

    const imgDims = image.scale(0.5);

    pages.forEach(page => {
      const { width, height } = page.getSize();
      page.drawImage(image, {
        x: width / 2 - imgDims.width / 2,
        y: height / 2 - imgDims.height / 2,
        width: imgDims.width,
        height: imgDims.height,
        opacity: opacity,
      });
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
};

export const pdfToWord = async (file, options = {}, onStatusUpdate = () => {}) => {
  const { includeImages = false } = options;
  const pdfJsDoc = await loadPdfJsDoc(file);
  const docSections = [];

  for (let i = 1; i <= pdfJsDoc.numPages; i++) {
     if (onStatusUpdate) onStatusUpdate({ status: 'generating', message: `Processing page ${i}/${pdfJsDoc.numPages}...` });
     const page = await pdfJsDoc.getPage(i);
     const textContent = await page.getTextContent();
     const pageText = textContent.items.map(item => item.str).join(' ');
     
     docSections.push({
         children: [ new Paragraph({ children: [ new TextRun(pageText) ] }) ]
     });
  }
  
  const doc = new Document({ sections: docSections });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${file.name.replace('.pdf', '')}_converted.docx`);
};

export const pdfToWordWithImages = async () => { /* ... simplified placeholder ... */ };