import UserContext from "./UserContext";

export default function UserState(props) {

    const fetchUserInfo = async()=>{
        const response = await fetch("http://localhost:5000/api/auth/fetchuserdetails", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authtoken": localStorage.getItem("token")
            }
        });
        const fetchedUserInfo = await response.json();
        localStorage.setItem("username", fetchedUserInfo.name);
    }

    return(
        <UserContext.Provider value={{fetchUserInfo}}>
            {props.children}
        </UserContext.Provider>
    );
}
