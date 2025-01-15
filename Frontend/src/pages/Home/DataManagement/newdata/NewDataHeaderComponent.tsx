import React from "react";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoMdArrowRoundForward } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { useRecoilValue } from "recoil";
import { authAtom } from "../../../../atoms/authAtom";
import SignOut from "../../../../services/SignOutButton";

const NewDataHeaderComponent = ({ backLink, nextLink }) => {
  const user = useRecoilValue(authAtom);
  return (
    <div className="flex lg:px-6 lg:py-2 px-4 py-1 text-white font-semibold text-[22px] my-4 justify-between items-center bg-[#63d478]">
      <div className="flex gap-8">
        <Link
          to={"/"}
          className="text-white flex gap-2 hover:text-gray-100  items-center"
        >
          {" "}
          Dashboard
        </Link>
        <div className="relative group">
        <button className="text-white flex gap-2 hover:text-gray-100 items-center">
            Data
          </button>
          <div className="absolute hidden group-hover:block text-base z-50 bg-white text-black  rounded shadow-lg">
            <Link to={"/master/client-master"} className="block px-4 py-2 hover:bg-gray-200">Client Master</Link>
            <Link to={"/master/other-detail"} className="block px-4 py-2 hover:bg-gray-200">Other Details</Link>
         </div>

        </div>
        
        <div className="relative group">
          <button className="text-white flex gap-2 hover:text-gray-100 items-center">
            Form
          </button>
          <div className="absolute text-base hidden group-hover:block bg-white text-black z-50 rounded ">
            <Link to={"/datamanagement/directexport"} className="block px-4 py-2 hover:bg-gray-200">Direct Export</Link>
            <Link to={"/datamanagement/indirectexport"} className="block px-4 py-2 hover:bg-gray-200">Indirect Export</Link>
          </div>
        </div>
        <div className="relative group">
          <button className="text-white flex gap-2 hover:text-gray-100 items-center">
            Documents List
          </button>
          <div className="absolute hidden group-hover:block text-base z-50 bg-white text-black  rounded shadow-lg">
            <Link to={"/datamanagement/epcg-license"} className="block px-4 py-2 hover:bg-gray-200">EPCG License</Link>
            <Link to={"/datamanagement/advance-license"} className="block px-4 py-2 hover:bg-gray-200">Advance License</Link>
            <Link to={"/datamanagement/newdata/part1"} className="block px-4 py-2 hover:bg-gray-200">Shipping Bill</Link>
            <Link to={"/datamanagement/invoice"} className="block px-4 py-2 hover:bg-gray-200">Invoice</Link>
            <Link to={"/datamanagement/e-invoice"} className="block px-4 py-2 hover:bg-gray-200">E - Invoice</Link>
            <Link to={"/datamanagement/ebrc"} className="block px-4 py-2 hover:bg-gray-200">E - BRC</Link>
            <Link to={"/datamanagement/e-way-bill"} className="block px-4 py-2 hover:bg-gray-200">E - Way Bill</Link>
            <Link to={"/datamanagement/subsidy"} className="block px-4 py-2 hover:bg-gray-200">Subsidy</Link>
          </div>
        </div>
      </div>
      <div className="flex gap-6 items-center">
        <Link
          to={"/datamanagement/newdata/dataanalytics"}
          className="text-white flex gap-2 hover:text-gray-100  items-center"
        >
          Analytics
        </Link>
        <div>{user.user.name.split(" ")[0]}</div>
        <div>
          <SignOut />
        </div>
      </div>
    </div>
  );
};

export default NewDataHeaderComponent;
