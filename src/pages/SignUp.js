import React from 'react';

// 2024-06-23 : 여기까지
import '../assets/css/style.css';
import Logo from '../assets/images/logo.jpg';

import { Link, Navigate, json, useLocation, useNavigate, useParams } from 'react-router-dom';

import axios from 'axios';

const SignUp = () => {

    const navigate = useNavigate();

    function signUp() {
       
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        // 1-5. 이메일 형식 체크 정규식
        const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;

        var signUpObject = {
            username: username,
            password: password,
            name: name,
            email: email
        }

        console.log(signUpObject);

        axios.post('/api/auth/join',
            // 1-1. 첫번째 인자 값 : 서버로 보낼 데이터
            JSON.stringify(signUpObject),
            // 1-2. 두번째 인자값 : headers 에 세팅할 값들 ex) content-type, media 방식 등
            {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                }
            }
            // 1-3. 성공
            ).then(function (res) {
                console.log(res);
                alert(res.data.message);

                navigate("/signin");

            // 1-4. 실패
            }).catch(function (res) {
                console.log(res);
                if(res.response.status === 500) {
                    alert(res.response.statusText);
                    return;
                }

                if(res.response.data.message === '중복된 아이디입니다.') {
                    alert(res.response.data.message);

                    document.getElementById("username").value = '';
                    document.getElementById("password").value = '';
                    document.getElementById("email").value = '';
                    document.getElementById("name").value = '';

                    return;
                }

                if(username === '' && password === '' && name === '' && email === '') {
                    alert("회원가입 양식을 채워주세요.");
                    document.getElementById("username").focus();
                    return;
                } else if(res.response.data.data.username) {
                    alert(res.response.data.data.username);
                    document.getElementById("username").focus();
                    return;
                } else if(res.response.data.data.password) {
                    alert(res.response.data.data.password);
                    document.getElementById("password").focus();
                    return;
                } else if(res.response.data.data.email) {
                    alert(res.response.data.data.email);
                    document.getElementById("email").focus();
                    return;
                } else if(!email_regex.test(email)) {
                    alert("이메일 형식에 맞지 않습니다.");
                    document.getElementById("email").focus();
                    return;
                } else if(res.response.data.data.name){
                    alert(res.response.data.data.name);
                    document.getElementById("name").focus();
                    return;
                } 

                
            }
        )
    }

    return (
        <div className="container">
            <div className="loginMain">
                {/* 회원가입섹션 */}
                <section className="login">
                    <article className="login__form__container">

                        {/* 회원가입 폼 */}
                        <div className="login__form">
                            {/* 로고 */}
                            <h1><img src={Logo} alt="" /></h1>
                            {/* 로고end */}

                            {/* 회원가입 인풋 */}
                            <form id='loginForm' className="login__input">
                                <input type="text" id='username' name="username" placeholder="아이디" required="required" maxLength="30" />
                                <input type="password" id='password' name="password" placeholder="패스워드" required="required" autoComplete="off" />
                                <input type="email" id='email' name="email" placeholder="이메일" required="required" />
                                <input type="text" id='name' name="name" placeholder="이름" required="required" />
                                <button type='button' id='loginBtn' name='loginBtn' onClick={() => signUp()}>가입</button>
                            </form>
                            {/* 회원가입 인풋end */}
                        </div>
                        {/* 회원가입 폼end */}

                        {/* 계정이 있으신가요? */}
                        <div className="login__register">
                            <span>계정이 있으신가요?</span>
                            <a href="/signin">로그인</a>
                        </div>
                        {/* 계정이 있으신가요?end */}

                    </article>
                </section>
            </div>
        </div>
    );
};

export default SignUp;