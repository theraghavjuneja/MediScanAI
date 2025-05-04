import React from 'react';
import { 
  ArrowLeft, 
  FileText, 
  FileType2, 
  MessageCircleQuestion,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { ReportAnalysisResult } from '../../types';

interface ReportResultProps {
  result: ReportAnalysisResult;
}

const ReportResult: React.FC<ReportResultProps> = ({ result }) => {
  const { setSelectedResult, setActiveTab } = useApp();
  
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
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Analyzing Report</h2>
              <p className="text-gray-600 text-center">Our AI is processing your medical report...</p>
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
              <p className="text-gray-600 text-center mb-6">We encountered an error while analyzing your report. Please try again.</p>
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
              <h2 className="text-xl font-semibold">Report Analysis Results</h2>
            </div>
            
            <div className="flex items-center space-x-2">
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
          {/* Report file info */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center mb-6">
              <div className="bg-secondary-100 p-3 rounded-lg mr-4">
                <FileType2 className="h-8 w-8 text-secondary-600" />
              </div>
              <div>
                <h3 className="font-medium">{result.fileName}</h3>
                <p className="text-sm text-gray-500">
                  Uploaded {result.timestamp.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg bg-white p-4 mb-6">
              <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                Report Summary
              </h4>
              <p className="text-gray-700">{result.summary}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Key Findings</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {result.keyFindings.map((finding, index) => (
                  <li key={index}>{finding}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Analysis insights */}
          <div className="flex flex-col">
            <div className="bg-gray-50 rounded-lg p-6 mb-4 flex-1">
              <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Severity Assessment</h4>
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-warning-500 h-2.5 rounded-full w-2/5"></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Mild</span>
                      <span className="font-medium">Moderate</span>
                      <span>Severe</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Recommended Follow-up</h4>
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <p className="text-gray-700">
                      Follow-up with a pulmonologist is recommended within 2 weeks to monitor progression and adjust treatment as necessary.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Treatment Considerations</h4>
                  <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Oral antibiotics may be necessary</li>
                      <li>Consider anti-inflammatory medication</li>
                      <li>Breathing exercises to improve lung function</li>
                      <li>Increased fluid intake recommended</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-primary-50 border border-primary-100 rounded-lg">
              <div className="flex items-start">
                <div className="bg-primary-100 p-2 rounded-lg mr-3">
                  <MessageCircleQuestion className="h-5 w-5 text-primary-500" />
                </div>
                <div>
                  <h4 className="font-medium text-primary-800">Have Questions?</h4>
                  <p className="text-primary-700 text-sm mb-3">
                    Ask our AI assistant to explain the report or provide more details.
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

export default ReportResult;