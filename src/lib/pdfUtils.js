import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun, ImageRun, AlignmentType, PageBreak } from 'docx';
import { saveAs } from 'file-saver';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

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

/**
 * Renders PDF pages to images and extracts text
 * @param {Object} pdfDoc - Loaded PDF Document
 * @param {Function} onProgress - Callback for progress (current, total)
 * @param {Object} options - Quality settings
 * @returns {Promise<{images: Blob[], texts: string[], pageCount: number, firstPagePreview: string}>}
 */
export const pdfToWordWithImages = async (pdfDoc, onProgress, options = {}) => {
  const { quality = 0.85, scale = 2 } = options;
  const images = [];
  const texts = [];
  let firstPagePreview = null;

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    if (onProgress) onProgress(i, pdfDoc.numPages);

    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale });
    
    // Prepare canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render
    await page.render({ canvasContext: context, viewport }).promise;

    // Extract Text
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    texts.push(pageText);

    // Get First Page Preview (small thumbnail)
    if (i === 1) {
      firstPagePreview = canvas.toDataURL('image/jpeg', 0.5);
    }

    // Convert to Blob (Optimize: JPEG for better compression)
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
    images.push({ blob, width: viewport.width, height: viewport.height });

    // Chunking to prevent UI freeze
    if (i % 3 === 0) await new Promise(resolve => setTimeout(resolve, 0));
  }

  return { images, texts, pageCount: pdfDoc.numPages, firstPagePreview };
};

export const pdfToWord = async (file, options = {}, onStatusUpdate = () => {}) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Load PDF
    const loadingTask = pdfjsLib.getDocument(arrayBuffer);
    loadingTask.onPassword = (updatePassword, reason) => {
      throw new Error('Password protected PDF. Please remove password first.');
    };
    
    const pdfDoc = await loadingTask.promise;
    
    onStatusUpdate({ status: 'analyzing', message: 'Analyzing PDF structure...' });

    // Step 1: Render Images & Extract Text
    const { images, texts, pageCount, firstPagePreview } = await pdfToWordWithImages(
      pdfDoc, 
      (current, total) => {
        onStatusUpdate({ 
          status: 'rendering', 
          message: `Rendering page ${current} of ${total}...`, 
          progress: (current / total) * 70 // Use first 70% for rendering
        });
      },
      options
    );

    onStatusUpdate({ status: 'generating', message: 'Generating Word document...', progress: 80 });

    // Step 2: Create Word Document
    const docSections = [];

    for (let i = 0; i < pageCount; i++) {
      const children = [];
      const imageInfo = images[i];
      const text = texts[i];

      // Prepare Image
      const imageBuffer = await imageInfo.blob.arrayBuffer();

      // Add Image Run
      children.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: imageBuffer,
              transformation: {
                width: 600, // Fixed width approx full page width
                height: (600 / imageInfo.width) * imageInfo.height,
              },
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 0 },
        })
      );

      // Add Hidden/Searchable Text
      if (text && text.trim().length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: text,
                size: 2, // 1pt font
                color: "FFFFFF", // White text
                vanish: true, // Hidden in Word
              })
            ],
            spacing: { line: 0, after: 0 },
          })
        );
      }

      // Add Page Break if not last page
      if (i < pageCount - 1) {
        children.push(new Paragraph({ children: [new PageBreak()] }));
      }

      docSections.push({
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch in twips
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: children,
      });

      // Update generation progress
      if (i % 5 === 0) {
        onStatusUpdate({ 
          status: 'generating', 
          message: `Building document page ${i + 1}...`, 
          progress: 70 + ((i / pageCount) * 25) 
        });
        await new Promise(r => setTimeout(r, 0));
      }
    }

    onStatusUpdate({ status: 'saving', message: 'Saving file...', progress: 95 });

    const doc = new Document({
      sections: docSections,
      creator: "PDF Tools",
      description: "Converted from PDF"
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${file.name.replace('.pdf', '')}_converted.docx`);

    return { success: true, pageCount, fileSize: blob.size, preview: firstPagePreview };

  } catch (error) {
    console.error('PDF Conversion Error:', error);
    if (error.name === 'PasswordException') {
        throw new Error('This PDF is password protected.');
    }
    if (error.message.includes('corrupted')) {
        throw new Error('The PDF file appears to be corrupted.');
    }
    throw new Error(error.message || 'Failed to convert PDF to Word');
  }
};

// Placeholder functions for other tools
export const pdfToImages = async (pdfFile) => {
  console.log('Converting PDF to images:', pdfFile);
  return [];
};

export const mergePDFs = async (pdfFiles) => {
  console.log('Merging PDFs:', pdfFiles);
  return null;
};

export const splitPDF = async (pdfFile, pages) => {
  console.log('Splitting PDF:', pdfFile, pages);
  return null;
};

export const pdfToDocx = async (pdfFile, options) => {
  return pdfToWord(pdfFile, options);
};
