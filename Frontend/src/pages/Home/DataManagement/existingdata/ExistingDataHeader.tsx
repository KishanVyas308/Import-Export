import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import { useRecoilValue } from "recoil";
import { authAtom } from "../../../../atoms/authAtom";
import SignOut from "../../../../services/SignOutButton";

const ExistingDataHeader = ({ backLink, nextLink }) => {
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
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative">
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
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              <div className="flex flex-wrap justify-between items-center p-6">
                <div className="flex items-center space-x-2">
                  <h1 className="text-3xl font-bold text-white">Existing Data</h1>
                  <div className="h-8 w-1 bg-white/20 rounded-full mx-4"></div>
                  <Link to="/" className="flex items-center space-x-2 text-white/90 z-20 hover:text-white transition-colors cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Dashboard</span>
                  </Link>

                  {backLink && (
                    <Link to={backLink} className="flex items-center space-x-2 text-white/90 z-20 hover:text-white transition-colors cursor-pointer ml-4">
                      <IoMdArrowRoundBack className="h-5 w-5" />
                      <span>Back</span>
                    </Link>
                  )}
                  
                  {nextLink && (
                    <Link to={nextLink} className="flex items-center space-x-2 text-white/90 z-20 hover:text-white transition-colors cursor-pointer">
                      <span>Next</span>
                      <IoMdArrowRoundForward className="h-5 w-5" />
                    </Link>
                  )}
                </div>
                
                <div className="flex items-center space-x-6">
                  <span className="text-white/90 text-xl">{greeting}, <span className="font-semibold">{user?.user?.name?.split(" ")[0] || "User"}</span></span>
                  <div>
                    <SignOut />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExistingDataHeader;