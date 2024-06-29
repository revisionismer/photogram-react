import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

/** StricMode : 콘솔에 API가 두번씩 실행되는 원인 : 나중에 제거 해주고 실행하면 alert 두번 안뜸 */
// React Router dom 첫번째 : browerRouter로 App.js를 감싼다.
root.render(

  //  <React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  //  </React.StrictMode>
);
