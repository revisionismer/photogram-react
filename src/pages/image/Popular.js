import React from 'react';
import { Link } from 'react-router-dom';

import '../../assets/css/popular.css';

import Home from '../../assets/images/home.jpg';

const Popular = () => {

    const area = document.getElementById('popular');

    console.log(area);
    return (
        <>
            <div id='popular' className="popular">
                {/* 인기 게시글 */}
                <div className="exploreContainer">

                    {/*인기게시글 갤러리(GRID배치)*/}
                    <div className="popular-gallery" >
                        <div>
                            <div className="p-img-box">
                                <Link>
                                    <img src={Home} height="300" />
                                </Link>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </>
    );
};

export default Popular;