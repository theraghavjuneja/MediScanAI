import { v4 as uuidv4 } from 'uuid';
import { ImageAnalysisResult, ReportAnalysisResult } from '../types';

const mriDiseases = [
  {
    name: 'Brain Tumor',
    confidence: 0.85,
    areas: [
      { x: 120, y: 80, width: 90, height: 70, label: 'Tumor Mass' },
      { x: 200, y: 150, width: 60, height: 50, label: 'Edema' }
    ],
    description: 'The MRI shows a well-defined mass in the right frontal lobe with surrounding edema. The mass appears to be enhancing with contrast.'
  },
  {
    name: 'Multiple Sclerosis',
    confidence: 0.78,
    areas: [
      { x: 150, y: 120, width: 40, height: 40, label: 'Lesion' },
      { x: 220, y: 160, width: 30, height: 30, label: 'Lesion' }
    ],
    description: 'Multiple hyperintense lesions are visible in the periventricular white matter, consistent with demyelinating disease.'
  },
  {
    name: 'No Significant Findings',
    confidence: 0.91,
    areas: [],
    description: 'No significant abnormalities detected in this MRI scan. All structures appear within normal limits.'
  }
];

const xrayDiseases = [
  {
    name: 'Pneumonia',
    confidence: 0.87,
    areas: [
      { x: 120, y: 80, width: 90, height: 70, label: 'Inflammation' },
      { x: 200, y: 150, width: 60, height: 50, label: 'Opacity' }
    ],
    description: 'The X-ray shows signs of pneumonia in the lower right lung. There are characteristic opacities consistent with inflammation and fluid accumulation.'
  },
  {
    name: 'Cardiomegaly',
    confidence: 0.82,
    areas: [
      { x: 180, y: 100, width: 100, height: 90, label: 'Enlarged Heart' }
    ],
    description: 'The X-ray shows an enlarged cardiac silhouette suggesting cardiomegaly. The cardiothoracic ratio appears increased above normal parameters.'
  },
  {
    name: 'No Significant Findings',
    confidence: 0.91,
    areas: [],
    description: 'No significant abnormalities detected in this X-ray. All structures appear within normal limits.'
  }
];

export const mockImageAnalysis = (imageUrl: string, imageType: 'mri' | 'xray'): ImageAnalysisResult => {
  // Select appropriate disease list based on image type
  const diseases = imageType === 'mri' ? mriDiseases : xrayDiseases;
  
  // Randomly select a disease or "No Significant Findings"
  const randomIndex = Math.floor(Math.random() * diseases.length);
  const selectedDisease = diseases[randomIndex];
  
  return {
    id: uuidv4(),
    imageUrl,
    detectedDisease: selectedDisease.name,
    confidence: selectedDisease.confidence,
    timestamp: new Date(),
    imageType,
    analysisDescription: selectedDisease.description,
    areas: selectedDisease.areas,
    status: 'completed'
  };
};

export const generateMockChatResponse = (
  query: string, 
  selectedResult: ImageAnalysisResult | ReportAnalysisResult | null
): string => {
  // Simple keyword-based responses
  const lowerQuery = query.toLowerCase();
  
  // If there's a selected result, use its information in the response
  if (selectedResult) {
    if ('detectedDisease' in selectedResult) {
      const disease = selectedResult.detectedDisease;
      
      if (lowerQuery.includes('what') && lowerQuery.includes('disease')) {
        return `Based on the analysis, the image shows signs of ${disease}. This was detected with ${(selectedResult.confidence * 100).toFixed(1)}% confidence.`;
      }
      
      if (lowerQuery.includes('treat') || lowerQuery.includes('therapy') || lowerQuery.includes('medication')) {
        if (disease === 'Pneumonia') {
          return `Treatment for pneumonia typically includes antibiotics for bacterial pneumonia, rest, and adequate hydration. In more severe cases, hospitalization may be required. Always consult with a healthcare provider for proper medical advice.`;
        } else if (disease === 'Diabetic Retinopathy') {
          return `Treatment for diabetic retinopathy focuses on controlling blood sugar levels, blood pressure, and cholesterol. Depending on the severity, treatments may include laser therapy, anti-VEGF injections, or vitrectomy surgery. Regular eye exams are crucial for early detection and management.`;
        } else if (disease === 'Cardiomegaly') {
          return `Treatment for cardiomegaly (enlarged heart) depends on the underlying cause. It may include medications like ACE inhibitors, beta-blockers, diuretics, or lifestyle changes such as reducing sodium intake and regular exercise. In some cases, procedures or surgery might be necessary.`;
        } else {
          return `No significant findings were detected in your scan, so no specific treatment is needed at this time. However, it's always good to maintain a healthy lifestyle and follow up with your healthcare provider regularly.`;
        }
      }
      
      if (lowerQuery.includes('symptom') || lowerQuery.includes('sign')) {
        if (disease === 'Pneumonia') {
          return `Common symptoms of pneumonia include cough with phlegm, fever, chills, shortness of breath, chest pain when breathing or coughing, fatigue, and sometimes confusion, especially in older adults.`;
        } else if (disease === 'Diabetic Retinopathy') {
          return `Early diabetic retinopathy often has no symptoms. As it progresses, symptoms may include blurred vision, fluctuating vision, impaired color vision, dark or empty areas in your vision, and in severe cases, vision loss.`;
        } else if (disease === 'Cardiomegaly') {
          return `Symptoms of cardiomegaly may include shortness of breath, especially during activity or when lying flat, swelling in the legs, ankles and feet, fatigue, and irregular heartbeat. Some people may not experience any symptoms, especially in mild cases.`;
        } else {
          return `No disease was detected in your scan, so there aren't specific symptoms to discuss. If you're experiencing concerning symptoms, please consult with your healthcare provider.`;
        }
      }
    } else if ('summary' in selectedResult) {
      // This is a report result
      if (lowerQuery.includes('summary') || lowerQuery.includes('explain') || lowerQuery.includes('mean')) {
        return `${selectedResult.summary} The key findings in your report include: ${selectedResult.keyFindings.join(', ')}.`;
      }
      
      if (lowerQuery.includes('severe') || lowerQuery.includes('serious')) {
        return `Based on the report analysis, your condition appears to be mild to moderate. The report indicates early stages with moderate inflammation. It's important to follow up with your doctor to discuss treatment options and monitoring.`;
      }
    }
  }
  
  // General responses
  if (lowerQuery.includes('hello') || lowerQuery.includes('hi ')) {
    return `Hello! I'm your medical AI assistant. How can I help you understand your scan or report better?`;
  }
  
  if (lowerQuery.includes('thank')) {
    return `You're welcome! If you have any more questions about your results, feel free to ask.`;
  }
  
  if (lowerQuery.includes('how') && lowerQuery.includes('work')) {
    return `I analyze your uploaded medical images using advanced convolutional neural networks to detect potential diseases. For reports, I use natural language processing to extract and interpret key information. I can then answer your specific questions about the findings.`;
  }
  
  if (lowerQuery.includes('accurate')) {
    return `Our AI models are trained on large datasets of medical images and reports, but they're designed to assist healthcare professionals, not replace them. The accuracy typically ranges from 80-95% depending on the condition and image quality. Always consult with a healthcare provider for definitive diagnosis and treatment.`;
  }
  
  // Default response
  return `I'm here to help you understand your medical results. Could you please clarify what specific aspect of the analysis you'd like to know more about?`;
};