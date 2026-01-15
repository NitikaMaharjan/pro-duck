import { useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import ThemeContext from "../../context/theme/ThemeContext";
import ProgressContext from "../../context/progress/ProgressContext";

export default function BulletJournal() {

  let navigate = useNavigate();
  
  const {theme} = useContext(ThemeContext);
  const {showProgress} = useContext(ProgressContext);

  useEffect(() => {
    showProgress();
    if (!localStorage.getItem("token")){
      navigate("/login");
    }
    // eslint-disable-next-line
  },[]);  
  
  return (
    <div className="content" style={{color: `${theme==="light"?"black":"white"}`}}>
      WIP
    </div>
  )
}
