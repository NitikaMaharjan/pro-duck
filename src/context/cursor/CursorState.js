import { useState, useEffect } from "react";
import CursorContext from "./CursorContext";

export default function CursorState(props) {

    const [cursorDot, setCursorDot] = useState(null);
    const [cursorOutline, setCursorOutline] = useState(null);
    
    const handleCursor = (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        if (cursorDot && cursorOutline) {
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 250, fill: "forwards" });
        }
    };

    const handleCursorEnter = () => {
        if (cursorDot && cursorOutline){
            cursorDot.style.backgroundColor = "white";
            cursorOutline.style.border = "2px solid white";
        }
    }
    
    const handleCursorLeave = () => {
        if (cursorDot && cursorOutline){
            cursorDot.style.backgroundColor = "#ffa8a8";
            cursorOutline.style.border = "2px solid #ffa8a8";
        }
    }

    useEffect(() => {
        setCursorDot(document.getElementById("dot"));
        setCursorOutline(document.getElementById("outline"));

        window.addEventListener("mousemove", handleCursor);

        return () => {
            window.removeEventListener("mousemove", handleCursor);
        };
        // eslint-disable-next-line
    }, [cursorDot, cursorOutline]);

    return(
        <>
            <CursorContext.Provider value={{handleCursorEnter, handleCursorLeave}}>
                {props.children}
            </CursorContext.Provider>

            <div>
                <div id="dot" className="cursor-dot"></div>
                <div id="outline" className="cursor-outline"></div>
            </div>
        </>
    );
}