import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
    user : string | null,
    setUser : (user : string | null) => void
}

const Footer = ({user, setUser} : HeaderProps) => {
    const nav = useNavigate();
    const Logout = () => {
        localStorage.removeItem("mb_level");
        setUser(null);
        nav('/');
    }
    return(
        <footer>
            <div id="footer-wrap">
                <div className="logo">SAMPLE</div>
                <div className="address">주소 및 정보가 들어가는 곳입니다.</div>
                <ul className="member">
                    {!user && (
                        <>
                            <li><Link to="/login">로그인</Link></li>
                            <li><Link to="/register">회원가입</Link></li>
                        </>
                    )}
                    {user && (<li className="logout"><button onClick={Logout}>로그아웃</button></li>)}
                </ul>
            </div>
        </footer>
    )
}

export default Footer;