import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authAtom } from '../atoms/authAtom';
import SignOut from '../services/SignOutButton';

const NewDataLayout = () => {
  const user = useRecoilValue(authAtom);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return "Good Morning";
      if (hour < 18) return "Good Afternoon";
      return "Good Evening";
    };
    setGreeting(getGreeting());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-4000"></div>

        {/* Curved lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 Q300,150 600,100 T1200,100" fill="none" stroke="rgba(99, 212, 120, 0.05)" strokeWidth="3" />
          <path d="M0,300 Q300,350 600,300 T1200,300" fill="none" stroke="rgba(99, 212, 120, 0.03)" strokeWidth="2" />
          <path d="M0,500 Q300,550 600,500 T1200,500" fill="none" stroke="rgba(99, 212, 120, 0.02)" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl shadow-lg overflow-hidden mb-10">
            <div className="relative">
              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              <div className="flex flex-wrap justify-between items-center p-6">
                <div className="flex items-center space-x-2">
                  <h1 className="text-3xl font-bold text-white">New Data</h1>
                  <div className="h-8 w-1 bg-white/20 rounded-full mx-4"></div>
                  <Link to="/" className="flex items-center space-x-2 text-white/90 z-20 hover:text-white transition-colors cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Dashboard</span>
                  </Link>
                </div>

                <div className="flex items-center space-x-6">
                  <span className="text-white/90 text-xl">{greeting}, <span className="font-semibold">{user.user.name.split(" ")[0]}</span></span>
                  <div>
                    <SignOut />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Note  */}
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">
                  <strong>Note:</strong> GST part is under development. DONT ADD ANY DATA IN THIS PART.
                </p>
              </div>
            </div>
          </div>


          {/* Navigation Menu */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-8">
            <nav className="flex flex-wrap gap-6 justify-center md:justify-start">
              <div className="relative group">
                <button className="text-gray-700 flex gap-2 items-center font-medium hover:text-green-600 transition-colors">
                  Data
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute hidden group-hover:block z-50 w-48  bg-white text-gray-700 rounded-lg shadow-xl">
                  <NavLink to="data/client-master" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Client Master</NavLink>
                  <NavLink to="data/other-detail" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Other Details</NavLink>
                </div>
              </div>

              <div className="relative group">
                <button className="text-gray-700 flex gap-2 items-center font-medium hover:text-green-600 transition-colors">
                  Form / File
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute hidden group-hover:block z-50 w-80 bg-white text-gray-700 rounded-lg shadow-xl">
                  <NavLink to="form/shipping-bill" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Shipping Bill</NavLink>
                  <NavLink to="form/invoice" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Invoice</NavLink>
                  <NavLink to="form/e-invoice" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>E-Invoice</NavLink>
                  <NavLink to="form/e-brc" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>E-BRC</NavLink>
                  <NavLink to="form/e-way-bill" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>E-Way Bill</NavLink>
                  <NavLink to="form/epcg-eo-fulfillment" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>EPCG Lic. wise EO fulfillment</NavLink>
                  <NavLink to="form/advance-eo-fulfillment" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Advance Lic. wise EO fulfillment</NavLink>

                  <NavLink to="form/direct-export" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Direct Export - ANF 5B</NavLink>
                  <NavLink to="form/indirect-export" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Indirect Export - ANF 5B</NavLink>
                </div>
              </div>

              <div className="relative group">
                <button className="text-gray-700 flex gap-2 items-center font-medium hover:text-green-600 transition-colors">
                  Documents
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute hidden group-hover:block z-50 w-48 bg-white text-gray-700 rounded-lg shadow-xl">
                  <NavLink to="documents/epcg-lic" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>EPCG License</NavLink>
                  <NavLink to="documents/advance-lic" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Advance License</NavLink>
                  <NavLink to="documents/shipping-bill/part1" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Shipping Bill</NavLink>
                  <NavLink to="documents/invoice" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Invoice</NavLink>
                  <NavLink to="documents/e-invoice" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>E - Invoice</NavLink>
                  <NavLink to="documents/e-brc" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>E - BRC</NavLink>
                  <NavLink to="documents/e-way-bill" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>E - Way Bill</NavLink>
                  <NavLink to="documents/subsidy" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Subsidy</NavLink>
                </div>
              </div>

              <div className="relative group">
                <button className="text-gray-700 flex gap-2 items-center font-medium hover:text-green-600 transition-colors">
                  Report
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute hidden group-hover:block z-50 w-64 bg-white text-gray-700 rounded-lg shadow-xl">
                  {/* Report subsection */}
                  <div className="relative group/report py-2 px-4 hover:bg-gray-50 flex justify-between items-center">
                    <span className="font-medium">Summary</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <div className="absolute hidden group-hover/report:block left-full top-0 w-80 bg-white text-gray-700 rounded-lg shadow-xl">
                      <NavLink to="report/summary/epcg-lic-summary" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>EPCG License Summary</NavLink>
                      <NavLink to="report/summary/advance-lic-summary" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Advance License Summary</NavLink>
                      <NavLink to="report/summary/party-wise-epcg-lic-summary" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Party-wise EPCG License Summary</NavLink>
                      <NavLink to="report/summary/party-wise-advance-lic-summary" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Party-wise Advance License Summary</NavLink>
                      <NavLink to="report/summary/client-master-report" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Client Master Report</NavLink>
                    </div>
                  </div>

                  {/* Form/Data subsection */}
                  <div className="relative group/form py-2 px-4 hover:bg-gray-50 flex justify-between items-center">
                    <span className="font-medium">Form/Data</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <div className="absolute hidden group-hover/form:block left-full top-0 w-80 bg-white text-gray-700 rounded-lg shadow-xl">
                      <NavLink to="report/form-file/direct-export" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Direct Export - ANF 5B</NavLink>
                      <NavLink to="report/form-file/indirect-export" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Indirect Export - ANF 5B</NavLink>
                    </div>
                  </div>

                  {/* Document subsection */}
                  <div className="relative group/doc py-2 px-4 hover:bg-gray-50 flex justify-between items-center">
                    <span className="font-medium">Document</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <div className="absolute hidden group-hover/doc:block left-full top-0 w-80 bg-white text-gray-700 rounded-lg shadow-xl">
                      <NavLink to="report/documents/epcg-lic" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>EPCG License</NavLink>
                    </div>
                  </div>



                </div>
              </div>

            </nav>
          </div>

          {/* Main content area */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <Outlet />
          </div>
        </div>

      </div>
    </div>
  );
};

export default NewDataLayout;