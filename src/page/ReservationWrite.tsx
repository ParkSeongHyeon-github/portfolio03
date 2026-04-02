const baseUrl = import.meta.env.VITE_API_BASE_URL;
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSearchParams, useParams } from "react-router-dom";
import { SelectOne ,Insert } from "../api/table/table-api";
import { ChevronLeft, ChevronRight } from "react-feather";
import { ChangeNumber } from "../utils/number";
import { nanoid } from "nanoid";
import SubBanner from "../components/SubBanner"
import Calendar from 'react-calendar';
import ResultMessage from "../components/ResultMessage";
import ReservationPay from "./ReservationPay";
import type { ResultProps } from "../type/result/result-type";
import type { RoomProps } from "../type/room/room-type";
import type { ReservationWriteProps } from "../type/reservation/reservation";
import type { Value } from "react-calendar/dist/shared/types.d.ts";
import "../css/calendar.css";
import "../css/reservation.css";

const ReservationWrite = () => {
    const periodArr : string[] = ['1박 2일', '2박 3일', '3박 4일', '4박 5일', '5박 6일', '6박 7일'];
    const personArr : string[] = ['1명', '2명', '3명', '4명'];
    const childArr : string[] = ["0명", ...personArr];

    //url 파라미터
    const {room_id} = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const selectDay = searchParams.get('select');

    // 네비게이션
    const nav = useNavigate();

    // 폼 관리
    const {register, handleSubmit, reset ,setValue, watch} = useForm<ReservationWriteProps>();
    const period = watch("stayPeriod") || '1박 2일';
    const orderSub = watch("roomSubject");
    const orderName = watch("userName");

    // 상태관리
    const [roomData, setRoomData] = useState<RoomProps | null>(null);
    const [orderId, setOrderId] = useState<string>("");
    const [result, setResult] = useState<ResultProps | null>(null);
    const [payResult, setPayResult] = useState<boolean>(false);
    const [price, setPrice] = useState<number>(0);
    const [adult, setAdult] = useState<number>();
    const [child, setChild] = useState<number>();

    // 룸아이디 및 예약일 없는거 방지
    if (!selectDay || !room_id) return;
    const splitDay = selectDay.split('-');
    if (!splitDay[0] || !splitDay[1] || !splitDay[2]) return ;
    const curDay = `${splitDay[0]}년 ${splitDay[1]}월 ${splitDay[2]}일`;

    // 캘린더 날짜 변경
    const ChangeDate = (value : Value) => {
        if (!value || Array.isArray(value)) return;
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const day = String(value.getDate()).padStart(2, '0');
        setSearchParams({ select: `${year}-${month}-${day}` });
    }

    // 폼 업로드
    const Upload = async(data : ReservationWriteProps) => {
        const newData = {...data, id : nanoid(10)}
        try{
            const result = await Insert(newData, "reservation");
            setOrderId(String(result.id));
            setPayResult(true);
        }catch{
            setResult({
                type : "error",
                message : "예약에 실패했습니다. \n다시 시도해주세요."
            })
        }
    }

    const changePerson = (e : React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        const newValue = value.replace("명", "");
        if(name === 'adultCount'){
            setAdult(Number(newValue))
        }else if(name === 'childCount'){
            setChild(Number(newValue))
        }
    }

    useEffect(() => {
        if(room_id){
            const load = async() => {
                try{
                    const result = await SelectOne("room", String(room_id));
                    setRoomData(result);
                }catch{
                    alert("객실 정보를 불러오는데 실패했습니다. \n객실을 다시 선택해주세요.");
                    nav('/reservation');
                }
            }
            load();
        }
    }, [room_id])


    useEffect(() => {
        if(roomData){
            const dayNumber = new Date(selectDay).getDay();
            if(dayNumber === 5){
                setPrice(Number(roomData.friday));
            }else if(dayNumber === 6 || dayNumber === 0){
                setPrice(Number(roomData.weekend));
            }else{
                setPrice(Number(roomData.weekday));
            }
        }

    }, [roomData, searchParams])

    useEffect(() => {
        if (!roomData || !selectDay) return;

        const basePrice = (() => {
            const dayNumber = new Date(selectDay).getDay();
            const days = Number(period.split('박')[0]);
            if (dayNumber === 5){
                if(days){
                    return Number(roomData.friday) * days
                }else{
                    return Number(roomData.friday);
                }
            }
            if (dayNumber === 6 || dayNumber === 0){
                if(days){
                    return Number(roomData.weekend) * days
                }else{
                    return Number(roomData.weekend);
                }
            }
            if(days){
                return Number(roomData.weekday) * days;
            }else{
                return Number(roomData.weekday);
            }
        })();

        const totalPeople = (adult ?? 0) + (child ?? 0);
        const basePeople = Number(roomData.person_base);

        if(totalPeople > Number(roomData.person_max)){
            alert("숙박 가능 최대 인원을 초과했습니다.");
            reset({"adultCount" : "1명", "childCount" : "0명"});
            setAdult(1);
            setChild(0);
        }

        let extra = 0;

        if (totalPeople > basePeople) {
            extra = (totalPeople - basePeople) * 20000;
        }


        setPrice(basePrice + extra);

    }, [adult, child, roomData, selectDay, period]);

    useEffect(() => {
        setValue("price", price);
    }, [price]);

    useEffect(() => {
        if(selectDay && roomData){
            const load = async() => {
                try{
                    const res = await fetch(baseUrl + `reservation?roomSubject=${roomData.room_subject}`);
                    const result = await res.json();
                    if (!result || result.length === 0) return;

                    const isReserved = result.some((val : any) => {
                        const start = val.useDate;
                        const end = val.endDate;

                        return start <= selectDay && end > selectDay;
                    })

                    if(isReserved){
                        alert("이미 예약이 완료된 객실입니다.");
                        nav("/reservation");
                    }
                }catch{ 
                    alert("올바른 접근이 아닙니다.");
                }
            }
            load()
        }
    }, [room_id, searchParams, roomData])

    useEffect(() => {
        if(period){
            const days = Number(period.split('박')[0]);
            const date = new Date(selectDay);
            date.setDate(date.getDate() + days);

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            setValue("endDate", `${year}-${month}-${day}`);
        }
    }, [period])

    if(!roomData){
        return <div>loading...</div>
    }

    return(
        <>
        {payResult && <ReservationPay orderId={orderId} orderSub={orderSub} orderName={orderName} Price={price} onClose={() => setPayResult(false)} />}
        {result && <ResultMessage title={"객실 예약"} type={result.type} message={result.message} onClose={() => setResult(null)} link={'/reservation'} />}
        <SubBanner tit={"RESERVATION"} />
        <div id="ReservationWrite">
            <form onSubmit={handleSubmit(Upload)} autoComplete="off">
                <input type="hidden" {...register("useDate", {value : selectDay})} />
                <input type="hidden" {...register("roomSubject", {value : roomData.room_subject})} />
                <input type="hidden" {...register("price", {value : price})} />
                <input type="hidden" {...register("endDate")} />
                <div className="top">
                    <div className="left">
                        <Calendar calendarType="gregory" nextLabel={<ChevronRight />} prevLabel={<ChevronLeft />} onChange={ChangeDate} value={selectDay ? new Date(selectDay) : new Date()} />
                    </div>
                    <div className="right">
                        <div className="tit"><span>선택일</span>{curDay}</div>
                        <ul>
                            <li><span>기안안내</span> 선택일은 <span className="type">비수기</span> 기간입니다.</li>
                            <li><span>예약안내</span> 1544-1544</li>
                            <li><span>기타사항</span> 만 19세 미만은 보호자가 동반해야 예약이 가능합니다.</li>
                        </ul>
                    </div>
                </div>
                <div className="middle">
                    <p>객실 정보</p>
                    <div className="info-wrap">
                        <div className="left">
                            <img src={`/img/room/${roomData.room_subject}01.jpg`} alt={roomData.room_subject} />
                        </div>
                        <div className="right">
                            <div className="tit">{roomData.room_subject} <span>기준 {roomData.person_base}명 / 최대 {roomData.person_max}명</span></div>
                            <div className="select-wrap">
                                <div className="period">
                                    <label htmlFor="stayPeriod">숙박기간</label>
                                    <select {...register("stayPeriod", {required : true})} id="stayPeriod">
                                        {periodArr.map((val) => {
                                            return(
                                                <option value={val} key={val}>{val}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className="adult">
                                    <label htmlFor="adultCount">성인</label>
                                    <select  {...register("adultCount", {required : true}) } id="adultCount" onChange={changePerson}>
                                        {personArr.map((val, index) => {
                                            if(Number(roomData.person_max) > index){
                                            return(
                                                <option value={val} key={val}>{val}</option>
                                            )
                                            }
                                        })}
                                    </select>
                                </div>
                                <div className="child">
                                    <label htmlFor="childCount">아동</label>
                                    <select {...register("childCount", {required : true})} id="childCount" onChange={changePerson}>
                                        {childArr.map((val, index) => {
                                            if(Number(roomData.person_max) > index){
                                            return(
                                                <option value={val} key={val}>{val}</option>
                                            )
                                            }
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="price">
                                <div>결제금액</div>
                                {price.toLocaleString()}원
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    <div className="right">
                        <p>예약자 정보입력</p>
                        <div className="container">
                            <div className="input-wrap">
                                <div>
                                    <label htmlFor="userName" className="sound_only">예약자 이름</label>
                                    <input type="text" {...register("userName", {required : true})} placeholder="예약자의 이름을 입력해주세요."/>
                                </div>
                                <div>
                                    <label htmlFor="userPhone" className="sound_only">예약자 연락처</label>
                                    <input type="text" {...register("userPhone", {required : true})} placeholder="예약자 연락처" onInput={ChangeNumber}/>
                                </div>
                            </div>
                            <label htmlFor="request" className="sound_only">요청사항</label>
                            <textarea {...register("request")} id="request" placeholder="요청사항을 입력해 주세요"></textarea>        
                        </div>
                    </div>
                    <div className="left">
                        <p>결제금액 안내</p>
                        <div className="container">
                            <div className="totalprice">최종결제금액 <span>{price.toLocaleString()}원</span></div>
                            <ul>
                                <li>예약문의 : 1544-1544</li>
                                <li>입금기한 : 예약 후 24시간 이내</li>
                                <li>객실 이용 기준명 초과시 2만원 추가금이 발생합니다.</li>
                                <li>입금 기한 내 입금확인 되지 않으면 예약이 자동 취소됩니다.</li>
                                <li>입금하실 때 예약자명으로 입금 하셔야 빠른 확인이 가능합니다.</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <ul className="btn-wrap">
                    <li><button type="submit">예약하기</button></li>
                    <li><Link to="/reservation">달력보기</Link></li>
                </ul>
            </form>
        </div>
        </>
    )
}

export default ReservationWrite;