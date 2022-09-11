const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser')




const JWT_secret = "Harryisagoodboy";

// route 1 : create a user using post "/api/auth/createuser" . no login required
router.post('/createUser',[
    body('name','Enter a valid name').isLength({ min: 5 }),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be alteast 5 character').isLength({ min: 5 }),
], async (req ,res)=>{
  let success= false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }


    // check weather the user with the email exist already
try {
  

    let user = await User.findOne({email: req.body.email});
    
    if(user){
      return res.status(400).json({success, errors: "Sorry a user with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password , salt);
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,

      })
      

      const data ={
        user:{
          id: user.id
        }
      }
      // .then(user => res.json(user)).catch(err=>{ console.log(err)
      // res.json({error : 'Please enter a unique value for email',message: err.message})})
 const authtoken =   jwt.sign(data , JWT_secret )
//  console.log(jwtData);
success = true;
res.json({success,authtoken })

}
catch (error) {
  console.error(error.message);
  res.status(500).send("Internal Server Error")
}
// res.send("im noob")
   
})

//Route 2 : authentication a user using : POST " api/auth/login".  No login required

router.post('/login',[
  body('email','Enter a valid email').isEmail(),
  body('password','Password cannot be blank').exists(),

], async (req ,res)=>{


  let success= false;
  // if there are errors , return bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    success = false;
    return res.status(400).json({success, errors: errors.array() });
  }

  const {email , password} = req.body;
  try {
    let user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({error: " Please try to login with correct credentials"});
    }

const passwordCompare = await bcrypt.compare(password , user.password);
if (!passwordCompare) {
  success = false;
  return res.status(400).json({success,error: " Please try to login with correct credentials"});
  
}

const data ={
  user:{
    id: user.id
  }
}

 success = true;
const authtoken =   jwt.sign(data , JWT_secret )
res.json({ success,authtoken})
  } 
  
  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
  });




//Route 3 : Get loggedin a user details using : POST " api/auth/getuser".   login required

router.post('/getuser', fetchuser, async (req ,res)=>{

try {
let userId = req.user.id;
// console.log(userId)
  const user = await  User.findById(userId).select("-password")
  // console.log(user)
res.status(200).send(user)
} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal Server Error");
}
})
module.exports = router;