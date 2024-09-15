import React from 'react';

import '../../assets/css/notification.css';

import Home from '../../assets/images/home.jpg';
import Logo from '../../assets/images/logo.jpg';
import Person from '../../assets/images/person.jpeg';

// 2024-09-09 : 여기까지
const Notification = () => {
    return (
        <div className='notificationSection'>
            <h2>알림리스트</h2>
            <div className='notificationSection__list'>
                <div className='notificationSection__cart follow_notify'>
                    <div className='notificationSection__profile'>
                        <div className='notificationSection__profile__img'>
                            <img src={Home} alt=' '></img>
                        </div>
                        <div className='notificationSection__info'>
                            <p className='notificationSection__name'>
                                김아무개
                                <span> 님이 당신을 구독했습니다.</span>
                                
                            </p>
                            <span className='notificationSection__before'>2시간전</span>
                        </div>
                    </div>
                    <div className='notificationSection__subscribe'>
                        <button className="cta">구독하기</button>
                    </div>
                </div>
                <div className='notificationSection__cart love_story'>
                    <div className='notificationSection__profile'>
                        <div className='notificationSection__profile__img'>
                            <img src={Person} alt=' '></img>
                        </div>
                        <div className='notificationSection__info'>
                            <p className='notificationSection__name'>
                                김아무개
                                <span> 님이 당신의 스토리를 좋아합니다.</span>
                            </p>
                            <span className='notificationSection__before'>2시간전</span>
                        </div>
                    </div>
                    <div className='notificationSection__story'>
                        <img src={Logo} alt=''></img>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notification;