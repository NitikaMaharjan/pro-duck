import { useState } from "react";
import ThemeContext from "./ThemeContext";

export default function ThemeState(props) {

    const [theme, setTheme] = useState(localStorage.getItem("mode")?localStorage.getItem("mode"):"light");

    const ChangeTheme = () => {
        if (theme==="light"){
          localStorage.setItem("mode", "dark");
          localStorage.setItem("bgColor", "#0e1011");
        }else{
          localStorage.setItem("mode", "light");
          localStorage.setItem("bgColor", "rgb(247, 247, 247)");
        }
        setTheme(localStorage.getItem("mode"));
    }

    return (
        <ThemeContext.Provider value={{theme, ChangeTheme}}>
            {props.children}
        </ThemeContext.Provider>
    );
}
