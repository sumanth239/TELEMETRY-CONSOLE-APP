import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Header/Header";
import Sidebar from "../Components/SideBar/SideBar";

const Layout: React.FC = () => {
    return (
        <>
        <Sidebar />
            <Header />
            <div className="content" >
                <Outlet />  {/* This is where the routed component will be rendered */}
            </div>
        </>
    );
};

export default Layout;
