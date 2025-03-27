import React ,{useState} from "react";
import "./TabsBar.css";
import { Link } from "react-router-dom";

const ActiveTabsBar: React.FC = () => {

    //states
    const [activeTab,setActiveTab] = useState("dashboard"); //to handle the active tab 

    return (
        <>
            <ul className="active-bars-container">
                <li> 
                    <Link to="/dashboard"> 
                        <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => (setActiveTab("dashboard"))}>Dashboard</button>
                    </Link>
                </li>

                <li>
                    <Link to="/data-viewer">
                        <button className={activeTab === "dataViewer" ? "active" : ""} onClick={() => (setActiveTab("dataViewer"))}>Data Viewer</button>
                    </Link>
                    
                </li>
                <li>
                    <Link to="/title1">
                        <button className={activeTab === "title1" ? "active" : ""} onClick={() => (setActiveTab("title1"))}>Title1</button>
                    </Link>
                    
                </li>
                <li>
                    <Link to="/title2">
                        <button className={activeTab === "title2" ? "active" : ""} onClick={() => (setActiveTab("title2"))}>Title2</button>
                    </Link>
                    
                </li>
            </ul>
        </>
    )
};
export default ActiveTabsBar;