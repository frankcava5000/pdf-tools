import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const PDFUpload = ({ onFilesUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = async (fileList) => {
    const pdfFiles = fileList.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length === 0) {
      toast({
        title: 'Invalid Files',
        description: 'Please upload only PDF files',
        variant: 'destructive'
      });
      return;
    }

    if (pdfFiles.length !== fileList.length) {
      toast({
        title: 'Warning',
        description: 'Some non-PDF files were ignored',
      });
    }

    setIsUploading(true);

    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const processedFiles = pdfFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        file: file,
        uploadedAt: new Date(),
        pageCount: Math.floor(Math.random() * 20) + 1 // Simulated page count
      }));

      onFilesUploaded(processedFiles);

      toast({
        title: 'Success!',
        description: `${pdfFiles.length} file(s) uploaded successfully`,
      });
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'There was an error uploading your files',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-4 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
          isDragging
            ? 'border-purple-500 bg-purple-500/10 scale-105'
            : 'border-slate-700 bg-slate-900/50 hover:border-purple-500/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        {isUploading ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xl text-white font-medium">Uploading files...</p>
          </motion.div>
        ) : (
          <>
            <motion.div
              animate={{ y: isDragging ? -10 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Upload className="w-20 h-20 text-purple-400 mx-auto mb-6" />
            </motion.div>

            <h3 className="text-2xl font-bold text-white mb-3">
              {isDragging ? 'Drop your files here' : 'Upload PDF Files'}
            </h3>
            <p className="text-gray-400 mb-6 text-lg">
              Drag and drop your PDF files here, or click to browse
            </p>

            <Button
              onClick={() => fileInputRef.current?.click()}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <File className="w-5 h-5 mr-2" />
              Browse Files
            </Button>

            <p className="text-gray-500 text-sm mt-4">
              Supported format: PDF • Multiple files allowed
            </p>
          </>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-purple-400" />
          Features
        </h3>
        <ul className="space-y-2 text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-1">•</span>
            <span>Multiple file upload support</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-1">•</span>
            <span>Drag and drop interface</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-1">•</span>
            <span>Automatic file validation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-1">•</span>
            <span>Instant file processing</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default PDFUpload;
