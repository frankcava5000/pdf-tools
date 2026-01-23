import React, { useEffect, useRef, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Memoized Thumbnail to prevent re-renders of the entire list
const PDFThumbnail = memo(({ pdfDoc, pageNumber, isSelected, onClick }) => {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Render Page to Canvas
  useEffect(() => {
    let active = true;
    let page = null;

    const renderThumbnail = async () => {
      if (!isVisible || !pdfDoc || !canvasRef.current) return;

      try {
        setLoading(true);
        page = await pdfDoc.getPage(pageNumber);
        
        if (!active) return;

        const viewport = page.getViewport({ scale: 0.3 }); // Small scale for thumbnails
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        if (active) setLoading(false);
      } catch (error) {
        console.error(`Error rendering thumbnail ${pageNumber}`, error);
      }
    };

    renderThumbnail();

    return () => {
      active = false;
      if (page) page.cleanup();
    };
  }, [pdfDoc, pageNumber, isVisible]);

  // Scroll to selected thumbnail
  useEffect(() => {
    if (isSelected && containerRef.current) {
      containerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [isSelected]);

  return (
    <div
      ref={containerRef}
      onClick={() => onClick(pageNumber)}
      className={cn(
        "cursor-pointer p-2 rounded-lg transition-all group flex flex-col items-center gap-2",
        isSelected ? "bg-purple-600/20" : "hover:bg-slate-800"
      )}
    >
      <div 
        className={cn(
          "relative bg-white rounded shadow-sm overflow-hidden min-h-[140px] w-full flex items-center justify-center transition-all",
          isSelected ? "ring-2 ring-purple-500" : "group-hover:ring-1 group-hover:ring-purple-500/50"
        )}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
            <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
          </div>
        )}
        <canvas ref={canvasRef} className="w-full h-auto block" />
      </div>
      <span className={cn("text-xs font-medium", isSelected ? "text-purple-400" : "text-gray-500")}>
        Page {pageNumber}
      </span>
    </div>
  );
});

const PDFThumbnailSidebar = ({ pdfDoc, currentPage, onPageSelect }) => {
  if (!pdfDoc) return null;

  return (
    <div className="h-full overflow-y-auto pr-2 custom-scrollbar space-y-2">
      {Array.from({ length: pdfDoc.numPages }, (_, i) => (
        <PDFThumbnail
          key={i + 1}
          pdfDoc={pdfDoc}
          pageNumber={i + 1}
          isSelected={currentPage === (i + 1)}
          onClick={onPageSelect}
        />
      ))}
    </div>
  );
};

export default PDFThumbnailSidebar;
