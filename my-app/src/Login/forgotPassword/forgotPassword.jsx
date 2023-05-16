import { useState, useEffect } from "react"
import './forgotPassword.css'
import { event } from "jquery"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Countdown from 'react-countdown';

export default function ForgetPassword() {
    const [email, setemail] = useState('')
    const [otp, setotp] = useState('')
    const [otpback, setotpback] = useState('')
    const [password, setpassword] = useState('')
    const [cnfpassword, setcnfpassword] = useState('')
    const [isemailvisible, setisemailvisible] = useState(true)
    const [isotpvisible, setisotpvisible] = useState(false)
    const [ispasswordvisible, setispasswordvisible] = useState(false)
    const [perr, setPerr] = useState('');
    const [pass, setPass] = useState(false);
    const [passwordmatches, isPasswordMatches] = useState(false);
    const [err, setErr] = useState('');
    const navigate = useNavigate();




    const email2 = {
        email: email
    }
    const password2 = {
        _id: email,
        password: password
    }

    const Completionist = () => <div className="resendotpdiv"><span>Didn't receice OTP ? </span><a className="resendotp" onClick={getotp}>Resend OTP</a></div>;

    
    const renderer = ({ minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
            return <Completionist />;
        } else {
            // Render a countdown
            return <div className="resendotpdiv2"><span className="resendotp2" >{minutes}:{seconds}</span></div>;
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setotpback('65896584569856698555658954')
        }, 60 * 10 * 1000); // clear otpback and otp after 10 minutes

        return () => clearTimeout(timer);
    }, [otpback]);

    const submitotp = (event) => {
        event.preventDefault();

        if (otp == otpback) {
            setisemailvisible(false)
            setisotpvisible(false)
            setispasswordvisible(true)
        } else {
            toast.error('Invalid OTP', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
            })
        }

    }
    const passwordCheck = (event) => {

        const uppercaseRegExp = /(?=.*?[A-Z])/;
        const lowercaseRegExp = /(?=.*?[a-z])/;
        const digitsRegExp = /(?=.*?[0-9])/;
        const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
        const minLengthRegExp = /.{8,}/;

        const uppercasePassword = uppercaseRegExp.test(event.target.value);
        const lowercasePassword = lowercaseRegExp.test(event.target.value);
        const digitsPassword = digitsRegExp.test(event.target.value);
        const specialCharPassword = specialCharRegExp.test(event.target.value);
        const minLengthPassword = minLengthRegExp.test(event.target.value);
        const passwordLength = event.target.value.length;
        setPerr("")
        setPass(true)
        console.log("good to go", pass)


        if (passwordLength === 0) {
            setPerr("Password is empty");
            setPass(false)
        }

        if (!uppercasePassword) {
            setPerr("Password must contain an uppercase");
            setPass(false)
        }
        if (!lowercasePassword) {
            setPerr("Password must contain a lowercase");
            setPass(false)
        }
        if (!digitsPassword) {
            setPerr("Password must contain number");
            setPass(false)
        }
        if (!specialCharPassword) {
            setPerr("Password must a special character");
            setPass(false)
        }
        if (!minLengthPassword) {
            setPerr("Password must be of minimum 8 characters");
            setPass(false)
        }





    }
    const validation = (event) => {
        setErr("")
        event.preventDefault();
        if (cnfpassword === null) {
            setErr("Enter password again")
            return
        }
        if (cnfpassword != password) {
            setErr("Password does not matches");
            isPasswordMatches(false)
            return

        }
        isPasswordMatches(true)

    }

    const setnewpassword = async (event) => {
        event.preventDefault();


        if (pass && passwordmatches) {
            try {
                let response = await fetch('http://localhost:8080/setforgetpassword', {
                    method: 'POST',
                    body: JSON.stringify(password2),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors'
                })
                var responses = await response.json()
                if (responses === 200) {
                    toast.success('Password Changed Successfully', {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 500,
                    })
                    setTimeout(function () {
                        navigate('/')
                    }, 1000);
                } else {

                }
            }
            catch (error) {
                console.log("------------error", error);
            }
        } else {
            toast.error('Enter proper password', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
            })
        }
    }

    const getotp = async (event) => {

        event.preventDefault();
        setisotpvisible(true)
        try {
            let response = await fetch('http://localhost:8080/generateotp', {
                method: 'POST',
                body: JSON.stringify(email2),
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            })
            var otpback = await response.json()
            console.log("otp------", otpback);
            setotpback(otpback)
        }
        catch (error) {
            console.log("------------error", error);
        }

    }

    return (
        <div className="box">
            <form className="myForm2">

                <h2>{ispasswordvisible ? "Enter Your Password" : "Enter Your Email"}</h2>

                <div className='form_input email'>
                    <input
                        type="email"
                        name="email"
                        className={isemailvisible ? "email" : "no_email"}
                        value={email}
                        placeholder="Email"
                        onChange={(event) => setemail(event.target.value)}

                    />
                </div>
                <p className={isotpvisible ? 'otpmessage' : 'no_otp'}>*OTP has been sent to your registered email</p>
                <p className={isotpvisible ? 'otptimer' : 'no_otp'}><Countdown
                    date={Date.now() + 10000}
                    renderer={renderer}
                /></p>
                <div className='form_input otp'>
                    <input
                        type="number"
                        name="email"
                        className={isotpvisible ? 'otp' : 'no_otp'}
                        value={otp}
                        placeholder="Enter OTP"
                        onChange={(event) => setotp(event.target.value)}

                    />
                </div>

                <div className='form_input'>
                    <input
                        type="password"
                        name="Password"
                        className={ispasswordvisible ? 'password' : 'no_password'}
                        value={password}
                        placeholder="Password"
                        onChange={(event) => setpassword(event.target.value)}
                        onKeyUp={passwordCheck}
                    />
                </div>

                <div className="errmsg1">
                    <p>{perr}</p>
                </div>

                <div className='form_input'>
                    <input
                        type="password"
                        name="CPassword"
                        className={ispasswordvisible ? 'password' : 'no_password'}
                        value={cnfpassword}
                        placeholder="Confirm Password"
                        onChange={(event) => setcnfpassword(event.target.value)}
                        onKeyUp={validation}

                    />
                </div>
                <div className="errmsg1">
                    <p>{err}</p>
                </div>
                {ispasswordvisible ? <button
                    type="submit"
                    onClick={setnewpassword}>SET PASSWORD
                </button> :
                    <div className="button" >
                        {isotpvisible ? <button
                            type="submit"
                            onClick={submitotp}
                        >SUBMIT
                        </button> :
                            <button
                                type="submit"
                                onClick={getotp}>GENERATE OTP
                            </button>}
                    </div>}
            </form>
            <ToastContainer />
        </div>
    )
}