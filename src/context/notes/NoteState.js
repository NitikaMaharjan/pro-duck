import NoteContext from "./NoteContext";
import { useState } from "react";

export default function NoteState(props) {
    const [notes, setNotes] = useState([]);

    const fetchNote = async()=>{
        const response = await fetch("http://localhost:5000/api/notes/getnote", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authtoken": localStorage.getItem("token")
            }
        });
        const fetchedNotes = await response.json();
        setNotes(fetchedNotes);
    }

    const addNote = async(title, description, tag)=>{
        await fetch("http://localhost:5000/api/notes/addnote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authtoken": localStorage.getItem("token")
            },
            body: JSON.stringify({title: title===""?"Untitled":title, description, tag: tag === ""?"General":tag})
        });
        // setNotes(notes.concat(new_note));
        fetchNote();
    }

    const editNote = async(id, title, description, tag)=>{
        await fetch(`http://localhost:5000/api/notes/updatenote/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "authtoken": localStorage.getItem("token")
            },
            body: JSON.stringify({title: title===""?"Untitled":title, description, tag: tag === ""?"General":tag})
        });
        // setNotes(prevNotes =>
        //     prevNotes.map(note =>
        //     note._id === id ? {...note, title: title===""?"Untitled":title, description, tag: tag === ""?"General":tag} : note
        //     )
        // );
        fetchNote();
    }

    const deleteNote = async(id)=>{
        await fetch(`http://localhost:5000/api/notes/deletenote/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "authtoken": localStorage.getItem("token")
            }
        });
        // setNotes(notes.filter((note)=>{return note._id!==id}));
        fetchNote();
    }

    return(
        <NoteContext.Provider value={{ notes, fetchNote, addNote, editNote, deleteNote }}>
            {props.children}
        </NoteContext.Provider>
    );
}
