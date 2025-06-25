import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { authAtom } from "../../atoms/authAtom";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import Loading from "../components/Loading";
import { BACKEND_URL } from "../../Globle";
import { jwtDecode } from "jwt-decode";

export interface User {
  id: number;
  email: string;
  name: string;
}

const Signin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useRecoilState(authAtom);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["token"]);

  const validation = () => {
    if (username === "" || password === "") {
      alert("Please fill all the fields");
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validation()) return;

    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/login`, {
        email: username,
        password: password,
      });
      
      if (res.data.token) {
        const user : any = jwtDecode<User>(res.data.token);
        user.name = user.name.charAt(0).toUpperCase() + user.name.slice(1);
        
        setAuth({
          isAuthenticated: true,
          user: user,
        });
        setCookie("token", res.data.token, { 
          path: "/",
          maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined // 30 days if remember me is checked
        });
        navigate("/");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cookies.token && !auth.isAuthenticated) {
      const user : any= jwtDecode<User>(cookies.token);
      setAuth({
        isAuthenticated: true,
        user: user,
      });
      navigate("/");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex relative overflow-hidden">
      {loading && <Loading />}
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        
        {/* Curved lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 Q300,150 600,100 T1200,100" fill="none" stroke="rgba(34, 197, 94, 0.1)" strokeWidth="3" />
          <path d="M0,200 Q300,250 600,200 T1200,200" fill="none" stroke="rgba(34, 197, 94, 0.07)" strokeWidth="2" />
          <path d="M0,300 Q300,350 600,300 T1200,300" fill="none" stroke="rgba(34, 197, 94, 0.05)" strokeWidth="1" />
        </svg>
      </div>
      
      {/* Left Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-12 z-10">
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-green-200 filter blur-md rounded-full opacity-30"></div>
          <img
            src="https://prikriti.in/images/logo.png"
            alt="Prikriti GROUP"
            className="w-52 h-52 object-contain relative z-10"
          />
        </div>
        
        <h1 className="text-5xl font-bold mb-4 text-gray-800">
          Welcome!!
        </h1>
        
        <p className="text-gray-700 text-center max-w-md mb-8 leading-relaxed">
          Innovating sustainable solutions for a greener tomorrow with Prikriti GROUP. 
          Our eco-conscious approaches help businesses thrive while preserving our natural environment.
        </p>
    
      </div>

      {/* Right Section - Login Form */}
      <div className="w-[520px] bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] p-16 flex flex-col justify-center relative z-10 shadow-2xl">
        <div className="absolute top-0 right-0 bottom-0 left-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"></div>
        
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
          <p className="text-gray-400">Welcome back! Please enter your details</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                type="email"
                className="block w-full pl-10 pr-3 py-3 border border-gray-700 bg-gray-800/50  rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-500 text-gray-100 focus:outline-none transition-colors"
                placeholder="Enter your email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-white">Password</label>
              <button 
                type="button" 
                className="text-sm text-green-500 hover:text-green-400 transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                className="block w-full pl-10 pr-3 py-3 border border-gray-700 bg-gray-800/50  rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-500 text-gray-100 focus:outline-none transition-colors"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-green-500 focus:ring-offset-gray-800"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="ml-2 text-sm text-gray-400">Remember me for 30 days</span>
            </label>
          </div>

          <button 
            type="submit" 
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <a href="#" className="text-green-500 hover:text-green-400 font-medium">
              Request Access
            </a>
          </p>
        </div>

        <footer className="mt-12 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Prikriti GROUP LLP. All rights reserved.
        </footer>
        
        {/* Animated accent element */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div>
      </div>
    </div>
  );
};

export default Signin;