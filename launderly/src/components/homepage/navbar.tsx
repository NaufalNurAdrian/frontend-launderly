"use client";

import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className="navbar bg-cyan-400 sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle"
            onClick={toggleDropdown}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          {isDropdownOpen && (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-cyan-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link href="#About" onClick={closeDropdown}>
                  About us
                </Link>
              </li>
              <li>
                <Link href="#WhyUs" onClick={closeDropdown}>
                  Why Launderly?
                </Link>
              </li>
              <li>
                <Link href="#Services" onClick={closeDropdown}>
                  Our Services
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">Launderly</a>
      </div>
      <div className="navbar-end">
        <button className="btn btn-primary">
          <Link href="/sign-in">Order Now!</Link>
        </button>
      </div>
    </div>
  );
}
