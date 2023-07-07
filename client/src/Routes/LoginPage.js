import React,{useState, useRef} from 'react';
import './css/Login.css';
import axios from 'axios';
import logo from '../images/logo.png'

const Login = ({setLogin}) => {
    //login refs
    const username= useRef(null);
    const password= useRef(null);
    const email= useRef(null);
    const usernameL= useRef(null);
    const passwordL= useRef(null);

    //sets login or sign up page
    const [logorsign,setLogorSign]= useState("login");
    //same password vars
    const[newpass1, setNewpass1]=useState(true);
    const[newpass2, setNewpass2]=useState(true);

    const checkpassword1 = (e) =>{
        setNewpass1(e.target.value);
    }
    const checkpassword2 = (e) =>{
        setNewpass2(e.target.value);
    }

    const loginToggle = () => {
        setLogorSign("login")
    }
    const signupToggle = () => {
        setLogorSign("signup")
    }

    const submitLogin = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', usernameL.current.value);
        formData.append('password', passwordL.current.value);


        axios.post('http://localhost:5000/submit-login', [...formData])
        .then(response => {
            console.log(response.data.message);
            console.log(response.data.message===true);
            if(response.data.message===true){
                setLogin(true);
                localStorage.setItem('isLoggedIn', JSON.stringify(true));
                localStorage.setItem('username', usernameL.current.value);
            }else(
                alert(response.data.message)
            )
          })
          .catch(error => {
            console.error(error);
          });
    }

    const submitSignIn = (e) => {
        if(newpass1 !== newpass2){
            alert("passwords must match");
            e.preventDefault();
        }else{
            e.preventDefault();
            const formData = new FormData();

            formData.append('username', username.current.value);
            formData.append('email', email.current.value);
            formData.append('password', password.current.value);

            axios.post('http://localhost:5000/submit-signin', [...formData])
            .then(response => {
                console.log(response.data.message);
                console.log(response.data.message===true);
                if(response.data.message===true){
                    setLogin(true);
                    localStorage.setItem('isLoggedIn', JSON.stringify(true));
                    localStorage.setItem('username', username.current.value);
                }
                if(response.data.message!==true){
                    alert(response.data.message);
                }
            })
            .catch(error => {
                console.error(error);
            });
        }
    }

    return(
        <>
        <div id="loginpage">
        <img src={logo} style={{width:20+"dvh", justifySelf:"center"}}></img>
            
            <div className={logorsign==="login"?"login":"loginNone"}>
            <div className="loginselector">
                <button onClick={loginToggle}>Login</button><button onClick={signupToggle}>Sign Up</button>
            </div>
                <h1>Login:</h1>
                <form onSubmit={submitLogin}>
                    <label htmlFor='username'>Username:</label><br/>
                    <input type='text' placeholder='username' ref={usernameL} required></input><br/>
                    <label htmlFor='password'>Password:</label><br/>
                    <input type='password' placeholder='your password' ref={passwordL}  required></input><br/>
                    <input className="loginSubmit" type='submit'/>
                </form>
            </div>
            <div className={logorsign==="login"?"signupNone":"signup"}>
            <div className="loginselector">
                <button onClick={loginToggle}>Login</button><button onClick={signupToggle}>Sign Up</button>
            </div>
                <h1>Sign Up:</h1>
                <form onSubmit={submitSignIn}>
                    <label htmlFor='email'>Email:</label><br/>
                    <input type='email' placeholder='your email' ref={email} required></input><br/>
                    <label htmlFor='username'>Username:</label><br/>
                    <input type='text' placeholder='username' ref={username} required></input><br/>
                    <label htmlFor='password'>Password:</label><br/>
                    <small>Please ensure your password is atleast 6 characters and contains a number</small><br/>
                    <input type='password' placeholder='your password' ref={password} pattern="^(?=.*[0-9]).{6,}$"   onChange={checkpassword1} required></input><br/>
                    <label htmlFor='confirmPassword'>Confirm password:</label><br/>
                    <input type='password' placeholder='confirm password' onChange={checkpassword2}  pattern="^(?=.*[0-9]).{6,}$"required></input><br/>
                    <input className="loginSubmit" type='submit'/>
                </form>
            </div>
        </div>
        </>
    )
}

export default Login;