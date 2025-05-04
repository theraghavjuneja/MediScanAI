import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, FileType2, Image } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const FileUpload: React.FC = () => {
  const { uploadImage, uploadReport, uploadStatus } = useApp();
  const [dragActive, setDragActive] = useState(false);
  const [uploadType, setUploadType] = useState<'image' | 'report'>('image');
  const [imageType, setImageType] = useState<'mri' | 'xray' | null>(null);
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
  
  const handleFiles = (files: FileList) => {
    const file = files[0];
    
    if (uploadType === 'image') {
      // Check if file is an image
      if (file.type.startsWith('image/')) {
        if (!imageType) {
          alert('Please select the type of medical image (MRI or X-Ray)');
          return;
        }
        uploadImage(file, imageType);
      } else {
        alert('Please upload a valid image file');
      }
    } else {
      // Check if file is a PDF
      if (file.type === 'application/pdf') {
        uploadReport(file);
      } else {
        alert('Please upload a PDF file for report analysis');
      }
    }
  };
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const isUploading = uploadStatus === 'uploading' || uploadStatus === 'processing';
  
  return (
    <div className="max-w-3xl mx-auto p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Upload Medical Data</h2>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <button
            className={`flex-1 py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              uploadType === 'image'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => {
              setUploadType('image');
              setImageType(null);
            }}
            disabled={isUploading}
          >
            <Image size={20} />
            <span>Medical Image</span>
          </button>
          
          <button
            className={`flex-1 py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors ${
              uploadType === 'report'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => {
              setUploadType('report');
              setImageType(null);
            }}
            disabled={isUploading}
          >
            <FileType2 size={20} />
            <span>Medical Report</span>
          </button>
        </div>
        
        {uploadType === 'image' && (
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <button
              className={`flex-1 py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                imageType === 'mri'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setImageType('mri')}
              disabled={isUploading}
            >
              <span>MRI</span>
            </button>
            
            <button
              className={`flex-1 py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                imageType === 'xray'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setImageType('xray')}
              disabled={isUploading}
            >
              <span>X-Ray</span>
            </button>
          </div>
        )}
        
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
            accept={uploadType === 'image' ? 'image/*' : 'application/pdf'}
            disabled={isUploading}
          />
          
          <div className="flex flex-col items-center">
            <Upload size={48} className="text-gray-400 mb-4" />
            
            <p className="text-lg font-medium text-gray-700 mb-2">
              {uploadType === 'image'
                ? `Upload ${imageType ? imageType.toUpperCase() : 'Medical'} Image`
                : 'Upload Medical Report (PDF)'}
            </p>
            
            <p className="text-gray-500 mb-4 text-center">
              Drag and drop your file here, or click to browse
            </p>
            
            {uploadType === 'image' ? (
              <p className="text-xs text-gray-400 text-center">
                Supports: X-rays, MRIs currently. We are working to bring CT Scans, Ultrasounds, Retinal Scans too
              </p>
            ) : (
              <p className="text-xs text-gray-400 text-center">
                Upload doctor's reports, lab results, or diagnostic summaries in PDF format
              </p>
            )}
            
            <button
              className="btn-primary mt-6"
              onClick={handleButtonClick}
              disabled={isUploading || (uploadType === 'image' && !imageType)}
            >
              {isUploading ? 'Processing...' : 'Choose File'}
            </button>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="font-medium text-lg mb-4">How it works</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Upload your medical {uploadType} for AI analysis</li>
            <li>Our advanced algorithms will analyze the {uploadType}</li>
            <li>Review the detected findings and diagnosis suggestions</li>
            <li>Ask follow-up questions to our AI assistant</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;