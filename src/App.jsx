import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import HomePage from '@/pages/HomePage';
import PDFToolsApp from '@/pages/PDFToolsApp';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <Router>
      <Helmet>
        <title>PDF Tools - Powerful PDF Management, Completely Free</title>
        <meta name="description" content="Free online PDF tools for uploading, viewing, editing, merging, splitting, and converting PDF files. Powerful PDF management made simple." />
      </Helmet>
      <div className="min-h-screen flex flex-col bg-slate-950">
        <Header />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tools" element={<PDFToolsApp />} />
          </Routes>
        </AnimatePresence>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;