import React from 'react';
import { Activity } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Header: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-primary-500" />
            <span className="text-xl font-bold text-gray-900">MediScan AI</span>
          </div>
          
          <nav className="flex space-x-1 sm:space-x-4">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'upload'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Upload
            </button>
            <button
              onClick={() => setActiveTab('detect')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'detect'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Detect Type
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'results'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Results
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              AI Chat
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;