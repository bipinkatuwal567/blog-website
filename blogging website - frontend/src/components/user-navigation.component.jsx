import React, { useContext, useState } from "react";
import AnimationPage from "../common/page-animation";
import { Link } from "react-router-dom";
import { userContext } from "../App";
import { removeSession } from "../common/session";

const UserNavigation = () => {
  const {
    authState: { username },
    setAuthState,
  } = useContext(userContext);

  const handleSignOut = () => {
    removeSession("user");
    setAuthState({ access_token: null });
  };
  return (
    <AnimationPage
      transition={{ duration: 0.2 }}
      className="z-50 absolute right-0"
    >
      <div className="absolute right-0 rounded-md border bg-white border-black/10 shadow overflow-hidden duration-200 w-60">
        <Link to={"/editor"} className="flex gap-2 pl-8 py-4 link">
          <i className="fi fi-rr-file-edit"></i>
          <p>Write</p>
        </Link>

        <Link to={`/user/${username}`} className="flex gap-2 pl-8 py-4 link">
          <i className="fi fi-rr-user"></i>
          <p>Profile</p>
        </Link>

        <Link to={"/dashboard/blogs"} className="flex gap-2 pl-8 py-4 link">
          <i className="fi fi-rr-dashboard"></i>
          <p>Dashboard</p>
        </Link>

        <Link
          to={"/settings/edit-profile"}
          className="flex gap-2 pl-8 py-4 link"
        >
          <i className="fi fi-rr-settings"></i>
          <p>Settings</p>
        </Link>

        <button
          className="flex gap-2 pl-8 py-4 link w-full border-t border-black/20"
          onClick={handleSignOut}
        >
          <i className="fi fi-rr-sign-out-alt font-semibold text-black"></i>
          <p className=" text-black font-semibold">Sign out</p>
        </button>
      </div>
    </AnimationPage>
  );
};

export default UserNavigation;
