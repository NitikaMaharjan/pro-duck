import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import CursorContext from "../context/cursor/CursorContext";
import ThemeContext from "../context/theme/ThemeContext";
import ProgressContext from "../context/progress/ProgressContext";
import AlertContext from "../context/alert/AlertContext";
import UserContext from "../context/user/UserContext";
import TextContext from "../context/text/TextContext";

export default function Login() {

  let navigate = useNavigate();
  
  const {handleCursorEnter, handleCursorLeave} = useContext(CursorContext);
  const {theme} = useContext(ThemeContext);
  const {showProgress} = useContext(ProgressContext);
  const {showAlert} = useContext(AlertContext);
  const {fetchUserInfo} = useContext(UserContext);
  const {handleCapitalizeFirstLetter} = useContext(TextContext);
  
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [passwordType, setPasswordType] = useState("password");

  const handleChange = (e) =>{
    setCredentials({...credentials, [e.target.name]: e.target.value.trim()});
  }

  const changePasswordType = () => {
    if(passwordType==="password"){
      setPasswordType("text");
    }else{
      setPasswordType("password");
    }
  }

  const clearText = (input_field) => {
    setCredentials({...credentials, [input_field]: ""});
  }

  const clientSideValidation = () => {
    if(credentials.email==="" && credentials.password!==""){
      showAlert("warning", "Email is required. Please try again!");
      return false;
    }else if(credentials.email!=="" && credentials.password===""){
      showAlert("warning", "Password is required. Please try again!");
      return false;
    }else if (credentials.email==="" && credentials.password===""){
      showAlert("warning", "Please enter your credentials to log in!");
      return false;
    }else if(!document.getElementById("email").checkValidity()){
      showAlert("warning", "Please enter a valid email address!");
      return false;
    }
    return true;
  }

  const handleSubmit = async(e) =>{
    e.preventDefault();
    if(clientSideValidation()){
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email: credentials.email, password: credentials.password})
      });
      const json = await response.json();
      if(json.success){
        // Saving the auth token and redirect to home
        localStorage.setItem("token", json.authtoken); 
        if(await fetchUserInfo()){
          handleCursorLeave();
          navigate("/");
          showAlert("success", "Welcome back, " + handleCapitalizeFirstLetter(localStorage.getItem("username")) + "!");
        }
      }else{
        showAlert("fail", json.error);
      }
    }
  }

  useEffect(() => {    
    showProgress();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="content" style={{color: `${theme==="light"?"black":"white"}`, paddingTop: "10px"}}>
      <h5 style={{textAlign: "center"}}>Hey there, welcome back!</h5>
      <div className="add-note-form">
        <div style={{padding: "20px", width: "400px", backgroundColor: `${theme==="light"?"white":"#212529"}`, border: `${theme==="light"?"1px solid #bebebe":"1px solid #424549"}`, borderRadius: "6px", boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.15)"}}>
          <form data-bs-theme={`${theme==="light"?"light":"dark"}`}>
            <div className="form-group mb-2">
              <div className="d-flex align-items-center gap-2 mb-1">
                <img src={`${theme==="light"?"/icons/email_black.png":"/icons/email_white.png"}`} height="18px" width="18px" alt="email icon"/>
                <label htmlFor="email" style={{fontWeight: "500"}}>Email</label>
              </div>
              <div className="d-flex align-items-center">
                <input type="email" className="form-control" id="email" name="email" placeholder="Enter email" onChange={handleChange} autoComplete="on" value={credentials.email}/>
                <img src={`${theme==="light"?"/icons/close.png":"/icons/close2.png"}`} height="18px" width="18px" alt="close icon" onClick={()=>{clearText("email");}} style={{margin: "0px 2px 0px 10px", opacity: `${credentials.email===""?"0":"1"}`}}/>
              </div>
            </div>
            <div className="form-group mb-3">
              <div className="d-flex align-items-center gap-2 mb-1">
                <img src={`${passwordType==="password"?theme==="light"?"/icons/eye_hide_black.png":"/icons/eye_hide_white.png":theme==="light"?"/icons/eye_black.png":"/icons/eye_white.png"}`} height="18px" width="18px" alt="eye icon" onClick={changePasswordType}/>
                <label htmlFor="password" style={{fontWeight: "500"}}>Password</label>
              </div>
              <div className="d-flex align-items-center">
                <input type={passwordType} className="form-control" id="password" name="password" placeholder="Enter password" onChange={handleChange} autoComplete="on" value={credentials.password}/>
                <img src={`${theme==="light"?"/icons/close.png":"/icons/close2.png"}`} height="18px" width="18px" alt="close icon" onClick={()=>{clearText("password");}} style={{margin: "0px 2px 0px 10px", opacity: `${credentials.password===""?"0":"1"}`}}/>
              </div>
            </div>
            <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
              <button type="submit" className="submit-button" onClick={handleSubmit} onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>Log in</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
