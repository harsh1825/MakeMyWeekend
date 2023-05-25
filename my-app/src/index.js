import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import App from './App';
import Signup from './Signup/Signup';
import Contact from './Contact/Contact';
import Homepage from './Homepage/Homepage';
import About from './About/About';
import Navbar from './Navbar/Navbar';
import Login from './Login/Login';
import User from './Users/User';
import AddUser from './Users/AddEdit/Adduser';
import NoteState from './context/notecontext';
import Footer from './footer/footer';
import Userprofile from './Users/userprofile/userprofile';
import Createrole from './Users/createrole/createrole';
import ForgetPassword from './Login/forgotPassword/forgotPassword';
import Feed from './feed/feed';
import MyPosts from './MyPosts/MyPosts';



export default function Main() {
  const JWT = localStorage.getItem('JWT')
  const isUserAdmin = localStorage.getItem('userrole') === '6440c13146465b84798eca3f'
  
  return (
    <>

      <BrowserRouter>
        {JWT ==='false' ?
          <Routes>
            <Route path="/Signup/Signup" element={<Signup />} />
            <Route path="*" element={<Login />} />
            <Route path="/Login/forgotPassword/forgotPassword" element={<ForgetPassword />} />
          </Routes> :
          <Routes>
            <Route path="/Signup/Signup" element={<Signup />} />
            <Route path="/" element={<Login />} />
            <Route path="/Navbar" element={<Navbar />} />
            <Route path="/Contact/Contact" element={<Contact />} />
            <Route path="/Homepage/Homepage" element={<Homepage />} />
            <Route path="/About/About" element={<About />} />
            <Route path="/Users/List/User" element={<User />} />
            {isUserAdmin&&<Route path="/Users/AddEdit/Adduser" element={<AddUser />} />}
            {isUserAdmin&&<Route path="/Users/createrole/createrole" element={<Createrole />} />}
            <Route path="/footer/footer" element={<Footer />} />
            <Route path="/Users/userprofile" element={<Userprofile />} />
            <Route path="/Login/forgotPassword/forgotPassword" element={<ForgetPassword />} />
            <Route path="/feed/feed" element={<Feed />} />
            <Route path="/MyPosts/MyPosts" element={<MyPosts />} />
          </Routes>
        }
      </BrowserRouter>

    </>

  );
}







