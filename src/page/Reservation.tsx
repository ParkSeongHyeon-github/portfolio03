import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SubBanner from "../components/SubBanner";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { Select } from "../api/table/table-api";
import type { RoomProps } from '../type/room/room-type';
import type { ReservationProps } from '../type/reservation/reservation';
import "../css/reservation.css"
import "../css/fullcalendar.css"

const Reservation = ({user} : {user : string | null}) => {
    const today = new Date;
    today.setDate(today.getDate() - 1);
    const nav = useNavigate();
    const [roomData, setRoomData] = useState<RoomProps[]>([]);
    const [resData, setResData] = useState<ReservationProps[]>([]);

    const resList = resData.map((val) => ({
        Id : val.id,
        roomName: val.roomSubject,
        useDate: val.useDate,
        endDate : val.endDate,
        orderId : val.orderId ?? null
    }));

    const getReservationStatus = (roomName: string, date: string) => {
        const target = resList.find((val) => {
            if (val.roomName !== roomName) return false;

            const current = new Date(date);
            const start = new Date(val.useDate);
            const end = new Date(val.endDate);

            return current >= start && current < end;
        });

        if (!target) return "available"
        if (!target.orderId) return "pending"
        return "complete";
    };
    useEffect(() => {
        const load = async() => {
            try{
                const roomResult = await Select({}, "room");
                const resResult = await Select({}, "reservation");
                setRoomData(roomResult.data);
                setResData(resResult.data);
            }catch{
                alert("객실정보를 불러오는데 실패했습니다.");
            }
        }
        load()
    }, [])

    return(
        <>
            <SubBanner tit={"RESERVATION"} />
            <div id="Reservation">
                <FullCalendar 
                    plugins={[dayGridPlugin]} 
                    fixedWeekCount={false} 
                    locale="ko"
                    dayCellContent={(arg) => {
                        const year : number = arg.date.getFullYear();
                        const month : string = ('0' + (arg.date.getMonth() + 1)).slice(-2);
                        const day : string = ('0' + arg.date.getDate()).slice(-2);
                        const todayFormat : string = year + '-' + month  + '-' + day;

                        if(arg.date < today){
                            return(
                            <div className="end-type">예약종료</div>
                            )
                        }else {
                        }
                        return(
                        <div className="cell-wrap">
                            <div className="date">
                                {arg.dayNumberText}
                            </div>
                        <ul className="room-list">
                            {roomData.map((val) => {
                                const status = getReservationStatus(val.room_subject, todayFormat);
                                return (
                                    <li key={val.id}>
                                        <div 
                                             onClick={() => {
                                                if (status !== "available") return;
                                                nav(`/reservation/write/${val.id}?select=${todayFormat}`);
                                            }}
                                            style={{ opacity: status === "available" ? 1 : 0.5 }}
                                        >
                                            <span className={`pos ${status === "complete" ? "end" : status === "pending" ? "wait" : ""}`}>
                                                {status === "available" ? "가" : status === "pending" ? "대" : "완"}
                                            </span>
                                            <div className="room">{val.room_subject}</div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        </div>
                        )
                    }}
                />
                {user && user === '10' && (
                <ul className="admin-btn">
                    <li><Link to="/reservation/list">예약 목록</Link></li>
                </ul>
                )}
            </div>
        </>
    )
}

export default Reservation;