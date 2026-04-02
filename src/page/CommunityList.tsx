import { useState, useEffect} from "react";
import { useSearchParams, Link } from "react-router-dom";
import SubBanner from "../components/SubBanner";
import List from "../components/List";
import { Select } from "../api/table/table-api";
import { Search, RefreshCw } from 'react-feather';
import type { CommunityProps } from "../type/community/community-type";
import "../css/community.css"

const CommunityList = ({user} : {user : string | null}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const curPage = Number(searchParams.get("page")) || 1;
    const curSubjec = searchParams.get("subject") || '';

    const [listData, setListData] = useState<CommunityProps[]>([]);
    const [totalCount, setTotalCount] = useState<number>(1);
    const [searchSubject, setSearchSubject] = useState<string>(curSubjec);

    const limit = 15;

    const pageGroup = Math.ceil(curPage / 10);
    const startPage = (pageGroup - 1) * 10 + 1;
    const endPage = Math.min(startPage + 9, totalCount);

    const ChangePage = (page : string) => {
        setSearchParams({page : page});
    }

    const SearchSubject = () => {
        setSearchParams({subject : searchSubject, page : "1"});
    }

    const Refresh = () => {
        setSearchParams({});
        setSearchSubject('');
    }

    useEffect(() => {
        const load = async() => {
            try{
                const result = await Select({page: curPage, subject : searchSubject}, "community");
                setListData(result.data);
                setTotalCount(result.totalCount / limit);
            }catch{
                alert("올바른 접근이 아닙니다.")
            }
        }
        load()
    }, [searchParams])

    
    const pagingArr = Array.from({length : (endPage - startPage + 1)}, (_, i) => startPage + i);

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
        <SubBanner tit={"COMMUNITY"}/>
        <div id="CommunityList">
            <div className="search"> 
                <div className="search-wrap">
                    <input type="text" value={searchSubject} placeholder='검색명을 입력해 주세요.' onChange={(e : React.ChangeEvent<HTMLInputElement>) => setSearchSubject(e.target.value)}  onKeyDown={(e) => {if (e.key === 'Enter') {SearchSubject();}}}/>
                    <button onClick={SearchSubject}><Search size={20}/></button>
                </div>
                <button className="refresh-btn" onClick={Refresh}><RefreshCw size={20}/></button>
            </div>
            <List subject={"제목"} name={"글쓴이"} data={listData} subjectKey={'subject'} nameKey={'userName'} table={"community"} />
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
            {user && user === '10' && (
            <ul className="admin-btn">
                <li><Link to="/community/write">게시글 작성</Link></li>
            </ul>
            )}
        </div>
        </>
    )
}

export default CommunityList;