//default imports
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

//style sheet imports
import "./SideBar.css";


const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const handleSignOut = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out",
      cancelButtonText: "Cancel",
      allowOutsideClick: false, // Prevent closing on outside click
      allowEscapeKey: false, // Prevent closing on escape key
      allowEnterKey: false, // Prevent closing on enter key
    }).then((result) => {
      if (result.isConfirmed) {
        // Remove the sessionStorage key
        localStorage.removeItem("sessionStorage");
        Swal.fire({
          title: "Logged Out!",
          text: "You have been logged out.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000, // Display for 3 seconds
        }).then(() => {
          // Redirect to sign-in path
          window.location.href = "/signin";
        });
      } 
    });
  };
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>

      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? <i className="bi bi-x"></i> : <i className="bi bi-list"></i>}

      </button>

      <div className="sidebar-top">
        <SidebarItem
          to="/dashboard"
          icon="bi bi-house-door-fill"
          label="Dashboard"
          isOpen={isOpen}
          isActive={location.pathname === "/dashboard"}
        />
        <SidebarItem
          to="/data-viewer"
          icon="bi bi-file-earmark-bar-graph-fill"
          label="Dataviewer"
          isOpen={isOpen}
          isActive={location.pathname === "/data-viewer"}
        />
        <SidebarItem
          to="/settings"
          icon="bi bi-gear-fill"
          label="Settings"
          isOpen={isOpen}
          isActive={location.pathname === "/settings"}
        />
      </div>

      <div className="sidebar-bottom">
        <div className={`sidebar-item logout-item`} onClick={handleSignOut}>
          <i className={`bi bi-box-arrow-right icon`}></i>
          {isOpen && <span className="label">Logout</span>}
        </div>

        <SidebarItem
          to="/help"
          icon="bi bi-question-circle-fill"
          label="Help"
          isOpen={isOpen}
          isActive={location.pathname === "/help"}
        />

      </div>
    </div>
  );
};

type SidebarItemProps = {
  to: string;
  icon: string;
  label: string;
  isOpen: boolean;
  isActive: boolean;
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  to,
  icon,
  label,
  isOpen,
  isActive,
}) => (
  <Link to={to} className={`sidebar-item ${isActive ? "active" : ""}`}>
    <i className={`bi ${icon} icon ${isActive ? "icon-active" : ""}`}></i>
    {isOpen && <span className="label">{label}</span>}
  </Link>
);

export default Sidebar;
