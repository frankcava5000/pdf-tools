import { useState, useEffect } from 'react';

export const usePDFFiles = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // Load files from localStorage on mount
  useEffect(() => {
    const savedFiles = localStorage.getItem('pdfFiles');
    if (savedFiles) {
      try {
        const parsed = JSON.parse(savedFiles);
        // Don't restore the File objects, just the metadata
        const filesWithoutFileObjects = parsed.map(f => ({
          ...f,
          file: null // We can't persist File objects
        }));
        setFiles(filesWithoutFileObjects);
      } catch (error) {
        console.error('Error loading files from localStorage:', error);
      }
    }
  }, []);

  // Save files to localStorage when they change
  useEffect(() => {
    if (files.length > 0) {
      // Don't save the File objects, just the metadata
      const filesToSave = files.map(f => ({
        ...f,
        file: null // Remove File object before saving
      }));
      localStorage.setItem('pdfFiles', JSON.stringify(filesToSave));
    } else {
      localStorage.removeItem('pdfFiles');
    }
  }, [files]);

  const addFiles = (newFiles) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (selectedFile?.id === fileId) {
      setSelectedFile(null);
    }
  };

  const clearFiles = () => {
    setFiles([]);
    setSelectedFile(null);
  };

  return {
    files,
    addFiles,
    removeFile,
    clearFiles,
    selectedFile,
    setSelectedFile
  };
};
