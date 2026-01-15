import { useContext } from 'react';
import { Link, useLocation } from "react-router";
import CursorContext from "../../context/cursor/CursorContext";
import ThemeContext from '../../context/theme/ThemeContext';

export default function SideNavbar() {

    const location = useLocation();
    
    const {handleCursorEnter, handleCursorLeave} = useContext(CursorContext);
    const {theme} = useContext(ThemeContext);
  
    return (
        <div style={{margin: "24px", padding: "12px", borderRadius: "6px", boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.15)", backgroundColor: `${theme==="light"?"white":"#212529"}`, border: `${theme==="light"?"1px solid #bebebe":"1px solid #424549"}`}}>
            <div className="d-flex align-items-center gap-2" style={{borderBottom: `${theme==="light"?"1px solid #bebebe":"1px solid #424549"}`, paddingBottom: "12px", marginBottom: "12px"}}>
                <img src={`${theme==="light"?"logo.png":"logo2.png"}`} style={{height: "24px", width: "24px"}}/>
                <h5 style={{margin: "0px", color: `${theme==="light"?"black":"white"}`}}>Aki Notes</h5>
            </div>
                
            <div>
                <Link to="/" className={`navbar-link${theme==="light"?"":"-dark"}${location.pathname==="/"? "-active": ""}`} onClick={(e)=>{if(!localStorage.getItem("token")){e.preventDefault();}}} onMouseEnter={()=>{if(location.pathname==="/"){handleCursorEnter();}}} onMouseLeave={()=>{if(location.pathname==="/"){handleCursorLeave();}}}>
                    <div className={`navbar-link${theme==="light"?"":"-dark"}-div${location.pathname==="/"? "-active": ""}`}>
                        Home
                    </div>
                </Link>
                <Link to="/notes" className={`navbar-link${theme==="light"?"":"-dark"}${location.pathname==="/notes"? "-active": ""}`} onClick={(e)=>{if(!localStorage.getItem("token")){e.preventDefault();}}} onMouseEnter={()=>{if(location.pathname==="/notes"){handleCursorEnter();}}} onMouseLeave={()=>{if(location.pathname==="/notes"){handleCursorLeave();}}}>
                    <div className={`navbar-link${theme==="light"?"":"-dark"}-div${location.pathname==="/notes"? "-active": ""}`}>
                        Notes
                    </div>
                </Link>
                <Link to="/todolists" className={`navbar-link${theme==="light"?"":"-dark"}${location.pathname==="/todolists"? "-active": ""}`} onClick={(e)=>{if(!localStorage.getItem("token")){e.preventDefault();}}} onMouseEnter={()=>{if(location.pathname==="/todolists"){handleCursorEnter();}}} onMouseLeave={()=>{if(location.pathname==="/todolists"){handleCursorLeave();}}}>
                    <div className={`navbar-link${theme==="light"?"":"-dark"}-div${location.pathname==="/todolists"? "-active": ""}`}>
                        To-Do Lists
                    </div>
                </Link>
                <Link to="/bulletjournal" className={`navbar-link${theme==="light"?"":"-dark"}${location.pathname==="/bulletjournal"? "-active": ""}`} onClick={(e)=>{if(!localStorage.getItem("token")){e.preventDefault();}}} onMouseEnter={()=>{if(location.pathname==="/bulletjournal"){handleCursorEnter();}}} onMouseLeave={()=>{if(location.pathname==="/bulletjournal"){handleCursorLeave();}}}>
                    <div className={`navbar-link${theme==="light"?"":"-dark"}-div${location.pathname==="/bulletjournal"? "-active": ""}`}>
                        Bullet Journal
                    </div>
                </Link>
                <Link to="/tracker" className={`navbar-link${theme==="light"?"":"-dark"}${location.pathname==="/tracker"? "-active": ""}`} onClick={(e)=>{if(!localStorage.getItem("token")){e.preventDefault();}}} onMouseEnter={()=>{if(location.pathname==="/tracker"){handleCursorEnter();}}} onMouseLeave={()=>{if(location.pathname==="/tracker"){handleCursorLeave();}}}>
                    <div className={`navbar-link${theme==="light"?"":"-dark"}-div${location.pathname==="/tracker"? "-active": ""}`}>
                        Tracker
                    </div>
                </Link>
            </div>
        </div>
    );
}
