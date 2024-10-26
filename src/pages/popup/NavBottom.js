import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import '../../assets/css/navBottom.css';

const NavBottom = () => {

    useEffect(() => {
        const homeIcon = document.querySelector('.home_icon');

        homeIcon.addEventListener('click', () => {
            console.log("home");
        })
    });
    
    return (
        <div className='nav__bottom'>
            <li><Link className='home_icon' to={"/image/story"}><i className="fas fa-home"></i></Link></li>
            <li><Link><i className="far fa-compass"></i></Link></li>
            <li><Link><i className="far fa-envelope"></i></Link></li>
            <li><Link className='notification_icon'><i className="far fa-heart"></i></Link></li>
            <li><Link className='writeStory_icon'><i className="fas fa-plus-circle"></i></Link></li>
            <li><Link><i className="fas fa-user"></i></Link></li>

        </div>
    );
};

export default NavBottom;