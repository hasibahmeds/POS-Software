//deepseek
import { signOut } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsFillCartCheckFill, BsFillCartPlusFill } from "react-icons/bs";
import { FaHome, FaProductHunt, FaBars, FaTimes } from "react-icons/fa";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import { RiArrowGoBackLine } from "react-icons/ri";
import { GoSignOut } from "react-icons/go";
import { Link, Outlet, useLocation } from "react-router-dom";
// import logo from "../../../Images/Cargo logo/logo.png";
import auth from "../../../firebase.init";
import "../../CSS/DashboardStyle.css";

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [authUser] = useAuthState(auth);
  const [users, setUsers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (authUser?.email) {
      fetch(`http://localhost:5000/user/${authUser?.email}`)
        .then((res) => res.json())
        .then((data) => setUsers(data));
    }
  }, [authUser?.email]);

  // Combined menu items including Sign Out
  const menuItems = [
    // {
    //   id: 1,
    //   name: "Home",
    //   path: "/",
    //   icon: <FaHome className="text-2xl" />,
    //   disabled: false,
    //   isSignOut: false,
    // },
    {
      id: 2,
      name: "Selling",
      path: "/qrCode",
      icon: <BsFillCartPlusFill className="text-2xl" />,
      isSignOut: false,
    },
    {
      id: 3,
      name: "Add Product",
      path: "/addProduct",
      icon: <MdOutlineAddToPhotos className="text-2xl" />,
      isSignOut: false,
    },
    {
      id: 4,
      name: "Products",
      path: "/allProduct",
      icon: <FaProductHunt className="text-2xl" />,
      isSignOut: false,
    },
    {
      id: 5,
      name: "Sales",
      path: "/buyProduct",
      icon: <BsFillCartCheckFill className="text-2xl" />,
      isSignOut: false,
    },
    {
      id: 6,
      name: "Updates",
      path: "/updateProduct",
      icon: <RxUpdate className="text-2xl" />,
      isSignOut: false,
    },
    {
      id: 7,
      name: "Back",
      path: "https://en.wikipedia.org/wiki/Point_of_sale",
      icon: <RiArrowGoBackLine className="text-2xl" />,
      isSignOut: false,
    },
    {
      id: 8,
      name: "Sign Out",
      path: "#",
      icon: <GoSignOut className="text-2xl" />,
      isSignOut: true,
      action: () => signOut(auth),
    },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Handle menu item click
  const handleMenuItemClick = (item) => {
    if (item.isSignOut) {
      item.action();
    }
    closeSidebar();
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {/* Mobile Header with Hamburger Menu */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-zinc-800 shadow-lg">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={toggleSidebar}
            className="text-white p-2 rounded-lg hover:bg-zinc-700 transition-colors"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>

          <div className="flex items-center space-x-3">
            <img
              className="h-10 w-10  object-cover flex-shrink-0"
              src={users[0]?.img || "https://i.ibb.co.com/ZPXrmqw/logo-1.png"}
              alt="Profile"
            />
            {/* <div className="hidden sm:block max-w-[120px]">
              <span className="font-semibold truncate block">
                {user?.displayName || "Admin"}
              </span>
              <span className="text-xs text-gray-400 truncate block">
                {user?.email}
              </span>
            </div> */}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed top-16 left-0 h-full w-64 bg-zinc-800 z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Profile Section with word wrapping */}
          <div className="p-6 border-b border-zinc-700">
            <div className="flex items-start space-x-3">
              {/* <img
                className="h-12 w-12 object-cover flex-shrink-0 mt-1"
                src={users[0]?.img || logo}
                alt="Profile"
              /> */}
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-lg break-words">
                  {user?.displayName || "Admin"}
                </h3>
                <p className="text-sm text-gray-400 break-all word-wrap-email">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Combined Navigation Menu with Sign Out */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              if (item.isSignOut) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item)}
                    className="flex items-center space-x-3 p-3 w-full text-left rounded-lg hover:bg-red-900 text-gray-300 hover:text-white transition-colors"
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => handleMenuItemClick(item)}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "bg-zinc-700 text-white"
                      : "hover:bg-zinc-700 text-gray-300"
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="flex min-h-screen pt-16 lg:pt-0">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:w-64 bg-zinc-800 border-r border-zinc-700">
          {/* Profile Section with word wrapping */}
          <div className="p-6 border-b border-zinc-700">
            <div className="flex items-start space-x-3">
              <img
                className="h-12 w-13 object-cover flex-shrink-0 mt-3"
                src={users[0]?.img || "https://i.ibb.co.com/ZPXrmqw/logo-1.png"}
                alt="Profile"
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-lg break-words">
                  {user?.displayName || "Admin"}
                </h3>
                <p className="text-sm text-gray-400 break-all word-wrap-email">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Combined Navigation Menu with Sign Out */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              if (item.isSignOut) {
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="flex items-center space-x-3 p-3 w-full text-left rounded-lg hover:bg-red-900 text-gray-300 hover:text-white transition-colors mt-auto"
                  >
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "bg-zinc-700 text-white"
                      : "hover:bg-zinc-700 text-gray-300"
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
