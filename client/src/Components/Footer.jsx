// src/Components/Footer.jsx
import React from 'react';
import { ChevronUp, Twitter, Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-50 mt-0 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">
              Baller<span className="text-blue-600">stalk</span>
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Your ultimate destination for sports news, analysis, and insights. 
              Covering all major sports with in-depth coverage and expert commentary.
            </p>
            <div className="text-sm text-gray-500">
              Copyright © {new Date().getFullYear()}. Ballerstalk. All rights reserved.
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail size={16} />
                <span>ranjan@ballertalks.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone size={16} />
                <span>Tel: +(977) 9843865766</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-600">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <div>
                  {/* <div>123 Sports Avenue</div> */}
                  <div>Kathmandu, Nepal</div>
                </div>
              </div>
            </div>
          </div>

          {/* Follow Us Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800">Follow Us</h4>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
                aria-label="Follow us on Twitter"
              >
                <Twitter size={20} className="text-gray-600 hover:text-blue-500" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
                aria-label="Follow us on Facebook"
              >
                <Facebook size={20} className="text-gray-600 hover:text-blue-600" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-300 transition-colors duration-200"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={20} className="text-gray-600 hover:text-pink-500" />
              </a>
              <a 
                href="#" 
                className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-300 transition-colors duration-200"
                aria-label="Subscribe to our YouTube channel"
              >
                <Youtube size={20} className="text-gray-600 hover:text-red-500" />
              </a>
            </div>
            <div className="pt-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Categories</h5>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-white rounded text-xs text-gray-600 border border-gray-200">NFL</span>
                <span className="px-2 py-1 bg-white rounded text-xs text-gray-600 border border-gray-200">NBA</span>
                <span className="px-2 py-1 bg-white rounded text-xs text-gray-600 border border-gray-200">MLB</span>
                <span className="px-2 py-1 bg-white rounded text-xs text-gray-600 border border-gray-200">Soccer</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <div className="border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 flex justify-center">
          <button
            onClick={scrollToTop}
            className="flex flex-col items-center space-y-1 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            aria-label="Go back to top"
          >
            <div className="p-2 rounded-full border border-gray-300 hover:border-gray-400">
              <ChevronUp size={20} />
            </div>
            <span className="text-xs font-medium">GO BACK ON TOP</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;