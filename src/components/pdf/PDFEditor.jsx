import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Type, Pencil, Highlighter, Eraser, Undo, Redo, Save, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const PDFEditor = ({ selectedFile }) => {
  const [activeTool, setActiveTool] = useState('text');
  const [textColor, setTextColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(16);
  const [annotations, setAnnotations] = useState([]);
  const { toast } = useToast();

  if (!selectedFile) {
    return (
      <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-12 text-center">
        <p className="text-gray-400 text-xl">Select a PDF file from the sidebar to edit</p>
      </div>
    );
  }

  const tools = [
    { id: 'text', icon: Type, label: 'Add Text' },
    { id: 'draw', icon: Pencil, label: 'Draw' },
    { id: 'highlight', icon: Highlighter, label: 'Highlight' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' }
  ];

  const handleSave = () => {
    toast({
      title: 'Saved!',
      description: '🚧 This feature isn\'t implemented yet—but don\'t worry! You can request it in your next prompt! 🚀'
    });
  };

  const handleDownload = () => {
    toast({
      title: 'Download',
      description: '🚧 This feature isn\'t implemented yet—but don\'t worry! You can request it in your next prompt! 🚀'
    });
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/80 backdrop-blur-lg border border-purple-500/20 rounded-xl p-4"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Tools */}
          <div className="flex items-center gap-2">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                variant="outline"
                size="sm"
                className={`${
                  activeTool === tool.id
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'border-purple-500/50 text-gray-300'
                }`}
              >
                <tool.icon className="w-4 h-4" />
              </Button>
            ))}
          </div>

          {/* Color & Size */}
          {activeTool === 'text' && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Color:</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Size:</label>
                <input
                  type="range"
                  min="12"
                  max="48"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-24"
                />
                <span className="text-white text-sm w-8">{fontSize}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => toast({ title: 'Undo', description: '🚧 This feature isn\'t implemented yet—but don\'t worry! You can request it in your next prompt! 🚀' })}
              variant="outline"
              size="sm"
              className="border-purple-500/50"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => toast({ title: 'Redo', description: '🚧 This feature isn\'t implemented yet—but don\'t worry! You can request it in your next prompt! 🚀' })}
              variant="outline"
              size="sm"
              className="border-purple-500/50"
            >
              <Redo className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleSave}
              variant="outline"
              size="sm"
              className="border-purple-500/50"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              onClick={handleDownload}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Canvas */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-900/50 border border-purple-500/20 rounded-xl overflow-hidden"
      >
        <div className="aspect-[8.5/11] bg-white flex items-center justify-center relative cursor-crosshair">
          <div className="text-center p-8">
            <p className="text-gray-600 text-xl font-medium mb-2">
              {selectedFile.name}
            </p>
            <p className="text-gray-500 mb-4">Click to add {activeTool === 'text' ? 'text' : activeTool}</p>
            <p className="text-sm text-gray-400">
              Active tool: <span className="font-semibold capitalize">{activeTool}</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-4"
      >
        <h3 className="text-white font-semibold mb-2">Editing Tools</h3>
        <p className="text-gray-400 text-sm">
          Use the toolbar above to add text, draw, highlight, or erase content on your PDF
        </p>
      </motion.div>
    </div>
  );
};

export default PDFEditor;