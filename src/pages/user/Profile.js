import React from 'react';

import Person from '../../assets/images/person.jpeg';
import { Link } from 'react-router-dom';

import '../../assets/css/profile.css';

const Profile = () => {

    // 2024-07-06 : modal 띄우는거 까지함

    // 1-1. 사용자 정보 메뉴 열기
    function popup(obj) {
        obj.style.setProperty("display", "flex");
    }

    // 1-2. 사용자 정보 메뉴 닫기
    function closePopup(obj) {
        obj.style.setProperty("display", "none");
    }

    // 1-3. 사용자 정보(회원정보, 로그아웃, 닫기) 모달 닫기
    function modalInfo(obj) {
        obj.style.setProperty.css("display", "none");
    }

    function openModalImage() {
        var obj = document.getElementById('modal-image');

        popup(obj);
    }

    function closeModalImage() {
        var obj = document.getElementById('modal-image');

        closePopup(obj);
    }

    function openModalInfo() {
        var obj = document.getElementById('modal-info');

        popup(obj);
    }

    function closeModalInfo() {
        var obj = document.getElementById('modal-info');

        closePopup(obj);
    }

    function goUserInfoPage() {
        location.href = "/users/1/update";
    }

    function updateUserProfilePage() {
        location.href = "/image/upload";
    }

    return (
        <>
            <section className="profile">
                {/* 유저정보 컨테이너 */}
                <div className="profileContainer">
                    {/*유저이미지*/}
                    <div className="profile-left">
                        <div className="profile-img-wrap story-border" id='userImgArea' onClick={() => openModalImage()}>
                            <form id="userProfileImageForm">
                                <input type="file" name="profileImageFile" style={{ display: 'none' }} id="userProfileImageInput" />
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
                                <button className="cta" onClick={() => updateUserProfilePage()}>사진등록</button>
                            </div>

                            <div>
                                <div>
                                    <button className="cta blue">구독취소</button>
                                </div>

                                <div>
                                    <button className="cta">구독하기</button>
                                </div>
                            </div>

                            <button className="modi" onClick={() => openModalInfo()}><i className="fas fa-cog"></i></button>
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

            {/* modal 모음 */}

            {/*로그아웃, 회원정보변경 모달 start */}
            <div id='modal-info' className="modal-info">
                <div className="modal">
                    <button onClick={() => goUserInfoPage()}>회원정보 변경</button>
                    <button onClick={null}>로그아웃</button>
                    <button onClick={() => closeModalInfo()}>취소</button>
                </div>
            </div>
            {/*로그아웃, 회원정보변경 모달 end*/}

            {/* 프로필 사진 바꾸기 모달 start */}
            <div id='modal-image' className="modal-image">
                <div className="modal">
                    <p>프로필 사진 바꾸기</p>
                    <button>사진 업로드</button>
                    <button onClick={() => closeModalImage()}>취소</button>
                </div>
            </div>
            {/* 프로필 사진 바꾸기 모달 end */}

            {/* 구독 정보 모달 start */}
            <div className="modal-subscribe">
                <div className="subscribe">
                    <div className="subscribe-header">
                        <span>구독정보</span>
                        <button onClick={null}><i className="fas fa-times"></i></button>
                    </div>

                    <div className="subscribe-list" id="subscribeModalList">

                    </div>
                </div>
            </div>
            {/* 구독 정보 모달 end*/}
        </>
    );
};

export default Profile;