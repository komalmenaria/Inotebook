const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");


//Route 1 : Get All the notes using : get " /api/notes/getuser". login required

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//Route 2 : add a new  the notes using : POst " /api/notes/addnote". login required
 


router.post(
  '/addnote',
  fetchuser,
  [
    body("title", "Enter a valid Title").isLength({ min: 3 }),
    body("description", "Description must be alteast 5 character").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      })

      const saveNote = await note.save()
      res.json(saveNote)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });


//Route 3 : Update an existing  notes using : PUT " /api/notes/updatenote". login required
router.put('/updatenote/:id',fetchuser,async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        
    
// create a newNote object
const newNote = {};
if(title){newNote.title = title}
if(description){newNote.description = description}
if(tag){newNote.tag = tag}

//find the note to updated and update it
let note = await Note.findById(req.params.id);
if (!note) {
    return res.status(404).send("Not Found")}    

if (note.user.toString() !== req.user.id){
    return res.status(401).send("Not allow")}

    note = await Note.findByIdAndUpdate(req.params.id, {$set:newNote}, {new:true})
    res.json({note});
}
catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})


//Route 4 : Delete an existing  notes using : DELETE " /api/notes/deletenote". login required
router.delete('/deletenote/:id',fetchuser,async (req, res) => {
try {

//find the note to deleted and delete it
let note = await Note.findById(req.params.id);
if (!note) {
    return res.status(404).send("Not Found")}    
  

    // Allow deletion only if user owns this Note
if (note.user.toString() !== req.user.id){
    return res.status(401).send("Not allow")}

    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"Success":"Note has been deleted", note:note});
}
catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})
module.exports = router;
