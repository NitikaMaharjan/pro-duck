import { useState, useEffect, useContext } from 'react';
import CursorContext from "../../context/cursor/CursorContext";
import ThemeContext from '../../context/theme/ThemeContext';
import ProgressContext from '../../context/progress/ProgressContext';
import AlertContext from '../../context/alert/AlertContext';
import NoteContext from '../../context/notes/NoteContext';

export default function AddNote(props) {
    
    const {handleCursorEnter, handleCursorLeave} = useContext(CursorContext);
    const {theme} = useContext(ThemeContext);
    const {showProgress} = useContext(ProgressContext);
    const {showAlert} = useContext(AlertContext);
    const {addNote} = useContext(NoteContext);
    
    const [note, setNote] = useState({
        title: "Untitled", 
        description: "", 
        tag: "General"
    });

    const handleChange = (e) =>{
        setNote({...note, [e.target.name]: e.target.value.trimStart()});
    }

    const clearText = (input_field) => {
        setNote({...note, [input_field]: ""});
    }

    const NoteValidation = () => {
        const titleRegex = /^[A-Za-z0-9!@#$%^&*()-+_?|',:;]+(?: [A-Za-z0-9!@#$%^&*()-+_?|',:;]+)*$/;
        const tagRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

        let trimmed_title = note.title.trim();
        let trimmed_tag = note.tag.trim();
        let trimmed_description = note.description.trim();

        if(trimmed_title==="Untitled" && trimmed_tag==="General" && trimmed_description===""){
            showAlert("warning", "Please enter some text before saving your note!");
            return false;
        }else if(trimmed_title==="" && trimmed_tag==="" && trimmed_description===""){
            showAlert("warning", "Please enter some text before saving your note!");
            return false;
        }else if(trimmed_title==="Untitled" && trimmed_tag==="" && trimmed_description===""){
            showAlert("warning", "Please enter some text before saving your note!");
            return false;
        }else if(trimmed_title==="" && trimmed_tag==="General" && trimmed_description===""){
            showAlert("warning", "Please enter some text before saving your note!");
            return false;
        }else if(trimmed_title.length>60){
            showAlert("warning", "Title cannot be more than 60 characters!");
            return false;
        }else if(trimmed_title.length!==0 && !titleRegex.test(trimmed_title)){
            showAlert("warning", "Title can only contain letters, numbers, single consecutive space and some special characters !@#$%^&*()-+_?|',:;");
            return false;
        }else if(trimmed_tag.length>15){
            showAlert("warning", "Tag cannot be more than 15 characters!");
            return false;
        }else if(trimmed_tag.length!==0 && !tagRegex.test(trimmed_tag)){
            showAlert("warning", "Tag can only contain letters and single consecutive space!");
            return false;
        }

        return true;
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        if(NoteValidation()){
            addNote(note.title.trim(), note.description.trim(), note.tag.trim());
            handleCursorLeave();
            props.ChangeContent(1);
            showAlert("success", "New note added!");
        }
    }

    useEffect(() => {    
        showProgress();
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <h5 style={{textAlign: "center"}}>What's on your mind today?</h5>
            <div className="add-note-form">
                <div style={{padding: "20px", width: "600px", backgroundColor: `${theme==="light"?"white":"#212529"}`, border: `${theme==="light"?"1px solid #bebebe":"1px solid #424549"}`, borderRadius: "6px", boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.15)"}}>
                    <form data-bs-theme={`${theme==="light"?"light":"dark"}`}>
                        <div className="form-group mb-2">
                            <label htmlFor="title" className="mb-1" style={{fontWeight: "500"}}>Title</label>
                            <div className="d-flex align-items-center">
                                <input type="text" className="form-control" id="title" name="title" placeholder="Enter title" onChange={handleChange} autoComplete="on" value={note.title==="Untitled"?"":note.title}/>
                                <img src={`${theme==="light"?"/icons/close.png":"/icons/close2.png"}`} height="18px" width="18px" alt="close icon" onClick={()=>{clearText("title");}} style={{margin: "0px 2px 0px 10px", opacity: `${note.title==="Untitled" || note.title==="" ?"0":"1"}`}}/>
                            </div>
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="tag" className="mb-1" style={{fontWeight: "500"}}>Tag</label>
                            <div className="d-flex align-items-center">
                                <input type="text" className="form-control" id="tag" name="tag" placeholder="Enter tag" onChange={handleChange} autoComplete="on" value={note.tag==="General"?"":note.tag}/>
                                <img src={`${theme==="light"?"/icons/close.png":"/icons/close2.png"}`} height="18px" width="18px" alt="close icon" onClick={()=>{clearText("tag");}} style={{margin: "0px 2px 0px 10px", opacity: `${note.tag==="General" || note.tag===""?"0":"1"}`}}/>
                            </div>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="description" className="mb-1" style={{fontWeight: "500"}}>Description</label>
                            <div className="d-flex align-items-start">
                                <textarea className="form-control" id="description" name="description" placeholder="Enter description" rows="3" onChange={handleChange} autoComplete="on" value={note.description}></textarea>
                                <img src={`${theme==="light"?"/icons/close.png":"/icons/close2.png"}`} height="18px" width="18px" alt="close icon" onClick={()=>{clearText("description");}} style={{margin: "12px 2px 0px 10px", opacity: `${note.description===""?"0":"1"}`}}/>
                            </div>
                        </div>
                        <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                            <button type="submit" className="submit-button" onClick={handleSubmit} onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>Add Note</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
