import React from 'react';

import Person from '../../assets/images/person.jpeg';

import '../../assets/css/update.css';

const Update = () => {
    return (
        <>
            {/* 프로필 섹션 */}
            <section className="setting-container">
                {/*프로필셋팅 아티클*/}
                <article className="setting__content">

                    {/*프로필셋팅 아이디영역*/}
                    <div className="content-item__01">
                        <div className="item__img">
                            <img className="profile-image" src={Person} id="userProfileImage" />
                        </div>
                        <div className="item__username">
                            <h2></h2>
                        </div>
                    </div>
                    {/*프로필셋팅 아이디영역end*/}

                    {/*프로필 수정*/}
                    <form id="profileUpdate">
                        <div className="content-item__02">
                            <div className="item__title">이름</div>
                            <div className="item__input">
                                <input type="text" name="name" placeholder="이름" />
                            </div>
                        </div>
                        <div className="content-item__03">
                            <div className="item__title">아이디</div>
                            <div className="item__input">
                                <input type="text" name="username" placeholder="유저네임" readOnly="readonly" />
                            </div>
                        </div>
                        <div className="content-item__04">
                            <div className="item__title">패스워드</div>
                            <div className="item__input">
                                <input type="password" name="password" placeholder="패스워드" required="required" autoComplete="off" />
                            </div>
                        </div>
                        <div className="content-item__05">
                            <div className="item__title">웹사이트</div>
                            <div className="item__input">
                                <input type="text" name="website" placeholder="웹 사이트" />
                            </div>
                        </div>
                        <div className="content-item__06">
                            <div className="item__title">소개</div>
                            <div className="item__input">
                                <textarea id="bio" name="bio" rows="3"></textarea>
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
                                <input type="text" name="email" placeholder="이메일" readOnly="readonly" />
                            </div>
                        </div>
                        <div className="content-item__09">
                            <div className="item__title">전회번호</div>
                            <div className="item__input">
                                <input type="text" name="phone" placeholder="전화번호" />
                            </div>
                        </div>
                        <div className="content-item__10">
                            <div className="item__title">성별</div>
                            <div className="item__input">
                                <input type="text" name="gender" />
                            </div>
                        </div>

                        {/*제출버튼*/}
                        <div className="content-item__11">
                            <div className="item__title"></div>
                            <div className="item__input">
                                <button>제출</button>
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