import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authAtom } from '../../../../atoms/authAtom';
import SignOut from '../../../../services/SignOutButton';

interface ProcessMonitoringHeaderProps {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
}

const ProcessMonitoringHeader = ({ searchTerm, setSearchTerm }: ProcessMonitoringHeaderProps) => {
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
    <div className="relative z-10">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl shadow-lg overflow-hidden mb-6">
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

                <h1 className="text-3xl font-bold text-white">Process Monitoring</h1>
                <div className="h-8 w-1 bg-white/20 rounded-full mx-4"></div>
                <Link to="/" className="flex items-center space-x-2 text-white/90 z-20 hover:text-white transition-colors cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Dashboard</span>
                </Link>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-white/90 text-xl flex items-center">
                  <span className="mr-2">{greeting},</span>
                  <span className="font-semibold">{user.user.name.split(" ")[0]}</span>
                </div>
                <div className="text-white text-2xl">
                  <SignOut />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-md overflow-hidden">
          <div className="flex justify-between  items-center px-6 py-3">
            <div className="flex gap-6 items-center text-white">
              <span className="text-lg font-medium cursor-pointer">XYZ Private Limited - Rajkot</span>
            </div>

            {/* Search Bar */}
            <div className=" relative">
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="w-full md:w-96 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute right-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessMonitoringHeader;