import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const ShippingBillLayout = () => {
  return (
    <div>

    <div className="flex lg:px-6 lg:py-2 px-4 py-1 flex-col text-white font-semibold text-[22px] my-4 justify-between items-center rounded-xl bg-[#63d478]">
      <div className="flex gap-8">
        <NavLink
          to={"part1"}
          className="text-white flex gap-2 hover:text-gray-100  items-center"
        >
          {" "}
          Part 1
        </NavLink>
        <NavLink
          to={"part2"}
          className="text-white flex gap-2 hover:text-gray-100  items-center"
        >
          {" "}
          Part 2
        </NavLink>
        <NavLink
          to={"part3"}
          className="text-white flex gap-2 hover:text-gray-100  items-center"
        >
          {" "}
          Part 3
        </NavLink>
        <NavLink
          to={"part4"}
          className="text-white flex gap-2 hover:text-gray-100  items-center"
        >
          {" "}
          Part 4
        </NavLink>
        <NavLink
          to={"part5"}
          className="text-white flex gap-2 hover:text-gray-100  items-center"
        >
          {" "}
          Part 5
        </NavLink>
      </div>
    </div>
    <div>

      <Outlet />
    </div>
      
    </div>
  );
};

export default ShippingBillLayout;
