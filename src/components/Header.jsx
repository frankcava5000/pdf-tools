import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { FileText } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900/80 backdrop-blur-lg border-b border-purple-500/20 sticky top-0 z-50"
    >
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              PDF TOOLS
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/"
              className={`text-lg font-medium transition-colors duration-300 ${
                location.pathname === '/' 
                  ? 'text-purple-400' 
                  : 'text-gray-300 hover:text-purple-400'
              }`}
            >
              Home
            </Link>
            <Link
              to="/tools"
              className={`text-lg font-medium transition-colors duration-300 ${
                location.pathname === '/tools' 
                  ? 'text-purple-400' 
                  : 'text-gray-300 hover:text-purple-400'
              }`}
            >
              Tools
            </Link>
          </div>
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;
