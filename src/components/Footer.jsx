import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-purple-500/20 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-gray-400 flex items-center justify-center gap-2">
          Made with <Heart className="w-4 h-4 text-pink-500 fill-pink-500" /> by PDF Tools Team
        </p>
        <p className="text-gray-500 text-sm mt-2">
          © 2026 PDF Tools. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
