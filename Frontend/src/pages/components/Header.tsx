import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <img
              src="http://www.udhyog4.in/images/new/logo.png"
              className="h-20 object-contain"
              alt="Udhyog 4.0 Logo"
            />
            <div className="ml-6 pl-6 border-l-2 border-gray-200 hidden sm:block">
              <h2 className="text-2xl font-bold text-gray-800">Industry 4.0 Solutions</h2>
              <p className="text-gray-600">Smart Manufacturing Platform</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="text-right mr-6 pr-6 border-r-2 border-gray-200 hidden sm:block">
              <h3 className="text-lg font-semibold text-gray-800">Transform Your Factory</h3>
              <p className="text-gray-600">Intelligent Manufacturing</p>
            </div>
            <img
              src="../src/images/mani_header_logo_2.png"
              className="h-20 object-contain"
              alt="Manufacturing Logo"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;