import { useContext, useState } from "react";
import AlertContext from "../alert/AlertContext";
import NoteContext from "./NoteContext";

export default function NoteState(props) {

    const { showAlert } = useContext(AlertContext);

    const [notes, setNotes] = useState([]);

    const fetchNote = async() => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/notes/getnote`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authtoken": localStorage.getItem("token")
            }
        });
        const json = await response.json();
        if(json.success){
            setNotes(json.notes);
        }else{
            showAlert("fail", json.error);
        }
    }

    const addNote = async(title, description, tag) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/notes/addnote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authtoken": localStorage.getItem("token")
            },
            body: JSON.stringify({title: title===""?"Untitled":title, description, tag: tag === ""?"General":tag})
        });
        const json = await response.json();
        if(json.success){
            await fetchNote();
            showAlert("success", "New note added successfully!");
            return true;
        }else{
            showAlert("fail", json.error);
            return false;
        }
    }

    const editNote = async(id, title, description, tag) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/notes/updatenote/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authtoken": localStorage.getItem("token")
            },
            body: JSON.stringify({title: title===""?"Untitled":title, description, tag: tag === ""?"General":tag})
        });
        const json = await response.json();
        if(json.success){
            await fetchNote();
            showAlert("success", "Changes saved successfully!");
            return true;
        }else{
            showAlert("fail", json.error);
            return false;
        }
    }

    const deleteNote = async(id) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/notes/deletenote/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "authtoken": localStorage.getItem("token")
            }
        });
        const json = await response.json();
        if(json.success){
            await fetchNote();
            showAlert("success", "Note deleted successfully!");
            return true;
        }else{
            showAlert("fail", json.error);
            return false;
        }
    }

    return(
        <NoteContext.Provider value={{notes, fetchNote, addNote, editNote, deleteNote}}>
            {props.children}
        </NoteContext.Provider>
    );
}
