import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import DetailCard from "../../components/DetailCard";
import SignOut from "../../../services/SignOutButton";
import { useRecoilValue } from "recoil";
import { authAtom, Role } from "../../../atoms/authAtom";
import UserAndExpoersEnterPopUp from "../../components/UserAndExpoersEnterPopUp";

const DgftHomePage: React.FC = () => {
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
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob"></div>
        <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-blob animation-delay-4000"></div>
        
        {/* Curved lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 Q300,150 600,100 T1200,100" fill="none" stroke="rgba(34, 197, 94, 0.05)" strokeWidth="3" />
          <path d="M0,300 Q300,350 600,300 T1200,300" fill="none" stroke="rgba(34, 197, 94, 0.03)" strokeWidth="2" />
          <path d="M0,500 Q300,550 600,500 T1200,500" fill="none" stroke="rgba(34, 197, 94, 0.02)" strokeWidth="1" />
        </svg>
      </div>
      
      <div className="relative z-10">
        {/* Header component */}
        <Header />

        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                  <h1 className="text-3xl font-bold text-white">GST Dashboard</h1>
                  <div className="h-8 w-1 bg-white/20 rounded-full mx-4"></div>
                  <span className="text-white/90 text-xl">{greeting}, <span className="font-semibold">{user.user.name.split(" ")[0]}</span></span>
                </div>
                
                <div className="flex items-center space-x-6">
                
                  
                  <div>
                    <SignOut />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <DetailCard
              link="/dgft/admin"
              title="Monitoring"
              color="from-amber-400 to-orange-500"
              description="Track, measure and monitor entire process, purchase to dispatch and from production to management level."
              imageSrc="../src/images/process_monitoring.png"
              icon="chart"
            />

            <DetailCard
              link="/dgft/datamanagement"
              title="Data Management"
              color="from-orange-400 to-red-500"
              description="Connect, and manage the data collected from systems, sensors, machines and people like never before."
              imageSrc="../src/images/data_management.png"
              icon="database"
            />
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default DgftHomePage;