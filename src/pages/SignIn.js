import React from 'react';

import '../assets/css/style.css';
import Logo from '../assets/images/logo.jpg';

import GoogleLogin from '../assets/images/google_signIn.svg';
import FacebookLogin from '../assets/images/facebook_signIn.png';

import axios from 'axios';

import { Link, Navigate, json, useLocation, useNavigate, useParams } from 'react-router-dom';


const SignIn = () => {

    // 2024-03-20 : 로그인, 로그아웃까지 완료
    const navigate = useNavigate();

    var ACCESS_TOKEN = "";

    function login() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        var loginObject = {
            username: username,
            password: password
        }

        console.log(loginObject)

        axios.post('/login',
            // 1-1. 첫번째 인자 값 : 서버로 보낼 데이터
            JSON.stringify(loginObject),
            // 1-2. 두번째 인자값 : headers 에 세팅할 값들 ex) content-type, media 방식 등
            {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                }
            }
        ).then(function (res) {
            console.log(res);

            // 1-3. response에서 가져온 값을 string으로 만들기 위해 앞에 "" 붙임
            var responseHeader = "" + res.headers.get('authorization');

            ACCESS_TOKEN = responseHeader.substring(7);

            console.log("엑세스 토큰 : " + ACCESS_TOKEN);

            navigate("/image/story");

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

    function LoginNaver() {
        var url = "http://localhost:8080/oauth2/authorization/naver";

        window.location.href = url;

    }

    function LoginGoogle() {
        var url = "http://localhost:8080/oauth2/authorization/google";

        window.location.href = url;
    }

    function LoginFacebook() {
        var url = "http://localhost:8080/oauth2/authorization/facebook";

        window.location.href = url;
    }

    return (
        <div className="container">
            <div className="loginMain">
                {/*로그인섹션 */}
                <section className="login">
                    {/*로그인박스*/}
                    <article className="login__form__container">
                        {/*로그인 폼*/}
                        <div className="login__form">
                            <h1><img src={Logo} alt="" /></h1>

                            {/*로그인 인풋*/}
                            <form className="login__input" action="/auth/signin" method="POST">
                                <input type="text" id='username' name="username" placeholder="아이디" required="required" />
                                <input type="password" id='password' name="password" placeholder="비밀번호" required="required" autoComplete="off" />
                                <button type='button' id='signInBtn' name='signInBtn' onClick={() => login()}>로그인</button>
                            </form>
                            {/*로그인 인풋end*/}

                            {/* 또는*/}
                            <div className="login__horizon">
                                <div className="br"></div>
                                <div className="or">또는</div>
                                <div className="br"></div>
                            </div>
                            {/* 또는end */}

                            {/* Oauth 소셜로그인 */}
                            <div className="login__naver">
                                <button className='login__naver__btn' type='button' onClick={() => LoginNaver()} >
                                    네이버 로그인
                                    <img src='' alt=''></img>
                                </button>
                            </div>

                            <div className="login__google">
                                <button className='login__google__btn' type='button' onClick={() => LoginGoogle()} >
                                    <img src={GoogleLogin} alt=''></img>
                                </button>
                            </div>
                            <div className="login__facebook">
                                <button className='login__facebook__btn' type='button' onClick={() => LoginFacebook()} >
                                    <img src={FacebookLogin} alt=''></img>
                                </button>
                            </div>
                            {/* Oauth 소셜로그인end*/}
                        </div>

                        {/*계정이 없으신가요?*/}
                        <div className="login__register">
                            <span>계정이 없으신가요?</span>
                            <a href="/signup">가입하기</a>
                        </div>
                        {/*계정이 없으신가요?end*/}
                    </article>
                </section>
            </div>

        </div>
    );
};

export default SignIn;