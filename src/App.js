// import logo from './logo.svg';
import './App.css';
import Footer from './components/fragment/Footer';
import Header from './components/fragment/Header';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
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
      <Header />
      <Routes>
        <Route path='/users/:id/profile/*' exact={true} element={<Profile />}></Route>
        <Route path='/users/:id/update/*' exact={true} element={<Update />}></Route>
      </Routes>
      <Footer />
    </div>
  );

}

export default App;
