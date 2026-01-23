import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, 
  ZoomIn, ZoomOut, Search, Maximize2, Minimize2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PDFPageNavigationBar = ({ 
  currentPage, 
  totalPages, 
  zoomLevel,
  isFullscreen,
  onPageChange, 
  onZoomIn, 
  onZoomOut,
  onToggleFullscreen
}) => {
  const [pageInput, setPageInput] = useState(currentPage);

  useEffect(() => {
    setPageInput(currentPage);
  }, [currentPage]);

  const handlePageSubmit = (e) => {
    e.preventDefault();
    const page = parseInt(pageInput);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
    } else {
      setPageInput(currentPage); // Reset on invalid
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-lg border border-purple-500/20 rounded-xl p-3 flex flex-wrap items-center justify-between gap-4 shadow-xl">
      {/* Left: Zoom Controls */}
      <div className="flex items-center gap-1">
        <Button onClick={onZoomOut} variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
          <ZoomOut className="w-4 h-4" />
        </Button>
        <div className="w-16 text-center text-xs font-mono text-purple-300">
          {Math.round(zoomLevel * 100)}%
        </div>
        <Button onClick={onZoomIn} variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>

      {/* Center: Page Navigation */}
      <div className="flex items-center gap-2">
        <Button 
          onClick={() => onPageChange(1)} 
          disabled={currentPage === 1}
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 hidden sm:flex"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>
        <Button 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <form onSubmit={handlePageSubmit} className="flex items-center gap-2">
          <Input 
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            className="w-14 h-8 text-center px-1 bg-slate-800 border-slate-700 text-white text-sm"
          />
          <span className="text-gray-500 text-sm whitespace-nowrap">of {totalPages}</span>
        </form>

        <Button 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button 
          onClick={() => onPageChange(totalPages)} 
          disabled={currentPage === totalPages}
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 hidden sm:flex"
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Right: Fullscreen */}
      <div className="flex items-center gap-1">
         <Button onClick={onToggleFullscreen} variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
           {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
         </Button>
      </div>
    </div>
  );
};

export default PDFPageNavigationBar;
