import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PDFUpload from '@/components/pdf/PDFUpload';
import PDFViewer from '@/components/pdf/PDFViewer';
import PDFEditor from '@/components/pdf/PDFEditor';
import PDFMerge from '@/components/pdf/PDFMerge';
import PDFSplit from '@/components/pdf/PDFSplit';
import PDFToWord from '@/components/pdf/PDFToWord';
import FilesSidebar from '@/components/FilesSidebar';
import { usePDFFiles } from '@/hooks/usePDFFiles';

const PDFToolsApp = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const { files, addFiles, removeFile, selectedFile, setSelectedFile } = usePDFFiles();

  return (
    <>
      <Helmet>
        <title>PDF Tools - Dashboard</title>
        <meta name="description" content="Manage your PDF files with our comprehensive suite of tools" />
      </Helmet>

      <main className="flex-1 bg-slate-950">
        <div className="max-w-[1600px] mx-auto p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              PDF Tools Dashboard
            </h1>
            <p className="text-gray-400 text-lg">
              Manage and process your PDF files
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Files Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <FilesSidebar 
                files={files} 
                onRemoveFile={removeFile}
                selectedFile={selectedFile}
                onSelectFile={setSelectedFile}
              />
            </motion.div>

            {/* Main Content Area */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-3"
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-2 bg-slate-900/50 p-2 rounded-xl mb-6">
                  <TabsTrigger value="upload" className="data-[state=active]:bg-purple-600">
                    Upload
                  </TabsTrigger>
                  <TabsTrigger value="view" className="data-[state=active]:bg-purple-600">
                    View
                  </TabsTrigger>
                  <TabsTrigger value="edit" className="data-[state=active]:bg-purple-600">
                    Edit
                  </TabsTrigger>
                  <TabsTrigger value="merge" className="data-[state=active]:bg-purple-600">
                    Merge
                  </TabsTrigger>
                  <TabsTrigger value="split" className="data-[state=active]:bg-purple-600">
                    Split
                  </TabsTrigger>
                  <TabsTrigger value="convert" className="data-[state=active]:bg-purple-600">
                    Convert
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload">
                  <PDFUpload onFilesUploaded={addFiles} />
                </TabsContent>

                <TabsContent value="view">
                  <PDFViewer selectedFile={selectedFile} />
                </TabsContent>

                <TabsContent value="edit">
                  <PDFEditor selectedFile={selectedFile} />
                </TabsContent>

                <TabsContent value="merge">
                  <PDFMerge files={files} />
                </TabsContent>

                <TabsContent value="split">
                  <PDFSplit selectedFile={selectedFile} />
                </TabsContent>

                <TabsContent value="convert">
                  <PDFToWord selectedFile={selectedFile} />
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
};

export default PDFToolsApp;
