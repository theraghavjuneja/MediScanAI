import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, Image, Loader2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const DetectType: React.FC = () => {
  const { uploadStatus } = useApp();
  const [dragActive, setDragActive] = useState(false);
  const [detectionResult, setDetectionResult] = useState<{
    image_type: string;
    confidence: number;
    message: string;
  } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };
  
  const handleFiles = async (files: FileList) => {
    const file = files[0];
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      return;
    }

    // Create preview URL
    const imageUrl = URL.createObjectURL(file);
    setPreviewUrl(imageUrl);
    setIsAnalyzing(true);

    try {
      // Create FormData and append the file
      const formData = new FormData();
      formData.append('file', file);

      // Make API call to detect image type
      const response = await fetch('http://localhost:8000/predict-image-type', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to detect image type');
      }

      const data = await response.json();
      setDetectionResult(data);
    } catch (error) {
      console.error('Error detecting image type:', error);
      alert('Failed to detect image type. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const isUploading = uploadStatus === 'uploading' || uploadStatus === 'processing';
  
  return (
    <div className="max-w-3xl mx-auto p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Detect Image Type</h2>
        
        <div
          className={`file-drop-area ${dragActive ? 'dragging' : ''} ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
            accept="image/*"
            disabled={isUploading}
          />
          
          <div className="flex flex-col items-center">
            <Upload size={48} className="text-gray-400 mb-4" />
            
            <p className="text-lg font-medium text-gray-700 mb-2">
              Upload Medical Image
            </p>
            
            <p className="text-gray-500 mb-4 text-center">
              Drag and drop your file here, or click to browse
            </p>
            
            <p className="text-xs text-gray-400 text-center">
              Upload any medical image to detect its type
            </p>
            
            <button
              className="btn-primary mt-6"
              onClick={handleButtonClick}
              disabled={isUploading}
            >
              {isUploading ? 'Processing...' : 'Choose File'}
            </button>
          </div>
        </div>

        {isAnalyzing && (
          <div className="mt-8 flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg">
            <Loader2 className="h-12 w-12 text-primary-500 animate-spin mb-4" />
            <p className="text-lg font-medium text-gray-700">Our AI is analyzing the image type...</p>
          </div>
        )}

        {detectionResult && previewUrl && (
          <div className="mt-8 space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Detection Results</h3>
              <div className="space-y-4">
                <div>
                  <span className="font-medium">Image Type:</span>
                  <span className="ml-2 text-gray-700">{detectionResult.image_type}</span>
                </div>
                <div>
                  <span className="font-medium">Confidence:</span>
                  <span className="ml-2 text-gray-700">{(detectionResult.confidence * 100).toFixed(1)}%</span>
                </div>
                <div>
                  <span className="font-medium">Message:</span>
                  <p className="mt-1 text-gray-700">{detectionResult.message}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Uploaded Image</h3>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={previewUrl}
                  alt="Uploaded medical image"
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetectType; 