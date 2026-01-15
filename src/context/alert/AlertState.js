import { useContext, useState } from "react";
import AlertContext from "./AlertContext";
import ThemeContext from "../theme/ThemeContext";

export default function AlertState(props) {

    const { theme } = useContext(ThemeContext);

    const [alert, setAlert] = useState(false);
    const [imgSrc, setImgSrc] = useState("");
    const [msg, setMsg] = useState("");

    const showAlert = (status, msg) => {
        setAlert(true);
        setImgSrc(status);
        setMsg(msg);

        setTimeout(() => {
            setAlert(false);
        }, 3000);
    }

    return(
        <>
            <AlertContext.Provider value={{showAlert}}>
                {props.children}
            </AlertContext.Provider>

            {
                alert 
                
                &&
                <>
                    {theme==="light" ?
                        <div className="alert-background">
                            <div className="alert-content">
                                <img src={`/icons/${imgSrc}.png`} height="28px" width="28px" alt={`${imgSrc} icon`}/>&nbsp;
                                <p className="m-0 p-0" style={{fontSize: "13px", color: "black"}}>
                                    {msg}
                                </p>
                            </div>
                        </div>
                    :
                        <div className="alert-background">
                            <div className="alert-content" style={{border: "1px solid #424549", backgroundColor: "#212529"}}>
                                <img src={`/icons/${imgSrc}.png`} height="28px" width="28px" alt={`${imgSrc} icon`}/>&nbsp;
                                <p className="m-0 p-0" style={{fontSize: "13px", color: "white"}}>
                                    {msg}
                                </p>
                            </div>
                        </div>}             
                </>
            }
        </>
    );
}