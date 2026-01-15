import "./App.css";
import { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import ThemeContext from "./context/theme/ThemeContext";
import ProgressState from "./context/progress/ProgressState";
import AlertState from "./context/alert/AlertState";
import UserState from "./context/user/UserState";
import TextState from "./context/text/TextState";
import NoteState from "./context/notes/NoteState";
import SideNavbar from "./components/navbar/SideNavbar";
import TopNavbar from "./components/navbar/TopNavbar";
import Home from "./components/home/Home";
import Notes from "./components/notes/Notes";
import ToDo from "./components/todo/ToDo";
import BulletJournal from "./components/bulletjournal/BulletJournal";
import Tracker from "./components/tracker/Tracker";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {

  const {theme} = useContext(ThemeContext);
  
  document.body.style.backgroundColor= localStorage.getItem("bgColor")?localStorage.getItem("bgColor"):"rgb(247, 247, 247)";

  const form_contorl_style = document.createElement("style");
  form_contorl_style.textContent = `
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    textarea:-webkit-autofill,
    textarea:-webkit-autofill:hover,
    textarea:-webkit-autofill:focus,
    select:-webkit-autofill,
    select:-webkit-autofill:hover,
    select:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0px 1000px ${theme==="light"?"white":"#212529"} inset !important;
    }
  `;
  document.head.appendChild(form_contorl_style);

  return (
    <>
      <ProgressState>
        <AlertState>
          <UserState>
            <TextState>
              <NoteState>
                <BrowserRouter>
                  <div style={{display: "flex"}}>
                    <div className="side-navbar">
                      <SideNavbar/>
                    </div>
                    <div className="top-navbar" style={{backgroundColor: `${theme==="light"?"rgb(247, 247, 247)":"#0e1011"}`}}>
                      <TopNavbar/>
                    </div>
                  </div>
                  <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/notes" element={<Notes/>}/>
                    <Route path="/todolists" element={<ToDo/>}/>
                    <Route path="/bulletjournal" element={<BulletJournal/>}/>
                    <Route path="/tracker" element={<Tracker/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                  </Routes>
                </BrowserRouter>
              </NoteState>
            </TextState>
          </UserState>
        </AlertState>
      </ProgressState> 
    </>
  );
}

export default App;
