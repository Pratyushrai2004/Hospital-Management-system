import React, { useState } from "react";
import "../layout.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate(); // Correct use of useNavigate hook

  const userMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-4-line",
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: "ri-file-list-3-line",
    },
    {
      name: "Apply Doctor",
      path: "/apply-doctor",
      icon: "ri-hospital-line",
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "ri-account-box-line",
    },
  ];

  const adminMenu = [
    {
      name: "Home",
      path: "/",
      icon: "ri-home-4-line",
    },
    {
      name: "Users",
      path: "/users",
      icon: "ri-user-line",
    },
    {
      name: "Doctors",
      path: "/doctors",
      icon: "ri-nurse-line",
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "ri-account-box-line",
    },
  ];

  const menuToBeRendered = user?.isAdmin ? adminMenu : userMenu; // check this here you can change the admin and user 
  

  return (
    <div className="main">
      <div className="d-flex layout">
        <div className={`${collapsed ? "collapsed-sidebar" : "sidebar"}`}>
          <div className="close">
            {collapsed ? (
              <i
                className="ri-menu-2-fill close-icon"
                onClick={() => setCollapsed(false)}
              ></i>
            ) : (
              <i
                className="ri-close-circle-line close-icon"
                onClick={() => setCollapsed(true)}
              ></i>
            )}
          </div>
          <div className="sidebar-header">
            {collapsed ? (
              <div className="logo-container">
                <h1>PR</h1>
              </div>
            ) : (
              <h1>PR Hospital</h1>
            )}
          </div>
          <div className="menu">
            {menuToBeRendered.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <Link
                  key={menu.path}
                  to={menu.path}
                  className={`d-flex menu-item ${
                    isActive ? "active-menu-item" : ""
                  }`}
                >
                  <i className={menu.icon}></i>
                  {!collapsed && <span>{menu.name}</span>}
                </Link>
              );
            })}
            <div
              className={`d-flex menu-item`}
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
            >
              <i className="ri-logout-box-line"></i>
              {!collapsed && <span>Logout</span>}
            </div>
          </div>
        </div>
        <div className="content">
          <div className="header d-flex justify-content-between align-items-center">
            <Link className="anchor" to="/profile">
              {user?.fname} {user?.lname}
            </Link>
            <i className="ri-notification-3-line noti"></i>
          </div>
          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
