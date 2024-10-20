import React from 'react';

import '../../assets/css/writeStory.css'

import Person from '../../assets/images/person.jpeg';


const WriteStory = () => {

    // 2024-10-18 : 파일 선택 취소시 같은 파일을 올려도 가능하게 하는 법
    const onChangeFile = (e) => {
        e.target.value = "";
    }

    return (
        <div className='writeStorySection'>
            <div className="writeStorySection__modalDialog">
                <div className="writeStorySection__modalContent">
                    <div className='writeStorySection__modalHeader'>
                        <h1 className='writeStorySection__modalHeader__h1'>게시글 작성하기</h1>
                        <div className='writeStorySection__modalHeader__btn'>
                            <button className='nextModalBtn'>다음</button>
                            {/** 글쓰기 모달 완료 : 6분 43초부터 다시 */}
                            <button className='shareModalBtn'>공유</button>
                            <button className='closeWriteStoryModal'><i className='fas fa-times'></i></button>
                        </div>
                    </div>
                    <div className='writeStorySection__modalBody'>
                        <div className='writeStorySection__imgArea'>
                            <div className='writeStorySection__uploadImg'><i className='far fa-images'></i></div>
                            <p>사진이나 영상을 여기로 가져오세요.</p>
                            <button className='writeStorySection__uploadBtn'>당신의 PC에서 선택하세요.
                                <form className='writeStorySection__uploadBtn__form'>
                                    <input type='file' className='writeStorySection__uploadImg__input' onChange={onChangeFile}></input>
                                </form>
                            </button>
                        </div>
                        <div className='writeStorySection__uploadImgArea'>
                            <img src='' alt='' className='writeStorySection__uploadImgArea__img'></img>
                        </div>
                        <div className='writeStorySection__uploadImgDescription'>
                            <div className='writeStorySection__uploadImgDescription__left'>
                                <img className='writeStorySection__uploadImgDescription__img' src='' alt=''></img>
                            </div>
                            <div className='writeStorySection__uploadImgDescription__right'>
                                <div className='writeStorySection__uploadImgDescription__profile'>
                                    <div>
                                        <img src={Person} alt=''></img>
                                    </div>
                                    <p>김아무개</p>
                                </div>
                                <form className='writeStorySection__uploadImgDescription__profile__form'>
                                    <textarea id='' name='' placeholder='이메일을 입력하세요.'></textarea>
                                </form>
                            </div>
                        </div>
                        <div className='writeStorySection__share'></div>
                    </div>
                    <div className='writeStorySection__modalFooter'>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default WriteStory;