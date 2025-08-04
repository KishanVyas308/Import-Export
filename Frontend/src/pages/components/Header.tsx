import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <img
              src="/images/logo.png"
              className="h-20 object-contain"
              alt="Udhyog 4.0 Logo"
            />
            <div className="ml-6 pl-6 border-l-2 border-gray-200 hidden sm:block">
              <h2 className="text-2xl font-bold text-gray-800">Prikriti Group Solutions</h2>
            
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="text-right mr-6 pr-6 border-r-2 border-gray-200 hidden sm:block">
            
            </div>
            <img
              src="../../src/images/mani_header_logo_2.png"
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