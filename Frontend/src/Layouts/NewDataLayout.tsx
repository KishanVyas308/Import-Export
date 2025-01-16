import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useRecoilValue } from 'recoil';
import { authAtom } from '../atoms/authAtom';
import SignOut from '../services/SignOutButton';


const NewDataLayout = () => {
  const user = useRecoilValue(authAtom);
  return (
    <div className="bg-[#e6e7e9] w-full h-full min-h-screen">
      <div className="container mx-auto px-4 py-8 ">



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
              <div className="absolute hidden group-hover:block text-base z-50 w-40 bg-white text-black  rounded shadow-lg">
                <NavLink to={"data/client-master"} className="block px-4 py-2 hover:bg-gray-200">Client Master</NavLink>
                <NavLink to={"data/other-detail"} className="block px-4 py-2 hover:bg-gray-200">Other Details</NavLink>
              </div>

            </div>

            <div className="relative group">
              <button className="text-white flex gap-2 hover:text-gray-100 items-center">
                Form
              </button>
              <div className="absolute text-base hidden group-hover:block w-40 bg-white text-black z-50 rounded ">
                <NavLink to={"form/direct-export"} className="block px-4 py-2 hover:bg-gray-200">Direct Export</NavLink>
                <NavLink to={"form/indirect-export"} className="block px-4 py-2 hover:bg-gray-200">Indirect Export</NavLink>
              </div>
            </div>
            <div className="relative group">
              <button className="text-white flex gap-2 hover:text-gray-100 items-center">
                Documents
              </button>
              <div className="absolute hidden group-hover:block text-base z-50 w-40 bg-white text-black  rounded shadow-lg">
                <NavLink to={"documents/epcg-lic"} className="block px-4 py-2 hover:bg-gray-200">EPCG License</NavLink>
                <NavLink to={"documents/advance-lic"} className="block px-4 py-2 hover:bg-gray-200">Advance License</NavLink>
                <NavLink to={"documents/shipping-bill/part1"} className="block px-4 py-2 hover:bg-gray-200">Shipping Bill</NavLink>
                <NavLink to={"documents/invoice"} className="block px-4 py-2 hover:bg-gray-200">Invoice</NavLink>
                <NavLink to={"documents/e-invoice"} className="block px-4 py-2 hover:bg-gray-200">E - Invoice</NavLink>
                <NavLink to={"documents/e-brc"} className="block px-4 py-2 hover:bg-gray-200">E - BRC</NavLink>
                <NavLink to={"documents/e-way-bill"} className="block px-4 py-2 hover:bg-gray-200">E - Way Bill</NavLink>
                <NavLink to={"documents/subsidy"} className="block px-4 py-2 hover:bg-gray-200">Subsidy</NavLink>
              </div>
            </div>
          </div>
          <div className="flex gap-6 items-center">
            <div className="relative group">
              <button className="text-white flex gap-2 hover:text-gray-100 items-center">
                Report
              </button>
                <div className="absolute hidden group-hover:block text-base z-50 bg-white w-40 text-black  rounded shadow-lg">
                <NavLink to={"report/epcg-lic-summary"} className="block px-4 py-2 hover:bg-gray-200">EPCG License Summary</NavLink>
                <NavLink to={"report/advance-lic-summary"} className="block px-4 py-2 hover:bg-gray-200">Advance License Summary</NavLink>
                <NavLink to={"report/party-wise-epcg-lic-summary"} className="block px-4 py-2 hover:bg-gray-200">Party-wise EPCG License Summary</NavLink>
                <NavLink to={"report/party-wise-advance-lic-summary"} className="block px-4 py-2 hover:bg-gray-200">Party-wise Advance License Summary</NavLink>
                </div>
            </div>
           
            <div>{user.user.name.split(" ")[0]}</div>
            <div>
              <SignOut />
            </div>
          </div>
        </div>


        <Outlet />

      </div>
    </div>
  )
}

export default NewDataLayout
