import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Import icons

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu state

  // Check login state on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    setIsLoggedIn(false);
    setIsMenuOpen(false); // Close menu on logout
    navigate("/login"); // Redirect to login
  };

  // Function to determine active class
  const getLinkClass = (path) =>
    location.pathname === path
      ? "text-blue-700 md:dark:text-blue-500"
      : "text-gray-900 dark:text-white md:hover:text-blue-700 md:dark:hover:text-blue-500";

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            ReadRite
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-800 dark:text-white p-2 rounded-md focus:outline-none"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:block">
          <ul className="flex space-x-8 font-medium">
            <li>
              <Link
                to="/"
                className={`block py-2 px-3 rounded-sm ${getLinkClass("/")}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/recommendations"
                className={`block py-2 px-3 rounded-sm ${getLinkClass(
                  "/recommendations"
                )}`}
              >
                Recommendations
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className={`block py-2 px-3 rounded-sm ${getLinkClass(
                    "/login"
                  )}`}
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700">
          <ul className="flex flex-col space-y-2 p-4">
            <li>
              <Link
                to="/"
                className="block py-2 px-3 rounded-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/recommendations"
                className="block py-2 px-3 rounded-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Recommendations
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition w-full"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block py-2 px-3 rounded-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Header;
