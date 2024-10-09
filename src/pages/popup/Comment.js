import React from 'react';

import '../../assets/css/comment.css';

import Person from '../../assets/images/person.jpeg';

const Comment = () => {
    return (
        <div className='commentSection'>
            <div className="commentSection__modalDialog">
                <div className="commentSection__modalContent">
                    <div className='commentSection__modalHeader'>
                        <h1>댓글</h1>
                        <button className='closeModal'><i className='fas fa-times'></i></button>
                    </div>
                    <div className='commentSection__modalBody'>
                        <div className='commentSection__comments'>
                            <div className='commentSection__comment'>
                                <div className='commentSection__comment__left'>
                                    <div className='commentSection__comment__img'>
                                        <img src={Person} alt=''></img>
                                        <p className='commentSection__comment__nickname'>닉네임</p>
                                        <div className='commentSection__comment__reply'>
                                            <button className='commentSection__comment__recomment'>대댓글</button>
                                            <button className='commentSection__comment__translation'>번역보기</button>
                                        </div>
                                        <div className='commentSection__comment__see_comment'>
                                            <button>
                                                <span className='commentSection__comment__showComment'>댓글 더보기</span>

                                                <span className='commentSection__comment__hideComment'>댓글 숨기기</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className='commentSection__comment__right'>
                                    <button><i className='far fa-heart'></i></button>
                                    <p>55</p>
                                </div>
                            </div>
                            <div className='commentSection__response'>
                                <div className='commentSection__response__left'>
                                    <div className='commentSection__response__img'>
                                        <img src={Person} alt=''></img>
                                    </div>
                                    <p className='commentSection__response__nickname'>닉네임</p>
                                    <div className='commentSection__response__reply'>
                                        <button className='commentSection__response__recomment'>대댓글</button>
                                        <button className='commentSection__response__translation'>번역보기</button>
                                    </div>
                                </div>
                                <div className='commentSection__response__right'>
                                    <button><i className='far fa-heart'></i></button>
                                    <p>33</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='commentSection__modalFooter'>
                        <form>
                            <div className='commentSection__modalFooter__container'>
                                <img src={Person} alt=''></img>
                                <input placeholder='댓글을 입력해주세요.'></input>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Comment;