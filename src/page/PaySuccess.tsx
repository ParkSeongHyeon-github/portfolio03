import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { SelectOne, Update } from "../api/table/table-api";
import { nanoid } from "nanoid";
import SubBanner from "../components/SubBanner";
import type { ReservationProps } from "../type/reservation/reservation";


const PaySuccess = () => {
    const [searchParams] = useSearchParams();
    const Id= searchParams.get("orderId");
    const [orderData, setOrderData] = useState<ReservationProps>();

    const formatPhone = (num: string) => {
        return num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    };

    useEffect(() => {
        if(Id){
            const load = async() => {
                try{
                    const result = await SelectOne("reservation", Id);
                    setOrderData(result);
                }catch{
                    alert("올바른 접근이 아닙니다.");
                }
            }
            load()
        }
    }, [])

    useEffect(() => {
        if(orderData && Id && !orderData.orderId){
            const load = async() =>{
                try{
                    const newData = {...orderData, orderId : nanoid(10)}
                    await Update(newData, "reservation", Id);
                }catch{
                    alert("올바른 접근이 아닙니다.")
                }
            }
            load()
        }
    }, [orderData])

    if(!orderData){
        return <div>loading...</div>
    }

    return(
        <>
        <SubBanner tit={"RESERVATION"}/>
        <div id="PaySuccess" className="pay-container">
            <img src="/img/check-blue-spot-ending-frame.png" alt="체크완료" />
            <h2>결제를 완료했어요</h2>
            <ul className="user-info">
                <li><span>주문 아이디</span>{searchParams.get("orderId")}</li>
                <li><span>객실명</span>{orderData.roomSubject}</li>
                <li><span>예약자명</span>{orderData.userName}</li>
                <li><span>연락처</span>{formatPhone(orderData.userPhone)}</li>
                <li><span>이용기간</span>{orderData.useDate} ~ {orderData.endDate} ({orderData.stayPeriod}) </li>
                <li><span>어른</span>{orderData.adultCount}</li>
                <li><span>아동</span>{orderData.childCount}</li>
                <li><span>결제 금액</span>{Number(searchParams.get("amount")).toLocaleString()}원</li>
            </ul>
            <ul className="link">
                <li><Link to="/">메인화면으로 돌아가기</Link></li>
                <li><Link to="/reservation">캘린더 확인하기</Link></li>
            </ul>
        </div>
        </>
    )
}

export default PaySuccess;