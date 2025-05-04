import React from 'react';
import { Activity, Shield, HelpCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="h-6 w-6 text-primary-500" />
              <span className="text-lg font-bold text-gray-900">MediScan AI</span>
            </div>
            <p className="text-gray-600 mb-4">
              Advanced AI-powered platform for medical image analysis and diagnostic assistance.
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <Shield className="h-4 w-4 mr-1" />
              <span>HIPAA Compliant & Secure</span>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="#" className="hover:text-primary-600 transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600 transition-colors">Supported Scan Types</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600 transition-colors">AI Technology</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600 transition-colors">For Healthcare Providers</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Help & Support</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="#" className="hover:text-primary-600 transition-colors">FAQs</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="flex items-center hover:text-primary-600 transition-colors">
                  <HelpCircle className="h-4 w-4 mr-1" />
                  <span>Contact Support</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} MediScan AI. All rights reserved.</p>
          <p className="mt-1">For demonstration purposes only. Not for medical use.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;