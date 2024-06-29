import React from 'react';

import Person from '../../assets/images/person.jpeg';
import { Link } from 'react-router-dom';

import '../../assets/css/profile.css';

const Profile = () => {
    return (
        <>
            <section className="profile">
                {/* 유저정보 컨테이너 */}
                <div className="profileContainer">
                    {/*유저이미지*/}
                    <div className="profile-left">
                        <div className="profile-img-wrap story-border">
                            <form id="userProfileImageForm">
                                <input type="file" name="profileImageFile" id="userProfileImageInput" />
                            </form>

                            <img className="profile-image" src={Person} id="userProfileImage" />

                        </div>

                    </div>
                    {/*유저이미지end*/}

                    {/*유저정보 및 사진등록 구독하기*/}
                    <div className="profile-right">
                        <div className="name-group">
                            <h2></h2>

                            <div>
                                <button className="cta">사진등록</button>
                            </div>

                            <div>
                                <div>
                                    <button className="cta blue">구독취소</button>
                                </div>

                                <div>
                                    <button className="cta">구독하기</button>
                                </div>
                            </div>

                            <button className="modi"><i className="fas fa-cog"></i></button>
                        </div>

                        <div className="subscribe">
                            <ul>
                                <li><Link>게시물<span></span></Link></li>
                                <li>
                                    <a><span></span></a>
                                </li>
                            </ul>
                        </div>
                        <div className="state">
                            <h4></h4>
                            {/* 2024-06-09 : a태그로 바꾸고 웹사이트 연결해줌 */}
                            <Link>웹사이트</Link>
                        </div>
                    </div>
                    {/*유저정보 및 사진등록 구독하기*/}
                </div>

            </section>

            {/*게시물컨섹션*/}
            <section id="tab-content">
                {/*게시물컨컨테이너*/}
                <div className="profileContainer">
                    {/*그냥 감싸는 div (지우면이미지커짐)*/}
                    <div id="tab-1-content" className="tab-content-item show">
                        {/*게시물컨 그리드배열*/}
                        <div className="tab-1-content-inner">
                            {/*아이템들*/}
                            <div>
                                {/*	<a th:text="${image.postImageUrl}"></a> */}
                                <div className="img-box">
                                    <Link>
                                        <img className="subscribe-image" />
                                    </Link>
                                </div>
                            </div>

                            {/*아이템들end*/}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Profile;