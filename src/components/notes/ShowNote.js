import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CursorContext from "../../context/cursor/CursorContext";
import ThemeContext from "../../context/theme/ThemeContext";
import ProgressContext from "../../context/progress/ProgressContext";
import AlertContext from "../../context/alert/AlertContext";
import TextContext from "../../context/text/TextContext";
import NoteContext from "../../context/notes/NoteContext";
import ChipTags from "./ChipTags";
import Throbber from "../Throbber";
import NoteItem from "./NoteItem";

export default function Note() {

    const navigate = useNavigate();

    const scrollContainerRef = useRef(null);
    const notesScrollRef = useRef(null);

    const {handleCursorEnter, handleCursorLeave} = useContext(CursorContext);
    const {theme} = useContext(ThemeContext);
    const {showProgress} = useContext(ProgressContext);
    const {showAlert} = useContext(AlertContext);
    const {handleCapitalizeFirstLetter, giveMeDay, giveMeTime, calculateCharacters, calculateWords} = useContext(TextContext);
    const {notes, fetchNote, deleteNote, editNote} = useContext(NoteContext);
    
    const [keyword, setKeyword] = useState("");
    const [selectedOrder, setSelectedOrder] = useState("latest");
    const [selectedTag, setSelectedTag] = useState("");
    const [uniqueTags, setUniqueTags] = useState([]);
    const [filteredNotes, setFilteredNotes] = useState([]);
    const [xScrollLeft, setXScrollLeft] = useState(false);
    const [xScrollRight, setXScrollRight] = useState(false);
    const [xScrollRightPrevValue, setXScrollRightPrevValue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notesYScroll, setNotesYScroll] = useState(false);
    const [selectedNote, setSelectedNote] = useState({
        _id: "",
        user: "",
        title: "",
        description: "",
        tag: "",
        date: "",
        __v: ""
    });
    const [activeModal, setActiveModal] = useState(null);
    
    const handleKeywordChange = (e) => {
        setKeyword(e.target.value);
        setSelectedTag("");        
        if(keyword.trim() !== ""){
            setFilteredNotes(notes.filter((note)=>{return note.title.toLowerCase().includes(keyword.toLowerCase()) || note.tag.toLowerCase().includes(keyword.toLowerCase()) || note.description.toLowerCase().includes(keyword.toLowerCase())}));
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
        for(let i=0; i<notes.length; i++){
            if(!unique_tags.includes(notes[i].tag)){
                unique_tags.push(notes[i].tag);
            }
        }
        setUniqueTags(unique_tags);    
    }
    
    const handleSelectTag = (selected_tag) => {
        setKeyword("");
        setSelectedTag(selected_tag);
        setFilteredNotes(notes.filter((note)=>{return note.tag.toLowerCase().includes(selected_tag.toLowerCase())}));
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
    
    const notesScrollToTop = () => {
        notesScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }

    const handleChange = (e) => {
        setSelectedNote({...selectedNote, [e.target.name]: e.target.value.trimStart()});
    }
    
    const OpenNoteDetailModal = (note) => {
        setSelectedNote(note);
        const myModal = new window.bootstrap.Modal(document.getElementById("noteDetailModal"));
        setActiveModal(myModal);
    }
    
    const OpenEditModal = () => {
        const myModal = new window.bootstrap.Modal(document.getElementById("editModal"));
        setActiveModal(myModal);
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
        if(ans){
            if(deleteNote(id)){
                activeModal.hide(); 
            }            
        }
    }

    useEffect(() => {
        if(localStorage.getItem("token")){
            fetchNote();
        }else{
            navigate("/login");
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if(notes.length !== 0){
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
            }, 1500);
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
                            <div className="d-flex align-items-center" style={{width: "500px", padding: "4px 8px", borderRadius: "6px", backgroundColor: `${theme==="light"?"white":"#212529"}`, border: `${theme==="light"?"1px solid #bebebe":"1px solid #424549"}`}}> 
                                <img src="/icons/search.png" height="20px" width="20px" alt="search icon"/>&nbsp;&nbsp;
                                <input id="search" name="search" className="search-bar-input" placeholder="Search notes" value={keyword} onChange={handleKeywordChange} style={{backgroundColor: `${theme==="light"?"white":"#212529"}`, color: `${theme==="light"?"black":"white"}`}}/>&nbsp;&nbsp;
                                <img src="/icons/close3.png" height="14px" width="14px" alt="close icon" onClick={()=>{clearText("keyword")}} style={{opacity: `${keyword===""?"0":"1"}`}}/>
                            </div>
                        </form>
                    </div>
                    <div className="d-flex justify-content-center" style={{marginTop: "12px"}}>
                        <button className={`chip${theme==="light"?"-light":"-dark"} left-scroll-arrow${xScrollLeft?"-show":""}`} style={{marginRight: "6px"}} onClick={() => handleScroll(-100)}>
                            <img src={`/icons/${theme==="light"?"left_light":"left_dark"}.png`} height="14px" width="14px" alt="left icon" style={{marginBottom: "3px", marginRight: "2px"}}/>
                        </button>
                        <div style={{display: "flex", justifyContent: "center", width: "800px"}}>
                            <div ref={scrollContainerRef} className="scroll-menu">
                                <div style={{display: "flex", gap: "6px"}}>
                                    <button className={`chip${theme==="light"?"-light":"-dark"} ${(selectedOrder==="latest" || selectedOrder==="oldest") && keyword==="" && selectedTag===""?"chip-active":""}`} onClick={()=>{setKeyword(""); setSelectedTag("");}}>All</button>
                                    <button className={`chip${theme==="light"?"-light":"-dark"} ${selectedOrder==="latest"?"chip-active":""}`} onClick={()=>{setSelectedOrder("latest")}}>Latest</button>
                                    <button className={`chip${theme==="light"?"-light":"-dark"} ${selectedOrder==="oldest"?"chip-active":""}`} onClick={()=>{setSelectedOrder("oldest")}}>Oldest</button>
                                    {   
                                        uniqueTags.length !==0 ?                 
                                        uniqueTags.map((tag, index) => {
                                            return <ChipTags key={index} tag={tag} selectedTag={selectedTag} handleSelectTag={handleSelectTag}/> 
                                        })
                                        :
                                        <></>
                                    }
                                </div>
                            </div>
                        </div>
                        <button className={`chip${theme==="light"?"-light":"-dark"} right-scroll-arrow${xScrollRight?"-show":""}`} style={{marginLeft: "6px"}} onClick={() => handleScroll(100)}>
                            <img src={`/icons/${theme==="light"?"right_light":"right_dark"}.png`} height="14px" width="14px" alt="right icon" style={{marginBottom: "3px", marginLeft: "2px"}}/>
                        </button>
                    </div>
                    
                    {loading?
                        <Throbber/>
                    :
                    <>  
                        <div ref={notesScrollRef} style={{marginTop: "32px", height: "410px", overflowY: "auto", scrollbarWidth: "none"}} onScroll={() => setNotesYScroll(notesScrollRef.current.scrollTop > 0)}>
                            <div className="notes-collection">
                                {   
                                    selectedTag !=="" ?
                                        selectedOrder ==="latest" ?
                                            (filteredNotes).map((note)=>{
                                                return <NoteItem key={note._id} note={note} OpenNoteDetailModal={() => OpenNoteDetailModal(note)}/>
                                            }).reverse()
                                        : 
                                            (filteredNotes).map((note)=>{
                                                return <NoteItem key={note._id} note={note} OpenNoteDetailModal={() => OpenNoteDetailModal(note)}/>
                                            })
                                    :
                                        selectedOrder ==="latest" ?
                                            (keyword===""?notes:filteredNotes).map((note)=>{
                                                return <NoteItem key={note._id} note={note} OpenNoteDetailModal={() => OpenNoteDetailModal(note)}/>
                                            }).reverse()
                                        : 
                                            (keyword===""?notes:filteredNotes).map((note)=>{
                                                return <NoteItem key={note._id} note={note} OpenNoteDetailModal={() => OpenNoteDetailModal(note)}/>
                                            })
                                }
                            </div>
                        </div>
                        <button className={`up-arrow${notesYScroll?"-show":""}`} onClick={notesScrollToTop} onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>&uarr;</button>                        
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
                                <button className="modal-button" onClick={()=>{activeModal.hide(); OpenEditModal();}}><img src={`${theme==="light"?"/icons/edit.png":"/icons/edit2.png"}`} alt="edit icon"/></button>
                                <button className="modal-button" onClick={()=>{handleDeleteNote(selectedNote?._id)}}><img src={`${theme==="light"?"/icons/delete.png":"/icons/delete2.png"}`} alt="delete icon"/></button>
                                <button className="modal-button" data-bs-dismiss="modal" aria-label="Close"><img src={`${theme==="light"?"/icons/close.png":"/icons/close2.png"}`} alt="close icon"/></button>
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
                            <button className="modal-button" data-bs-dismiss="modal" aria-label="Close"><img src={`${theme==="light"?"/icons/close.png":"/icons/close2.png"}`} alt="close icon"/></button>
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
