import './footer.css'
import Clock from 'react-live-clock';
import { useState } from 'react';


export default function Footer(){

    const date = new Date();
    let year = date.getFullYear();
    return(
        <div className="class">
        <h4 className='copyright'>Copyright ©{year} | Harsh Parekh | <Clock format="HH:mm:ss A" interval={1000} ticking={true} /></h4>
        </div>
        )
}