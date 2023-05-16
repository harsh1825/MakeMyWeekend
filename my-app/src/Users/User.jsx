import './User.css'
import Navbar from '../Navbar/Navbar';
import React, { useState } from "react";
import { Await, Link, useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { FaCheck, FaPlus, FaTrash, FaXing } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
import { FaUpload } from "react-icons/fa";
import { saveAs } from 'file-saver';
import Footer from '../footer/footer';
import ReactPaginate from 'react-paginate';
import $ from 'jquery';
import Papa from 'papaparse';
import { FaTimes } from 'react-icons/fa';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const XLSX = require('xlsx');


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
        width: '500px',
        height: '200px',
        bgcolor: 'background.paper',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'

    },
};


export default function User() {
    const [data, setdata] = useState();
    const [roledata, setroledata] = useState();
    const [searchstring, setsearchstring] = useState("");
    const [pageNumber, setPageNumber] = useState("");
    const [showicon, setshowicon] = useState(false);
    const [csvfile, setcsvfile] = useState();
    const [newrole, setnewrole] = useState("");


    const navigate = useNavigate();
    const token = localStorage.getItem('JWT')
    const uemail = localStorage.getItem('userid')
    const isUserAdmin = localStorage.getItem('userrole') === '6440c13146465b84798eca3f'


    const usersPerPage = 5;
    let startIndex = pageNumber * usersPerPage;





    const [modalIsOpen, setIsOpen] = useState(false);
    let subtitle;

    function openModal() {
        setIsOpen(true);
    }
    const [secondmodalIsOpen, setsecondIsOpen] = useState(false);

    function opensecondModal() {
        setsecondIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#000';
    }

    function closeModal() {
        setIsOpen(false);
        document.querySelector('.fileupload').value = null
        setshowicon(false)
        setsecondIsOpen(false);
        setnewrole('')
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await fetch('http://localhost:8080/getusers', {
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
    }, []);

    var searchdata = {
        _id: { $regex: searchstring }
    }

    const createroleindb = async (e) => {
        e.preventDefault();
        const role ={
            role:newrole
        }
        if (newrole != null) {
            try {
                await fetch('http://localhost:8080/newrolecreate', {
                    method: 'POST',
                    body: JSON.stringify(role),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((res) => {
                    if (res) {
                        toast.success('Role Added', {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 1000,
                        })
                        setTimeout(1000)
                        closeModal()
                    } else{
                        toast.error('Error', {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 2000,
                        })
                        closeModal()
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

    const search = async () => {

        // console.log("----------", searchdata);

        try {
            $.ajax({
                type: "POST",
                url: "http://localhost:8080/searchedusers",
                data: JSON.stringify({ searchdata }),
                headers: {
                    'Authorization': `${token}`
                },
                contentType: "application/json",
                success: function (response) {
                    console.log("----search response-----", response);
                    setdata(response);
                }
            });
        } catch (error) {
            console.error(error);
        }


    };


    const deleteuser = async (userid) => {

        console.log(userid)

        const confirmdelete = window.confirm("Are you sure you want to delete " + userid + " ?")

        if (confirmdelete) {
            const userdeleteid = {
                _id: userid
            }
            try {
                window.location.reload();
                await fetch('http://localhost:8080/delete', {
                    method: 'POST',
                    body: JSON.stringify(userdeleteid),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`

                    }
                })


            } catch (error) {
                console.log("------------error", error);
            }
        } else {
            return
        }

    }

    const adduser = () => {
        navigate('/Users/AddEdit/Adduser');
    }
    const createrole = () => {
        navigate('/Users/createrole/createrole');
    }
    const edituser = (user) => {

        console.log('-----------------', user);
        navigate('/Users/AddEdit/Adduser', { state: { user } });


    }

    const handleDownload = () => {

        // format data into array of objects
        const formData = data?.map(item => {
            return {
                _id: item._id,
                name: item.name,
                contact: item.contact,
                role: roledata?.find(role => role._id === item.role)?.role,
                action: item.action,
                createdAT: item.createdAT,
                createdBY: item.createdBY,
                updatedBY: item.updatedBY,
                updatedAT: item.updatedAT
            };
        });

        // create workbook and worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(formData);

        // set cell format to text
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
                cell.z = '@'; // set format code to text
            }
        }

        // add worksheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

        // write workbook to buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'csv' });

        // create file object and save
        const file = new Blob([buffer], { type: 'csv' });
        saveAs(file, 'UserData.csv');


    };

    const handleFileChange = async () => {

        const blob = new Blob([csvfile], { type: 'xlsx/csv' });

        const data = Papa.parse(await blob.text(), { header: true, skipEmptyLines: true })


        for (let i = 0; i < data.data.length; i++) {

            const roles = roledata?.find(role => role.role === data.data[i].role)?._id
            data.data[i].role = roles

        }
        console.log('data-----------', data.data);

        try {
            const formData = new FormData();
            formData.append('filedata', JSON.stringify(data));

            $.ajax({
                type: "POST",
                url: "http://localhost:8080/fileupload",
                data: formData,
                headers: {
                    'Authorization': `${token}`
                },
                processData: false,
                contentType: false,
                success: function (res) {
                    if (res === '200') {
                        $('.fileupload').val('');
                        toast.success('Uploaded Successfully', {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 500,
                        })
                        setTimeout(function () {
                            window.location.reload(true)
                        }, 1000);




                    } else {
                        toast.error('"Sorry :( Try Again Later"', {
                            position: toast.POSITION.TOP_CENTER,
                            autoClose: 500,
                            className: "toast_msg",
                        })

                    }
                }
            });
            console.log("----Sent !----");

        } catch (error) {
            console.error(error);
            toast.error('"Sorry :( Try Again Later"', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 500,
                className: "toast_msg",
            })

        }

    }
    const settingicon = () => {
        setshowicon(true)
    }



    return (
        <div className='usertopmostdiv'>
            <Navbar />

            <div className='btn'>

                <div className="searchbox">
                    <input
                        type="text"
                        className={isUserAdmin?"search":"search2"}
                        placeholder="Search Email"
                        value={searchstring}
                        onChange={(event) => setsearchstring(event.target.value)}
                        onKeyUp={search}
                    />
                </div>

                {isUserAdmin &&
                    <div className='threebuttons'>
                        <div>
                            <button onClick={openModal} className='uploadiconmain'><FaUpload />Upload</button>
                            <Modal
                                isOpen={modalIsOpen}
                                onAfterOpen={afterOpenModal}
                                onRequestClose={closeModal}
                                style={customStyles}
                                contentLabel="Example Modal"
                                overlayClassName="Overlay"
                            >
                                <h2 ref={(_subtitle) => (subtitle = _subtitle)} className='headinginmodal'>UPLOAD FILE</h2>
                                <div className='fileuploadupperdiv'>
                                    <input
                                        type="file"
                                        name="file"
                                        accept=".csv,.xls,.xlsx"
                                        className='fileupload'
                                        // onClick={handleFileChange}
                                        onChange={(event) => {
                                            const file = event.target.files[0];


                                            const reader = new FileReader();
                                            reader.readAsArrayBuffer(file);


                                            reader.onload = async function (event) {
                                                var fileData = event.target.result;
                                                setcsvfile(fileData)
                                            }
                                            settingicon()
                                        }
                                        }
                                    />
                                </div>
                                <FaUpload className={showicon ? 'uploadicon' : 'nouploadicon'} onClick={handleFileChange} />
                                <FaTimes className={showicon ? 'cancelupload' : 'nouploadicon'} onClick={closeModal} />
                            </Modal>
                        </div>


                        <div>
                            <button
                                className='adduserbtn downloadbtn'
                                onClick={handleDownload}>
                                <span className='usericon'><FaDownload /></span>
                                Download
                            </button>
                        </div>

                        <div>
                            <button
                                className='adduserbtn'
                                onClick={adduser}>
                                <span className='usericon'><FaUser /></span>
                                Add User
                            </button>
                        </div>

                        <div>
                            <button
                                className='createrollrbtn'
                                onClick={opensecondModal}>
                                <span className='usericon'><FaPlus /></span>
                                Create Role
                            </button>
                            <Modal
                                isOpen={secondmodalIsOpen}
                                onAfterOpen={afterOpenModal}
                                onRequestClose={closeModal}
                                style={customStyles}
                                contentLabel="Example Modal"
                                overlayClassName="Overlay"
                            >
                                <h2 ref={(_subtitle) => (subtitle = _subtitle)} className='headinginmodal'>CREATE ROLE</h2>
                                <div className='fileuploadupperdiv'>
                                    <input
                                        type="text"
                                        name="newrole"
                                        className='fileupload'
                                        placeholder='Enter Role'
                                        value={newrole}
                                        onChange={(e)=>setnewrole(e.target.value)}
                                    />
                                </div>
                                <FaPlus className='uploadicon'  onClick={createroleindb} />
                                <FaTimes className= 'cancelupload'  onClick={closeModal} />
                            </Modal>
                        </div>

                    </div>
                }

            </div>
            <table>
                <thead>
                    <tr>

                        <th>
                            Sr No.
                        </th>
                        <th>
                            Name
                        </th>
                        <th>
                            Email
                        </th>
                        <th>
                            Contact
                        </th>
                        <th>
                            Role
                        </th>
                        {isUserAdmin &&
                            <th>
                                Action
                            </th>}
                    </tr>
                </thead>
                <tbody>
                    {data?.slice(startIndex, startIndex + usersPerPage).map((user, index) => (
                        <tr>
                            <td>{startIndex + index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user._id}</td>
                            <td>{user.contact}</td>
                            <td>{roledata?.find(role => role._id === user.role)?.role}</td>
                            {isUserAdmin && <td className='actionicons'><a className='iconatag' onClick={() => edituser(user)}><FaEdit /></a><a className='iconatag' onClick={() => deleteuser(user._id)}><FaTrash /></a></td>}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='paginationtop'>
                <ReactPaginate
                    pageCount={Math.ceil(data?.length / usersPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={({ selected }) => setPageNumber(selected)}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                    pageClassName={'page-item'}
                    pageLinkClassName={'page-link'}
                    previousClassName={'page-item'}
                    previousLinkClassName={'page-link'}
                    nextClassName={'page-item'}
                    nextLinkClassName={'page-link'}
                />

            </div>
            <Footer />

            <div>
                <ToastContainer />
            </div>
        </div>
    )
}







