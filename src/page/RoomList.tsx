import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Select } from '../api/table/table-api';
import SubBanner from "../components/SubBanner";
import RoomInfo from '../components/RoomInfo';
import type { RoomProps } from '../type/room/room-type';

const RoomList = ({user} : {user : string | null}) => {
    
    const [infoView, setInfoView] = useState<boolean>(false);
    const [infoData, setInfoData] = useState<RoomProps | null>(null);
    const [roomData, setRoomData] = useState<RoomProps[]>([]);

    const ClickRoom = (data : RoomProps) => {
        setInfoData(data);
        setInfoView(true);
    }
    const handleDelete = (id : string) => {
        setRoomData(prev => prev.filter(room => room.id !== id));
    }

    useEffect(() => {
        const load = async() => {
            try{
                const result = await Select({}, "room");
                setRoomData(result.data);
            }catch{
                alert(`객실을 불러오는데 실패했습니다. \n다시 시도해주세요.`)
            }
        }
        load()
    }, [])

    return(
        <>
            <SubBanner tit={"ROOM VIEW"} />
            <div id="RoomList">
                {infoView && <RoomInfo data={infoData} mb={user} onClose={() => setInfoView(false)} onDelete={handleDelete} />}
                <div className="list-wrap">
                    {roomData.map((val) => {
                        const minPrice = Math.min(Number(val.weekday), Number(val.friday), Number(val.weekend));
                        const maxPrice = Math.max(Number(val.weekday), Number(val.friday), Number(val.weekend));
                        return(
                            <div key={val.id} className="room-info">
                                <img src={`/img/room/${val.room_subject}01.jpg`} alt={`${val.room_subject}`} onClick={() => ClickRoom(val)} />
                                <div className="sub">{val.room_subject}</div>
                                <div className="person">인원(기준/최대) {val.person_base} / {val.person_max}</div>
                                <div className="price">가격 <span>{minPrice.toLocaleString()} ~ {maxPrice.toLocaleString()} 원</span></div>
                            </div>
                        )
                    })}
                </div>
                {user && user === '10' && (
                    <Link to='/room/write' className='write-link'>객실등록</Link>
                )}
            </div>
        </>
    )
}

export default RoomList;