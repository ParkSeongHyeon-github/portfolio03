import { Link } from 'react-router-dom';
import { Delete } from '../api/table/table-api';
import { X, User, Layout, Slash } from 'react-feather';
import type { RoomProps } from "../type/room/room-type"

interface RoomInfoProps {
    data : RoomProps | null,
    mb : string | null,
    onClose : () => void;
    onDelete : (id : string) => void;
}
const RoomInfo = ({data, mb, onClose, onDelete} : RoomInfoProps) => {

    const formmatDate = () => {
        const value = new Date();
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const day = String(value.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    const DeleteData = async(id : string) => {
        try{
            const ckDelete = confirm("해당 객실을 삭제하시겠습니까? \n삭제 후 복구는 불가능합니다.");
            if(ckDelete){
                await Delete("room", id);
                alert("객실이 정상적으로 삭제 되었습니다.");
                onDelete(id);
                onClose();
            }
        }catch{
            alert("올바른 접근이 아닙니다.");
        }
    }

    if(!data){return <div>loading...</div>}

    return(
        <div id="RoomInfo">
            <div className="wrap">
                <button type="button" className="close-btn" onClick={onClose}><X size="30"/></button>
                <div className="left">
                    <ul>
                        {data.room_img.slice().reverse().map((val, index) => {
                            return(
                                <li key={index}>
                                    <img src={`/img/room/${val}`} alt="객실 정보" />
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className="right">
                    <h3>{data.room_subject}</h3>
                    <ul className="basic">
                        <li><User size={22} />기준 {data.person_base}인 / 최대 {data.person_max}인</li>
                        <li><Layout size={22} /> {data.bed}</li>
                        <li><Slash size={22} />금연객실</li>
                    </ul>
                    <div className="service">
                        <p>시설/서비스</p>
                        <ul>
                            {data.service.map((val) => {
                                return(
                                    <li key={val.serviceKey}>
                                        <div>{val.serviceKey}</div>
                                        {val.serviceVal}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div className="content">
                        <p>기본정보</p>
                        <div className="pl">{data.room_content}</div>
                    </div>
                    {(!mb || mb !== '10') && (
                        <ul className='btn-wrap'>
                            <li>
                                <Link to={`/reservation/write/${data.id}?select=${formmatDate()}`} className='reser-btn'>예약하기</Link>
                            </li>
                        </ul>
                    )}
                    {(mb && mb === '10') && (
                        <ul className='btn-wrap admin'>
                            <li>
                                <Link to={`/room/write/${data.id}`} className='reser-btn'>객실 수정</Link>
                            </li>
                            <li>
                                <button type="button" className="delete-btn" onClick={() => DeleteData(data.id)}>객실 삭제</button>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}

export default RoomInfo;