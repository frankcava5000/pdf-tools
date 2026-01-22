import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Upload, Eye, Edit, Merge, Split, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Upload,
      title: 'Upload PDFs',
      description: 'Drag and drop or browse to upload multiple PDF files instantly'
    },
    {
      icon: Eye,
      title: 'View PDFs',
      description: 'View your PDFs with advanced navigation and zoom controls'
    },
    {
      icon: Edit,
      title: 'Edit PDFs',
      description: 'Add text, drawings, and highlights directly to your PDFs'
    },
    {
      icon: Merge,
      title: 'Merge PDFs',
      description: 'Combine multiple PDF files into a single document'
    },
    {
      icon: Split,
      title: 'Split PDFs',
      description: 'Extract specific pages or ranges from your PDF files'
    },
    {
      icon: FileText,
      title: 'Convert PDFs',
      description: 'Convert PDF files to Word documents with preserved formatting'
    }
  ];

  const scrollToTools = () => {
    navigate('/tools');
  };

  return (
    <>
      <Helmet>
        <title>PDF Tools - Home</title>
        <meta name="description" content="Powerful PDF Management tools - upload, view, edit, merge, split, and convert PDFs for free" />
      </Helmet>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section 
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #4c1d95 50%, #ec4899 100%)'
          }}
        >
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1616578273577-5d54546f4dec)',
              backgroundBlendMode: 'overlay'
            }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950" />

          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative z-10 text-center px-4 max-w-5xl mx-auto"
          >
            <motion.h1 
              className="text-7xl md:text-9xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              PDF TOOLS
            </motion.h1>
            
            <motion.p 
              className="text-2xl md:text-3xl text-gray-300 mb-12 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Powerful PDF Management, Completely Free
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                onClick={scrollToTools}
                size="lg"
                className="text-lg px-10 py-7 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                Start Using PDF Tools
              </Button>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-purple-400 rounded-full flex items-start justify-center p-2">
              <motion.div 
                className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Everything You Need
              </h2>
              <p className="text-xl text-gray-400">
                Professional PDF tools at your fingertips
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-lg border border-purple-500/20 rounded-xl p-8 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-purple-900 to-pink-900">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center px-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-purple-100 mb-10">
              Start managing your PDFs with our powerful tools today
            </p>
            <Button
              onClick={scrollToTools}
              size="lg"
              className="text-lg px-10 py-7 bg-white text-purple-900 hover:bg-gray-100 shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Launch PDF Tools
            </Button>
          </motion.div>
        </section>
      </main>
    </>
  );
};

export default HomePage;
