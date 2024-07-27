import React from 'react';

import '../../assets/css/upload.css';

import Logo from '../../assets/images/logo.jpg';
import Person from '../../assets/images/person.jpeg';
import axios from 'axios';

import { Link, Navigate, json, useLocation, useNavigate, useParams} from 'react-router-dom';


const Upload = () => {

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

    function deleteCookie(key) {
        document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }


    let f;

    function imageChoose(e) {

        f = e.target.files[0];

        if (!f.type.match("image.*")) {
            alert("이미지를 등록해야 합니다.");

            // 1-2. 이미지 등록 실패시 file input value도 초기화하고 default 이미지를 다시 보여준다.
            document.getElementById("uploadStoryImgfile").value = "";
            document.getElementById("imageUploadPreview").setAttribute("src", Person);

            return;
        }

        let reader = new FileReader();

        reader.onload = (e) => {
            document.getElementById("imageUploadPreview").setAttribute("src", e.target.result);
        }

        reader.readAsDataURL(f);  // 1-3. 이 코드 실행시 reader.onload 실행

    }

    function storyImgUpload() {

        if (!f) {
            alert("스토리 이미지를 등록해주세요.");
            return;
        }

        var caption = document.getElementById('caption').value;

        if (caption === '') {
            alert("스토리에 대한 설명을 적어주세요.");
            document.getElementById('caption').focus();
            return;
        }

        let formData = new FormData();
        formData.append('file', f);
        formData.append('caption', caption);

        console.log(formData);

        axios.post(`http://127.0.0.1:8080/api/images/s/story`,
            formData,
            {
                headers: {
                    'Authorization': 'Bearer ' + ACCESS_TOKEN,
                    'Content-Type': 'multipart/form-data'

                }
            }).then(function (res) {
                console.log(res);

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
                    <form id='uploadImgForm' className="upload-form">
                        <input type="file" id='uploadStoryImgfile' name="file" className="file" onChange={(e) => imageChoose(e)} />
                        <div className="upload-img">
                            <img src={Person} alt="" id="imageUploadPreview" />
                        </div>

                        {/*사진설명 + 업로드버튼*/}
                        <div className="upload-form-detail">
                            <input type="text" placeholder="사진설명" id='caption' name="caption" />
                            <button type='button' id='storyImageUploadBtn' className="cta blue" onClick={() => storyImgUpload()}>업로드</button>
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