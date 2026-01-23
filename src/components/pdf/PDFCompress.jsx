// PDF Compress Component - v1.0
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileArchive, Download, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { compressPDF, formatFileSize } from '@/lib/pdfUtils';
import { saveAs } from 'file-saver';

const PDFCompress = ({ selectedFile }) => {
  const [level, setLevel] = useState('medium');
  const [isCompressing, setIsCompressing] = useState(false);
  const [result, setResult] = useState(null);
  const { toast } = useToast();

  if (!selectedFile) return <div className="text-center text-gray-400 p-8">Select a PDF to compress</div>;

  const handleCompress = async () => {
    setIsCompressing(true);
    setResult(null);
    try {
      const compressedBlob = await compressPDF(selectedFile.file, level);
      setResult({
        blob: compressedBlob,
        size: compressedBlob.size,
        saved: selectedFile.size - compressedBlob.size
      });
      toast({ title: 'Success', description: 'PDF compressed successfully!' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to compress PDF', variant: 'destructive' });
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadFile = () => {
    if (result) saveAs(result.blob, `compressed_${selectedFile.name}`);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Compress PDF</h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {['low', 'medium', 'high'].map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`p-4 rounded-lg border-2 transition-all ${
                level === l
                  ? 'border-purple-500 bg-purple-500/20 text-white'
                  : 'border-slate-700 bg-slate-800 text-gray-400 hover:border-purple-500/50'
              }`}
            >
              <div className="capitalize font-bold mb-1">{l}</div>
              <div className="text-xs opacity-70">
                {l === 'low' ? 'Best Quality' : l === 'medium' ? 'Balanced' : 'Smallest Size'}
              </div>
            </button>
          ))}
        </div>
        
        <Button 
          onClick={handleCompress} 
          disabled={isCompressing}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
        >
          {isCompressing ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <FileArchive className="w-4 h-4 mr-2" />}
          {isCompressing ? 'Compressing...' : 'Compress PDF'}
        </Button>
      </div>

      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 text-center"
        >
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-white mb-2">Compression Complete!</h4>
          <div className="flex justify-center gap-8 text-sm mb-6">
             <div>
               <p className="text-gray-400">Original</p>
               <p className="text-white font-mono">{formatFileSize(selectedFile.size)}</p>
             </div>
             <div>
               <p className="text-gray-400">Compressed</p>
               <p className="text-green-400 font-mono">{formatFileSize(result.size)}</p>
             </div>
             <div>
               <p className="text-gray-400">Saved</p>
               <p className="text-purple-400 font-mono">{((result.saved / selectedFile.size) * 100).toFixed(1)}%</p>
             </div>
          </div>
          <Button onClick={downloadFile} variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10">
            <Download className="w-4 h-4 mr-2" /> Download Compressed PDF
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default PDFCompress;
