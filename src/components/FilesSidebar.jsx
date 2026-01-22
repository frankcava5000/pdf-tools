import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatFileSize, formatTime } from '@/lib/pdfUtils';

const FilesSidebar = ({ files, onRemoveFile, selectedFile, onSelectFile }) => {
  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6 shadow-xl h-fit sticky top-24">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <FileText className="w-6 h-6 text-purple-400" />
        Uploaded Files
      </h2>

      {files.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">No files uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          <AnimatePresence>
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onClick={() => onSelectFile(file)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                  selectedFile?.id === file.id
                    ? 'bg-purple-600/20 border-purple-500'
                    : 'bg-slate-800/50 border-slate-700 hover:border-purple-500/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate mb-1">
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(file.uploadedAt)}
                      </span>
                    </div>
                    {file.pageCount && (
                      <p className="text-xs text-purple-400 mt-1">
                        {file.pageCount} pages
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFile(file.id);
                    }}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default FilesSidebar;
