import React from "react";
import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";

const BlogEditor = () => {
  return (
    <nav className="navbar">
      <Link to={"/"} className="w-10 flex-none">
        <img src={logo} className="w-full" />
      </Link>

      <p className=" max-md:hidden text-black line-clamp-1 w-full">New Blog</p>

      <div className="flex ml-auto gap-4">
        <button className="btn-dark py-2">Publish</button>
        <button className="btn-light py-2">Save Draft</button>
      </div>
    </nav>
  );
};

export default BlogEditor;
