import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '../../assets/images/logo.jpg';
import '../../assets/css/header.css';
import '../../assets/fontawesome/css/all.min.css';

const Header = () => {
    return (
        <>
            <header className="header">
                <div className="container">
                    <Link to={"/"} className="logo">
                        <img src={Logo} alt="" />
                    </Link>
                    <nav className="navi">
                        <ul className="navi-list">
                            <li className="navi-item">
                                <Link to={'/image/story'}>
                                    <i className="fas fa-home"></i>
                                </Link>
                            </li>
                            <li className="navi-item">
                                <Link to={'/image/popular'}>
                                    <i className="far fa-compass"></i>
                                </Link>
                            </li>
                            <li className="navi-item">
                                <Link to={'/user/profile'}>
                                    <i className="far fa-user"></i>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    );
};

export default Header;