import React from "react";
import { useCookies } from "react-cookie";
import { useRecoilState } from "recoil";
import { authAtom } from "../atoms/authAtom";
import { FaPowerOff } from "react-icons/fa";

const SignOut = () => {
  const [cookies, setCookie] = useCookies(["token"]);
  const [auth, setAuth] = useRecoilState<any>(authAtom);

  const signOutHandle = () => {
    setAuth({
      isAuthenticated: false,
      user: {
        id: 0,
        email: "",
        name: "",
      },
    });
    setCookie("token", "");
  };
  
  return (
    <button 
      onClick={signOutHandle}
      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
      title="Sign Out"
    >
      <FaPowerOff className="text-white" />
      <span className="font-medium">Sign Out</span>
    </button>
  );
};

export default SignOut;