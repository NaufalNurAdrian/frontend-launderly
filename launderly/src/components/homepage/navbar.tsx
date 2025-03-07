"use client";

import Link from "next/link";
import { useState } from "react";
import useSession from "@/hooks/useSession";
import { PersonStanding } from "lucide-react";

export function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, isAuth, setIsAuth, setUser } = useSession();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuth(false);
    setUser(null);
    window.location.href = "/sign-in"; 
  };

  return (
    <div className="navbar bg-cyan-500 bg-opacity-90 backdrop-blur-md sticky top-0 z-50 md:px-20 lg:px-32 xl:px-44 text-black shadow-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle hover:bg-cyan-200 transition-all duration-300"
            onClick={toggleDropdown}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
          {isDropdownOpen && (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-cyan-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-md"
            >
              <li>
                <Link
                  href="#WhoWeAre"
                  onClick={closeDropdown}
                  className="hover:text-cyan-600"
                >
                  Who We Are
                </Link>
              </li>
              <li>
                <Link
                  href="#Services"
                  onClick={closeDropdown}
                  className="hover:text-cyan-600"
                >
                  Our Services
                </Link>
              </li>
              <li>
                <Link
                  href="#Quotes"
                  onClick={closeDropdown}
                  className="hover:text-cyan-600"
                >
                  Quotes?
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>

      <div className="navbar-center">
        <Link href="/">
          <p className="text-3xl font-bold tracking-wide drop-shadow-lg">
            Launderly
          </p>
        </Link>
      </div>

      <div className="navbar-end flex items-center gap-4">
        <Link href="/ourOutlet">
          <button className="btn btn-ghost text-xl font-bold tracking-wide text-white">
            Our Outlet
          </button>
        </Link>

        {isAuth && user ? (
          <div className="relative">
            <button
              className="flex items-center gap-2"
              onClick={toggleDropdown}
            >
              <PersonStanding />
              <span className="text-black font-semibold">{user.fullName}</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg">
                <ul className="py-2">
                  <li>
                    <Link
                      href={user.role == "CUSTOMER" ? "/dashboardCustomer" : user.role == "DRIVER" || "WORKER" ? "/attendance" : "/dashboard"}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                      onClick={closeDropdown}
                    >
                      {user.role == "DRIVER" || "WORKER" ? "Attendance" : "Dashboard"}
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <Link href="/sign-in">
            <button className="btn bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 transition-all duration-300">
              Sign in
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
