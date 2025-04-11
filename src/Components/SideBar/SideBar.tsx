import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SideBar.css";
import logo from "../../assets/logo.png";


const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>

      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? <i className="bi bi-x"></i> : <i className="bi bi-list"></i>}
       
      </button>
      {/* {isOpen && <div className="logo-container">
                <img id="astro-logo-image" src={logo} alt="AstroLink Logo" />
                <p id="logo-text">AstroLink 10G ODT</p>
            </div>} */}

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
          to="/"
          icon="bi bi-gear-fill"
          label="Settings"
          isOpen={isOpen}
          isActive={location.pathname === "/title1"}
        />
      </div>

      <div className="sidebar-bottom">
      <SidebarItem
          to="/"
          icon="bi-box-arrow-right"
          label="Logout"
          isOpen={isOpen}
          isActive={location.pathname === "/logout"}
        />
        <SidebarItem
          to="/"
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
