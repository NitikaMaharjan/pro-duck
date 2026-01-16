import { useState } from "react";
import ProgressContext from "./ProgressContext";
import LoadingBar from "react-top-loading-bar";

export default function ProgressState(props) {
    
    const [progress, setProgress] = useState(0);

    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    const showProgress = async() => {
        setProgress(0);
        await wait(100);
        setProgress(10);
        await wait(100);
        setProgress(30);
        await wait(100);
        setProgress(50);
        await wait(100);
        setProgress(70);
        await wait(100);
        setProgress(90);
        await wait(100);
        setProgress(100);
    };

    return (
        <>
            <ProgressContext.Provider value={{showProgress}}>
                {props.children}
            </ProgressContext.Provider>

            <LoadingBar color="#ffa8a8" progress={progress} height={3}/>
        </>
    )
}