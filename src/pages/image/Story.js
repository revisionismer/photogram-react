import React, { useEffect, useState } from 'react';

import Home from '../../assets/images/home.jpg';
import Person from '../../assets/images/person.jpeg';

import '../../assets/css/story.css';

import axios from 'axios';

import Base64 from 'base-64';
import { Link, Navigate, json, useLocation, useNavigate, useParams } from 'react-router-dom';

import Search from '../popup/Search';
import Explore from '../popup/Explore';
import Message from '../popup/Message';
import Notification from '../popup/Notification';
import Reels from '../popup/Reels';


const Story = () => {

    // 2024-07-06 : modal 띄우는거 까지함
    const navigate = useNavigate();

    var ACCESS_TOKEN = getCookie('access_token');

    function getCookie(key) {

        let result = null;
        let cookie = document.cookie.split(';');

        cookie.some(function (item) {
            item = item.replace(' ', '');

            let dic = item.split('=');

            if (key === dic[0]) {
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

    if (ACCESS_TOKEN != null) {
        payload = ACCESS_TOKEN.substring(ACCESS_TOKEN.indexOf('.') + 1, ACCESS_TOKEN.lastIndexOf('.'));
        loginUser = JSON.parse(Base64.decode(payload));
    }

    function deleteCookie(key) {
        document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    // 2024-07-30 : 여기까지
    const [stories, setStories] = useState([]);

    const [lastIndex, setLastIndex] = useState();

    var page = 1;

    function onScroll() {

        var scrollTop = document.documentElement.scrollTop;

        var documentHeight = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        )

        var windowHeight = window.innerHeight;

        var checkNum = scrollTop - (documentHeight - windowHeight);

        if (checkNum < 1 && checkNum > -1 && !lastIndex) {

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
                    page = page + 1;

                    if (res.data.data.totalCount > 0) {

                        for (var i = 0; i < res.data.data.totalCount; i++) {
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
                        <button id="likeBtn">
            ${image.likeState === true ?
                `<i class="fas fa-heart active" id="storyLikeIcon_${image.imageId}"></i>`
                :
                `<i class="far fa-heart" id="storyLikeIcon_${image.imageId}"></i>`
            }                    
                        </button>
                    </div>
                    <span class="like"><b id="storyLikeCount_${image.imageId}">${image.totalLikeCount}</b>likes</span>
                    <div class="sl__item__contents__content">
                        <p>Person.jpeg</p>
                    </div>
                    <div id="storyCommentList_${image.imageId}">`;
        image.comments.forEach((comment) => {
            item += `
                                <div class="sl__item__contents__comment" id="storyCommentItem_${comment.commentId}">` +
                `<p>` +
                `<b>${comment.username} :</b> ${comment.content}` +
                `</p>
                            `;

            if (loginUser.id === comment.userId) {
                item += `<button><i id="deleteCommentBtn_${comment.commentId}" class="fas fa-times"></i></button>`;
            }
            item += `</div>`
        });
        item += `
                        
                    </div>
                    <div class="sl__item__input">
                        <input type="text" placeholder="댓글 달기..." id="storyCommentInput_${image.imageId}" name="storyCommentInput_${image.imageId}" />
                        <button id="commentBtn_${image.imageId}">게시</button>
                    </div>
                </div>
            </div>
        `;

        return item;
    }

    function debounce(func, timeout = 300) {
        let timer;
        return (...args) => {
            if (!timer) {
                func.apply(this, args)
            }

            clearTimeout(timer);

            timer = setTimeout(() => {
                timer = undefined;
            }, timeout);
        };
    }


    useEffect(() => {
        // 2024-09-05 : 더보기
        const moreBtn = document.querySelector('.nav__more__btn');
        const dropMenu = document.querySelector('.nav__more__dropdownMenu');

        moreBtn.addEventListener('click', () => {
            dropMenu.classList.toggle('show');
        });

        // 2024-09-06 : search
        const searchSection = document.querySelector('.searchSection')
        const searchIcon = document.querySelector('.search_icon');
        
        searchIcon.addEventListener('click', () => {
            searchSection.classList.toggle('show');
        })
    }, [])

    // 2024-08-20 : 댓글 삭제 진행중
    useEffect(() => {

        const parent = document.querySelector('#storyList');

        if (parent !== null) {

            parent.addEventListener('click', (e) => {

                const commentId = e.target.id.slice(17);

                let storyCommentItem = document.getElementById(`storyCommentItem_${commentId}`);
                let commentCancelBtn = document.getElementById(`deleteCommentBtn_${commentId}`);

                if (commentId > 0) {

                    if (commentCancelBtn) {
                        if (e.target.id === commentCancelBtn.id) {
                            console.log(commentCancelBtn)

                            axios.delete(`http://127.0.0.1:8080/api/comments/${commentId}`,
                                {
                                    headers: {
                                        'Content-Type': 'application/json; charset=UTF-8',
                                        'Authorization': 'Bearer ' + ACCESS_TOKEN
                                    }
                                }).then(function (res) {
                                    console.log(res);

                                    storyCommentItem.style.display = 'none';

                                }).catch(function (res) {
                                    console.log(res);

                                    if (res.code === "ERR_NETWORK") {
                                        console.log("서버와의 연결이 되어 있지 않습니다.");
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
                    }

                }

            });

        }
    }, [])

    // 2024-08-19 : 댓글 달기 까지 성공, 나중에 commentDto에 엔티티 직접 반환하는거 수정해줘야함
    useEffect(() => {

        const parent = document.querySelector('#storyList');

        if (parent !== null) {

            parent.addEventListener('click', (e) => {

                // 댓글 게시 버튼 눌렀을때 이미지 id 가져오기.
                const imageId = e.target.id.slice(11);

                let commentListArea = document.querySelector(`#storyCommentList_${imageId}`);

                let commentInput = document.getElementById(`storyCommentInput_${imageId}`);

                if (commentInput != null) {

                    let commentObject = {
                        content: commentInput.value,
                        imageId: imageId,
                        userId: loginUser.id
                    }

                    console.log(commentObject);

                    if (commentObject.content === "") {
                        alert("댓글을 작성해주세요!");
                        commentInput.focus();
                        return;
                    }

                    axios.post(`http://127.0.0.1:8080/api/comments`,
                        JSON.stringify(commentObject),
                        {
                            headers: {
                                'Content-Type': 'application/json; charset=UTF-8',
                                'Authorization': 'Bearer ' + ACCESS_TOKEN
                            }
                        }).then(function (res) {
                            console.log(res);

                            let comment = res.data.data;

                            let content =
                                `<p>` +
                                `<b>${comment.username} :</b> ${comment.content}` +
                                `</p>` +
                                `<button><i id="deleteCommentBtn_${comment.commentId}" class="fas fa-times"></i></button>`;

                            let newComment = document.createElement('div');
                            newComment.innerHTML = content;
                            newComment.setAttribute("class", "sl__item__contents__comment");
                            newComment.setAttribute("id", `storyCommentItem_${comment.commentId}`);

                            commentListArea.appendChild(newComment);


                        }).catch(function (res) {
                            console.log(res);

                            if (res.code === "ERR_NETWORK") {
                                console.log("서버와의 연결이 되어 있지 않습니다.");
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

                    commentInput.value = "";

                }

            })
        }

    }, []);

    // 2024-08-14 : 한 번만 실행되게 처리
    useEffect(() => {

        const parent = document.querySelector('#storyList');

        if (parent !== null) {

            parent.addEventListener('click', (e) => {

                // 좋아요 아이콘 눌렀을때 이미지 id 가져오기
                const imageId = e.target.id.slice(14);

                let likeIcon = document.getElementById(`storyLikeIcon_${imageId}`);
                let likeCount = document.getElementById(`storyLikeCount_${imageId}`);

                if (imageId > 0) {
                    console.log(imageId);

                    if (likeIcon.classList.contains("far")) {  // 좋아요
                        axios.post(`http://127.0.0.1:8080/api/images/s/story/${imageId}/like`,
                            null,
                            {
                                headers: {
                                    'Content-Type': 'application/json; charset=UTF-8',
                                    'Authorization': 'Bearer ' + ACCESS_TOKEN
                                }
                            }).then(function (res) {
                                console.log(res);

                                likeIcon.classList.remove('far');

                                likeIcon.classList.add('fas');
                                likeIcon.classList.add('active');

                                likeCount.innerText = res.data.data.totalLikeCount;

                            }).catch(function (res) {
                                console.log(res);

                                if (res.code === "ERR_NETWORK") {
                                    console.log("서버와의 연결이 되어 있지 않습니다.");
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
                    } else {
                        console.log("좋아요 취소!!");

                        // 주의 : delete는 데이터 싣는 곳이 없음 null로 표기하면 안됨.
                        axios.delete(`http://127.0.0.1:8080/api/images/s/story/${imageId}/unlike`,
                            {
                                headers: {
                                    'Content-Type': 'application/json; charset=UTF-8',
                                    'Authorization': 'Bearer ' + ACCESS_TOKEN
                                }
                            }).then(function (res) {
                                console.log(res);

                                likeIcon.classList.remove('fas');
                                likeIcon.classList.remove('active');

                                likeIcon.classList.add('far');

                                likeCount.innerText = res.data.data.totalLikeCount;

                            }).catch(function (res) {
                                console.log(res);

                                if (res.code === "ERR_NETWORK") {
                                    console.log("서버와의 연결이 되어 있지 않습니다.");
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
                }
            });

        }

    }, [ACCESS_TOKEN, navigate]);


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
                if (res.data.data.totalCount > 0) {

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
           
                <section className='navMenu'>
                    <div className='nav'>
                        <div className='nav__logo'></div>
                        <div className='nav__menu'>
                            <ul className='nav__menu__conatiner'>
                                <li><Link to={"/image/story"}><i className="fas fa-home"></i>홈</Link></li>
                                <li><Link className='search_icon'><i className="fas fa-search"></i>검색</Link></li>
                                <li><Link><i className="far fa-compass"></i>탐색</Link></li>
                                <li><Link><i className="far fa-envelope"></i>메시지</Link></li>
                                <li><Link><i className="far fa-heart"></i>알람</Link></li>
                                <li><Link><i className="fas fa-plus-circle"></i>글쓰기</Link></li>
                                <li><Link><i className="fas fa-user"></i>프로필</Link></li>
                            </ul>
                        </div>
                        <div className='nav__more'>
                            
                            <div className='nav__more__btn'>
                                <i className='fas fa-bars'></i>
                                더보기
                            </div>

                            <ul className='nav__more__dropdownMenu'>
                                <li className='nav__more__li'><Link className='nav__menu__dropdownItem'><i className="fas fa-cog"></i>환경설정</Link></li>
                                <li className='nav__more__li'><Link className='nav__menu__dropdownItem'><i className="fas fa-clock"></i>나의 활동</Link></li>
                                <li className='nav__more__li'><Link className='nav__menu__dropdownItem'><i className="far fa-bookmark"></i>찜한 목록</Link></li>
                                <li className='nav__more__li'><Link className='nav__menu__dropdownItem'><i className="fas fa-moon"></i>화면 색상 전환</Link></li>
                                <li className='nav__more__li'><Link className='nav__menu__dropdownItem'><i className="far fa-bookmark"></i>에러 보고하기</Link></li>
                                <li className='nav__more__li'><Link className='nav__menu__dropdownItem'><i className="far fa-bookmark"></i>계정 전환</Link></li>
                                <li className='nav__more__li'><Link className='nav__menu__dropdownItem'><i className="far fa-bookmark"></i>로그 아웃</Link></li>
                            </ul>
                        </div>

                    </div>
                </section>
                
                <section className="container">
                    
                    {/* 전체 리스트 시작 */}
                    <article className="story-list" id="storyList">
                        {/*스토리 아이템*/}
                        {stories.map((story, index) => {
                            return (
                                <div key={index} className={`story-list__item`}>
                                    <div className="sl__item__header">
                                        <div>
                                            <img className="profile-image" src={story.profileImageUrl === null ? Person : `/profileImg/${story.profileImageUrl}`} alt='' width={'100%'} height={'100%'} />
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
                                                {story.likeState === true ?
                                                    <i className="fas fa-heart active" id={'storyLikeIcon_' + story.imageId}></i>
                                                    :
                                                    <i className="far fa-heart" id={'storyLikeIcon_' + story.imageId}></i>
                                                }
                                            </button>
                                        </div>
                                        <span className="like"><b id={`storyLikeCount_${story.imageId}`}>{story.totalLikeCount}</b>likes</span>
                                        <div className="sl__item__contents__content">
                                            <p>{story.caption}</p>
                                        </div>
                                        <div id={`storyCommentList_${story.imageId}`}>
                                            {story.comments.map((comment, index) =>
                                                <div key={index} className="sl__item__contents__comment" id={`storyCommentItem_${comment.commentId}`}>
                                                    <p>
                                                        <b>{comment.username} :</b> {comment.content}
                                                    </p>
                                                    {story.comments[index].userId === loginUser.id ?
                                                        <button><i id={`deleteCommentBtn_${comment.commentId}`} className="fas fa-times"></i></button>
                                                        :
                                                        ''
                                                    }
                                                </div>
                                            )}

                                        </div>
                                        <div className="sl__item__input">
                                            <input type="text" placeholder="댓글 달기..." id={`storyCommentInput_${story.imageId}`} />
                                            <button id={`commentBtn_${story.imageId}`}>게시</button>
                                        </div>
                                    </div>
                                </div>

                            );
                        })}
                        {/*스토리 아이템 끝*/}

                    </article>
               
                </section>
                {/* 팝업 js */}
                <Search/>
                <Explore/>
                <Message/>
                <Notification/>
                <Reels/>

            </div>

            
            
        </>
    );
};

export default Story;