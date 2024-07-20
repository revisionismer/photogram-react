import React, { useEffect, useState } from 'react';

import Person from '../../assets/images/person.jpeg';

import '../../assets/css/profile.css';

import axios from 'axios';

import Base64 from 'base-64';


import { Link, Navigate, json, useLocation, useNavigate, useParams } from 'react-router-dom';

// 2024-07-16 : decode하기위해 라이브러리 하나 받아와야함 
const Profile = () => {

    // 2024-07-06 : modal 띄우는거 까지함
    const navigate = useNavigate();

    var ACCESS_TOKEN = getCookie('access_token');

    function getCookie(key) {

        let result = null;
        let cookie = document.cookie.split(';');

        cookie.some( function(item) {
            item = item.replace(' ', '');

            let dic = item.split('=');

			if(key === dic[0]) {
				result = dic[1];
				return true;
			}
            return false;
        });
        return result;
    }

    // 2024-07-17 : base64로 로그인 정보 꺼내오기
    // 2024-07-18 : 토큰이 없다면 서버에서 예외터지도록 변경
    let payload;
    let loginUser;

    if(ACCESS_TOKEN != null) {
        payload = ACCESS_TOKEN.substring(ACCESS_TOKEN.indexOf('.') + 1, ACCESS_TOKEN.lastIndexOf('.'));
        loginUser = JSON.parse(Base64.decode(payload));
    }

    // 1-1. 사용자 정보 메뉴 열기
    function popup(obj) {
        obj.style.setProperty("display", "flex");
    }

    // 1-2. 사용자 정보 메뉴 닫기
    function closePopup(obj) {
        obj.style.setProperty("display", "none");
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
        navigate("/user/update");
    }

    function updateUserProfilePage() {
        navigate("/image/upload");
    }


    function deleteCookie(key) {
        document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    function logout() {

        axios.get('/api/auth/logout',
            // 1-1. 첫번째 인자 값 : 서버로 보낼 데이터
            null,
            // 1-2. 두번째 인자값 : headers 에 세팅할 값들 ex) content-type, media 방식 등
            {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                }
            }
            ).then(function (res) {
                console.log(res);

                deleteCookie('access_token');
                
                navigate("/signin");


            }).catch(function (res) {
                console.log(res);
                if (res.response.status === 500) {
                    alert(res.response.statusText);
                    return;
                }

                alert(res.response.data.message);
                return;
            }
        )
    }

    const [user, setUser] = useState({
        id : "",
        username : "",
        profileImageUrl : null,
        role : "",
        name : "",
        website : "",
        bio : "",
        email : "",
        phone : "",
        gender : ""
    });

    const [users, setUsers] = useState([]);

    const [principalId, setPricipalId] = useState({});

    const [id, setId] = useState();

    useEffect(() => {

        if(loginUser) {
            
            setPricipalId(loginUser.id)
        }

    }, [loginUser]);

    useEffect(() => {
        
        const getUserList = async () => {

            axios.get(`http://127.0.0.1:8080/api/users/list`,
                {
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
//                      'Authorization': 'Bearer ' + ACCESS_TOKEN
                    }
                }
            ).then(function (res) {
                console.log({...res.data.data});
                setUsers([...res.data.data]);
                
                
            }).catch(function (res) {
                console.log(res);

                if(res.code === "ERR_NETWORK") {
                    alert("서버와의 연결이 되어있지 않습니다.");
                    navigate("/signin");
                    return false;
                    
                }

                if (res.response.status === 400 || res.response.status === 401 || res.response.status === 403) {
                    // 2024-03-28 : alert가 두번씩 호출됨 고민해봐야함 : index.js에서 문제됨
                    alert(res.response.data.message);
    
                    // 2024-04-12 : 무슨 이유인지 GET 방식에서는 403일때 서버에서 쿠키 삭제가 안되어 클라이언트 단에서 직접 삭제
                    deleteCookie('access_token');
                    navigate("/signin");
                    return;
                }
            })

        }

        getUserList();

        // 2024-07-16 : 서버와 연결안되어 있을때 한 곳만 alert해주고 남은 함수들은 로그만 찍어주게 변경
        const getUser = async () => {
            axios.get(`http://127.0.0.1:8080/api/users/s/info`,
                {
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Authorization': 'Bearer ' + ACCESS_TOKEN
                    }
                }
            ).then(function (res) {
                console.log(res.data.data);
                setUser(res.data.data);
                setId(res.data.data.id);
                    
            }).catch(function (res) {
                console.log(res);
                
                if(res.code === "ERR_NETWORK") {
                    console.log("서버와의 연결이 되어 있지 않습니다.");
                    return false;
                    
                }

                if (res.response.status === 500 || res.response.status === 400 || res.response.status === 401 || res.response.status === 403) {
                    // 2024-03-28 : alert가 두번씩 호출됨 고민해봐야함 : index.js에서 문제됨
                    alert(res.response.data.message);
    
                    // 2024-04-12 : 무슨 이유인지 GET 방식에서는 403일때 서버에서 쿠키 삭제가 안되어 클라이언트 단에서 직접 삭제
                    deleteCookie('access_token');
                    navigate("/signin");
                    return;
                }
            })
    
        }
    
        // useEffect 마지막에는 함수 안에서 변동되는 값들을 넣어준다.(변경감지)
        getUser();

    }, [ACCESS_TOKEN, navigate]);

    // 2024-07-16 : 여기까지
    function userInfo(id) {

        axios.get(`http://127.0.0.1:8080/api/users/s/${id}/info`,
            {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Authorization': 'Bearer ' + ACCESS_TOKEN
                }
            }
            ).then(function (res) {
                console.log(res.data.data);
                setUser(res.data.data);
                setId(res.data.data.id);
                    
            }).catch(function (res) {
                console.log(res);
                
                if(res.code === "ERR_NETWORK") {
                    console.log("서버와의 연결이 되어 있지 않습니다.");
                    return false;
                    
                }

                if (res.response.status === 400 || res.response.status === 401 || res.response.status === 403) {
                    // 2024-03-28 : alert가 두번씩 호출됨 고민해봐야함 : index.js에서 문제됨
                    alert(res.response.data.message);
    
                    // 2024-04-12 : 무슨 이유인지 GET 방식에서는 403일때 서버에서 쿠키 삭제가 안되어 클라이언트 단에서 직접 삭제
                    deleteCookie('access_token');
                    navigate("/signin");
                    return;
                }
            }
        )
        
    }

    // 2024-07-18 : 프로필 이미지 업데이트까지
    function profileImageUpload() {
	
        // 3-2. 이미지 업로드 창 띄우기
        document.getElementById("profile-img-input").click();

        // 3-3. 업로드창에 이벤트가 있을 시 실행
        document.getElementById("profile-img-input").addEventListener("change", (e) => {
            let f = e.target.files[0];

            // 3-4. 이미지가 아닌 파일은 다시 등록하라고 알러트
		    if(!f.type.match("image.*")) {
                alert("이미지를 등록해주세요.");
                e.target.value = "";  
                
                closeModalImage(); 

                return false;
                
            }

		    // 3-5. formData 생성
		    let formData = new FormData();
            formData.append('file', e.target.files[0]);

            console.log(formData);

            axios.put(`http://127.0.0.1:8080/api/users/s/update/profileImage`,
                formData,
                {
                    headers: {
                        'Authorization': 'Bearer ' + ACCESS_TOKEN,
                        'Content-Type': 'multipart/form-data'
                        
                    }
                }).then(function (res) {
                    console.log(res);

                    let reader = new FileReader();
                    reader.onload = (e) => {
                        document.getElementById("userProfileImage").setAttribute("src", e.target.result);
                    }
                    reader.readAsDataURL(f);

                    closeModalImage();
                        
                }).catch(function (res) {
                    console.log(res);
                    
                    if(res.code === "ERR_NETWORK") {
                        console.log("서버와의 연결이 되어 있지 않습니다.");
                        return false;
                        
                    }
    
                    if (res.response.status === 400 || res.response.status === 401 || res.response.status === 403) {
                        // 2024-03-28 : alert가 두번씩 호출됨 고민해봐야함 : index.js에서 문제됨
                        alert(res.response.data.message);
        
                        // 2024-04-12 : 무슨 이유인지 GET 방식에서는 403일때 서버에서 쿠키 삭제가 안되어 클라이언트 단에서 직접 삭제
                        deleteCookie('access_token');
                        navigate("/signin");
                        return;
                    }
                }
            );

        });
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
                                <input type="file" id="profile-img-input" name="profileImageFile" style={{ display: 'none' }} />
                            </form>

                            <img alt='' className="profile-image" src={user.profileImageUrl === null ? Person : `/profileImg/${user.profileImageUrl}`} id="userProfileImage" />

                        </div>

                    </div>
                    {/*유저이미지end*/}

                    {/*유저정보 및 사진등록 구독하기*/}
                    <div className="profile-right">
                        <div className="name-group">
                            <h2>{user.username}</h2>

                            <div>
                                {principalId === id ? <button className="cta" onClick={() => updateUserProfilePage()}>사진등록</button> : ''}
                                
                            </div>
                        {principalId !== id ? 
                            <div>
                                <div>
                                    <button className="cta blue">구독취소</button>
                                </div>

                                <div>
                                    <button className="cta">구독하기</button>
                                </div>
                            </div>
                            : ''
                        }
                            {principalId === id ? <button className="modi" onClick={() => openModalInfo()}><i className="fas fa-cog"></i></button> : ''}
                            
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
                            <h4>{user.bio}</h4>
                            {/* 2024-06-09 : a태그로 바꾸고 웹사이트 연결해줌 */}
                            <Link to={user.website}>{user.website}</Link>
                        </div>
                    </div>
                    {/*유저정보 및 사진등록, 구독하기*/}

                    <div id='user-list'>
                        <table>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>계정</th>
                                    <th>사용자 이름</th>
                                    <th>권한</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => {
                                    return (
                                        <tr key={index} onClick={() => userInfo(user.id)}>
                                            <td>{user.id}</td>
                                            <td>{user.username}</td>
                                            <td>{user.name}</td>
                                            <td>{user.role}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            
                        </table>
                    
                    </div>
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
                                        <img alt='' className="subscribe-image" />
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
                    <button onClick={() => logout()}>로그아웃</button>
                    <button onClick={() => closeModalInfo()}>취소</button>
                </div>
            </div>
            {/*로그아웃, 회원정보변경 모달 end*/}

            {/* 프로필 사진 바꾸기 모달 start */}
            <div id='modal-image' className="modal-image">
                <div className="modal">
                    <p>프로필 사진 바꾸기</p>
                    <button onClick={() => profileImageUpload()}>사진 업로드</button>
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