import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../Components/Header/Header";
import Sidebar from "../Components/SideBar/SideBar";

const Layout: React.FC = () => {
  const location = useLocation();
  const hideForRoutes = ["/signin", "/signup"];

  const shouldHideLayout = hideForRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideLayout && <Sidebar />}
      {!shouldHideLayout && <Header />}
      <div className="content">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;

