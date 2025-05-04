import React from 'react';
import { AppProvider } from './contexts/AppContext';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import AnalysisResults from './components/AnalysisResults';
import ChatInterface from './components/ChatInterface';
import Footer from './components/Footer';
import { useApp } from './contexts/AppContext';

// This component renders the content based on the active tab
const MainContent: React.FC = () => {
  const { activeTab } = useApp();
  
  switch (activeTab) {
    case 'upload':
      return <FileUpload />;
    case 'results':
      return <AnalysisResults />;
    case 'chat':
      return <ChatInterface />;
    default:
      return <FileUpload />;
  }
};

// Main App component
function App() {
  return (
    <AppProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-6">
          <MainContent />
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
}

// AppWrapper ensures the MainContent component can use the useApp hook
const AppWrapper: React.FC = () => {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
};

export default AppWrapper;