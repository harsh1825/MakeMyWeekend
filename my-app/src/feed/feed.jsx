import Navbar from '../Navbar/Navbar'
import Footer from '../footer/footer'
import './feed.css'
import Modal from 'react-modal';
import React, { useState } from "react";
import cities from './cities.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { FaComment, FaPlus, FaTrash } from 'react-icons/fa';
import $ from 'jquery';


cities.sort((a, b) => a.name.localeCompare(b.name));


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
        width: '600px',
        height: '360px',
        bgcolor: 'background.paper',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'

    },
};

export default function Feed(props) {
    const [secondmodalIsOpen, setsecondIsOpen] = useState(false);
    let subtitle;
    const id = localStorage.getItem("userid")
    const username = localStorage.getItem("username")
    const isUserAdmin = localStorage.getItem('userrole') === '6440c13146465b84798eca3f'
    const token = localStorage.getItem('JWT')
    const [likedPosts, setLikedPosts] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [idea, setidea] = useState("");
    const [costpp, setcostpp] = useState("");
    const [data, setdata] = useState();
    const [category, setcategory] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [Comment, setComment] = useState();
    const [searchstring, setsearchstring] = useState("");


    let post = {
        postBY: username,
        postID: id,
        idea: idea,
        category: category,
        city: selectedCity,
        costpp: costpp,
        comments:[],
        likedBY:[]
    }

    var searchdata = {
        city: { $regex: searchstring, $options: "i" }
    };

    const handleLike = async (postId) => {
        try {
            const action = likedPosts.includes(postId) ? 'unlike' : 'like';
            const response = await fetch('http://localhost:8080/likepost', {
                method: 'POST',
                body: JSON.stringify({ postId, action, id }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                const updatedData = data.map((post) => {
                    if (post._id === postId) {
                        const updatedPost = { ...post };
                        updatedPost.likedBY = action === 'like' ? [...post.likedBY, id] : post.likedBY.filter(userId => userId !== id);
                        return updatedPost;
                    }
                    return post;
                });

                setdata(updatedData);
                setLikedPosts(updatedData.filter(post => post.likedBY.includes(id)).map(post => post._id));
            } else {
                throw new Error("Failed to perform the action");
            }
        } catch (error) {
            console.log("------------error", error);
            toast.error("Sorry, there was an error. Please try again later.", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });
        }
    };



    const fetchData = async () => {
        try {
            let response = await fetch('http://localhost:8080/getposts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                    'Email': `${id}`
                }
            });
            const responses = await response.json();
            console.log("responses:",responses);
            const likedPosts = responses?.map(post => post.likedBY.includes(id) ? post._id : null).filter(Boolean);
            setdata(responses);
            setLikedPosts(likedPosts);
        } catch (error) {
            console.error(error);
        }
    };
    
    useEffect(() => {
        console.log("called");
        fetchData();
    }, []);

    console.log('data===========>', data);



    const submit = async () => {

        if(idea && selectedCity && costpp && category != null || ""){
        try {
            await fetch('http://localhost:8080/ideapost', {
                method: 'POST',
                body: JSON.stringify(post),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                if (res) {
                    toast.success("That's a brilliant Idea !", {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                    })

                } else {
                    toast.error("Sorry Try Again later", {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                    })
                }
                closeModal()
            })
        } catch (error) {
            console.log("------------error", error);
        }
        // console.log(detail);
        closeModal()
    }
    else{
        toast.error("fields cannot be empty", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
        })
    }
    }


    function opensecondModal() {
        setsecondIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#000';
    }

    function closeModal() {
        setsecondIsOpen(false);
        setSelectedCity('')
        setidea('')
        setcostpp('')


    }

    const deletepost = async (userid) => {

        console.log(userid)

        const confirmdelete = window.confirm("Are you sure you want to delete this Post ?")

        if (confirmdelete) {
            const postdeleteid = {
                _id: userid
            }
            try {
                await fetch('http://localhost:8080/deletepost', {
                    method: 'POST',
                    body: JSON.stringify(postdeleteid),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`

                    }
                })



            } catch (error) {
                console.log("------------error", error);
            }
            window.location.reload();
        } else {
            return
        }

    }
    const comment = async (postid) => {
        console.log("inside");
        const detail = {
            inWhichPost: postid,
            comment: Comment,
            bywhom: username,
            userid: id
        }
        console.log(detail);

        try {
            const response = await fetch('http://localhost:8080/postcomment', {
                method: 'POST',
                body: JSON.stringify(detail),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                }
            });

            if (response.ok) {
                const updatedData = data.map((post) => {
                    if (post._id === postid) {
                        const updatedPost = { ...post };
                        updatedPost.comments.push(detail);
                        return updatedPost;
                    }
                    return post;
                });

                setdata([...updatedData]);
                setComment('');
            } else {
                toast.error("Sorry, there was an error. Please try again later.", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                });
            }
        } catch (error) {
            console.log("------------error", error);
        }


    }

    const search = async () => {

        // console.log("----------", searchdata);

        try {
            $.ajax({
                type: "POST",
                url: "http://localhost:8080/searchedcity",
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
    return (
        <div className='feedtopdiv'>
            <Navbar />
            <div className="small-container">
                <div className="row row-2">
                    <h2 className='weekendideas'>Weekend Ideas</h2>
                    <input
                        type="text"
                        className="search2"
                        placeholder="Search City"
                        value={searchstring}
                        onChange={(event) => setsearchstring(event.target.value)}
                        onKeyUp={search}
                    />
                    <select className='topsort'>
                        <option className='topsort2'>Sort By Default</option>
                        <option className='topsort2'>Sort By Price</option>
                        <option className='topsort2'>Sort By Popularity</option>
                        <option className='topsort2'>Sort By Comments</option>
                    </select>
                    <button className='postidea' onClick={opensecondModal}><FaPlus /> POST</button>
                </div>
            </div>
            <div className="small-container2">
                <div className="row">
                    {data?.map((post) => (
                        <div className="col-4" key={post._id}>
                            <span className='username2'>{post.category}</span>
                            <h4 className='outerproducttitle'>{post.idea}</h4>
                            <div className='userpostdetail'>
                                <div className='byuser'>
                                    <p className='username'>{post.postBY}</p>
                                    <p>{post.city}</p>
                                    <p className='price'>₹{post.costpp}/P</p>
                                </div>
                                <div className='feedicons'>
                                    {isUserAdmin && <FaTrash className='trashicon' onClick={() => deletepost(post._id)} />}
                                    <FontAwesomeIcon
                                        icon={likedPosts.includes(post._id) ? solidHeart : regularHeart}
                                        style={likedPosts.includes(post._id) ? { color: 'red' } : {}}
                                        onClick={() => handleLike(post._id)}
                                        className='likeicon'
                                    />
                                    <span className="like-count">{post.likedBY.length}</span>
                                    <FaComment className='commenticon'
                                        onClick={() =>
                                            setShowComments({
                                                ...showComments,
                                                [post._id]: !showComments[post._id],
                                            })
                                        } />

                                </div>

                            </div>
                            {showComments[post._id] && (
                                <div className="comment-section">
                                    <p className='commentsheading'>Comments</p>
                                    {post.comments.map((comment, index) => (
                                        <div className="onecomment" key={index}>
                                            <p className="commentbywhom">
                                                <u>{comment.bywhom}</u>
                                            </p>
                                            <p className="comment-content">{comment.comment}</p>
                                        </div>
                                    ))}
                                    <div className='onecomment'>
                                        <input type="text"
                                            placeholder='Add a comment'
                                            value={Comment}
                                            onChange={(event) => setComment(event.target.value)}
                                        />
                                        <button className='commentbutton' onClick={() => comment(post._id)}>Submit</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </div>

            <Modal
                isOpen={secondmodalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
                overlayClassName="Overlay"
            >
                <h2 ref={(_subtitle) => (subtitle = _subtitle)} className='headinginmodal'>POST</h2>
                <div className='fileuploadupperdiv'>
                    <input
                        type="text"
                        name="newrole"
                        className='addidea'
                        value={idea}
                        onChange={(event) => setidea(event.target.value)}
                        placeholder='Idea (Mention all the details)'
                    />
                    <select
                        className='category'
                        onChange={(event) => setcategory(event.target.value)}
                        value={category}
                    >
                        <option className='category2'>Select a Category</option>
                        <option className='category2' value='Food'>Food</option>
                        <option className='category2' value='Travel and Getaways'>Travel and Getaways</option>
                        <option className='category2' value='Adventure'>Adventure</option>
                        <option className='category2' value='Events'>Events</option>
                        <option className='category2' value='Volunteer and Charity Work'>Volunteer and Charity Work</option>
                        <option className='category2' value='Educational and Learning'>Educational and Learning</option>
                        <option className='category2' value='Sports and Fitness'>Sports and Fitness</option>
                    </select>
                    <select value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)} className='addidea2'>
                        <option value="">Select a city</option>
                        {cities.map(city => (
                            <option
                                key={city.id}
                                value={city.name}
                            >
                                {city.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        name="newrole"
                        className='addidea3'
                        value={costpp}
                        onChange={(event) => setcostpp(event.target.value)}
                        placeholder='Approx Price/Person in ₹'
                    />

                    <button className='modalsubmit' onClick={submit}>SUBMIT</button>
                </div>

            </Modal>
            <Footer />
            <ToastContainer />
        </div>
    )
}
