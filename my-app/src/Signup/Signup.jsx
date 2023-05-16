import "./signup.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




function Signup() {


    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
    const [cnfpass, setCnfpass] = useState();
    const [role, setRole] = useState('');
    const [err, setErr] = useState('');
    const [emailerr, setEmailerr] = useState('');
    const [perr, setPerr] = useState('');
    const [pass, setPass] = useState(false);
    const [emailpass, setEmailpass] = useState(false);
    const [contacterror, setContacterror] = useState(false);
    const [nameerror, setNameerror] = useState(false);
    const [roleerror, setRoleerror] = useState(false);
    const [passwordmatches, isPasswordMatches] = useState(false);
    const [data, setdata] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await fetch('http://localhost:8080/roles', {
                    method: 'GET',
                })
                let responses = await response.json();
                //console.log(responses);
                setdata(responses)
                console.log("----------------",data);

            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const formdata = {
        _id: email,
        name: name,
        contact: parseInt(contact),
        role: role,
    };


    const navigates = async (e) => {
        e.preventDefault();
        if (name && contact && role !=null&& emailpass) {
            try {
                await fetch('http://localhost:8080/signup', {
                    method: 'POST',
                    body: JSON.stringify(formdata),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((res) => {
                    console.log("--------------", res);
                    if (res.status === 200) {
                        toast.success('Welcome Back !', {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 1000,
                        })
                        setTimeout(1000)
                        navigate("/")
                    } else if (res.status === 400) {
                        toast.error('Email Already Registered', {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 2000,
                        })
                    }

                })
            } catch (error) {
                console.log("------------error", error);
            }
        }
        else {
            console.log("errorrrrrrrrrrrrrrrrrrrrr")
            toast.error('Fill all the details properly', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            })
        }

    };

    const emailvalidation = (event) => {

        if (event.target.value.length === 0) {
            setEmailerr("")
            setEmailpass(false)
        }
        else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(event.target.value)) {
            setEmailerr('Invalid email address')
            setEmailpass(false)
        }
        else {
            setEmailerr("")
            setEmailpass(true)
        }

    }

    const validation = (event, fieldName) => {
        setNameerror(false)
        setContacterror(false)
        setErr("")
        event.preventDefault();

        if (fieldName === 'CnfPassword' && !cnfpass) {
            //console.log('CnfPassword');
            setErr("Enter password again")
            return
        }
        if (fieldName === 'role' && !role) {
            //console.log('role');
            setRoleerror("select role");
            return
        }
        if (fieldName === 'name' && !name) {
            //console.log('name');
            setNameerror(true);
            return
        }
        if (fieldName === 'contact' && contact.length < 1) {
            //console.log('contact');
            setContacterror(true);
            return
        }
        if (fieldName === 'CnfPassword' && cnfpass != password) {
            //console.log('password matching');
            setErr("Password does not matches");
            isPasswordMatches(false)
            return

        }
        isPasswordMatches(true)
        
        

    }
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

    const login = () => {
        navigate("/ ")
    }

    return (
        <div className="box">
            <form className="myForm1">

                <h1>Sign Up</h1>

                <div className='form_input'>
                    <input
                        type="text"
                        name="name"
                        className={name ? 'nameValidated':'nameInvalid'}
                        value={name}
                        placeholder="Full Name"
                        onChange={(event) => setName(event.target.value)}
                        onKeyUp={(event) => validation(event, 'name')}
                    />
                </div>
                {nameerror &&
                    <div className="errmsg1">
                        <p>Enter Name</p>
                    </div>
                }

                <div className='form_input'>
                    <input
                        type="email"
                        name="email"
                        className={emailpass ? 'emailValidated':'emailInvalid'}
                        value={email}
                        placeholder="Email"
                        onChange={(event) => setEmail(event.target.value)}
                        onKeyUp={emailvalidation}
                    />
                </div>

                <div className="errmsg1">
                    <p>{emailerr}</p>
                </div>

                <div className='form_input'>
                    <input
                        type="tel"
                        name="contact"
                        className={contact ? 'contactValidated':'contactInvalid'}
                        value={contact}
                        placeholder="Contact No."
                        onChange={(event) => setContact(event.target.value)}
                        onKeyUp={(event) => validation(event, "contact")}
                    />
                </div>

                {contacterror &&
                    <div className="errmsg1">
                        <p>Enter Contact Number</p>
                    </div>
                }
                <div className="form_input">
                    
                    <select
                        value={role}
                        name="role"
                        className="selects"
                        onChange={(event) => setRole(event.target.value)}
                        onKeyUp={(event) => validation(event, "role")}
                    >
                        <option><span className="options">Select Role</span></option>
                        {data?.map((user) => (
                        <option
                            value={user._id}
                            className="options"
                        > {user.role}
                        </option>
                        ))}
                    </select>
                
                </div>

                <div className="button" >
                    <button
                        type="button" 
                        
                        onClick={navigates}>SIGN UP
                    </button>
                </div>
                <div className="aau">
                    <span className="alreadyauser">Already a user ?</span>
                    <a className="login" onClick={login}>Log In</a>
                </div>
            </form>
            <ToastContainer />
        </div>

    );
}

export default Signup;