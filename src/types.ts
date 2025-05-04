export interface ReportAnalysisResult {
  id: string;
  fileName: string;
  fileUrl: string;
  summary: string;
  keyFindings: string[];
  severityAssessment: string;
  recommendedFollowup: string;
  treatmentConsiderations: string[];
  timestamp: Date;
  status: 'analyzing' | 'completed' | 'failed';
} 