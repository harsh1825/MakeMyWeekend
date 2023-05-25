import './Login.css'
import { useNavigate, Link } from "react-router-dom";
import React, { useState, useContext, createContext } from "react";
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NoteContext } from '../context/notecontext';
import App from '../App';
import Userprofile from '../Users/userprofile/userprofile';
import ForgetPassword from './forgotPassword/forgotPassword';


export default function Login() {

    

    const navigate = useNavigate();

    const { setuName } = useContext(NoteContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [perpassword, setperPassword] = useState('');
    const [percnfpassword, setpercnfPassword] = useState('');
    const [userName, setuserName] = useState('');
    const [permanentpasswordflag, setpermanentpasswordflag] = useState(false);
    const [perr, setPerr] = useState('');
    const [pass, setPass] = useState(false);
    const [passwordmatches, isPasswordMatches] = useState(false);
    const [err, setErr] = useState('');




    const logindata = {
        _id: email,
        password: password
    }

    const navigates = async (event) => {
        event.preventDefault();
        if (Object.values(email).every((value) => value === null) ||
            Object.values(password).every((value) => value === null)) {
            toast.warning("Fields can not be Empty", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
                className: "toast_msg"
            })
        }

        else {

            try {
                let response = await fetch('http://localhost:8080/login', {
                    method: 'POST',
                    body: JSON.stringify(logindata),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors'


                })
                let responses = await response.json()
                if (responses == '404') {
                    toast.warning('You are not verified ! Contact Admin', {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                        className: "toast_msg",
                    })
                }
                else if (responses == '700') {
                    setpermanentpasswordflag(true)
                }
                else if (responses == '400') {
                    toast.error('Invalid', {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                        className: "toast_msg",
                    })
                }
                else {
                    let token = response.headers.get("Token");
                    localStorage.setItem('JWT', token)
                    // console.log(token)
                    // console.log(responses);
                    localStorage.setItem('username', responses.name)
                    localStorage.setItem('userid', responses._id)
                    localStorage.setItem('usercontact', responses.contact)
                    localStorage.setItem('userrole', responses.role)

                    const myname = localStorage.getItem("dbuser", responses)
                    setuName(myname)
                    navigate('/Homepage/Homepage');
                }


            }
            catch (error) {
                console.log("------------error", error);
                toast.error('Invalid', {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 1000,
                    className: "toast_msg",
                })
            }

            // console.log('------langggg-----',name);


            //store.update(userName);



        }
    };


    const passwordCheck = (event) => {

        const uppercaseRegExp = /(?=.*?[A-Z])/;
        const lowercaseRegExp = /(?=.*?[a-z])/;
        const digitsRegExp = /(?=.*?[0-9])/;
        const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
        const minLengthRegExp = /.{8,}/;
        const passwordLength = event.target.value.length;
        const uppercasePassword = uppercaseRegExp.test(event.target.value);
        const lowercasePassword = lowercaseRegExp.test(event.target.value);
        const digitsPassword = digitsRegExp.test(event.target.value);
        const specialCharPassword = specialCharRegExp.test(event.target.value);
        const minLengthPassword = minLengthRegExp.test(event.target.value);
        setPerr("")
        setPass(true)
        console.log("good to go",pass)


        if (passwordLength === 0) {
            setPerr("Password is empty");
            setPass(false)
        }

        if (!uppercasePassword) {
            setPerr("Password must contain an uppercase");
            setPass(false)
        }
        if (!lowercasePassword) {
            setPerr("Password must contain a lowercase");
            setPass(false)
        }
        if (!digitsPassword) {
            setPerr("Password must contain number");
            setPass(false)
        }
        if (!specialCharPassword) {
            setPerr("Password must a special character");
            setPass(false)
        }
        if (!minLengthPassword) {
            setPerr("Password must be of minimum 8 characters");
            setPass(false)
        }
        
    }

    const validation = (event) => {
        setErr("")
        event.preventDefault();

        if (!percnfpassword || percnfpassword != perpassword) {
            //console.log('CnfPassword');
            setErr("Password does not matches");
            isPasswordMatches(false)
            return
        }
        
        isPasswordMatches(true)
        
    }

    const signup = () => {
        navigate("/Signup/Signup")
    }
    const logindata2 = {
        _id: email,
        password: perpassword,
        temppassword:"123456789098765432345678"
    }
    const settingpermanentpassword = async(event) => {
        event.preventDefault();
        if (Object.values(perpassword).every((value) => value === null) ||
            Object.values(percnfpassword).every((value) => value === null)) {
            toast.warning("Fields can not be Empty", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
                className: "toast_msg"
            })
        }
        else if(percnfpassword != perpassword){
            toast.error("Password does not match", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
                className: "toast_msg"
            })
        }
        else if(perr != ""){
            toast.error("Enter Proper password", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
                className: "toast_msg"
            })
        }
        else {

            try {
                let response = await fetch('http://localhost:8080/updateperpass', {
                    method: 'POST',
                    body: JSON.stringify(logindata2),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors'
                })
                let responses = await response.json()
                if (responses == '200') {
                    toast.success('Done', {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                        className: "toast_msg",
                    })
                    setpermanentpasswordflag(false)
                }
                else {

                    toast.error('wrong try again', {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                        className: "toast_msg",
                    })
                }


            }
            catch (error) {
                console.log("------------error", error);
                toast.error('Invalid', {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 1000,
                    className: "toast_msg",
                })
            }



        }
    }

    return (
        <div className="box">
            {permanentpasswordflag ? 
            <form className="myForm2" onSubmit={settingpermanentpassword}>

                <h1>Set Password</h1> 

                <div className='form_input'>
                    <input
                        type="password"
                        name="Password"
                        className="password"
                        value={perpassword}
                        placeholder="Password"
                        onChange={(event) => setperPassword(event.target.value)}
                        onKeyUp={passwordCheck}
                    />
                </div>
                <div className="errmsg1">
                    <p>{perr}</p>
                </div>
                <div className='form_input'>
                    <input
                        type="password"
                        name="Password"
                        className="password"
                        value={percnfpassword}
                        placeholder="Confirm Password"
                        onChange={(event) => setpercnfPassword(event.target.value)}
                        onKeyUp={validation}
                    />
                </div>
                <div className="errmsg1">
                    <p>{err}</p>
                </div> 
                <div className="button" >
                    <button
                        type="submit">SUBMIT
                    </button>
                </div>

                
            </form> :




            <form className="myForm2" onSubmit={navigates}>

                <h1>Log In</h1>
                
                <div className='form_input'>
                    <input
                        type="email"
                        name="email"
                        className="emailinput"
                        value={email}
                        placeholder="Email"
                        onChange={(event) => setEmail(event.target.value)}

                    />
                </div>

                <div className='form_input'>
                    <input
                        type="password"
                        name="Password"
                        className="password"
                        value={password}
                        placeholder="Password"
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>

                <div className="button" >
                    <button
                        type="submit">LOG IN
                    </button>
                </div>


                <div className="aau2">

                    <Link className="signup" to='/Login/forgotPassword/forgotPassword'>Forgot Password ?</Link>
                </div>
                <div className="aau">
                    <span className='notauser'>Not a user ?</span>
                    <a className="signup" onClick={signup}>Sign up</a>
                </div>
            </form>
            }
            <ToastContainer />
        </div>

    );
}

