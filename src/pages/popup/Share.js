import React from 'react';

import '../../assets/css/share.css';

import Person from '../../assets/images/person.jpeg';

const Share = () => {
    return (
        <div className='shareSection'>
            <div className="shareSection__modalDialog">
                <div className="shareSection__modalContent">
                    <div className='shareSection__modalHeader'>
                        <h1>공유</h1>
                        <button className='closeShareModal'><i className='fas fa-times'></i></button>
                    </div>
                    <div className='shareSection__modalBody'>
                        <div className='shareSection__modalBody__search'>
                            <p>To: </p>
                            <input type='text' placeholder='검색'></input>
                        </div>
                        <div className='shareSection__modalBody__recommendationList'>추천목록</div>
                        <div className='shareSection__modalBody__people'>
                            <ul>
                                <li className='shareSection__modalBody__person'>
                                    <div className='shareSection__modalBody__person__left'>
                                        <img src={Person} alt=''></img>
                                    </div>
                                    <div className='shareSection__modalBody__person__right'>
                                        <p>박아무개</p>
                                        <p>칠흑의 암살자</p>
                                    </div>
                                </li>
                                <li className='shareSection__modalBody__person'>
                                    <div className='shareSection__modalBody__person__left'>
                                        <img src={Person} alt=''></img>
                                    </div>
                                    <div className='shareSection__modalBody__person__right'>
                                        <p>김아무개</p>
                                        <p>에이션트 원</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='shareSection__modalFooter'>
                        <button>보내기</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Share;