import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import Logo from "../imgs/logo.png";

const Navbar = () => {
  const [showVisibility, setShowVisibility] = useState(false);

  return (
    <>
      <nav className="navbar">
        <Link to={"/"} className="flex-none w-10">
          <img src={Logo} className="w-full" />
        </Link>

        <div
          className={
            "absolute bg-white w-full left-0 top-full border-b border-grey mt-0.5 p-4 px-[5vw] md:border-none md:block md:relative md:inset-0 md:w-auto md:p-0 md:show " +
            (showVisibility ? "show" : "hide")
          }
        >
          <input
            type="text"
            placeholder="Search"
            className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
          />

          <i className="fi fi-rr-search absolute right-[10%] top-1/2 -translate-y-1/2 md:pointer-events-none md:left-5 text-dark-grey text-xl"></i>
        </div>

        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          <button
            className="md:hidden h-12 w-12 bg-grey rounded-full flex items-center justify-center"
            onClick={() => setShowVisibility((value) => !value)}
          >
            <i className="fi fi-rr-search text-dark-grey text-xl"></i>
          </button>

          <Link to={"/editor"} className="hidden md:flex gap-2 link">
            <i className="fi fi-rr-file-edit"></i>
            <p>Write</p>
          </Link>

          <Link to={"/sign-in"} className="btn-dark py-2">
            Sign In
          </Link>

          <Link to={"/sign-up"} className="btn-light py-2 hidden md:block">
            Sign Up
          </Link>
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Navbar;
