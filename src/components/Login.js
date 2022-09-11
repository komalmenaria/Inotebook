import React,{useState,useEffect} from 'react'
import { useHistory } from 'react-router-dom'

const Login = (props) => {

useEffect( async () => {
  
let checkToken= await localStorage.getItem('token')
if(checkToken){
  history.push("/")
}
}, [])
const [credential, setCredential] = useState({email:"",password:""})
let history = useHistory();

const handleSubmit = async (e)=>{
e.preventDefault();

const response = await fetch("http://localhost:5000/api/auth/login" , {
    method: 'POST', 
    
    headers: { 
      'Content-Type': 'application/json',
      
    },
    
    body: JSON.stringify({email :credential.email,password :credential.password})
  });
const json = await response.json()
console.log(json)

if (json.success) {
    //  save the auth token and redirect
    localStorage.setItem('token' , json.authtoken)
    history.push("/")
    props.showAlert(`  Hey user  ${credential.email}  you are login successfully ` ,"success")
}else{
  props.showAlert("  Invalid details ","danger")
}


}
const onChange = (e)=>{
    setCredential({...credential , [e.target.name]: e.target.value})
        }

    return (
        <div className="mt-3">
           <form onSubmit={handleSubmit}>
             <h3>Login to continue in iNoteBook</h3>
  <div className="mb-3">
    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
    <input type="email" className="form-control" value={credential.email}  onChange={onChange}  id="email" name="email" aria-describedby="emailHelp" />
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3" >
    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
    <input type="password" className="form-control" value={credential.password}    onChange={onChange}   id="password"  name="password" /> 
  </div>
  <button type="submit" className="btn btn-primary"  >Login</button>
</form>            
        </div>
    )
}

export default Login
