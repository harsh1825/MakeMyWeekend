import { Outlet, Link, useNavigate, NavLink } from 'react-router-dom';
import './Navbar.css';
import { useEffect } from 'react';
import React, { useState, useContext } from "react";
import Login from '../Login/Login';
import NoteContext from '../context/notecontext';
import Userprofile from '../Users/userprofile/userprofile';
import { FaCheck, FaCommentAlt, FaMailchimp, FaTrash } from 'react-icons/fa';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@mui/material';

const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)' // sets the background color of the overlay
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '900px',
        height: '400px',
        bgcolor: 'background.paper',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'

    },
};
const customStyles2 = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)' // sets the background color of the overlay
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        height: '150px',
        bgcolor: 'background.paper',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'

    },
};



function Navbar() {
    let subtitle;
    const [secondmodalIsOpen, setsecondIsOpen] = useState(false);
    const [roledata, setroledata] = useState();
    const [remark, setremark] = useState('');
    const [data, setdata] = useState();
    const [selecteduser, setselecteduser] = useState();
    const navigate = useNavigate();
    const { uName, setuName } = useContext(NoteContext);
    const myname = localStorage.getItem("username").charAt(0)
    const isUserAdmin = localStorage.getItem('userrole') === '6440c13146465b84798eca3f'
    const token = localStorage.getItem('JWT')
    const uemail = localStorage.getItem('userid')
    setuName(myname)
    const [showChildModal, setShowChildModal] = useState(false);
    const [isrejectbtn, setisrejectbtn] = useState(false);

    const handleOpenChildModal = (user) => {
        setShowChildModal(true);
        setselecteduser(user)
    };
    const handleOpenChildModal2 = (user) => {
        setShowChildModal(true);
        setselecteduser(user);
        setisrejectbtn(true)
    };

    const handleCloseChildModal = () => {
        setShowChildModal(false);
        setremark('')
        setisrejectbtn(false)
    };

    useEffect(() => {

    }, []);

    const logout = () => {
        localStorage.setItem("JWT", false)
        localStorage.setItem("username", null)
        localStorage.setItem("userid", null)
        localStorage.setItem("usercontact", null)
        localStorage.setItem("userrole", null)
    }
    const userverificationdone = async () => {
        console.log(selecteduser);
        const details = {
            _id: selecteduser._id,
            userVerified: '1',
            remarks: remark
        }
        const detail2 = {
            _id: selecteduser._id,
        }
        console.log(details);
        try {
            await fetch('http://localhost:8080/update', {
                method: 'POST',
                body: JSON.stringify(details),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                console.log("--------------", res.status);
                if (res.status === 200) {
                    toast.success('User Verified !', {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                    })
                    setTimeout(function () {
                        closeModal()
                        handleCloseChildModal()
                    }, 1000);
                } else if (res.status === 400) {
                    toast.error('Error', {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                    })
                }

            })
        } catch (error) {
            console.log("------------error", error);
        }
        try {
            await fetch('http://localhost:8080/sendcredentialtouser', {
                method: 'POST',
                body: JSON.stringify(details),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                console.log("--------------", res.status);
                if (res.status === 200) {
                    toast.success('User Verified !', {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                    })
                    setTimeout(function () {
                        closeModal()
                        handleCloseChildModal()
                    }, 1000);
                } else if (res.status === 400) {
                    toast.error('Error', {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                    })
                }

            })
        } catch (error) {
            console.log("------------error", error);
        }

    }
    const userverificationreject = async () => {
        console.log(selecteduser);
        const details = {
            _id: selecteduser._id,
            userVerified: '-1',
            remarks: remark
        }
        console.log(details);
        try {
            await fetch('http://localhost:8080/update', {
                method: 'POST',
                body: JSON.stringify(details),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                console.log("--------------", res.status);
                if (res.status === 200) {
                    toast.success('User Rejected !', {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                    })
                    setTimeout(function () {
                        closeModal()
                        handleCloseChildModal()
                    }, 1000);
                } else if (res.status === 400) {
                    toast.error('Error', {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                    })
                }

            })
        } catch (error) {
            console.log("------------error", error);
        }

    }
    const userprofile = () => {
        <Userprofile />
    }
    function opensecondModal() {
        setsecondIsOpen(true);
        const fetchData = async () => {
            try {
                let response = await fetch('http://localhost:8080/verifyusers', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                        'Email': `${uemail}`

                    }
                })
                let responses = await response.json();
                // console.log(responses);
                setdata(responses)
                // console.log("user data--------", data);

            } catch (error) {
                console.error(error);
                localStorage.setItem("JWT", false)
                localStorage.setItem("username", null)
                localStorage.setItem("userid", null)
                localStorage.setItem("usercontact", null)
                localStorage.setItem("userrole", null)
                alert('Session Timed Out ! Login again ')
                navigate('/')
            }
        };
        fetchData();

        const fetchroleData = async () => {
            try {
                let response = await fetch('http://localhost:8080/roles', {
                    method: 'GET',

                })
                let responses = await response.json();
                //console.log(responses);
                setroledata(responses)
                // console.log("role data-----------", roledata);

            } catch (error) {
                console.error(error);
            }
        };
        fetchroleData();
    }
    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#000';
    }
    function closeModal() {
        setsecondIsOpen(false);
    }

    return (
        <div>

            <div className='navtopmostdiv'>
                <header>
                    <div className='headingimg'>

                        <h1 className='main-heading'>MakeMy<span className='Home'> Weekend</span></h1>

                        <div className="abc2">
                            <ul className='navbar-main'>
                                <li><NavLink to="/Homepage/Homepage" ClassName="active">Home</NavLink></li>
                                <li><NavLink to="/feed/feed" ClassName="active">Feed</NavLink></li>
                                <li><NavLink to="/MyPosts/MyPosts" ClassName="active">My Posts</NavLink></li>
                                <li><NavLink to="/Users/List/User" ClassName="active">Users</NavLink></li>
                                <li><NavLink to="/About/About" ClassName="active">About</NavLink></li>

                            </ul>
                            <div className='dropdownmain'>
                                <Link className="firstchar">{uName}</Link>
                                <div className="dropdownmenu">
                                    <div className='logout'>
                                        <Link to="/" className='logout' onClick={logout}>Log Out</Link>
                                    </div>
                                    <div className='userprofile'>
                                        <Link to="/users/userprofile" className='userprofile' onClick={userprofile}>User Profile</Link>
                                    </div>
                                </div>

                            </div>
                            {isUserAdmin && <FaCommentAlt className='messageicon' onClick={opensecondModal} />}
                        </div>


                    </div>
                    {isUserAdmin &&
                        <div>
                            <Modal
                                isOpen={secondmodalIsOpen}
                                onAfterOpen={afterOpenModal}
                                onRequestClose={closeModal}
                                style={customStyles}
                                contentLabel="Example Modal"
                                overlayClassName="Overlay"
                            >
                                <h2 ref={(_subtitle) => (subtitle = _subtitle)} className='headinginmodal'>APPROVAL REQUESTS</h2>
                                <table>
                                    <thead>
                                        <tr >
                                            <th className='modaltable'>
                                                Name
                                            </th>
                                            <th className='modaltable'>
                                                Email
                                            </th>
                                            <th className='modaltable'>
                                                Contact
                                            </th>
                                            <th className='modaltable'>
                                                Role
                                            </th>
                                            <th className='modaltable'>
                                                Verify
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.map((user) => (
                                            <tr>
                                                <td className='modaltable2'>{user.name}</td>
                                                <td className='modaltable2'>{user._id}</td>
                                                <td className='modaltable2'>{user.contact}</td>
                                                <td className='modaltable2'>{roledata?.find(role => role._id === user.role)?.role}</td>
                                                <td className='actionicons2'><button onClick={() => handleOpenChildModal(user)} className='iconatag2'>Accept</button><button onClick={() => handleOpenChildModal2(user)} className='iconatag2'>Reject</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Modal>
                            <Modal
                                isOpen={showChildModal}
                                onAfterOpen={afterOpenModal}
                                onRequestClose={handleCloseChildModal}
                                style={customStyles2}
                                contentLabel="Example Modal"
                                overlayClassName="Overlay"
                            >
                                <h2 ref={(_subtitle) => (subtitle = _subtitle)} className='remarkheading'>REMARKS</h2>
                                <div className='remarkinputdiv'>
                                    <input type="text"
                                        name="remarks"
                                        className='remarkinput'
                                        value={remark}
                                        onChange={(event) => setremark(event.target.value)} /></div>
                                <div className='remarkbuttons'>
                                    {isrejectbtn ? <button className='iconatag2' onClick={userverificationreject}>Reject</button> :
                                        <button className='iconatag2' onClick={userverificationdone}>Accept</button>}
                                    <button className='iconatag2' onClick={handleCloseChildModal}>Cancel</button>
                                </div>
                            </Modal>
                        </div>
                    }
                </header>
                <Outlet />
            </div>
            <ToastContainer />
        </div>

    )
}
export default Navbar;