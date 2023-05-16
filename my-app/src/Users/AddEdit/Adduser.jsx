import './Adduser.css'
import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { useLocation } from "react-router-dom";
import Footer from '../../footer/footer';



export default function Adduser() {

    const location = useLocation();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [role, setRole] = useState('');
    const [emailerr, setEmailerr] = useState('');
    const [emailpass, setEmailpass] = useState(false);
    const [contacterror, setContacterror] = useState(false);
    const [nameerror, setNameerror] = useState(false);
    const [roleerror, setRoleerror] = useState(false);
    const [heading, setHeading] = useState(false);
    const [data, setdata] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state) {
            const { _id, name, contact, role } = location.state.user;
            setName(name)
            setEmail(_id)
            setContact(contact)
            setRole(role)
            setHeading(true)
        }
        const fetchData = async () => {
            try {
                let response = await fetch('http://localhost:8080/roles', {
                    method: 'GET',
                })
                let responses = await response.json();
                //console.log(responses);
                setdata(responses)
                // console.log("----------------",data);

            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    if (heading) {
        const heading = "UPDATE USER"
    } else {
        const heading = "ADD USER"
    }

    const userid = localStorage.getItem("userid")
    const formdata = {
        _id: email,
        name: name,
        contact: parseInt(contact),
        role: role,
        createdBY: userid
    };

    const navigates = async (e) => {
        e.preventDefault();
        if (name && contact && role != null && emailpass) {
            try {
                await fetch('http://localhost:8080/adduser', {
                    method: 'POST',
                    body: JSON.stringify(formdata),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((res) => {
                    console.log("--------------", res.status);
                    if (res.status === 200) {
                        toast.success('User Added !', {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 1000,
                        })
                        setTimeout(1000)
                        navigate("/Users/List/User")
                    } else if (res.status === 400) {
                        toast.warning('Please Contact Administration', {
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
            toast.error('Fill all the details properly', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            })
        }

    };


    const emailvalidation = (event) => {
        console.log(emailpass);
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
        event.preventDefault();

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
        if (fieldName === 'role' && !role) {
            //console.log('role');
            setRoleerror("select role");
            return
        }



    }
    const cancel = () => {
        navigate("/Users/List/User")
    }
    const formdata2 = {
        _id: email,
        name: name,
        contact: parseInt(contact),
        role: role,
        updatedBY: userid
    };
    const update = async (e) => {
        e.preventDefault();
        if (name && contact && role != null) {
            try {
                await fetch('http://localhost:8080/update', {
                    method: 'POST',
                    body: JSON.stringify(formdata2),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((res) => {
                    console.log("--------------", res.status);
                    if (res.status === 200) {
                        toast.success('User Updated !', {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 1000,
                        })
                        setTimeout(1000)
                        navigate("/Users/List/User")
                    } else if (res.status === 400) {
                        toast.error('User Already Exist', {
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
            toast.error('Fill all the details properly', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            })
        }

    }

    return (
        <div className='addusertopdiv'>
            <h1 className={heading ? 'updateuserheading' : 'adduserheading'}></h1>
            <form className='adduserform'>
                <div>
                    <div>
                        <input
                            type="email"
                            name="email"
                            className={heading ? 'updateuseremailinput' : 'adduseremailinput'}
                            value={email}
                            placeholder="Email"
                            onChange={(event) => setEmail(event.target.value)}
                            onKeyUp={emailvalidation}
                        />
                    </div>
                    <div className="errmsg">
                        <p>{emailerr}</p>
                    </div>

                    <div>
                        <input
                            type="text"
                            name="name"
                            className="adduserinput"
                            value={name}
                            placeholder="Full Name"
                            onChange={(event) => setName(event.target.value)}
                            onKeyUp={(event) => validation(event, 'name')}
                        />
                    </div>

                    {nameerror &&
                        <div className="errmsg">
                            <p>Enter Name</p>
                        </div>
                    }
                    <div>
                        <input
                            type="tel"
                            name="contact"
                            className="adduserinput"
                            value={contact}
                            placeholder="Contact No."
                            onChange={(event) => setContact(event.target.value)}
                            onKeyUp={(event) => validation(event, "contact")}
                        />
                    </div>

                    {contacterror &&
                        <div className="errmsg">
                            <p>Enter Contact Number</p>
                        </div>
                    }

                    <div>
                        <select
                            value={role}
                            name="role"
                            onChange={(event) => setRole(event.target.value)}
                            onKeyUp={(event) => validation(event, "role")}
                            className="adduserinput"
                        >
                        <option
                        > <span className="options">Select Role</span>
                        </option>
                        {data?.map((user) => (
                        <option
                            value={user._id}
                            className="options"

                        > {user.role}
                        </option>
                        ))}
                        </select>
                    </div>
                    <div className='buttons'>
                        <div>
                            <button
                                className="adduserbutton"
                                type="button"
                                onClick={heading ? update : navigates}
                            >DONE
                            </button>
                        </div>
                        <div>
                            <button
                                className="cancelbutton"
                                type="button"
                                onClick={cancel}
                            >CANCEL
                            </button>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </form>
            <Footer/>
        </div>
    )
}






