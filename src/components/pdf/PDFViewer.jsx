import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { loadPdfJsDoc, formatFileSize } from '@/lib/pdfUtils';
import PDFThumbnailSidebar from '@/components/pdf/PDFThumbnailSidebar';
import PDFPageNavigationBar from '@/components/pdf/PDFPageNavigationBar';
import { saveAs } from 'file-saver';

const PDFViewer = ({ selectedFile }) => {
  const [pdfDocument, setPdfDocument] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [renderedPageData, setRenderedPageData] = useState(null);
  const [isPageRendering, setIsPageRendering] = useState(false);
  
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { toast } = useToast();

  // Load PDF Document
  useEffect(() => {
    if (!selectedFile?.file) return;

    const loadPDF = async () => {
      setIsLoading(true);
      setError(null);
      setPdfDocument(null);
      setCurrentPage(1);
      setZoomLevel(1.0);

      try {
        const doc = await loadPdfJsDoc(selectedFile.file);
        setPdfDocument(doc);
      } catch (err) {
        console.error("Failed to load PDF:", err);
        setError("Could not load this PDF file. It might be corrupted or password protected.");
      } finally {
        setIsLoading(false);
      }
    };

    loadPDF();
  }, [selectedFile]);

  // Render Current Page
  useEffect(() => {
    let active = true;
    let page = null;
    let renderTask = null;

    const renderPage = async () => {
      if (!pdfDocument || !canvasRef.current) return;

      try {
        setIsPageRendering(true);
        page = await pdfDocument.getPage(currentPage);
        
        if (!active) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        // Handle High DPI
        const pixelRatio = window.devicePixelRatio || 1;
        const viewport = page.getViewport({ scale: zoomLevel * pixelRatio });
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        // Style width/height for responsive display
        canvas.style.width = `${viewport.width / pixelRatio}px`;
        canvas.style.height = `${viewport.height / pixelRatio}px`;

        renderTask = page.render({
          canvasContext: context,
          viewport: viewport
        });

        await renderTask.promise;
        
        if (active) setIsPageRendering(false);
        
        // Pre-fetch adjacent pages (simple cache warm-up)
        if (currentPage < pdfDocument.numPages) {
            pdfDocument.getPage(currentPage + 1).then(p => p.cleanup()); 
        }

      } catch (err) {
        if (err.name !== 'RenderingCancelledException') {
          console.error("Render error:", err);
          toast({
            title: "Rendering Error",
            description: "Failed to render this page.",
            variant: "destructive"
          });
        }
      } finally {
        setIsPageRendering(false);
      }
    };

    renderPage();

    return () => {
      active = false;
      if (renderTask) renderTask.cancel();
      if (page) page.cleanup();
    };
  }, [pdfDocument, currentPage, zoomLevel]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!pdfDocument) return;
      
      // Only if not focusing input
      if (e.target.tagName === 'INPUT') return;

      switch(e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          if (currentPage < pdfDocument.numPages) setCurrentPage(p => p + 1);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          if (currentPage > 1) setCurrentPage(p => p - 1);
          break;
        case 'Home':
          e.preventDefault();
          setCurrentPage(1);
          break;
        case 'End':
          e.preventDefault();
          setCurrentPage(pdfDocument.numPages);
          break;
        case '+':
        case '=':
          e.preventDefault();
          if (zoomLevel < 3.0) setZoomLevel(z => z + 0.25);
          break;
        case '-':
          e.preventDefault();
          if (zoomLevel > 0.5) setZoomLevel(z => z - 0.25);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pdfDocument, currentPage, zoomLevel]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 3.0));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5));

  const handleDownload = () => {
    if (selectedFile?.file) {
      saveAs(selectedFile.file, selectedFile.name);
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
        setIsFullscreen(true);
    } else {
        document.exitFullscreen();
        setIsFullscreen(false);
    }
  };

  if (!selectedFile) {
    return (
      <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-12 text-center h-[500px] flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-gray-500" />
        </div>
        <p className="text-gray-400 text-xl">Select a PDF file to view</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col h-[calc(100vh-140px)] bg-slate-950 ${isFullscreen ? 'p-0 h-screen bg-black' : ''}`}
    >
      {/* Header Info */}
      {!isFullscreen && (
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex items-center gap-3">
             <h2 className="text-white font-semibold truncate max-w-[300px]">{selectedFile.name}</h2>
             <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-gray-400">{formatFileSize(selectedFile.size)}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleDownload} className="border-purple-500/50 hover:bg-purple-500/10">
            <Download className="w-4 h-4 mr-2" /> Download
          </Button>
        </div>
      )}

      <div className="flex flex-1 gap-4 overflow-hidden relative">
        {isLoading ? (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
            <p className="text-white font-medium">Loading Document...</p>
          </div>
        ) : error ? (
           <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        ) : (
          <>
            {/* Sidebar - Desktop Only */}
            <div className={`hidden lg:block w-64 bg-slate-900/50 border border-purple-500/20 rounded-xl p-3 flex-shrink-0 transition-all ${isFullscreen ? 'absolute left-0 top-0 bottom-0 z-20 bg-black/90' : ''}`}>
              <PDFThumbnailSidebar 
                pdfDoc={pdfDocument} 
                currentPage={currentPage} 
                onPageSelect={setCurrentPage} 
              />
            </div>

            {/* Main Viewer Area */}
            <div className="flex-1 flex flex-col relative bg-slate-900/30 rounded-xl border border-slate-800/50 overflow-hidden">
               {/* Controls Overlay */}
               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-lg px-4">
                  <PDFPageNavigationBar
                    currentPage={currentPage}
                    totalPages={pdfDocument?.numPages || 0}
                    zoomLevel={zoomLevel}
                    isFullscreen={isFullscreen}
                    onPageChange={setCurrentPage}
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    onToggleFullscreen={handleToggleFullscreen}
                  />
               </div>

               {/* Scrollable Canvas Container */}
               <div className="flex-1 overflow-auto flex items-center justify-center p-8 custom-scrollbar relative">
                 <AnimatePresence mode='wait'>
                    <motion.div
                      key={currentPage}
                      initial={{ opacity: 0.8, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="shadow-2xl relative"
                    >
                       <canvas ref={canvasRef} className="bg-white block mx-auto shadow-2xl" />
                       
                       {/* Loading Overlay for individual page */}
                       {isPageRendering && (
                          <div className="absolute inset-0 bg-white/50 flex items-center justify-center backdrop-blur-[1px]">
                             <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                          </div>
                       )}
                    </motion.div>
                 </AnimatePresence>
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
