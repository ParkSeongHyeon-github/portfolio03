import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Select } from '../api/table/table-api';
import { Search, RefreshCw } from 'react-feather';
import SubBanner from "../components/SubBanner";
import List from '../components/List';
import type { ReservationProps } from '../type/reservation/reservation';

const ReservationList = ({user} : {user : string | null}) => {
    const nav = useNavigate();
    if(!user || user !== '10'){
        nav('/');
    }
    const [searchParams, setSearchParams] = useSearchParams();
    const curPage = Number(searchParams.get("page")) || 1;
    const curName = searchParams.get("username") || '';

    const [resData, setResData] = useState<ReservationProps[]>([]);
    const [totalCount, setTotalCount] = useState<number>(1);
    const [searchName, setSearchName] = useState<string>(curName);

    const pageGroup = Math.ceil(curPage / 10);
    const startPage = (pageGroup - 1) * 10 + 1;
    const endPage = Math.min(startPage + 9, totalCount)

    const ChangePage = (page : string) => {
        if(curName){
            setSearchParams({page : page, username : curName});
        }
        setSearchParams({page : page});
    }

    const SearchSubject = () => {
        setSearchParams({username : searchName, page : "1"});
    }

    const Refresh = () => {
        setSearchParams({});
        setSearchName('');
    }

    useEffect(() => {
        const load = async() => {
            try{
                const result = await Select({page : curPage, name : searchName}, "reservation");
                setResData(result.data);
                setTotalCount(result.totalCount / 15);
            }catch{
                alert("예약 정보를 불러오는데 실패했습니다.")
            }
        }
        load()
    }, [searchParams])

    const pagingArr = Array.from({ length : endPage - startPage + 1}, (_, i) => startPage + i);
    const prevGroup = () => {
        if(startPage > 1){
            ChangePage(String(startPage - 1));
        }
    }
    const nextGroup = () => {
        if (endPage < totalCount) {
            ChangePage(String(endPage + 1));
        }
    };

    return(
        <>
        <SubBanner tit={"RESERVATION"} />
        <div id="ReservationList">
            <div className="search"> 
                <div className="search-wrap">
                    <input type="text" value={searchName} placeholder='예약자명을 입력해 주세요.' onChange={(e : React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value)}  onKeyDown={(e) => {if (e.key === 'Enter') {SearchSubject();}}}/>
                    <button onClick={SearchSubject}><Search size={20}/></button>
                </div>
                <button className="refresh-btn" onClick={Refresh}><RefreshCw size={20}/></button>
            </div>
            <List subject={"객실명"} name={"예약자명"} data={resData} subjectKey={'roomSubject'} nameKey={'userName'} table={"reservation"} />
            <div className="pagination">
                {startPage > 1 && (
                    <button onClick={prevGroup}>이전</button>
                )}
                {pagingArr.map((val) => (
                    <button key={val} type="button" onClick={() => ChangePage(String(val))} className={val === curPage ? 'active' : ''}>{val}</button>
                ))}
                {endPage < totalCount && (
                    <button onClick={nextGroup}>다음</button>
                )}
            </div>
            <ul className="admin-btn">
                <li><Link to="/reservation">캘린더</Link></li>
            </ul>
        </div>
        </>
    )
}

export default ReservationList;