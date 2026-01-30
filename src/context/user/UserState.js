import { useContext } from "react";
import AlertContext from "../alert/AlertContext";
import UserContext from "./UserContext";

export default function UserState(props) {

    const { showAlert } = useContext(AlertContext);

    const fetchUserInfo = async() => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/fetchuserdetails`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authtoken": localStorage.getItem("token")
            }
        });
        const json = await response.json();
        if(json.success===true){
            localStorage.setItem("username", json.user.name);
            return true;
        }else{
            showAlert("fail", json.error);
            return false;
        }
    }

    return(
        <UserContext.Provider value={{fetchUserInfo}}>
            {props.children}
        </UserContext.Provider>
    );
}
