import React from 'react';

// 2024-06-23 : 여기까지
import '../assets/css/style.css';
import Logo from '../assets/images/logo.jpg';

const SignUp = () => {
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
                            <form className="login__input" action="/auth/signup" method="post">
                                <input type="text" name="username" placeholder="아이디" required="required" maxLength="30" />
                                <input type="password" name="password" placeholder="패스워드" required="required" autoComplete="off" />
                                <input type="email" name="email" placeholder="이메일" required="required" />
                                <input type="text" name="name" placeholder="이름" required="required" />
                                <button>가입</button>
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