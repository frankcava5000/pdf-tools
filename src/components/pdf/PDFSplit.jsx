import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Square, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const PDFSplit = ({ selectedFile }) => {
  const [selectedPages, setSelectedPages] = useState([]);
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');
  const { toast } = useToast();

  if (!selectedFile) {
    return (
      <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-12 text-center">
        <p className="text-gray-400 text-xl">Select a PDF file from the sidebar to split</p>
      </div>
    );
  }

  const totalPages = selectedFile.pageCount || 10;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const togglePage = (page) => {
    setSelectedPages(prev =>
      prev.includes(page)
        ? prev.filter(p => p !== page)
        : [...prev, page]
    );
  };

  const selectRange = () => {
    const start = parseInt(rangeStart);
    const end = parseInt(rangeEnd);

    if (isNaN(start) || isNaN(end) || start > end || start < 1 || end > totalPages) {
      toast({
        title: 'Invalid Range',
        description: `Please enter a valid range between 1 and ${totalPages}`,
        variant: 'destructive'
      });
      return;
    }

    const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    setSelectedPages(prev => {
      const combined = [...new Set([...prev, ...range])];
      return combined.sort((a, b) => a - b);
    });
    setRangeStart('');
    setRangeEnd('');
  };

  const handleExtract = () => {
    if (selectedPages.length === 0) {
      toast({
        title: 'No Pages Selected',
        description: 'Please select at least one page to extract',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Extracting Pages',
      description: '🚧 This feature isn\'t implemented yet—but don\'t worry! You can request it in your next prompt! 🚀'
    });
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/80 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Split PDF</h2>
        <p className="text-gray-400 mb-6">
          Select individual pages or specify a range to extract
        </p>

        {/* Range Selection */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">From:</label>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={rangeStart}
              onChange={(e) => setRangeStart(e.target.value)}
              placeholder="1"
              className="w-20 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">To:</label>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={rangeEnd}
              onChange={(e) => setRangeEnd(e.target.value)}
              placeholder={totalPages.toString()}
              className="w-20 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            />
          </div>
          <Button
            onClick={selectRange}
            variant="outline"
            size="sm"
            className="border-purple-500/50"
          >
            Add Range
          </Button>
        </div>

        {/* Selected Pages Info */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-400">
            Selected: <span className="text-purple-400 font-semibold">{selectedPages.length}</span> of {totalPages} pages
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => setSelectedPages(pages)}
              variant="outline"
              size="sm"
              className="border-purple-500/50"
            >
              Select All
            </Button>
            <Button
              onClick={() => setSelectedPages([])}
              variant="outline"
              size="sm"
              className="border-purple-500/50"
            >
              Clear
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Page Thumbnails */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-6"
      >
        <h3 className="text-white font-semibold mb-4">Select Pages</h3>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {pages.map((page) => {
            const isSelected = selectedPages.includes(page);
            return (
              <motion.button
                key={page}
                onClick={() => togglePage(page)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`aspect-[8.5/11] border-2 rounded-lg flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-slate-700 bg-slate-800 hover:border-purple-500/50'
                }`}
              >
                <div className="mb-2">
                  {isSelected ? (
                    <CheckSquare className="w-6 h-6 text-purple-400" />
                  ) : (
                    <Square className="w-6 h-6 text-gray-500" />
                  )}
                </div>
                <span className={`text-sm font-medium ${isSelected ? 'text-purple-400' : 'text-gray-400'}`}>
                  Page {page}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Extract Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end"
      >
        <Button
          onClick={handleExtract}
          disabled={selectedPages.length === 0}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          size="lg"
        >
          <Download className="w-5 h-5 mr-2" />
          Extract Selected Pages
        </Button>
      </motion.div>
    </div>
  );
};

export default PDFSplit;
