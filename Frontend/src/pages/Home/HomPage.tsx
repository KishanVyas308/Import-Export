import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import DetailCard from "../components/DetailCard";
import SignOut from "../../services/SignOutButton";
import { useRecoilValue } from "recoil";
import { authAtom, Role } from "../../atoms/authAtom";
import UserAndExpoersEnterPopUp from "../components/UserAndExpoersEnterPopUp";

const HomePage: React.FC = () => {
  const user = useRecoilValue(authAtom);
  const [open, setOpen] = useState(false);
  const [greeting, setGreeting] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-4000"></div>
        
        {/* Curved lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 Q300,150 600,100 T1200,100" fill="none" stroke="rgba(34, 197, 94, 0.05)" strokeWidth="3" />
          <path d="M0,300 Q300,350 600,300 T1200,300" fill="none" stroke="rgba(34, 197, 94, 0.03)" strokeWidth="2" />
          <path d="M0,500 Q300,550 600,500 T1200,500" fill="none" stroke="rgba(34, 197, 94, 0.02)" strokeWidth="1" />
        </svg>
      </div>

      <UserAndExpoersEnterPopUp open={open} handleClose={handleClose} />
      
      <div className="relative z-10">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg overflow-hidden mb-10">
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
                  <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                  <div className="h-8 w-1 bg-white/20 rounded-full mx-4"></div>
                  <span className="text-white/90 text-xl">{greeting}, <span className="font-semibold">{user.user.name.split(" ")[0]}</span></span>
                </div>
                
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={() => {
                      user.user.role === Role.ADMIN ? handleClickOpen() : alert("You are not authorized")
                    }}
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 z-50 rounded-lg  transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Manage Users</span>
                  </button>
                  
                  <div>
                    <SignOut />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <DetailCard
              link="/admin"
              title="Process Monitoring"
              color="from-amber-400 to-orange-500"
              description="Track, measure and monitor entire process, purchase to dispatch and from production to management level."
              imageSrc="../src/images/process_monitoring.png"
              icon="chart"
            />

            <DetailCard
              link="/datamanagement"
              title="Data Management"
              color="from-orange-400 to-red-500"
              description="Connect, and manage the data collected from systems, sensors, machines and people like never before."
              imageSrc="../src/images/data_management.png"
              icon="database"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300">
              <div className="p-3 bg-green-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Real-time Analytics</h3>
              <p className="text-gray-600">Monitor your industrial processes in real-time with advanced analytics.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300">
              <div className="p-3 bg-blue-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Increased Efficiency</h3>
              <p className="text-gray-600">Boost your manufacturing efficiency with smart IoT solutions.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300">
              <div className="p-3 bg-purple-100 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Data-Driven Decisions</h3>
              <p className="text-gray-600">Make informed decisions with comprehensive data analytics.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;