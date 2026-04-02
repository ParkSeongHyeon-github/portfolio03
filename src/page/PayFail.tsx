import { Link } from "react-router-dom";
import SubBanner from "../components/SubBanner";

const PayFail = () => {
    return(
        <>
        <SubBanner tit={"RESERVATION"}/>
        <div id="PayFail" className="pay-container">
            <img src="/img/fail-img.png" alt="" />
            <h2>결제를 실패했어요</h2>
            <p>예약하신 객실이 현재 대기 상태일 경우<br />
                관리자에게 문의하신 후 다시 예약해주시기 바랍니다.</p>
            <ul className="link">
                <li><Link to="/">메인화면으로 돌아가기</Link></li>
                <li><Link to="/reservation">캘린더 확인하기</Link></li>
            </ul>
        </div>        
        </>
    )
}

export default PayFail;