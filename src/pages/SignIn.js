import React from 'react';

import '../assets/css/style.css';
import Logo from '../assets/images/logo.jpg';

const SignIn = () => {
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
                                <input type="text" name="username" placeholder="아이디" required="required" />
                                <input type="password" name="password" placeholder="비밀번호" required="required" autoComplete="off" />
                                <button>로그인</button>
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
                            <div className="login__facebook">
                                <button type='button'>
                                    <i className="fab fa-facebook-square"></i>
                                    <span>Facebook으로 로그인</span>
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