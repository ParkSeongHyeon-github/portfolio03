import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Main from './main/Main';
import Footer from './components/Footer';
import Login from './member/Login';
import Register from './member/Register';
import RoomWrite from './page/RoomWrite';
import RoomList from './page/RoomList';
import Reservation from './page/Reservation';
import ReservationWrite from './page/ReservationWrite';
import ReservationList from './page/ReservationList';
import ReservationView from './page/ReservationView';
import PaySuccess from './page/PaySuccess';
import PayFail from './page/PayFail';
import CommunityWrite from './page/CommunityWrite';
import CommunityList from './page/CommunityList';
import CommunityView from './page/CommunityView';
import './css/default.css';
import './css/common.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {
  const [user, setUser] = useState<string | null>(null);
  
    useEffect(() => {
      const mbLevel = localStorage.getItem("mb_level");
      if(mbLevel){
        setUser(mbLevel)
      }
      AOS.init({offset: -500});
    }, [])
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Main />}></Route>
            <Route path="/login" element={<Login setUser={setUser} />}></Route>
            <Route path="/register" element={<Register />}></Route>
            
            <Route path="/room/write" element={<RoomWrite user={user} />}></Route>
            <Route path="/room/write/:room_id" element={<RoomWrite user={user} />}></Route>
            <Route path="/room/list" element={<RoomList user={user} />}></Route>

            <Route path="/reservation" element={<Reservation user={user} />}></Route>
            <Route path="/reservation/write/:room_id" element={<ReservationWrite />}></Route>
            <Route path="/reservation/list" element={<ReservationList user={user} />}></Route>
            <Route path="/reservation/view/:res_id" element={<ReservationView user={user} />}></Route>

            <Route path="/pay/success" element={<PaySuccess />}></Route>
            <Route path="/pay/fail" element={<PayFail />}></Route>

            <Route path="/community/write" element={<CommunityWrite user={user} />}></Route>
            <Route path="/community/write/:commu_id" element={<CommunityWrite user={user} />}></Route>
            <Route path="/community/list" element={<CommunityList user={user} />}></Route>
            <Route path="/community/view/:commu_id" element={<CommunityView user={user} />}></Route>
        </Routes>
      </main>
      <Footer user={user} setUser={setUser}/>
    </BrowserRouter>
  )
}

export default App
