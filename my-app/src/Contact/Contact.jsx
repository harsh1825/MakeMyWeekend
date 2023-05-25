import './Contact.css';
import { useEffect } from 'react';
import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { FaEnvelope, FaLocationArrow, FaMailBulk, FaMailchimp, FaPhone, FaSearchLocation } from 'react-icons/fa';

export default function Contact() {
  useEffect(() => {
    return () => {
      console.log('Leaving from contact--------------------------------');
    }
  }, []);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [emailpass, setEmailpass] = useState(false);
  const[message, setMessage] = useState('');

  
  const messagedata = {
    _id: email,
    name: name,
    contact: parseInt(contact),
    message: message,
};


const send = async (e) => {
    e.preventDefault();
    if (name && contact && message && email != ''){
        try {
            await fetch('http://localhost:8080/sendquerymail', {
                method: 'POST',
                body: JSON.stringify(messagedata),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                console.log("--------------", res);
                if (res.status === 200) {
                    toast.success('Message sent !', {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                    })
                    setEmail('');
                    setName('');
                    setContact('');
                    setMessage('');

                    setTimeout(1000)
                } else if (res.status === 400) {
                    toast.error('Failed to deliver your message', {
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

  return (
    <div className='class' >
      <div className='icons'>
        <div className='head'>Contact Us <br /></div>
        <div className='flex'>
          <div className='left-side'>
            <div className='icon-container'>
              <FaPhone />
              <span className='icon-text'>Call us: </span>
              <span className='small'><br />Ahmedabad office <br /> +91 80799 49466 </span>
            </div>
            <div className='icon-container'>
              <FaLocationArrow />
              <span className='icon-text'> Visit us: </span><span className='small'> <br /><a href='https://www.google.com/maps/place/Maharshi+Electronic+Systems/@23.0166683,
          72.5595629,17z/data=!3m1!4b1!4m6!3m5!1s0x395e84f83fffffff:
          0x8e6992fad626f949!8m2!3d23.0166634!4d72.5617516!16s%2Fg%2F1wfvl1mq' className='addresss2'>MAHARSHI ELECTRONIC SYSTEMS
                “SARASWATI”, 55,
                Brahmin Mitra Mandal Society, Ellisbridge, Ahmedabad – 380006 INDIA </a></span>
            </div>
            <div className='icon-container'>
              <FaEnvelope />
              <span className='icon-text'>Email us: </span> <span className='small'><br /><a href='https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=sales@abc.in' className='addresss'>sales@abc.in</a><br /> <br />
                <a href='https://mail.google.com/mail/u/0/?fs=1&tf=cm&to=contact@abc.in' className='addresss'>contact@abc.in</a></span>
            </div>
          </div>
          <div className='right-side'>
            <form className="myForm3">
              <h1 className='ping'>Ping Us !</h1>
              <div className='form_input1'>
                <input
                  type="text"
                  name="name"
                  className={name}
                  value={name}
                  placeholder="Full Name"
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className='form_input1'>
                <input
                  type="email"
                  name="email"
                  className={emailpass}
                  value={email}
                  placeholder="Email"
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className='form_input1'>
                <input
                  type="tel"
                  name="contact"
                  className={contact}
                  value={contact}
                  placeholder="Contact No."
                  onChange={(event) => setContact(event.target.value)}
                />
              </div>
              <div className='form_input1'>
                <textarea
                  type="address"
                  name="message"
                  className='message-9'
                  value={message}
                  placeholder="Write to us"
                  onChange={(event) => setMessage(event.target.value)}
                />
              </div>
              <div className="button" >
                <button className='submitB'
                  type="button"
                  onClick={send}>SUBMIT
                </button>
              </div>
            
            </form>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
}