import { useState } from 'react';
import { Link } from "react-router-dom";
import { Delete } from "../api/table/table-api";
import ResultMessage from '../components/ResultMessage';
import type { ReservationProps } from "../type/reservation/reservation";
import type { ResultProps } from '../type/result/result-type';
import type { CommunityProps } from '../type/community/community-type';
import "../css/view.css"

interface ViewProps {
    user : string | null,
    viewData : ReservationProps | CommunityProps | null, 
    table : string,
    listLink : string
}

const View = ({user, viewData, table, listLink} : ViewProps) => {
    const isReservation = table === 'reservation';
    const [result, setResult] = useState<ResultProps | null>(null);

    const formatPhone = (num: string) => {
        return num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    };

    const DeleteData = async(id : string) => {
        try{
            const ckDelete = confirm(`해당 게시글을 삭제 하시겠습니까? \n삭제 후 복구는 불가능합니다.`);
            if(ckDelete){
                await Delete(table, id);
                setResult({
                    type : "success",
                    message : "게시글이 정상적으로 삭제되었습니다."
                })
            }
        }catch{
            setResult({ 
                type : "error",
                message : "게시글 삭제에 실패했습니다."
            })
        }
    }
    console.log(user);

    if(!viewData){
        return <div>loading...</div>
    }

    return(
        <div className="view-table">
            {result && <ResultMessage title={"게시글 삭제"} type={result.type} message={result.message} onClose={() => setResult(null)} link={`/${table}/list`} />}
            <div className="title">
                {isReservation 
                    ? (viewData as ReservationProps).roomSubject 
                    : (viewData as CommunityProps).subject}
            </div>
            <ul className="user">
                <li><span>작성자</span>{viewData.userName}</li>
            </ul>
           {isReservation && ((() => {
                const data = viewData as ReservationProps;
                return (
                <ul className="info">
                    <li><span>이름</span>{data.userName}</li>
                    <li><span>연락처</span>{formatPhone(data.userPhone)}</li>
                    <li><span>예약일</span>{data.useDate} ~ {data.endDate}</li>
                    <li><span>성인</span>{data.adultCount}</li>
                    <li><span>아동</span>{data.childCount}</li>
                    <li><span>가격</span>{data.price.toLocaleString()}원</li>
                    <li><span>결제</span>{data.orderId ? "결제완료" : "결제대기중"}</li>
                </ul>
                )
            })()
            )}
            <div className="content pl">
            {isReservation 
                ? (viewData as ReservationProps).request 
                : (viewData as CommunityProps).content}
            </div>
            <div className="btn">
                <Link to={listLink}>글 목록</Link>
                {user && user === '10' && table === 'community' && (
                <Link to={`/community/write/${viewData.id}`}>글 수정</Link>
                )}
                {user && user === '10' && (
                <button type='button' onClick={() => DeleteData(viewData.id)} className="delete-btn">글 삭제</button>
                )}
            </div>
        </div>
    )
}

export default View;