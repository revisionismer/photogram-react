import React from 'react';

import '../../assets/css/footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <>
            <footer className='footer'>
                <div className="container">
                    <ul>
                        <li><Link href="#a">소개</Link></li>
                        <li><Link href="#a">블로그</Link></li>
                        <li><Link href="#a">채용 정보</Link></li>
                        <li><Link href="#a">도움말</Link></li>
                        <li><Link href="#a">API</Link></li>
                        <li><Link href="#a">개인정보처리방침</Link></li>
                        <li><Link href="#a">약관</Link></li>
                        <li><Link href="#a">인기 계정</Link></li>
                        <li><Link href="#a">해시태그</Link></li>
                        <li><Link href="#a">위치</Link></li>
                    </ul>
                    <div className="copy">
                        <p>© 2024 Photogram-React By PARK JONG HEE</p>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;