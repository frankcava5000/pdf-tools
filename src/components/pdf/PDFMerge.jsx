import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { GripVertical, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { formatFileSize } from '@/lib/pdfUtils';

const PDFMerge = ({ files }) => {
  const [selectedFiles, setSelectedFiles] = useState(files.map(f => ({ ...f, selected: true })));
  const [isMerging, setIsMerging] = useState(false);
  const { toast } = useToast();

  const handleRemove = (id) => {
    setSelectedFiles(selectedFiles.filter(f => f.id !== id));
  };

  const handleMerge = async () => {
    if (selectedFiles.length < 2) {
      toast({
        title: 'Insufficient Files',
        description: 'Please select at least 2 files to merge',
        variant: 'destructive'
      });
      return;
    }

    setIsMerging(true);
    
    // Simulate merging
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsMerging(false);
    toast({
      title: 'Success!',
      description: '🚧 This feature isn\'t implemented yet—but don\'t worry! You can request it in your next prompt! 🚀'
    });
  };

  if (files.length === 0) {
    return (
      <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-12 text-center">
        <p className="text-gray-400 text-xl">Upload PDF files to merge them</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/80 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Merge PDF Files</h2>
        <p className="text-gray-400 mb-6">
          Drag and drop to reorder files, then click merge to combine them
        </p>

        {selectedFiles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No files selected for merging</p>
          </div>
        ) : (
          <>
            <Reorder.Group
              axis="y"
              values={selectedFiles}
              onReorder={setSelectedFiles}
              className="space-y-3 mb-6"
            >
              {selectedFiles.map((file, index) => (
                <Reorder.Item
                  key={file.id}
                  value={file}
                  className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 cursor-move hover:border-purple-500/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <GripVertical className="w-5 h-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-sm text-gray-400">
                        {formatFileSize(file.size)} • {file.pageCount} pages
                      </p>
                    </div>
                    <span className="text-purple-400 font-medium px-3 py-1 bg-purple-500/20 rounded-full text-sm">
                      #{index + 1}
                    </span>
                    <Button
                      onClick={() => handleRemove(file.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>

            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
              <div className="text-gray-400">
                <p className="text-sm">Total: {selectedFiles.length} files</p>
                <p className="text-sm">
                  Combined size: {formatFileSize(selectedFiles.reduce((acc, f) => acc + f.size, 0))}
                </p>
              </div>
              <Button
                onClick={handleMerge}
                disabled={isMerging || selectedFiles.length < 2}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isMerging ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Merging...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Merge PDFs
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default PDFMerge;
