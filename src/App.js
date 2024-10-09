// import logo from './logo.svg';
import './App.css';
import Footer from './components/fragment/Footer';
import Header from './components/fragment/Header';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Popular from './pages/image/Popular';
import Story from './pages/image/Story';
import Upload from './pages/image/Upload';
import Profile from './pages/user/Profile';
import Update from './pages/user/Update';

import { Routes, Route, useLocation } from 'react-router-dom';

function App() {

  const { pathname } = useLocation();

  if (pathname === '/signin') {
    return (
      <Routes>
        <Route path='/signin/*' exact={true} element={<SignIn />}></Route>
      </Routes>
    );
  }

  if (pathname === '/signup') {
    return (
      <Routes>
        <Route path='/signup/*' exact={true} element={<SignUp />}></Route>
      </Routes>
    );
  }

  return (
    <div>
      <div className='dim'></div>
      <Header />
      <Routes>

        <Route path='/*' exact={true} element={<Story />}></Route>
        <Route path='/image/story/*' exact={true} element={<Story />}></Route>
        <Route path='/image/popular/*' exact={true} element={<Popular />}></Route>
        <Route path='/user/profile/*' exact={true} element={<Profile />}></Route>
        <Route path='/user/update/*' exact={true} element={<Update />}></Route>

        <Route path='/image/upload' exact={true} element={<Upload />}></Route>

        <Route path='/login/oauth2/code/naver?code=:code&state=:state' element={<Upload />}></Route>
      </Routes>
      <Footer />
    </div>
  );

}

export default App;
