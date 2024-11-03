import React, { useEffect, useState } from 'react';

import Home from '../../assets/images/home.jpg';
import Person from '../../assets/images/person.jpeg';
import bookmark_black from '../../assets/images/bookmark_black.png';
import bookmark_white from '../../assets/images/bookmark_white.png';
import ShareIcon from '../../assets/images/message.png';

import Chat from '../../assets/images/chat.png';

import '../../assets/css/story.css';

import axios from 'axios';

import Base64 from 'base-64';
import { Link, Navigate, json, useLocation, useNavigate, useParams } from 'react-router-dom';

import Search from '../popup/Search';
import Explore from '../popup/Explore';
import Message from '../popup/Message';
import Notification from '../popup/Notification';
import Reels from '../popup/Reels';
import Comment from '../popup/Comment';
import Share from '../popup/Share';
import WriteStory from '../popup/WriteStory';
import NavBottom from '../popup/NavBottom';

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

    const [subscribeUsers, setSubscribeUsers] = useState([]);

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

    let extraImgUrl;

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

        // 2024-09-10 : Notification
        const notificationSection = document.querySelector('.notificationSection');
        const notificationIcon = document.querySelector('.notification_icon');

        notificationIcon.addEventListener('click', () => {
            notificationSection.classList.toggle('show');
        })

    }, [])

    // 2024-10-17 : 여기까지
    useEffect(() => {
        const form = document.querySelector('.writeStorySection__uploadBtn__form');
        const uploadImgArea = document.querySelector('.writeStorySection__uploadImgArea');
        const imgArea = document.querySelector('.writeStorySection__imgArea');

        const imgInput = document.querySelector('.writeStorySection__uploadImg__input');

        const modalHeaderH1 = document.querySelector('.writeStorySection__modalHeader__h1');

        const modalNextBtn = document.querySelector('.writeStorySection__modalHeader__btn .nextModalBtn');

        form.addEventListener('change', (e) => {
            e.preventDefault();

            uploadImgArea.style.display = "block";
            imgArea.style.display = "none";

            const imgFile = imgInput.files[0];
            /*
                // 1.
                let reader = new FileReader();
                
                reader.onload = (e) => {
                    const uploadImg = document.querySelector('.writeStorySection__uploadImgArea__img');
                    uploadImg.src = e.target.result;
                }
                
                reader.readAsDataURL(imgFile);  // 1-3. 이 코드 실행시 reader.onload 실행
            */

            // 2. 
            // 2024-10-18 : 여기까지
            const imgUrl = URL.createObjectURL(imgFile);

            console.log(imgUrl);

            const uploadImg = document.querySelector('.writeStorySection__uploadImgArea__img');
            uploadImg.src = imgUrl;

            modalHeaderH1.textContent = '자르기';
            modalNextBtn.style.display = 'inline-block';

            extraImgUrl = imgUrl;

        })
    }, [])

    useEffect(() => {
        const parent = document.querySelector('#storyList');
        const writeStorySection = document.querySelector('.writeStorySection');
        const writeStoryIcon = document.querySelector('.writeStory_icon');
        const closeModal = document.querySelector('.closeWriteStoryModal');
        const dim = document.querySelector('.dim');

        const imgArea = document.querySelector('.writeStorySection__imgArea');
        const uploadImgArea = document.querySelector('.writeStorySection__uploadImgArea');
        const uploadedImg = document.querySelector('.writeStorySection__uploadImgArea__img');
        const modalHeaderH1 = document.querySelector('.writeStorySection__modalHeader__h1');
        const modalNextBtn = document.querySelector('.writeStorySection__modalHeader__btn .nextModalBtn');
        const modalShareBtn = document.querySelector('.writeStorySection__modalHeader__btn .shareModalBtn');

        const uploadImgDescription = document.querySelector('.writeStorySection__uploadImgDescription');
        const lastShare = document.querySelector('.writeStorySection__share');

        if (parent !== null) {
            writeStoryIcon.addEventListener('click', () => {
                writeStorySection.classList.toggle('show');
                dim.classList.toggle('show');

            });

            closeModal.addEventListener('click', (e) => {

                e.preventDefault();

                writeStorySection.classList.remove('show');
                dim.classList.remove('show');
                imgArea.style.display = "block";
                uploadImgArea.style.display = "none";
                modalHeaderH1.textContent = '게시글 작성하기';
                modalNextBtn.style.display = "none";
                modalShareBtn.style.display = "none";
                uploadImgDescription.style.display = 'none';

                uploadedImg.src = '';

                lastShare.style.display = 'none';

                lastShare.textContent = '';

            });

            dim.addEventListener('click', (e) => {
                e.preventDefault();

                writeStorySection.classList.remove('show');
                dim.classList.remove('show');
                imgArea.style.display = "block";
                uploadImgArea.style.display = "none";
                modalHeaderH1.textContent = '게시글 작성하기';
                modalNextBtn.style.display = "none";
                modalShareBtn.style.display = "none";

                uploadedImg.src = '';

                lastShare.style.display = 'none';

                lastShare.textContent = '';
            });

            modalNextBtn.addEventListener('click', (e) => {
                modalHeaderH1.textContent = '게시글 생성하기';
                modalNextBtn.style.display = 'none';
                modalShareBtn.style.display = 'inline-block';
                uploadImgDescription.style.display = 'grid';

                const lastImg = document.querySelector('.writeStorySection__uploadImgDescription__img');

                lastImg.src = extraImgUrl;
            });

            modalShareBtn.addEventListener('click', (e) => {
                modalShareBtn.style.display = 'none';
                uploadImgDescription.style.display = 'none';
                uploadImgArea.style.display = 'none';

                lastShare.style.display = 'flex';

                lastShare.textContent = '공유되었습니다.';
            });

        }

    }, [])

    useEffect(() => {
        const writeStorySection = document.querySelector('.writeStorySection');
        const closeModal = document.querySelector('.closeWriteStoryModal');
        const dim = document.querySelector('.dim');

        const writeStory_icon = document.querySelector('.nav__bottom .writeStory_icon');

        writeStory_icon.addEventListener('click', () => {

            writeStorySection.classList.toggle('show');

            const writeStorySection_show = document.querySelector('.writeStorySection.show');

            writeStorySection_show.style.left = '22%';

            dim.classList.toggle('show');
        })

        closeModal.addEventListener('click', (e) => {
            e.preventDefault();
            writeStorySection.classList.remove('show');
            dim.classList.remove('show');
        })

        dim.addEventListener('click', (e) => {
            e.preventDefault();
            writeStorySection.classList.remove('show');
            dim.classList.remove('show');
        })

    }, [])

    useEffect(() => {
        const parent = document.querySelector('#storyList');
        const shareSection = document.querySelector('.shareSection');
        const closeModal = document.querySelector('.closeShareModal');
        const dim = document.querySelector('.dim');

        if (parent !== null) {
            parent.addEventListener('click', (e) => {

                const shareBtnId = e.target.id.slice(15);

                if (Number(shareBtnId)) {

                    shareSection.style.top = `50%`;
                    shareSection.style.left = `40%`;

                    shareSection.classList.toggle('show');

                    dim.classList.toggle('show');

                }

            })

            closeModal.addEventListener('click', (e) => {
                shareSection.classList.remove('show');
                dim.classList.remove('show');
            })

            dim.addEventListener('click', (e) => {
                shareSection.classList.remove('show');
                dim.classList.remove('show');
            });
        }
    }, [])


    // 2024-10-07 : 토글 작업 중
    useEffect(() => {
        const parent = document.querySelector('#storyList');
        const commentSection = document.querySelector('.commentSection');
        const closeModal = document.querySelector('.closeCommentModal');
        const dim = document.querySelector('.dim');

        if (parent !== null) {
            parent.addEventListener('click', (e) => {

                const chatBtnId = e.target.id.slice(9);

                if (Number(chatBtnId)) {  // 2024-10-09 : chatBtnId 값이 있을때

                    // 2024-10-06 : 토글시 해당 스토리 근처에서 모달창이 뜨게끔 해줘야함
                    commentSection.style.top = `40%`;
                    commentSection.style.left = `50%`;

                    commentSection.classList.toggle('show');

                    dim.classList.toggle('show');
                }

            })

            // 2024-10-08 : dim 처리까지 완료
            closeModal.addEventListener('click', (e) => {
                commentSection.classList.remove('show');
                dim.classList.remove('show');
            })

            // 2024-10-09 : dim을 클릭해도 댓글 창이 사라지게 구현
            dim.addEventListener('click', (e) => {
                commentSection.classList.remove('show');
                dim.classList.remove('show');
            });


        }

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

        if (ACCESS_TOKEN != null) {

            const getSubscribeUsers = async () => {
                axios.get(`http://127.0.0.1:8080/api/users/s/subscribeUserList`,
                    {
                        headers: {
                            'Content-Type': 'application/json; charset=UTF-8',
                            'Authorization': 'Bearer ' + ACCESS_TOKEN
                        }
                    }
                ).then(function (res) {

                    console.log(res);
                    setSubscribeUsers(res.data.data);

                }).catch(function (res) {
                    console.log(res);
                    // 2024-09-24 : exception이 두번 터져서 주석 처리
                    /*
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
                    */
                })
            }

            getSubscribeUsers();
        }


    }, [ACCESS_TOKEN, navigate]);

    // 2024-09-22 : 여기까지 대략 구현
    useEffect(() => {

        const profileCarousel = document.querySelector(".profileCarousel");

        let isDragging = false;
        let startPosition = 0;
        let accumulateDeltaX = 0;

        function updateCarousel(deltaX) {
            const items = document.querySelectorAll(".story-list .profileCarousel .profileCarousel__img");

            accumulateDeltaX = accumulateDeltaX + deltaX;

            const lastItemRightEdge = profileCarousel.offsetWidth + accumulateDeltaX;

            console.log(items.length);

            // 토탈 프로필 리스트 수와 프로필 섹션 크기를  곱한 값. -> 추후에 동적으로 가져와야함.
            const totalItemWidth = items.length * items[0].offsetWidth;

            if (lastItemRightEdge >= totalItemWidth && deltaX > 0) {
                if (items.length > 8) {
                    accumulateDeltaX = totalItemWidth + items[0].offsetWidth * 2.5 - profileCarousel.offsetWidth;
                } else {
                    accumulateDeltaX = 0;
                }
            }

            if (lastItemRightEdge < profileCarousel.offsetWidth && deltaX <= 0) {
                accumulateDeltaX = 0;
            }

            profileCarousel.style.transform = `translateX(${-accumulateDeltaX}px)`;

        }

        function handleMouseDown(e) {
            isDragging = true;

            // 마우스 클릭시 첫 위치 값
            startPosition = e.clientX;

        }

        function handleMouseMove(e) {
            if (!isDragging) {
                return;
            }

            const currentPosition = e.clientX;

            const deletaX = startPosition - currentPosition;

            startPosition = e.clientX;

            console.log("deltaX : ", deletaX);

            if (deletaX > 0) {
                // 캐러셀을 오른쪽으로 이동
                updateCarousel(deletaX);
            } else if (deletaX < 0) {
                // 캐러셀을 왼쪽으로 이동
                updateCarousel(deletaX);
            }

        }

        // mouseUp이라는 말은 mousedown(click) 후 마우스를 뗏다는 의미.
        function handleMouseUp() {
            isDragging = false;
        }

        profileCarousel.addEventListener('mousedown', handleMouseDown);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

    }, []);


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
                                <li><Link className='notification_icon'><i className="far fa-heart"></i>알람</Link></li>
                                <li><Link className='writeStory_icon'><i className="fas fa-plus-circle"></i>글쓰기</Link></li>
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
                    <div className='main-content'>

                        {/* 전체 리스트 시작 */}
                        <article className="story-list" id="storyList">

                            {/* 프로필 카루셀 */}
                            <div className='profileCarousel'>

                                {subscribeUsers.map((subscribeUser, index) => {
                                    return (
                                        <div className='profileCarousel__img' key={index}>
                                            <img src={subscribeUser.profileImageUrl === null ? Person : `/profileImg/${subscribeUser.profileImageUrl}`} alt='' width={'100%'} height={'100%'} />
                                            <p>{subscribeUser.username}</p>
                                        </div>
                                    )
                                })}

                            </div>

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
                                                <div style={{ display: 'flex' }}>
                                                    <button>
                                                        {story.likeState === true ?
                                                            <i className="fas fa-heart active" id={'storyLikeIcon_' + story.imageId}></i>
                                                            :
                                                            <i className="far fa-heart" id={'storyLikeIcon_' + story.imageId}></i>
                                                        }
                                                    </button>
                                                    <button>
                                                        <img id={`chatIcon_${story.imageId}`} className='chatImgIcon' src={Chat} alt='' width={25} height={25.6} ></img>
                                                    </button>

                                                    <button><img id={`storyShareIcon_${story.imageId}`} className='shareImgIcon' src={ShareIcon} alt='' width={25} height={25}></img></button>
                                                </div>
                                                <button id={'storyBookmarkIcon_' + story.imageId}>
                                                    {/** 나중에 조건식 수정 */}
                                                    {true === true ?
                                                        <img src={bookmark_white} alt='' width={25} height={25}></img>
                                                        :
                                                        <img src={bookmark_black} alt='' width={25} height={25}></img>
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
                        {/* 2024-09-26 : 추천인 보기(너 그리고 나) */}
                        <article className='recommendUser' id='recommendUser'>
                            <div className='recommendUser__myself'>
                                <div className='recommendUser__myself__left'>
                                    <div className='recommendUser__myself__img'>
                                        <img src={Person} alt=''></img>
                                    </div>
                                    <div>
                                        <p className='recommendUser__myself__name'>차아무개</p>
                                        <p className='recommendUser__myself__state'>안녕하세요</p>
                                    </div>
                                </div>
                                <div className='recommendUser__myself__right'>
                                    전환
                                </div>
                            </div>
                            <div className='recommendUser__friends'>

                                <div className='recommendUser__friends__title'>
                                    <h4>친구추천</h4>
                                    <Link>모두보기</Link>
                                </div>
                                <div className='recommendUser__friends__list'>
                                    <div className='recommendUser__friends__container'>
                                        <div className='recommendUser__friends__left'>
                                            <div className='recommendUser__friends__img'>
                                                <img src={Person} alt=''></img>
                                            </div>
                                            <div>
                                                <p className='recommendUser__friends__name'>김아무개</p>
                                                <p className='recommendUser__friends__state'>헬로우</p>
                                            </div>
                                        </div>
                                        <div className='recommendUser__friends__right'>
                                            구독
                                        </div>
                                    </div>

                                    <div className='recommendUser__friends__container'>
                                        <div className='recommendUser__friends__left'>
                                            <div className='recommendUser__friends__img'>
                                                <img src={Person} alt=''></img>
                                            </div>
                                            <div>
                                                <p className='recommendUser__friends__name'>장아무개</p>
                                                <p className='recommendUser__friends__state'>하이</p>
                                            </div>
                                        </div>
                                        <div className='recommendUser__friends__right'>
                                            구독
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </article>

                    </div>

                </section>
                {/* 팝업 js */}
                <Search />
                <Explore />
                <Message />
                <Notification />
                <Reels />
                <Comment />
                <Share />
                <WriteStory />

                {/** nav_bottom js */}
                <NavBottom />
            </div>



        </>
    );
};

export default Story;