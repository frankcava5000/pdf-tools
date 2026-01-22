import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const PDFViewer = ({ selectedFile }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { toast } = useToast();

  if (!selectedFile) {
    return (
      <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-12 text-center">
        <p className="text-gray-400 text-xl">Select a PDF file from the sidebar to view</p>
      </div>
    );
  }

  const totalPages = selectedFile.pageCount || 10;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleZoomIn = () => {
    if (zoom < 200) {
      setZoom(zoom + 25);
    }
  };

  const handleZoomOut = () => {
    if (zoom > 50) {
      setZoom(zoom - 25);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    toast({
      title: isFullscreen ? 'Exited Fullscreen' : 'Fullscreen Mode',
      description: '🚧 This feature isn\'t implemented yet—but don\'t worry! You can request it in your next prompt! 🚀'
    });
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/80 backdrop-blur-lg border border-purple-500/20 rounded-xl p-4 flex items-center justify-between flex-wrap gap-4"
      >
        {/* Page Navigation */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            className="border-purple-500/50"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-white font-medium px-4">
            Page {currentPage} / {totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            className="border-purple-500/50"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleZoomOut}
            disabled={zoom === 50}
            variant="outline"
            size="sm"
            className="border-purple-500/50"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-white font-medium px-4">{zoom}%</span>
          <Button
            onClick={handleZoomIn}
            disabled={zoom === 200}
            variant="outline"
            size="sm"
            className="border-purple-500/50"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        {/* Fullscreen */}
        <Button
          onClick={toggleFullscreen}
          variant="outline"
          size="sm"
          className="border-purple-500/50"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </Button>
      </motion.div>

      {/* PDF Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-900/50 border border-purple-500/20 rounded-xl overflow-hidden"
      >
        <div className="aspect-[8.5/11] bg-white flex items-center justify-center relative">
          <div
            style={{
              transform: `scale(${zoom / 100})`,
              transition: 'transform 0.3s ease'
            }}
            className="w-full h-full flex items-center justify-center p-8"
          >
            <div className="text-center">
              <p className="text-gray-600 text-xl font-medium mb-2">
                {selectedFile.name}
              </p>
              <p className="text-gray-500">Page {currentPage} of {totalPages}</p>
              <p className="text-gray-400 text-sm mt-4">
                PDF Preview (Simulated)
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Page Thumbnails */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-4"
      >
        <h3 className="text-white font-semibold mb-3">Page Thumbnails</h3>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <motion.button
              key={page}
              onClick={() => setCurrentPage(page)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`aspect-[8.5/11] border-2 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                currentPage === page
                  ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                  : 'border-slate-700 bg-slate-800 text-gray-400 hover:border-purple-500/50'
              }`}
            >
              {page}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default PDFViewer;
