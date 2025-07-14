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
          <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-xl shadow-lg overflow-hidden mb-10">
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

                  {/* DGFT Basic subsection */}
                  <div className="relative group/dgft-basic py-2 px-4 hover:bg-gray-50 flex justify-between items-center">
                    <span className="font-medium">DGFT - Basic</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <div className="absolute hidden group-hover/dgft-basic:block left-full top-0 w-80 bg-white text-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto">
                      <NavLink to="report/dgft-basic/ad-code" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>AD Code</NavLink>
                      <NavLink to="report/dgft-basic/bank-incentive" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Bank Incentive</NavLink>
                      <NavLink to="report/dgft-basic/coo" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>COO</NavLink>
                      <NavLink to="report/dgft-basic/dsc" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>DSC</NavLink>
                      <NavLink to="report/dgft-basic/icegate" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Icegate</NavLink>
                      <NavLink to="report/dgft-basic/iec" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>IEC</NavLink>
                      <NavLink to="report/dgft-basic/iem-udyam" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>IEM (UDYAM)</NavLink>
                      <NavLink to="report/dgft-basic/ies" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>IES</NavLink>
                      <NavLink to="report/dgft-basic/lei" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>LEI</NavLink>
                      <NavLink to="report/dgft-basic/pmfs" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>PMFS</NavLink>
                      <NavLink to="report/dgft-basic/rcmc" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>RCMC</NavLink>
                      <NavLink to="report/dgft-basic/rex-no" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Rex No.</NavLink>
                      <NavLink to="report/dgft-basic/rodtep-script-generate" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Rodtep - Script Generate</NavLink>
                      <NavLink to="report/dgft-basic/rodtep-script-transfer" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Rodtep - Script Transfer</NavLink>
                      <NavLink to="report/dgft-basic/self-sealing-permission" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Self Sealing Permission</NavLink>
                    </div>
                  </div>

                  {/* DGFT Closure + AR subsection */}
                  <div className="relative group/dgft-closure py-2 px-4 hover:bg-gray-50 flex justify-between items-center">
                    <span className="font-medium">DGFT - Closure + AR</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <div className="absolute hidden group-hover/dgft-closure:block left-full top-0 w-80 bg-white text-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto">
                      <NavLink to="report/dgft-closure/advance-appeal" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Advance - Appeal</NavLink>
                      <NavLink to="report/dgft-closure/advance-extension" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Advance - Extension</NavLink>
                      <NavLink to="report/dgft-closure/advance-notice" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Advance - Notice</NavLink>
                      <NavLink to="report/dgft-closure/advance-redemption" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Advance - Redemption</NavLink>
                      <NavLink to="report/dgft-closure/advance-revalidation" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Advance - Revalidation</NavLink>
                      <NavLink to="report/dgft-closure/epcg-annual-report" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>EPCG - Annual Report</NavLink>
                      <NavLink to="report/dgft-closure/epcg-appeal" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>EPCG - Appeal</NavLink>
                      <NavLink to="report/dgft-closure/epcg-extension" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>EPCG - Extension</NavLink>
                      <NavLink to="report/dgft-closure/epcg-notice" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>EPCG - Notice</NavLink>
                      <NavLink to="report/dgft-closure/epcg-redemption" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>EPCG - Redemption</NavLink>
                      <NavLink to="report/dgft-closure/advance-value-enhancement" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Advance - Value Enhancement</NavLink>
                      <NavLink to="report/dgft-closure/advance-validation" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Advance - Validation</NavLink>
                    </div>
                  </div>

                  {/* DGFT Online Lic subsection */}
                  <div className="relative group/dgft-online py-2 px-4 hover:bg-gray-50 flex justify-between items-center">
                    <span className="font-medium">DGFT - Online Lic</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <div className="absolute hidden group-hover/dgft-online:block left-full top-0 w-80 bg-white text-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto">
                      <NavLink to="report/dgft-online/advance-amendment" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Advance - Amendment</NavLink>
                      <NavLink to="report/dgft-online/advance-cos-invalidation" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Advance - COS / Invalidation</NavLink>
                      <NavLink to="report/dgft-online/advance-surrender" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Advance - Surrender</NavLink>
                      <NavLink to="report/dgft-online/advance-fresh" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Advance - Fresh</NavLink>
                      <NavLink to="report/dgft-online/dfia-script-generate" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>DFIA - Script Generate</NavLink>
                      <NavLink to="report/dgft-online/dfia-file-no-generation" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>DFIA - File No. Generation</NavLink>
                      <NavLink to="report/dgft-online/epcg-amendment" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>EPCG - Amendment</NavLink>
                      <NavLink to="report/dgft-online/epcg-installation" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>EPCG - Installation</NavLink>
                      <NavLink to="report/dgft-online/epcg-invalidation" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>EPCG - Invalidation</NavLink>
                      <NavLink to="report/dgft-online/epcg-invalidation-surrender" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>EPCG - Invalidation Surrender</NavLink>
                      <NavLink to="report/dgft-online/epcg-surrender" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>EPCG - Surrender</NavLink>
                      <NavLink to="report/dgft-online/epcg-fresh" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>EPCG - Fresh</NavLink>
                      <NavLink to="report/dgft-online/free-sale-certificate" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Free Sale Certificate</NavLink>
                      <NavLink to="report/dgft-online/nfmims" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>NFMIMS</NavLink>
                      <NavLink to="report/dgft-online/pims" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>PIMS</NavLink>
                      <NavLink to="report/dgft-online/sims" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>SIMS</NavLink>
                      <NavLink to="report/dgft-online/advance-norms-fixation" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Advance - Norms Fixation</NavLink>
                    </div>
                  </div>

                  {/* DGFT Other subsection */}
                  <div className="relative group/dgft-other py-2 px-4 hover:bg-gray-50 flex justify-between items-center">
                    <span className="font-medium">DGFT - Other</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <div className="absolute hidden group-hover/dgft-other:block left-full top-0 w-80 bg-white text-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto">
                      <NavLink to="report/dgft-other/advisory-import-export" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Advisory on Import & Export</NavLink>
                      <NavLink to="report/dgft-other/aeo" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>AEO</NavLink>
                      <NavLink to="report/dgft-other/custom-bg-release" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Custom - BG Release</NavLink>
                      <NavLink to="report/dgft-other/export-house-status-holder" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Export House (Status Holder)</NavLink>
                      <NavLink to="report/dgft-other/igcr-return" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>IGCR - Return</NavLink>
                      <NavLink to="report/dgft-other/moowr-application" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>MOOWR - Application</NavLink>
                      <NavLink to="report/dgft-other/moowr-return" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>MOOWR - Return</NavLink>
                      <NavLink to="report/dgft-other/moowr-compliance" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>MOOWR - Compliance</NavLink>
                      <NavLink to="report/dgft-other/restricted-license" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Restricted License</NavLink>
                      <NavLink to="report/dgft-other/trq" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>TRQ</NavLink>
                      <NavLink to="report/dgft-other/igcr-application" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>IGCR - Application</NavLink>
                      <NavLink to="report/dgft-other/igcr-bond-bg-closure" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>IGCR - Bond/BG Closure</NavLink>
                      <NavLink to="report/dgft-other/dgft-other-notice" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>DGFT - Other Notice</NavLink>
                      <NavLink to="report/dgft-other/annual-rodtep-return" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>Annual Rodtep - Return (ARR)</NavLink>
                      <NavLink to="report/dgft-other/del-removal" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>DEL Removal</NavLink>
                      <NavLink to="report/dgft-other/moowr-offline-to-online" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>MOOWR Offline to Online</NavLink>
                      <NavLink to="report/dgft-other/prc-application" className={({ isActive }) => `block px-4 py-3 hover:bg-gray-50 rounded-md ${isActive ? 'text-green-600 font-medium' : ''}`}>PRC Application</NavLink>
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