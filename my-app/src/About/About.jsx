import Navbar from '../Navbar/Navbar';
import { useEffect, useContext, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { NoteContext } from '../context/notecontext';
import Footer from '../footer/footer';
import { FaAddressCard, FaSearch } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { FaLinkedin } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';
import { FaFacebookSquare } from 'react-icons/fa';
import Contact from '../Contact/Contact';


export default function About() {
    import('./About.css');
    const store = useContext(NoteContext)
    const teamRef = useRef(null);
    // console.log("-----store--------",store);

    const navigate = useNavigate();
    const navigates = () => {
        teamRef.current.scrollIntoView({ behavior: 'smooth' });

    }
    return (
        <div className='main'>
            <Navbar />
            <div className="aboutmain">
                <div>
                    <div className='container1'>
                        <span className='heading'>Discover Your <span className='ab'>Perfect Weekend </span></span>
                        <h3 className='bottom'>Unleashing Memorable Experiences</h3>
                    </div>
                    <p className='content'>MakeMyWeekend is a vibrant online community dedicated to bringing together weekend enthusiasts like you. We believe that the best recommendations come from real people who have experienced and enjoyed incredible weekends firsthand. That's why we created this platform – to provide a space for you to share your favorite weekend ideas and discover inspiration from others.
                    <br /> <br />

                        Our platform is built upon the collective wisdom and diverse perspectives of our community members. Whether you're an adventure seeker, a culture connoisseur, or someone who simply enjoys a relaxing weekend getaway, you'll find a wealth of ideas and recommendations here.</p>
                    <button className='aboutbtn' onClick={navigates} >Get More Info</button>
                </div>
                <img src='\assets\images\about.png' className='aboutimg' alt="Hello" />
            </div>

            <div class="container">
                <h4 className='team'>Our Team</h4>

                <div class="row">
                    <div class="col-md-4 col-sm-6">
                        <div class="our-team">
                            <div class="team-image">
                                <img src="\assets\images\123.jpg" />
                                <p class="description">
                                As a dedicated adventurer at heart, I am committed to helping you uncover extraordinary weekend experiences that ignite your sense of wonder and create lasting memories.
                                </p>
                                <ul class="social">
                                    <li><a href="https://www.linkedin.com/in/harshparekh5818/?originalSubdomain=in"><FaLinkedin /></a></li>
                                    <li><a href="https://twitter.com/harshparekh185/"><FaTwitter /></a></li>
                                    <li><a href="#"><FaFacebookSquare /></a></li>
                                    <li><a href="https://www.instagram.com/harsh_.parekh/"><FaInstagram /></a></li>
                                </ul>
                            </div>
                            <div class="team-info">
                                <h3 class="title">Harsh Parekh</h3>
                                <span class="post">Founder</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4 col-sm-6">
                        <div class="our-team">
                            <div class="team-image">
                                <img src="\assets\images\f9.jpg" />
                                <p class="description">
                                With a deep passion for exploration and a knack for curating the finest recommendations, I am thrilled to share my insights and inspire you to embark on remarkable weekend journeys.                                </p>
                                <ul class="social">
                                    <li><a href="https://www.linkedin.com/in/krishavora/?originalSubdomain=in"><FaLinkedin /></a></li>
                                    <li><a href="#"><FaTwitter /></a></li>
                                    <li><a href="#"><FaFacebookSquare /></a></li>
                                    <li><a href="https://www.instagram.com/krisha_vora_/"><FaInstagram /></a></li>
                                </ul>
                            </div>
                            <div class="team-info">
                                <h3 class="title">Krisha Vora</h3>
                                <span class="post">Co-Founder</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div ref={teamRef}>
                <Contact />
            </div>
            <Footer />
        </div>
    )
}