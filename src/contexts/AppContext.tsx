import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  ImageAnalysisResult, 
  ReportAnalysisResult, 
  ChatMessage, 
  AnalysisType,
  UploadStatus
} from '../types';
import { mockImageAnalysis, generateMockChatResponse } from '../utils/mockData';

interface AppContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  imageResults: ImageAnalysisResult[];
  reportResults: ReportAnalysisResult[];
  chatMessages: ChatMessage[];
  currentAnalysisType: AnalysisType;
  uploadStatus: UploadStatus;
  selectedResult: ImageAnalysisResult | ReportAnalysisResult | null;
  setSelectedResult: (result: ImageAnalysisResult | ReportAnalysisResult | null) => void;
  uploadImage: (file: File, imageType: 'mri' | 'xray') => Promise<void>;
  uploadReport: (file: File) => Promise<void>;
  sendChatMessage: (message: string) => void;
  clearChat: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [imageResults, setImageResults] = useState<ImageAnalysisResult[]>([]);
  const [reportResults, setReportResults] = useState<ReportAnalysisResult[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentAnalysisType, setCurrentAnalysisType] = useState<AnalysisType>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [selectedResult, setSelectedResult] = useState<ImageAnalysisResult | ReportAnalysisResult | null>(null);

  const uploadImage = async (file: File, imageType: 'mri' | 'xray') => {
    setUploadStatus('uploading');
    setCurrentAnalysisType('image');
    
    // Create a URL for the uploaded image
    const imageUrl = URL.createObjectURL(file);
    
    // Create a new result with "analyzing" status
    const newResult: ImageAnalysisResult = {
      id: uuidv4(),
      imageUrl,
      detectedDisease: null,
      confidence: 0,
      timestamp: new Date(),
      status: 'analyzing',
      imageType,
      analysisDescription: ''
    };
    
    setImageResults(prev => [newResult, ...prev]);
    setSelectedResult(newResult);
    setActiveTab('results');
    
    // Simulate analysis delay
    setUploadStatus('processing');
    
    try {
      // Create FormData and append the file
      const formData = new FormData();
      formData.append('file', file);

      // Make API call based on image type
      const endpoint = imageType === 'mri' ? 'http://localhost:8000/predict' : 'http://localhost:8000/predict-pneumonia';
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Failed to analyze ${imageType.toUpperCase()} image`);
      }

      const data = await response.json();
      
      // Update with API results
      const analyzeResult: ImageAnalysisResult = {
        id: newResult.id,
        imageUrl,
        detectedDisease: imageType === 'mri' 
          ? (data.condition === 'notumor' ? 'No Tumor Detected' : data.condition)
          : (data.condition === 'Normal' ? 'No Pneumonia Detected' : data.condition),
        confidence: data.confidence,
        timestamp: new Date(),
        imageType,
        analysisDescription: data.analysis_description,
        areas: (imageType === 'mri' && data.condition === 'notumor') || 
               (imageType === 'xray' && data.condition === 'Normal') 
          ? [] 
          : [{
              x: 120, // These coordinates would ideally come from the API
              y: 80,
              width: 90,
              height: 70,
              label: data.area_of_interest
            }],
        status: 'completed'
      };

      setImageResults(prev => 
        prev.map(result => 
          result.id === newResult.id ? analyzeResult : result
        )
      );
      
      setSelectedResult(analyzeResult);
      setUploadStatus('success');
    } catch (error) {
      console.error('Error analyzing image:', error);
      setUploadStatus('error');
      
      // Update with error status
      setImageResults(prev => 
        prev.map(result => 
          result.id === newResult.id ? {...result, status: 'failed'} : result
        )
      );
    }
  };

  const uploadReport = async (file: File) => {
    setUploadStatus('uploading');
    setCurrentAnalysisType('report');
    
    // Create a URL for the uploaded file
    const fileUrl = URL.createObjectURL(file);
    
    // Create a new result with "analyzing" status
    const newResult: ReportAnalysisResult = {
      id: uuidv4(),
      fileName: file.name,
      fileUrl,
      summary: '',
      keyFindings: [],
      severityAssessment: '',
      recommendedFollowup: '',
      treatmentConsiderations: [],
      timestamp: new Date(),
      status: 'analyzing'
    };
    
    setReportResults(prev => [newResult, ...prev]);
    setSelectedResult(newResult);
    setActiveTab('results');
    
    // Simulate analysis delay
    setUploadStatus('processing');
    
    try {
      // Create FormData and append the file
      const formData = new FormData();
      formData.append('file', file);

      // Make API call to analyze the report
      const response = await fetch('http://localhost:8000/analyze-report/', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to analyze medical report');
      }

      const data = await response.json();
      
      // Update with API results
      const analyzeResult: ReportAnalysisResult = {
        id: newResult.id,
        fileName: file.name,
        fileUrl,
        summary: data.report_summary,
        keyFindings: data.key_findings,
        severityAssessment: data.severity_assessment,
        recommendedFollowup: data.recommended_followup,
        treatmentConsiderations: data.treatment_considerations,
        timestamp: new Date(),
        status: 'completed'
      };
      
      setReportResults(prev => 
        prev.map(result => 
          result.id === newResult.id ? analyzeResult : result
        )
      );
      
      setSelectedResult(analyzeResult);
      setUploadStatus('success');
    } catch (error) {
      console.error('Error analyzing report:', error);
      setUploadStatus('error');
      
      // Update with error status
      setReportResults(prev => 
        prev.map(result => 
          result.id === newResult.id ? {...result, status: 'failed'} : result
        )
      );
    }
  };

  const sendChatMessage = (message: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    
    // Add typing indicator message
    const typingIndicatorId = uuidv4();
    const typingMessage: ChatMessage = {
      id: typingIndicatorId,
      content: '',
      sender: 'bot',
      timestamp: new Date(),
      isTyping: true
    };
    
    setChatMessages(prev => [...prev, typingMessage]);
    
    // Simulate delay and then add bot response
    setTimeout(() => {
      const response = generateMockChatResponse(message, selectedResult);
      
      // Replace typing indicator with actual response
      setChatMessages(prev => 
        prev.map(msg => 
          msg.id === typingIndicatorId 
            ? {
                id: uuidv4(),
                content: response,
                sender: 'bot',
                timestamp: new Date()
              } 
            : msg
        )
      );
    }, 1500);
  };

  const clearChat = () => {
    setChatMessages([]);
  };

  const value = {
    activeTab,
    setActiveTab,
    imageResults,
    reportResults,
    chatMessages,
    currentAnalysisType,
    uploadStatus,
    selectedResult,
    setSelectedResult,
    uploadImage,
    uploadReport,
    sendChatMessage,
    clearChat
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};