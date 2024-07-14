import React from 'react';

import Home from '../../assets/images/home.jpg';
import Person from '../../assets/images/person.jpeg';

import '../../assets/css/story.css';

const Story = () => {
    return (
        <>
            <div className="main">
                <section className="container">
                    {/* 전체 리스트 시작 */}
                    <article className="story-list" id="storyList">

                        {/*스토리 아이템*/}
                        <div className="story-list__item">
                            <div className="sl__item__header">
                                <div>
                                    <img className="profile-image" src={Home} alt=''/>
                                </div>
                                <div>
                                    <div>ssar</div>
                                </div>
                            </div>
                            <div className="sl__item__img">
                                <img src={Person} alt='' />
                            </div>
                            <div className="sl__item__contents">
                                <div className="sl__item__contents__icon">

                                    <button>
                                        <i className="fas fa-heart active" id="storyLikeIcon-1"></i>
                                    </button>
                                </div>
                                <span className="like"><b id="storyLikeCount-1">0</b>likes</span>
                                <div className="sl__item__contents__content">
                                    <p>Person.jpeg</p>
                                </div>
                                <div id="storyCommentList-1">
                                    <div className="sl__item__contents__comment" id="storyCommentItem-1">
                                        <p>
                                            <b>admin :</b> 왜?
                                        </p>
                                        <button><i className="fas fa-times"></i></button>
                                    </div>

                                </div>
                                <div className="sl__item__input">
                                    <input type="text" placeholder="댓글 달기..." id="storyCommentInput-1" />
                                    <button type="button">게시</button>
                                </div>
                            </div>
                        </div>
                        {/*스토리 아이템 끝*/}
                    </article>
                </section>
            </div>
        </>
    );
};

export default Story;