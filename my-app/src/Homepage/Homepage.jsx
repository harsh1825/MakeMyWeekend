import './Homepage.css';
import Navbar from '../Navbar/Navbar';
import 'react-toastify/dist/ReactToastify.css';
import React, { useContext, useState } from 'react';
import { NoteContext } from '../context/notecontext';
import Footer from '../footer/footer';
import { FaArrowRight, FaStar, FaUserAlt } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";





export default function Homepage() {

    // console.log("-----name--------", name);
    const navigate = useNavigate();
    const navigatess = () => {
        navigate('/feed/feed')
    }
    // const [name, setname] = useState(" en");
    // const value = { name, setname };
    return (
        <>
            <div className='hometopdiv'>

                <Navbar />
                <div className='homecontent'>
                    <div className='headingtext'>
                        <h1 className='homeheading'>No ideas for your<span className='abc'>Weekend ?</span></h1>
                        <h2 className='homesecondheading'>Don't worry we've got a perfect solution for you !</h2>
                        <p className='hometext'>Join our community of weekend adventurers!
                            We love exploring offbeat and creative ideas, from hidden gems in the city to unique experiences and cuisines.
                            Share your own weird and wonderful ideas with us and spice up your weekends!
                        </p>
                        <button className='explorenow' onClick={navigatess}>Explore Now <FaArrowRight className='arrow' /></button>
                    </div>
                    <img src='/assets/images/small-business-website.png' className='homeimg' alt="Hello" />
                </div>
                <div className='middlehomepage'>
                    <img src="/assets/images/chat.png" alt="" className='chatimg' />
                    
                        <div class="chat-container">
                            <div class="chat-messages">
                                <div class="message user1">
                                    <span class="sender"><FaUserAlt/></span>
                                    <span class="message-content">Hey, any plans for the weekend?</span>
                                </div>
                                <div class="message user3">
                                    <span class="sender"><FaUserAlt/></span>
                                    <span class="message-content">check out MakeMyWeekend, It's an amazing website for weekend ideas!</span>
                                </div>
                                <div class="message user1">
                                    <span class="sender"><FaUserAlt/></span>
                                    <span class="message-content">Yes, I have heard of it.</span>
                                </div>
                                <div class="message user2">
                                    <span class="sender"><FaUserAlt/></span>
                                    <span class="message-content">It has a wide range of ideas for all interests.</span>
                                </div>
                                <div class="message user1">
                                    <span class="sender"><FaUserAlt/></span>
                                    <span class="message-content">I just loved it !</span>
                                </div>
                        
                            </div>
                            
                        </div>

                    
                </div>
                <div className="testimonial">
                    <div className="containers1">
                        <div className="row1">
                            <div className="cols-3">
                                <p>"I absolutely love the forum website! It's the perfect platform to share and discover amazing weekend ideas.
                                    I'm a travel enthusiast, and thanks to this website,
                                    I've found incredible destinations and activities to explore during my weekends.
                                </p>
                                <br />
                                <img src="/assets/images/user1.png" alt="" className='userimg' />
                                <div className='stars'><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
                                <h3>Sean Parker</h3>
                            </div>
                            <div className="cols-3">
                                <p>"As a food lover, this forum website has been a game-changer for me!
                                    The variety of culinary ideas and recipes shared by the community is outstanding.
                                    I've discovered unique and delicious dishes that I would have never known about otherwise.
                                </p>
                                <img src="./images/user-2.png" alt="" />
                                <br />
                                <img src="/assets/images/user1.png" alt="" className='userimg' />
                                <div className='stars'><FaStar /><FaStar /><FaStar /><FaStar /></div>
                                <h3>Mike Smith</h3>
                            </div>
                            <div className="cols-3">
                                <p>"I'm an adventure seeker, and I can't express how grateful I am for this forum website.
                                    It's like a treasure trove of thrilling weekend ideas! Whether it's hiking, or even skydiving,
                                    found incredible suggestions from fellow adrenaline junkies.
                                </p>
                                <br />
                                <img src="/assets/images/user1.png" alt="" className='userimg' />
                                <div className='stars'><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
                                <h3>Mabel Joe</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}
