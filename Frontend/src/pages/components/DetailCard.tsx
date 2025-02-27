import React from 'react';
import { Link } from 'react-router-dom';

interface DetailCardProps {
  link: string;
  title: string;
  description: string;
  imageSrc: string;
  color: string;
  icon?: string;
}

const DetailCard: React.FC<DetailCardProps> = ({ link, title, description, imageSrc, color, icon }) => {
  
  // Icon selector based on prop
  const renderIcon = () => {
    switch(icon) {
      case 'chart':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'database':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  return (
    <Link 
      to={link} 
      className={`bg-gradient-to-r ${color} rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}
    >  
      <div className="relative p-6 sm:p-8">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
      
        <div className="flex flex-col md:flex-row items-center justify-between relative">
          <div className="md:max-w-[60%] mb-6 md:mb-0">
            <div className="flex items-center mb-4">
              {renderIcon() && (
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                  {renderIcon()}
                </div>
              )}
              <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
            </div>
            <p className="text-white/90 text-lg leading-relaxed">{description}</p>
            
            <div className="mt-6">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors duration-300">
                <span>Explore</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="relative">
            {/* Add a subtle glow effect behind the image */}
            <div className="absolute inset-0 bg-white/20 rounded-full filter blur-xl"></div>
            <img
              src={imageSrc}
              className="w-48 h-48 object-contain relative z-10"
              alt={title}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DetailCard;