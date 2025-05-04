import React from 'react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import ImageResult from './results/ImageResult';
import ReportResult from './results/ReportResult';
import ResultsHistory from './results/ResultsHistory';

const AnalysisResults: React.FC = () => {
  const { 
    imageResults, 
    reportResults, 
    selectedResult, 
    setSelectedResult,
    uploadStatus,
    currentAnalysisType
  } = useApp();
  
  if (uploadStatus === 'uploading') {
    return (
      <div className="max-w-5xl mx-auto p-4 animate-fade-in">
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-primary-200 h-16 w-16 flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-primary-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Uploading Your File</h2>
            <p className="text-gray-600 text-center">Please wait while we upload your file...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (uploadStatus === 'processing') {
    return (
      <div className="max-w-5xl mx-auto p-4 animate-fade-in">
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-primary-200 h-16 w-16 flex items-center justify-center mb-4">
              <div className="h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Analyzing Your Data</h2>
            <p className="text-gray-600 text-center">Our AI is analyzing your {currentAnalysisType === 'image' ? 'medical image' : 'medical report'}...</p>
            <div className="w-64 bg-gray-200 rounded-full h-2.5 mt-6">
              <div className="bg-primary-500 h-2.5 rounded-full w-3/4 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (uploadStatus === 'error') {
    return (
      <div className="max-w-5xl mx-auto p-4 animate-fade-in">
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-error-100 h-16 w-16 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-error-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Analysis Failed</h2>
            <p className="text-gray-600 text-center mb-6">We encountered an error while analyzing your file. Please try again.</p>
            <button className="btn-primary">Try Again</button>
          </div>
        </div>
      </div>
    );
  }
  
  if (selectedResult) {
    if ('imageUrl' in selectedResult) {
      return <ImageResult result={selectedResult} />;
    } else if ('fileName' in selectedResult) {
      return <ReportResult result={selectedResult} />;
    }
  }
  
  if (imageResults.length === 0 && reportResults.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-4 animate-fade-in">
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-gray-100 h-16 w-16 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Results Yet</h2>
            <p className="text-gray-600 text-center mb-6">Upload a medical image or report to get started with analysis.</p>
            <button 
              className="btn-primary"
              onClick={() => {
                const { setActiveTab } = useApp();
                setActiveTab('upload');
              }}
            >
              Upload Now
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return <ResultsHistory />;
};

export default AnalysisResults;