import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ZoomIn, 
  ZoomOut, 
  Scan, 
  MessageCircleQuestion,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { ImageAnalysisResult } from '../../types';

interface ImageResultProps {
  result: ImageAnalysisResult;
}

const ImageResult: React.FC<ImageResultProps> = ({ result }) => {
  const { setSelectedResult, setActiveTab } = useApp();
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showAreas, setShowAreas] = useState(true);
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };
  
  const handleBackToList = () => {
    setSelectedResult(null);
  };
  
  const handleChatAboutResult = () => {
    setActiveTab('chat');
  };
  
  if (result.status === 'analyzing') {
    return (
      <div className="max-w-5xl mx-auto p-4 animate-fade-in">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-6">
            <button 
              onClick={handleBackToList}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span>Back to Results</span>
            </button>
          </div>
          
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Analyzing Image</h2>
              <p className="text-gray-600 text-center">Our AI is processing your medical image...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (result.status === 'failed') {
    return (
      <div className="max-w-5xl mx-auto p-4 animate-fade-in">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-6">
            <button 
              onClick={handleBackToList}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span>Back to Results</span>
            </button>
          </div>
          
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-error-100 h-16 w-16 flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-error-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Analysis Failed</h2>
              <p className="text-gray-600 text-center mb-6">We encountered an error while analyzing your image. Please try again.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <button 
                onClick={handleBackToList}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-3"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <h2 className="text-xl font-semibold">Image Analysis Results</h2>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowAreas(!showAreas)}
                className={`btn ${showAreas ? 'btn-primary' : 'btn-outline'}`}
              >
                <Scan className="h-4 w-4 mr-1" />
                <span>{showAreas ? 'Hide' : 'Show'} Markers</span>
              </button>
              
              <button
                onClick={handleChatAboutResult}
                className="btn btn-secondary"
              >
                <MessageCircleQuestion className="h-4 w-4 mr-1" />
                <span>Ask AI</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6">
          {/* Image preview with annotations */}
          <div className="bg-gray-50 rounded-lg p-4 overflow-hidden">
            <div className="flex justify-end mb-2 space-x-2">
              <button 
                onClick={handleZoomOut}
                className="p-1 rounded bg-white shadow hover:bg-gray-100 text-gray-700"
                title="Zoom Out"
              >
                <ZoomOut size={18} />
              </button>
              <button 
                onClick={handleZoomIn}
                className="p-1 rounded bg-white shadow hover:bg-gray-100 text-gray-700"
                title="Zoom In"
              >
                <ZoomIn size={18} />
              </button>
            </div>
            
            <div className="relative overflow-auto max-h-[400px] flex items-center justify-center bg-[url('/src/assets/transparency-grid.png')]">
              <div
                className="relative transition-transform"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <img
                  src={result.imageUrl}
                  alt="Medical scan"
                  className="max-w-full"
                  style={{ maxHeight: '400px' }}
                />
                
                {showAreas && result.areas && result.areas.map((area, index) => (
                  <div
                    key={index}
                    className="absolute border-2 border-accent-500 bg-accent-500/20 rounded-sm flex items-center justify-center"
                    style={{
                      left: `${area.x}px`,
                      top: `${area.y}px`,
                      width: `${area.width}px`,
                      height: `${area.height}px`,
                    }}
                  >
                    <span className="text-xs font-bold bg-accent-500 text-white px-1 py-0.5 rounded">
                      {area.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Analysis results */}
          <div className="flex flex-col">
            <div className="bg-gray-50 rounded-lg p-4 flex-1">
              <h3 className="text-lg font-semibold mb-4">AI Diagnosis</h3>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">Detected Condition</span>
                  <span className="text-sm bg-secondary-100 text-secondary-800 px-2 py-1 rounded">
                    {Math.round(result.confidence * 100)}% Confidence
                  </span>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <span className="text-lg font-medium">{result.detectedDisease}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium mb-2">Areas of Interest</h4>
                <div className="space-y-2">
                  {result.areas && result.areas.length > 0 ? (
                    result.areas.map((area, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-accent-500" />
                        <span>{area.label}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No specific areas of interest detected.</p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Analysis Description</h4>
                <p className="text-gray-700">
                  {result.analysisDescription}
                </p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-primary-50 border border-primary-100 rounded-lg">
              <div className="flex items-start">
                <div className="bg-primary-100 p-2 rounded-lg mr-3">
                  <MessageCircleQuestion className="h-5 w-5 text-primary-500" />
                </div>
                <div>
                  <h4 className="font-medium text-primary-800">Have Questions?</h4>
                  <p className="text-primary-700 text-sm mb-3">
                    Ask our AI assistant for more information about this diagnosis.
                  </p>
                  <button
                    onClick={handleChatAboutResult}
                    className="btn-primary text-sm"
                  >
                    Chat with AI
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageResult;