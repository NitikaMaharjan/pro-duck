import { useContext } from "react";
import ThemeContext from "../context/theme/ThemeContext";

export default function Throbber() {

    const {theme} = useContext(ThemeContext);
    
    return (
        <div className="text-center" style={{marginTop: "80px"}}>
            <div className={`spinner-border text${theme==="light"?"-dark":"-light"}`} style={{height: "22px", width: "22px", borderWidth: "2px"}} role="status">
                <span className="sr-only"></span>
            </div>
        </div>
    )
}
