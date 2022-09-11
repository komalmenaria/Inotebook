import React,{useContext} from "react";
import noteContext from "../context/notes/noteContext";


const Noteitem = (props) => {
  const context = useContext(noteContext);
  const { deleteNote } = context;
  const { note ,updateNote } = props;


  return (
    <div className="col-md-3">
      <div className="card my-3">
        <div className="card-body">
            <div className="d-flex komal">
          <h5 className="card-title mx-2"> {note.title}</h5>

            <div className="d-flex kom2">
            <i className="fas fa-trash-alt mx-3 one" onClick={()=>{deleteNote(note._id);props.showAlert("  Note Deleted Successfully ","danger")}}></i>
          <i className="fas fa-edit mx-3 two" onClick={()=>{updateNote(note)}}></i>
            </div>
            </div>
          <p className="card-text"> {note.description}</p>
          <center><p className=" my-unique card-text"> {note.tag}</p></center>
          
         
         
        </div>
      </div>
    </div>
  );
};

export default Noteitem;
