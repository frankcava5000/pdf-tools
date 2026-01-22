import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Settings, RefreshCw, AlertCircle, CheckCircle2, Loader2, X, Eye, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { pdfToWord, formatFileSize } from '@/lib/pdfUtils';

const PDFToWord = ({ selectedFile }) => {
  const [quality, setQuality] = useState(0.85);
  const [status, setStatus] = useState('idle'); // idle, converting, success, error
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState(null);
  const { toast } = useToast();

  if (!selectedFile) {
    return (
      <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-12 text-center">
        <p className="text-gray-400 text-xl">Select a PDF file from the sidebar to convert</p>
      </div>
    );
  }

  const handleConvert = async () => {
    setStatus('converting');
    setProgress(0);
    setStatusMessage('Initializing...');
    setErrorMessage('');
    setResult(null);

    try {
      const conversionResult = await pdfToWord(selectedFile.file, { 
        quality,
        scale: 2 // High Res
      }, (update) => {
        setStatusMessage(update.message);
        if (update.progress) setProgress(Math.round(update.progress));
      });
      
      setProgress(100);
      setResult(conversionResult);
      
      // Artificial delay for success state
      setTimeout(() => {
        setStatus('success');
        toast({
          title: 'Conversion Successful!',
          description: 'Your Word document has been downloaded.',
          variant: 'default'
        });
      }, 500);

    } catch (error) {
      console.error(error);
      setStatus('error');
      setErrorMessage(error.message);
      toast({
        title: 'Conversion Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setProgress(0);
    setStatusMessage('');
    setErrorMessage('');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* File Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/80 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6"
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-white">Convert PDF to Word</h2>
          {status !== 'idle' && (
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{selectedFile.name}</p>
              <div className="flex gap-3 text-sm text-gray-400">
                <span>{formatFileSize(selectedFile.size)}</span>
                <span>•</span>
                <span>{selectedFile.pageCount || '?'} pages</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Options & Actions */}
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div
            key="options"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-slate-900/80 backdrop-blur-lg border border-purple-500/20 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-400" />
              Conversion Settings
            </h3>

            <div className="space-y-6 mb-8">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Image Quality</span>
                  <span className="text-purple-400">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <p className="text-xs text-gray-500">
                  Higher quality results in larger file sizes. 85% is recommended.
                </p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-sm text-gray-300 mb-2 font-medium">Features Enabled:</p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    High-resolution rendering (300 DPI)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Searchable hidden text
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Layout preservation
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleConvert}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/25 min-w-[160px]"
                size="lg"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Convert to Word
              </Button>
            </div>
          </motion.div>
        )}

        {status === 'converting' && (
          <motion.div
            key="converting"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900/80 border border-purple-500/20 rounded-xl p-8 text-center"
          >
            <div className="relative w-20 h-20 mx-auto mb-6">
              <Loader2 className="w-full h-full text-purple-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-white">{progress}%</span>
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{statusMessage}</h3>
            <p className="text-gray-400 mb-4 text-sm">Large files may take a moment to process.</p>
            
            <div className="w-full max-w-md mx-auto h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}

        {status === 'success' && result && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900/80 border border-green-500/20 rounded-xl p-8"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Preview */}
              {result.preview && (
                <div className="w-full md:w-1/3">
                   <div className="relative aspect-[1/1.4] bg-white rounded-lg overflow-hidden shadow-2xl border-4 border-slate-800">
                     <img 
                       src={result.preview} 
                       alt="Document Preview" 
                       className="w-full h-full object-contain"
                     />
                     <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
                       Preview
                     </div>
                   </div>
                </div>
              )}

              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">Ready for Download!</h3>
                <p className="text-gray-400 mb-6">
                  Successfully converted <span className="text-white font-medium">{result.pageCount} pages</span>.
                  <br />
                  File size: {formatFileSize(result.fileSize)}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-purple-500/50 hover:bg-purple-500/10"
                  >
                    Convert Another File
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-slate-900/80 border border-red-500/20 rounded-xl p-8 text-center"
          >
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Conversion Failed</h3>
            <p className="text-red-400 mb-8 max-w-md mx-auto">{errorMessage}</p>
            
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleConvert}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-slate-700"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PDFToWord;
