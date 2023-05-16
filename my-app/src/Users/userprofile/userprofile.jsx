import Footer from "../../footer/footer";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './userprofile.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Userprofile() {



    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [role, setRole] = useState('');
    const [data, setdata] = useState();

    const formdata = {
        _id: email,
        name: name,
        contact: parseInt(contact),
        role: role,
        updatedBY: email
    };


    const myname = localStorage.getItem("username").charAt(0)

    useEffect(() => {

        setName(localStorage.getItem("username"))
        setEmail(localStorage.getItem("userid"))
        setContact(localStorage.getItem("usercontact"))
        setRole(localStorage.getItem("userrole"))

        const fetchData = async () => {
            try {
                let response = await fetch('http://localhost:8080/roles', {
                    method: 'GET',
                })
                let responses = await response.json();
                //console.log(responses);
                setdata(responses)
                // console.log("----------------", data);

            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [])

    const update = async (e) => {
        e.preventDefault();
        if (name && contact && role != null) {
            try {
                await fetch('http://localhost:8080/update', {
                    method: 'POST',
                    body: JSON.stringify(formdata),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((res) => {
                    console.log("--------------", res.status);
                    if (res.status === 200) {
                        console.log("-------4-------", res.status);
                        toast.success('User Updated !', {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 1000,
                        })
                        localStorage.setItem("username", formdata.name)
                        localStorage.setItem("usercontact", formdata.contact)
                        localStorage.setItem("userrole", formdata.role)
                        navigate("/Homepage/Homepage");
                        

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


    const cancel = () => {
        navigate("/Homepage/Homepage")
    }

    return (
        <div className="userprofile1">
            <div className="firstchar1">{myname}</div>
            <h2 className='heading2'>USER PROFILE</h2>
            <form className='adduserform2'>
                <div>
                    <div>
                        <input
                            type="email"
                            name="email"
                            className='updateuseremailinput'
                            value={email}
                            placeholder="Email"
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="name"
                            className="adduserinput"
                            value={name}
                            placeholder="Full Name"
                            onChange={(event) => setName(event.target.value)}
                        // onKeyUp={(event) => validation(event, 'name')}
                        />
                    </div>

                    {/* {nameerror &&
                        <div className="errmsg">
                            <p>Enter Name</p>
                        </div>
                    } */}
                    <div>
                        <input
                            type="tel"
                            name="contact"
                            className="adduserinput"
                            value={contact}
                            placeholder="Contact No."
                            onChange={(event) => setContact(event.target.value)}
                        // onKeyUp={(event) => validation(event, "contact")}
                        />
                    </div>

                    {/* {contacterror &&
                        <div className="errmsg">
                            <p>Enter Contact Number</p>
                        </div>
                    } */}
                    {role ==='6440c13146465b84798eca3f' ?

                    <div>
                        <select
                            value={role}
                            name="role"
                            onChange={(event) => setRole(event.target.value)}
                            // onKeyUp={(event) => validation(event, "role")}
                            className="adduserinput"
                        >
                            <option
                            className="options"
                            > Select Role
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
                    :
                    <h4 className="cantchangerole">*Please contact Administration to change your Role</h4>
                    }
                    <div className='buttons'>
                        <div>
                            <button
                                className="adduserbutton"
                                type="button"
                                onClick={update}
                            >SAVE
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
            <Footer />
        </div>
    )
}