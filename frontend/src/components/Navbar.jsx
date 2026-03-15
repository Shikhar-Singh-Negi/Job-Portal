import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";

const Navbar = () => {
  const navigate = useNavigate();

  const {
    setShowRecruiterLogin,
    setShowUserLogin,
    userData,
    userToken,
    setUserData,
    setUserToken,
  } = useContext(AppContext);

  const logout = () => {
    setUserToken(null);
    setUserData(null);
    localStorage.removeItem("userToken");
    navigate("/");
  };

  return (
    <div className="shadow py-4">
      <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">
        <img
          onClick={() => navigate("/")}
          className="cursor-pointer"
          src={assets.logo}
          alt="logo"
        />
        {userToken && userData ? (
          <div className="flex items-center gap-3">
            <Link to={"/applications"}>Applied Jobs</Link>
            <p>|</p>
            <p className="max-sm:hidden">Hi, {userData.name}</p>
            <div className="relative group">
              <img
                className="w-8 h-8 rounded-full border"
                src={userData.image || assets.profile_img}
                alt=""
              />
              <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black pt-12">
                <ul className="list-none m-0 p-2 bg-white border rounded shadow text-sm">
                  <li
                    onClick={logout}
                    className="py-1 px-2 cursor-pointer pr-10"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 max-sm:text-xs">
            <button
              onClick={() => setShowRecruiterLogin(true)}
              className="text-gray-600"
            >
              Recruiter Login
            </button>
            <button
              onClick={() => setShowUserLogin(true)}
              className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full "
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
