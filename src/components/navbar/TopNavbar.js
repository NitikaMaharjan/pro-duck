import { useContext }from "react";
import { Link, useNavigate } from "react-router";
import ThemeContext from "../../context/theme/ThemeContext";
import AlertContext from "../../context/alert/AlertContext";
import TextContext from "../../context/text/TextContext";

export default function TopNavbar() {

  let navigate = useNavigate();

  const {theme, ChangeTheme} = useContext(ThemeContext);
  const {showAlert} = useContext(AlertContext);
  const {giveMeDay, giveMeTime} = useContext(TextContext);
  
  const handleLogout = () => {
    let ans = window.confirm("Are you sure?");
    if (ans) {
      localStorage.removeItem("loggedInUsername");
      localStorage.removeItem("username");
      localStorage.removeItem("activeContent");
      localStorage.removeItem("token");
      navigate("/login");
      showAlert("success", "You've logged out. See you next time!");
    }
  }

  return (
    <div style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
      <div>
        <h6 style={{margin: "0px", padding: "0px", color: `${theme==="light"?"black":"white"}`}}>{giveMeDay(new Date())} | {giveMeTime(new Date())}</h6>
      </div>

      <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
        {localStorage.getItem("token")?
          <button className={`login-btn${theme==="light"?"":"-dark"}`} onClick={handleLogout}>Log out</button>
        :
          <>
            <Link to="/login"><button className={`login-btn${theme==="light"?"":"-dark"}`}>Log in</button></Link>
            <Link to="/signup"><button className={`signup-btn${theme==="light"?"":"-dark"}`}>Sign up</button></Link>
          </>
        }
        
        <div className={`theme-change-button${theme==="light"?"-light":"-dark"}`} onClick={()=>ChangeTheme()} title={`change to ${theme==="light"?"dark":"light"} theme`}>
          <img src={theme==="light"?"/icons/moon.png":"/icons/sun.png"} height="20px" width="20px" alt={`${theme==="light"?"dark":"light"} theme button`}/>
        </div>
      </div>
    </div>
  )
}
