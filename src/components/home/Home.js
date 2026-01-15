import { useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import ThemeContext from "../../context/theme/ThemeContext";
import ProgressContext from "../../context/progress/ProgressContext";
import TextContext from "../../context/text/TextContext";

export default function Home() {

  let navigate = useNavigate();
  
  const {theme} = useContext(ThemeContext);
  const {showProgress} = useContext(ProgressContext);
  const {handleCapitalizeFirstLetter} = useContext(TextContext);

  useEffect(() => {
    showProgress();
    if (!localStorage.getItem("token")){
      navigate("/login");
    }
    // eslint-disable-next-line
  },[]);  
  
  return (
    <div className="content" style={{color: `${theme==="light"?"black":"white"}`}}>
      <p style={{margin: "0px", padding: "0px"}}>Hello, {handleCapitalizeFirstLetter(localStorage.getItem("token")?localStorage.getItem("username"):"world")}!</p>
    </div>
  )
}
