import { useState, useEffect, useContext, useRef } from "react";
import CursorContext from "../../context/cursor/CursorContext";
import ThemeContext from "../../context/theme/ThemeContext";
import ProgressContext from "../../context/progress/ProgressContext";
import AlertContext from "../../context/alert/AlertContext";
import TextContext from "../../context/text/TextContext";
import NoteContext from "../../context/notes/NoteContext";
import Throbber from "../Throbber";
import NoteItem from "./NoteItem";
import ChipTags from "./ChipTags";

export default function Note() {

    const {handleCursorEnter, handleCursorLeave} = useContext(CursorContext);
    const {theme} = useContext(ThemeContext);
    const {showProgress} = useContext(ProgressContext);
    const {showAlert} = useContext(AlertContext);
    const {handleCapitalizeFirstLetter, giveMeDay, giveMeTime, calculateCharacters, calculateWords} = useContext(TextContext);
    const {notes, fetchNote, deleteNote, editNote} = useContext(NoteContext);
    
    const [selectedNote, setSelectedNote] = useState({
        _id: "",
        user: "",
        title: "",
        description: "",
        tag: "",
        date: "",
        __v: ""
    });
    const [latestNote, setLatestNote] = useState([]);
    const [oldestNote, setOldestNote] = useState([]);
    const [activeModal, setActiveModal] = useState(null);
    const [xScrollLeft, setXScrollLeft] = useState(false);
    const [xScrollRight, setXScrollRight] = useState(false);
    const [xScrollRightPrevValue, setXScrollRightPrevValue] = useState(null);
    const [yScroll, setYScroll] = useState(false);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [latestfilterednotes, setLatestFilteredNotes] = useState([]);
    const [oldestfilterednotes, setOldestFilteredNotes] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState("latest");
    const [uniqueTags, setUniqueTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState("");

    const scrollContainerRef = useRef(null);
    
    const OpenNoteDetailModal = (note) => {
        setSelectedNote(note);
        const myModal = new window.bootstrap.Modal(document.getElementById("noteDetailModal"));
        setActiveModal(myModal);
    };
    
    const OpenEditModal = () => {
        const myModal = new window.bootstrap.Modal(document.getElementById("editModal"));
        setActiveModal(myModal);
    };

    const handleChange = (e) => {
        setSelectedNote({...selectedNote, [e.target.name]: e.target.value.trimStart()});
    }

    const NoteValidation = () => {
        const titleRegex = /^[A-Za-z0-9!@#$%^&*()-+_?|',:;]+(?: [A-Za-z0-9!@#$%^&*()-+_?|',:;]+)*$/;
        const tagRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

        let id = selectedNote._id;
        let trimmed_title = selectedNote.title.trim();
        let trimmed_tag = selectedNote.tag.trim();
        let trimmed_description = selectedNote.description.trim();

        if(trimmed_title==="Untitled" && trimmed_tag==="General" && trimmed_description===""){
            deleteNote(id); 
            activeModal.hide();
            return false;
        }else if(trimmed_title==="" && trimmed_tag==="" && trimmed_description===""){
            deleteNote(id); 
            activeModal.hide();            
            return false;
        }else if(trimmed_title==="Untitled" && trimmed_tag==="" && trimmed_description===""){
            deleteNote(id); 
            activeModal.hide();            
            return false;
        }else if(trimmed_title==="" && trimmed_tag==="General" && trimmed_description===""){
            deleteNote(id); 
            activeModal.hide();            
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

    const handleSubmit = () => {
        if(NoteValidation()){
            if(editNote(selectedNote._id, selectedNote.title===""?"Untitled":selectedNote.title.trim(), selectedNote.description===""?" ":selectedNote.description.trim(), selectedNote.tag===""?"General":selectedNote.tag.trim())){
                handleCursorLeave();
                activeModal.hide();
            }
        }
    }

    const handleDeleteNote = (id) => {
        let ans = window.confirm("Are you sure?");
        if (ans) {
            if(deleteNote(id)){
                activeModal.hide(); 
            }
            
        }
    }

    const handleKeywordChange = (e) =>{
        setKeyword(e.target.value);
        setSelectedTag("");

        if(keyword.trim() !== ""){
            let filtered_notes = notes.filter((note)=>{return note.title.toLowerCase().includes(keyword.toLowerCase()) || note.tag.toLowerCase().includes(keyword.toLowerCase()) || note.description.toLowerCase().includes(keyword.toLowerCase())});
            setFilteredNotes(filtered_notes);
            let latest_filtered_notes = [...filteredNotes].sort((a,b) => new Date(b.date) - new Date(a.date));
            setLatestFilteredNotes(latest_filtered_notes);
            let oldest_filtered_notes = [...filteredNotes].sort((a,b) => new Date(a.date) - new Date(b.date));
            setOldestFilteredNotes(oldest_filtered_notes);
        }
    }

    const clearText = (input_field) => {
        if(input_field === "keyword"){
            setKeyword("");
        }else{
            setSelectedNote({...selectedNote, [input_field]: ""});
        }
    }

    const getUniqueTags = () => {
        let unique_tags = [];
        unique_tags.push(notes[0].tag);
        for (let i=1; i<notes.length; i++){
            if (!unique_tags.includes(notes[i].tag)) {
                unique_tags.push(notes[i].tag);
            }
        }
        setUniqueTags(unique_tags);     
    }

    const handleScroll = (scrollOffset) => {
        if (scrollContainerRef.current) {
            setXScrollRightPrevValue(scrollContainerRef.current.scrollLeft);
            scrollContainerRef.current.scrollLeft += scrollOffset;
        }

        if (scrollContainerRef.current.scrollLeft!==0){
            setXScrollLeft(true);
        }else{
            setXScrollLeft(false);
        }

        if (xScrollRightPrevValue===scrollContainerRef.current.scrollLeft){
            setXScrollRight(false);
        }else{
            setXScrollRight(true);
        }
    }

    const latestNotes = () => {
        let latest_notes = [...notes].sort((a,b) => new Date(b.date) - new Date(a.date));
        setLatestNote(latest_notes);
    }
    
    const oldestNotes = () => {
        let oldest_notes = [...notes].sort((a,b) => new Date(a.date) - new Date(b.date));
        setOldestNote(oldest_notes);
    }

    const handleSelectTag = (selected_tag) => {
        setSelectedTag(selected_tag);
        setSelectedOrder("none");
        setKeyword("");

        let filtered_notes = notes.filter((note)=>{return note.tag.toLowerCase().includes(selected_tag.toLowerCase())});
        setFilteredNotes(filtered_notes);
    }

    useEffect(() => {
        if(localStorage.getItem("token")){
            fetchNote();
        }

        window.addEventListener("scroll", () => {
            if(window.scrollY){
                setYScroll(true);
            }else{
                setYScroll(false);
            }
        });

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (notes.length !== 0){
            latestNotes();
            oldestNotes();
        }
        // eslint-disable-next-line
    }, [notes]);

    useEffect(() => {
        if (notes.length !== 0) {
            getUniqueTags();
            if(scrollContainerRef.current && scrollContainerRef.current.scrollWidth > scrollContainerRef.current.clientWidth){
                setXScrollRight(true);
            }else{
                setXScrollRight(false);
            }
        }
        // eslint-disable-next-line
    }, [notes]);
    
    useEffect(() => {
        if(activeModal!=null){
            activeModal.show();
        }else{
            showProgress();
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
        // eslint-disable-next-line
    }, [activeModal]);
    
    return (
        <>  
            {notes.length === 0?
                <p style={{margin: "0px",padding: "40px 0px 0px 0px", textAlign: "center", color: `${theme==="light"?"black":"white"}`}}>Want to share a quick thought? Tap on "Add Note" to get started!</p>
            :
                <>
                    <div className="d-flex justify-content-center">
                        <form>
                            <div className="d-flex align-items-center" style={{width: "500px", padding: "6px 12px", borderRadius: "6px", backgroundColor: `${theme==="light"?"white":"#212529"}`, border: `${theme==="light"?"1px solid #bebebe":"1px solid #424549"}`}}> 
                                <img src="/icons/search.png" height="20px" width="20px" alt="search icon"/>&nbsp;&nbsp;
                                <input id="search" name="search" className="search-bar-input" placeholder="Search notes" value={keyword} onChange={handleKeywordChange} style={{backgroundColor: `${theme==="light"?"white":"#212529"}`, color: `${theme==="light"?"black":"white"}`}}/>&nbsp;&nbsp;
                                <img src="/icons/close3.png" height="14px" width="14px" alt="close icon" onClick={()=>{clearText("keyword")}} style={{opacity: `${keyword===""?"0":"1"}`}}/>
                            </div>
                        </form>
                    </div>
                    <div className="d-flex justify-content-center">
                        <div className="d-flex align-items-center" style={{marginTop: "12px", overflow: "hidden"}}> 
                            <button className={`chip${theme==="light"?"-light":"-dark"} left-scroll-arrow${xScrollLeft?"-show":""}`} style={{marginRight: "6px"}} onClick={() => handleScroll(-100)}>
                                <img src={`/icons/${theme==="light"?"left_light":"left_dark"}.png`} height="14px" width="14px" alt="left icon" style={{marginBottom: "3px", marginRight: "2px"}}/>
                            </button>
                            <div ref={scrollContainerRef} className="d-flex align-items-center scroll-menu">
                                <div className="d-flex" style={{gap: "6px"}}>
                                    <button className={`chip${theme==="light"?"-light":"-dark"} ${(selectedOrder==="latest" || selectedOrder==="oldest") && keyword===""?"chip-active":""}`} onClick={()=>{setSelectedOrder("latest"); setKeyword(""); setSelectedTag("");}}>All</button>
                                    <button className={`chip${theme==="light"?"-light":"-dark"} ${selectedOrder==="latest"?"chip-active":""}`} onClick={()=>{setSelectedOrder("latest"); setSelectedTag("");}}>Latest</button>
                                    <button className={`chip${theme==="light"?"-light":"-dark"} ${selectedOrder==="oldest"?"chip-active":""}`} onClick={()=>{setSelectedOrder("oldest"); setSelectedTag("");}}>Oldest</button>
                                    
                                    {   
                                        uniqueTags.length !== 0?                 
                                            uniqueTags.map((tag, index) => {
                                                return <ChipTags key={index} tag={tag} selectedTag={selectedTag} handleSelectTag={() => handleSelectTag(tag)}/> 
                                            })
                                        :
                                            <></>
                                    }
                                </div>
                            </div>                  
                            <button className={`chip${theme==="light"?"-light":"-dark"} right-scroll-arrow${xScrollRight?"-show":""}`} style={{marginLeft: "6px"}} onClick={() => handleScroll(100)}>
                                <img src={`/icons/${theme==="light"?"right_light":"right_dark"}.png`} height="14px" width="14px" alt="right icon" style={{marginBottom: "3px", marginLeft: "2px"}}/>
                            </button>
                        </div>
                    </div>
                    
                    {loading?
                        <Throbber/>
                    :
                    <>
                        <div className="notes-collection">
                            {   
                                selectedTag!==""?
                                   (filteredNotes).map((note)=>{
                                        return <NoteItem key={note._id} note={note} OpenNoteDetailModal={() => OpenNoteDetailModal(note)}/>
                                    })
                                : 
                                    selectedOrder==="latest"?
                                        (keyword===""?latestNote:latestfilterednotes).map((note)=>{
                                            return <NoteItem key={note._id} note={note} OpenNoteDetailModal={() => OpenNoteDetailModal(note)}/>
                                        })
                                        :
                                        (keyword===""?oldestNote:oldestfilterednotes).map((note)=>{
                                            return <NoteItem key={note._id} note={note} OpenNoteDetailModal={() => OpenNoteDetailModal(note)}/>
                                        })
                            }
                        </div>
                        <div>
                            <a className={`up-arrow${yScroll?"-show":""}`} href="#top" onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>&uarr;</a>
                        </div>
                    </>
                    }
                </>
            }

            <div className="modal fade bd-example-modal-lg" id="noteDetailModal" tabIndex="-1" role="dialog" aria-labelledby="noteDetailModalLabel" aria-hidden="true" data-bs-theme={`${theme==="light"?"light":"dark"}`}>
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header d-flex justify-content-between" style={{border: "none"}}>
                            <h5 className="modal-title" id="noteDetailModalLabel" style={{color: `${theme==="light"?"black":"white"}`}}>{selectedNote?.title}</h5>
                            <div>
                                <button className="modal-btn" onClick={()=>{activeModal.hide(); OpenEditModal();}}><img src={`${theme==="light"?"/icons/edit.png":"/icons/edit2.png"}`} alt="edit icon" title="edit"/></button>
                                <button className="modal-btn" onClick={()=>{handleDeleteNote(selectedNote?._id)}}><img src={`${theme==="light"?"/icons/delete.png":"/icons/delete2.png"}`} alt="delete icon" title="delete"/></button>
                                <button className="modal-btn" data-bs-dismiss="modal" aria-label="Close"><img src={`${theme==="light"?"/icons/close.png":"/icons/close2.png"}`} alt="close icon" title="close"/></button>
                            </div>
                        </div>
                        <div style={{display: "flex", alignItems: "center", margin: "0px", padding: "0px 16px"}}>
                            <h6 className="card-subtitle text-body-secondary" style={{margin: "0px", padding: "0px", color: "#212529"}}>{handleCapitalizeFirstLetter(selectedNote?.tag)}</h6>
                            <h6 className="card-subtitle text-body-secondary mx-2" style={{margin: "0px", padding: "0px", color: "#212529"}}>|</h6>
                            <p className="card-subtitle text-body-secondary" style={{margin: "0px", padding: "0px", color: "#212529"}}>{giveMeDay(selectedNote?.date)}</p>                           
                            <h6 className="card-subtitle text-body-secondary mx-2" style={{margin: "0px", padding: "0px", color: "#212529"}}>|</h6>
                            <p className="card-subtitle text-body-secondary" style={{margin: "0px", padding: "0px", color: "#212529"}}>{giveMeTime(selectedNote?.date)}</p>
                            <h6 className="card-subtitle text-body-secondary mx-2" style={{margin: "0px", padding: "0px", color: "#212529"}}>|</h6>
                            <p className="card-subtitle text-body-secondary" style={{margin: "0px", padding: "0px", color: "#212529"}}>{calculateCharacters(selectedNote?.description)}</p>
                            <h6 className="card-subtitle text-body-secondary mx-2" style={{margin: "0px", padding: "0px", color: "#212529"}}>|</h6>
                            <p className="card-subtitle text-body-secondary" style={{margin: "0px", padding: "0px", color: "#212529"}}>{calculateWords(selectedNote?.description)}</p>
                        </div>
                        <div className="modal-body">
                            {selectedNote?.description}
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade bd-example-modal-lg" id="editModal" tabIndex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true" data-bs-theme={`${theme==="light"?"light":"dark"}`}>
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header justify-content-end" style={{border: "none", paddingBottom: "0px"}}>
                            <button className="modal-btn" data-bs-dismiss="modal" aria-label="Close"><img src={`${theme==="light"?"/icons/close.png":"/icons/close2.png"}`} alt="edit" title="close"/></button>
                        </div>
                        <div className="modal-body" style={{paddingTop: "0px", paddingBottom: "6px"}}>
                            <label htmlFor="title" className="mb-1" style={{fontWeight: "500"}}>Title</label>
                            <div className="d-flex align-items-center">
                                <input type="text" className="form-control" id="title" name="title" placeholder="Enter title" onChange={handleChange} autoComplete="on" value={selectedNote.title==="Untitled"?"":selectedNote.title}/>
                                <img src={`${theme==="light"?"/icons/close.png":"/icons/close2.png"}`} height="18px" width="18px" alt="close icon" onClick={()=>{clearText("title");}} style={{margin: "0px 2px 0px 10px", opacity: `${selectedNote.title==="Untitled" || selectedNote.title==="" ?"0":"1"}`}}/>
                            </div>
                        </div>
                        <div className="modal-body" style={{paddingTop: "0px", paddingBottom: "6px"}}>
                            <label htmlFor="tag" className="mb-1" style={{fontWeight: "500"}}>Tag</label>
                            <div className="d-flex align-items-center">
                                <input type="text" className="form-control" id="tag" name="tag" placeholder="Enter tag" onChange={handleChange} autoComplete="on" value={selectedNote.tag==="General"?"":selectedNote.tag}/>
                                <img src={`${theme==="light"?"/icons/close.png":"/icons/close2.png"}`} height="18px" width="18px" alt="close icon" onClick={()=>{clearText("tag");}} style={{margin: "0px 2px 0px 10px", opacity: `${selectedNote.tag==="General" || selectedNote.tag===""?"0":"1"}`}}/>
                            </div>
                        </div>
                        <div className="modal-body" style={{paddingTop: "0px", paddingBottom: "6px"}}>
                            <label htmlFor="description" className="mb-1" style={{fontWeight: "500"}}>Description</label>
                            <div className="d-flex align-items-center">
                                <textarea className="form-control" id="description" name="description" placeholder="Enter description" rows="3" onChange={handleChange} autoComplete="on" value={selectedNote.description}></textarea>
                                <img src={`${theme==="light"?"/icons/close.png":"/icons/close2.png"}`} height="18px" width="18px" alt="close icon" onClick={()=>{clearText("description");}} style={{margin: "0px 2px 0px 10px", opacity: `${selectedNote.description===""?"0":"1"}`}}/>
                            </div>                          
                        </div>                       
                        <div className="modal-body" style={{display: "flex", justifyContent: "center", paddingTop: "4px"}}>
                            <button className="submit-button" onClick={handleSubmit} onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>Edit Note</button>
                        </div>                       
                    </div>
                </div>
            </div>
        </>
    )
}
