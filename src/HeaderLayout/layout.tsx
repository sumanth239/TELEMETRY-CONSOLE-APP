import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Header/Header";
import ActiveTabsBar from "../Components/TabsBar/TabsBar";

const Layout: React.FC = () => {
    return (
        <>
            <Header />
            {/* <ActiveTabsBar /> */}
            <div className="content" style={{"backgroundColor":"white"}}>
                <Outlet />  {/* This is where the routed component will be rendered */}
            </div>
        </>
    );
};

export default Layout;
