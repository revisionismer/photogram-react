import React, { useEffect, useState } from 'react';

import Person from '../../assets/images/person.jpeg';

import '../../assets/css/update.css';

import axios from 'axios';

import Base64 from 'base-64';

import { Link, Navigate, json, useLocation, useNavigate, useParams} from 'react-router-dom';

// 2024-07-11 : 여기까지
const Update = () => {

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

    function deleteCookie(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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

    useEffect(() => {

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
                    
            }).catch(function (res) {
                console.log(res);
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
    
        // useEffect 마지막에는 함수 안에서 변동되는 값들을 넣어준다.(변경감지)
        getUser();

    }, [ACCESS_TOKEN, navigate]);

    function updateUser() {
        const name = document.getElementById('name').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const webstie = document.getElementById('website').value;
        const bio = document.getElementById('bio').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const gender = document.getElementById('gender').value;

        if(!password) {
            alert("비밀번호를 입력해주세요.");
            document.getElementById('password').focus();
            return false;
        }

        const updateUserObject = {
            name : name,
            username : username,
            password : password,
            website : webstie,
            bio : bio,
            email : email,
            phone : phone,
            gender : gender
        }

        console.log(updateUserObject);

        axios.put(`http://127.0.0.1:8080/api/users/s/update`,
            JSON.stringify(updateUserObject),
            {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Authorization': 'Bearer ' + ACCESS_TOKEN
                }
            }
        ).then(function (res) {
            console.log(res);
            alert(res.data.message);

        }).catch(function (res) {
            console.log(res);
            if (res.response.status === 400 || res.response.status === 401 || res.response.status === 403) {
               
                alert(res.response.data.message);
                
                if(res.response.data.message === '비밀번호가 일치하지 않습니다.') {
                    document.getElementById('password').focus();
                    document.getElementById('password').value = '';
                    return false;
                } 

                deleteCookie('access_token');
                navigate("/signin");
                return;
            }
        })

    }

    return (
        <>
            {/* 프로필 섹션 */}
            <section className="setting-container">
                {/*프로필셋팅 아티클*/}
                <article className="setting__content">

                    {/*프로필셋팅 아이디영역*/}
                    <div className="content-item__01">
                        <div className="item__img">
                            <img className="profile-image" src={user.profileImageUrl === null ? Person : "/profileImg/" + user.profileImageUrl} id="userProfileImage" alt='' />
                        </div>
                        <div className="item__username">
                            <h2>{user.username != null ? user.username : ""}</h2>
                        </div>
                    </div>
                    {/*프로필셋팅 아이디영역end*/}

                    {/*프로필 수정*/}
                    <form id="profileUpdate">
                        <div className="content-item__02">
                            <div className="item__title">이름</div>
                            <div className="item__input">
                                <input type="text" id='name' name="name" placeholder="이름" defaultValue={user.name} />
                            </div>
                        </div>
                        <div className="content-item__03">
                            <div className="item__title">아이디</div>
                            <div className="item__input">
                                <input type="text" id='username' name="username" placeholder="아이디" defaultValue={user.username} readOnly="readonly" />
                            </div>
                        </div>
                        <div className="content-item__04">
                            <div className="item__title">패스워드</div>
                            <div className="item__input">
                                <input type="password" id='password' name="password" placeholder="패스워드" required="required" autoComplete="off" />
                            </div>
                        </div>
                        <div className="content-item__05">
                            <div className="item__title">웹사이트</div>
                            <div className="item__input">
                                <input type="text" id='website' name="website" defaultValue={user.website} placeholder="웹 사이트"  />
                            </div>
                        </div>
                        <div className="content-item__06">
                            <div className="item__title">소개</div>
                            <div className="item__input">
                                <textarea id="bio" name="bio" rows="3" defaultValue={user.bio}></textarea>
                            </div>
                        </div>
                        <div className="content-item__07">
                            <div className="item__title"></div>
                            <div className="item__input">
                                <span><b>개인정보</b></span>
                                <span>
                                    비즈니스나 반려동물 등에 사용된 계정인 경우에도 회원님의 개인 정보를 입력하세요. 공개 프로필에는 포함되지 않습니다.
                                </span>
                            </div>
                        </div>
                        <div className="content-item__08">
                            <div className="item__title">이메일</div>
                            <div className="item__input">
                                <input type="text" id='email' name="email" placeholder="이메일" defaultValue={user.email} />
                            </div>
                        </div>
                        <div className="content-item__09">
                            <div className="item__title">전회번호</div>
                            <div className="item__input">
                                <input type="text" id='phone' name="phone" defaultValue={user.phone} placeholder="전화번호" />
                            </div>
                        </div>
                        <div className="content-item__10">
                            <div className="item__title">성별</div>
                            <div className="item__input">
                                <input type="text" id='gender' name="gender" defaultValue={user.gender} />
                            </div>
                        </div>

                        {/*제출버튼*/}
                        <div className="content-item__11">
                            <div className="item__title"></div>
                            <div className="item__input">
                                <button type='button' onClick={() => updateUser()}>제출</button>
                            </div>
                        </div>
                        {/*제출버튼end*/}

                    </form>
                    {/*프로필수정 form end*/}
                </article>
            </section>
        </>
    );
};

export default Update;