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
                    <p className='content'>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Doloribus vel quos eveniet repudiandae
                        dolorem modi neque autem, nulla quaerat optio itaque nam,
                        perferendis ex earum explicabo rerum voluptates, nisi eaque.
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Doloribus vel quos eveniet repudiandae
                        dolorem modi neque autem, nulla quaerat optio itaque nam,
                        perferendis ex earum explicabo rerum voluptates, nisi eaque.</p>
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
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent urna diam, maximus ut ullamcorper quis, placerat id eros. Duis semper justo sed condimentum rutrum. Nunc tristique purus turpis. Maecenas vulputate.
                                </p>
                                <ul class="social">
                                    <li><a href="#"><FaLinkedin /></a></li>
                                    <li><a href="#"><FaTwitter /></a></li>
                                    <li><a href="#"><FaFacebookSquare /></a></li>
                                    <li><a href="#"><FaInstagram /></a></li>
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
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent urna diam, maximus ut ullamcorper quis, placerat id eros. Duis semper justo sed condimentum rutrum. Nunc tristique purus turpis. Maecenas vulputate.
                                </p>
                                <ul class="social">
                                    <li><a href="#"><FaLinkedin /></a></li>
                                    <li><a href="#"><FaTwitter /></a></li>
                                    <li><a href="#"><FaFacebookSquare /></a></li>
                                    <li><a href="#"><FaInstagram /></a></li>
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