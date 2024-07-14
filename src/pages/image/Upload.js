import React from 'react';

import '../../assets/css/upload.css';

import Logo from '../../assets/images/logo.jpg';
import Person from '../../assets/images/person.jpeg';

const Upload = () => {
    return (
        <>
            {/*업로드 섹션*/}
            <div className="uploadContainer">
                <section className="upload">
                    {/*사진업로드 로고*/}
                    <div className="upload-top">
                        <a href="home.html" className="homeArea">
                            <img src={Logo} alt="" />
                        </a>
                        <p>사진 업로드</p>
                    </div>
                    {/*사진업로드 로고 end*/}

                    {/*사진업로드 Form*/}
                    {/**  multipart/form-data : 여러가지 타입의 파일을 전송하기 위해서 사용  */}
                    <form className="upload-form" action="/image" method="post" encType="multipart/form-data">
                        <input type="file" name="file" className="file" onChange={null} />
                        <div className="upload-img">
                            <img src={Person} alt="" id="imageUploadPreview" />
                        </div>

                        {/*사진설명 + 업로드버튼*/}
                        <div className="upload-form-detail">
                            <input type="text" placeholder="사진설명" name="caption" />
                            <button className="cta blue">업로드</button>
                        </div>
                        {/*사진설명end*/}

                    </form>
                    {/*사진업로드 Form*/}

                </section>
            </div>
        </>
    );
};

export default Upload;