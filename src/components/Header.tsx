import React from 'react';
import { Zap, Settings, User } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gray-900/80 backdrop-blur-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-white">MBT Studio</h1>
              <p className="text-xs text-gray-400">Model-Based Testing Platform</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </a>
            <a href="/models" className="text-gray-300 hover:text-white transition-colors">
              Models
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Documentation
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};