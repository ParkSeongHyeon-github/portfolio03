import { Link, useLocation  } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    const isMain = location.pathname === "/";
    return(
        <header>
            <div id="header-wrap" className={isMain ? "Main" : "Sub"}>
                <div className="logo">
                    <Link to="/">SAMPLE</Link>
                </div>
                <nav>
                    <ul>
                        <li><Link to="/room/list">ROOM VIEW</Link></li>
                        <li><Link to="/reservation">RESERVATION</Link></li>
                        <li><Link to="/community/list">COMMUNITY</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header;