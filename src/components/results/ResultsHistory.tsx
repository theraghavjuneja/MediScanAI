import React from 'react';
import { Calendar, FileType2, Image, ArrowRight } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { ImageAnalysisResult, ReportAnalysisResult } from '../../types';

const ResultsHistory: React.FC = () => {
  const { 
    imageResults, 
    reportResults, 
    setSelectedResult,
    setActiveTab
  } = useApp();
  
  // Combine and sort all results by date
  const allResults = [...imageResults, ...reportResults].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );
  
  const handleSelectResult = (result: ImageAnalysisResult | ReportAnalysisResult) => {
    setSelectedResult(result);
  };
  
  const handleUploadNew = () => {
    setActiveTab('upload');
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <div className="max-w-5xl mx-auto p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-4 sm:p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Analysis History</h2>
            <button 
              onClick={handleUploadNew}
              className="btn-primary"
            >
              Upload New
            </button>
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
          {allResults.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Analysis History</h3>
              <p className="text-gray-500 mb-6">
                You haven't uploaded any medical images or reports for analysis yet.
              </p>
              <button
                onClick={handleUploadNew}
                className="btn-primary"
              >
                Upload Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allResults.map(result => (
                <div 
                  key={result.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleSelectResult(result)}
                >
                  <div className="flex p-4">
                    <div className="mr-4">
                      {'imageUrl' in result ? (
                        <div className="bg-primary-50 rounded-lg h-20 w-20 flex items-center justify-center overflow-hidden">
                          <img 
                            src={result.imageUrl} 
                            alt="Medical scan"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="bg-secondary-50 rounded-lg h-20 w-20 flex items-center justify-center">
                          <FileType2 className="h-10 w-10 text-secondary-500" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        {'imageUrl' in result ? (
                          <>
                            <Image className="h-3 w-3 mr-1" />
                            <span>Medical Image</span>
                          </>
                        ) : (
                          <>
                            <FileType2 className="h-3 w-3 mr-1" />
                            <span>Medical Report</span>
                          </>
                        )}
                        <span className="mx-2">•</span>
                        <span>{formatDate(result.timestamp)}</span>
                      </div>
                      
                      <h3 className="font-medium text-gray-800 mb-1">
                        {'detectedDisease' in result ? (
                          result.detectedDisease || 'Analysis in progress...'
                        ) : (
                          result.fileName
                        )}
                      </h3>
                      
                      <div className="flex justify-between items-center">
                        <span className={`text-sm px-2 py-0.5 rounded ${
                          result.status === 'completed' 
                            ? 'bg-success-100 text-success-800' 
                            : result.status === 'analyzing'
                            ? 'bg-primary-100 text-primary-800'
                            : 'bg-error-100 text-error-800'
                        }`}>
                          {result.status === 'completed' 
                            ? 'Completed' 
                            : result.status === 'analyzing'
                            ? 'Analyzing...'
                            : 'Failed'}
                        </span>
                        
                        <div className="text-primary-500 flex items-center text-sm font-medium">
                          <span>View Details</span>
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsHistory;