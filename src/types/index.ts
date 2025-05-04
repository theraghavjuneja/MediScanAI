// Types for the application

export type ImageAnalysisResult = {
  id: string;
  imageUrl: string;
  detectedDisease: string | null;
  confidence: number;
  timestamp: Date;
  imageType: 'mri' | 'xray';
  analysisDescription: string;
  areas?: {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
  }[];
  status: 'analyzing' | 'completed' | 'failed';
};

export type ReportAnalysisResult = {
  id: string;
  fileName: string;
  fileUrl: string;
  summary: string;
  keyFindings: string[];
  timestamp: Date;
  status: 'analyzing' | 'completed' | 'failed';
};

export type ChatMessage = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTyping?: boolean;
};

export type AnalysisType = 'image' | 'report' | null;

export type UploadStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';