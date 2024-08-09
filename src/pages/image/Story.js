import React, { useEffect, useState } from 'react';

import Home from '../../assets/images/home.jpg';
import Person from '../../assets/images/person.jpeg';

import '../../assets/css/story.css';

import axios from 'axios';

import Base64 from 'base-64';
import { Link, Navigate, json, useLocation, useNavigate, useParams } from 'react-router-dom';


const Story = () => {

    // 2024-07-06 : modal 띄우는거 까지함
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

    function deleteCookie(key) {
        document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    // 2024-07-30 : 여기까지ㄴ
    const [stories, setStories] = useState([]);
    
    const [lastIndex, setLastIndex] = useState();

    function onScroll() {

        var scrollTop = document.documentElement.scrollTop;

        var documentHeight = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        )

        var windowHeight = window.innerHeight;

        var checkNum = scrollTop - ( documentHeight - windowHeight );

        var page = 0;

        if(checkNum < 1 && checkNum > -1 && !lastIndex) {
            
            page++;
            console.log(page);
         
            const getStories = async () => {
                axios.get(`http://127.0.0.1:8080/api/images/s/story/all?page=${page}`,
                    {
                        headers: {
                            'Content-Type': 'application/json; charset=UTF-8',
                            'Authorization': 'Bearer ' + ACCESS_TOKEN
                        }
                    }
                ).then(function (res) {
    
                    // 2024-08-07 : 여기까지
                    console.log(res);
                    setLastIndex(res.data.data.images.last);
      
                    if(res.data.data.totalCount > 0) {
                      
                        for(var i = 0; i < res.data.data.totalCount; i++) {
                            let storyItem = getStoryItem(res.data.data.images.content[i]);
                            document.getElementById('storyList').innerHTML += storyItem;
                        }
                    
                    }
                    
                }).catch(function (res) {
                    console.log(res);
    
                    if (res.code === "ERR_NETWORK") {
                        alert("서버와의 연결이 되어있지 않습니다.");
                        navigate("/signin");
                        return false;
    
                    }
    
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
    
            getStories();
		}

    }

    
    function getStoryItem(image) {
        let item = `
            <div class='story-list__item'>
                <div class="sl__item__header">
                    <div>
                        <img class="profile-image" src=${image.profileImageUrl === null ? Person : `/profileImg/${image.profileImageUrl}`} alt='' width={'100%'} height={'100%'}/>
                    </div>
                    <div>
                        <div>${image.username}</div>
                    </div>
                </div>
                <div class="sl__item__img">
                    <img src=${image.storyImageUrl === null ? Person : `/storyImg/${image.storyImageUrl}`} alt='' />
                </div>
                <div class="sl__item__contents">
                    <div class="sl__item__contents__icon">  
                        <button>
                            <i class="fas fa-heart active" id="storyLikeIcon-1"></i>
                        </button>
                    </div>
                    <span class="like"><b id="storyLikeCount-1">0</b>likes</span>
                    <div class="sl__item__contents__content">
                        <p>Person.jpeg</p>
                    </div>
                    <div id="storyCommentList-1">
                        <div class="sl__item__contents__comment" id="storyCommentItem-1">
                            <p>
                                <b>admin :</b> 왜?
                            </p>
                            <button><i class="fas fa-times"></i></button>
                        </div>

                    </div>
                    <div class="sl__item__input">
                        <input type="text" placeholder="댓글 달기..." id="storyCommentInput-1" />
                        <button type="button">게시</button>
                    </div>
                </div>
            </div>
        `;
		
		return item;
	}
    

    useEffect(() => {
        window.addEventListener('scroll', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
        }
    });

    useEffect(() => {

        const getStories = async () => {
            axios.get(`http://127.0.0.1:8080/api/images/s/story/all`,
                {
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Authorization': 'Bearer ' + ACCESS_TOKEN
                    }
                }
            ).then(function (res) {

                console.log(res);
                if(res.data.data.totalCount > 0) {
                    
                    setStories(res.data.data.images.content);
                    setLastIndex(res.data.data.images.last);
                
                }
                
            }).catch(function (res) {
                console.log(res);

                if (res.code === "ERR_NETWORK") {
                    alert("서버와의 연결이 되어있지 않습니다.");
                    navigate("/signin");
                    return false;

                }

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

        getStories();

    }, [ACCESS_TOKEN, navigate]);


    return (
        <>
            <div id='main' className="main">
                <section className="container">
                    {/* 전체 리스트 시작 */}
                    <article className="story-list" id="storyList">
                        {/*스토리 아이템*/}
                        {stories.map((story, index) => {
                            return (
                                <div key={index} className={`story-list__item`}>
                                    <div className="sl__item__header">
                                        <div>
                                            <img className="profile-image" src={story.profileImageUrl === null ? Person : `/profileImg/${story.profileImageUrl}`} alt='' width={'100%'} height={'100%'}/>
                                        </div>
                                        <div>
                                            <div>{story.username}</div>
                                        </div>
                                    </div>
                                    <div className="sl__item__img">
                                        <img src={story.storyImageUrl === null ? Person : `/storyImg/${story.storyImageUrl}`} alt='' />
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
                                
                            );
                        })}
                        {/*스토리 아이템 끝*/}
                    
                    </article>
                </section>
            </div>
        </>
    );
};

export default Story;