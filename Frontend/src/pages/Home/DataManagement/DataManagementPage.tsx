import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import DetailCard from "../../components/DetailCard";
import { useRecoilValue } from "recoil";
import { authAtom } from "../../../atoms/authAtom";
import SignOut from "../../../services/SignOutButton";

const DataManagementPage: React.FC = () => {
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
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-4000"></div>
        
        {/* Curved lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 Q300,150 600,100 T1200,100" fill="none" stroke="rgba(246, 135, 79, 0.05)" strokeWidth="3" />
          <path d="M0,300 Q300,350 600,300 T1200,300" fill="none" stroke="rgba(246, 135, 79, 0.03)" strokeWidth="2" />
          <path d="M0,500 Q300,550 600,500 T1200,500" fill="none" stroke="rgba(246, 135, 79, 0.02)" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative z-10">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl shadow-lg overflow-hidden mb-10">
            <div className="relative">
              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              <div className="flex flex-wrap justify-between items-center p-6">
                <div className="flex items-center space-x-2">
                  <h1 className="text-3xl font-bold text-white">Data Management</h1>
                  <div className="h-8 w-1 bg-white/20 rounded-full mx-4"></div>
                  <Link to="/" className="flex items-center space-x-2 text-white/90 hover:text-white z-40 transition-colors cursor-pointer">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <DetailCard
              link="/datamanagement/newdata"
              title="New Data"
              color="from-amber-400 to-orange-500"
              description="Add and upload new data to the system. Integrate new data sources and manage incoming information streams."
              imageSrc="../src/images/new_data.png"
              icon="upload"
            />

            <DetailCard
              link="/datamanagement/existingdata"
              title="Existing Data"
              color="from-orange-400 to-red-500"
              description="View, edit and manage your existing data. Analyze historical data and generate insights from your database."
              imageSrc="../src/images/data_management.png"
              icon="database"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300">
              <div className="p-3 bg-orange-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Data History</h3>
              <p className="text-gray-600">Access and analyze historical data with comprehensive timeline views.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300">
              <div className="p-3 bg-red-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Data Reports</h3>
              <p className="text-gray-600">Generate insightful reports and export data in multiple formats.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300">
              <div className="p-3 bg-amber-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Data Security</h3>
              <p className="text-gray-600">Implement robust security measures to protect your valuable data.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagementPage;