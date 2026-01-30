import { useContext } from "react";
import ThemeContext from "../../context/theme/ThemeContext";
import TextContext from "../../context/text/TextContext";

export default function NoteItem(props) {
  
  const {theme} = useContext(ThemeContext);
  const {handleCapitalizeFirstLetter, giveMeDay, trimTitle, trimDescription} = useContext(TextContext);

  return (
    <>
      <div className="card" data-bs-theme={`${theme==="light"?"light":"dark"}`} style={{width: "100%", height: "192px"}} onClick={props.OpenNoteDetailModal}>
          <div className="card-body">
              <h5 className="card-title" style={{color: `${theme==="light"?"black":"white"}`}} title={props.note.title}>{trimTitle(props.note.title)}</h5>
              <div className="mb-2" style={{display: "flex"}}>
                <p className="card-subtitle text-body-secondary" style={{margin: "0px", padding: "0px", fontSize: "14px", fontWeight: "500"}}>{handleCapitalizeFirstLetter(props.note.tag)}</p>
                <p className="card-subtitle text-body-secondary mx-1" style={{margin: "0px", padding: "0px", fontSize: "14px"}}>|</p>
                <p className="card-subtitle text-body-secondary" style={{margin: "0px", padding: "0px", fontSize: "14px"}}>{giveMeDay(props.note.date)}</p>
              </div>
              <p className="card-text">{trimDescription(props.note.description)}</p>
          </div>
      </div>
  </>
  )
}