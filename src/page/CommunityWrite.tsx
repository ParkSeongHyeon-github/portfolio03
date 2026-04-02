import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Insert ,SelectOne, Update } from "../api/table/table-api";
import SubBanner from "../components/SubBanner";
import ResultMessage from "../components/ResultMessage";
import type { ResultProps } from "../type/result/result-type";
import type { CommunityWriteProps } from "../type/community/community-type";
import "../css/write.css"

const CommunityWrite = ({user} : {user : string | null}) => {
    const nav = useNavigate()
    const {commu_id} = useParams();
    const [result, setResult] = useState<ResultProps | null>(null);
    const {register, handleSubmit, reset} = useForm<CommunityWriteProps>();

    const Upload = async(data : CommunityWriteProps) => {
        const newData = {...data, userName : "관리자"}
        if(!commu_id){
            try{
                await Insert(newData, "community")
                setResult({
                    type : "success",
                    message : "게시글이 정상적으로 업로드 되었습니다."
                })
            }catch{
                setResult({
                    type : "error",
                    message : "게시글 업로드에 실패했습니다."
                })
            }
        }else{
            try{
                await Update(newData, "community", commu_id)
                setResult({
                    type : "success",
                    message : "게시글이 정상적으로 수정 되었습니다."
                })
            }catch{
                setResult({
                    type : "error",
                    message : "게시글 업로드에 실패했습니다."
                })
            }
        }
    }

    useEffect(() => {
        if(commu_id){
            const load = async() =>{
                try{
                    const result = await SelectOne("community", commu_id);
                    reset(result);
                }catch{
                    alert("올바른 접근이 아닙니다.");
                }
            }
            load()
        }
    }, [commu_id])

    if(!user || user !== "10"){
        nav("/")
    }
    
    return(
        <>
        <SubBanner tit={"COMMUNITY"}/>
        {result && <ResultMessage title={"게시글 작성"} type={result.type} message={result.message} onClose={() => setResult(null)} link={'/community/list'} />}
        <div id="CommunityWrite" className="write-table">
            <form onSubmit={handleSubmit(Upload)}>
                <div className="item">
                    <label htmlFor="subject">제목</label>
                    <input type="text" {...register("subject", {required : true})} className="input full" />
                </div>
                <div className="item">
                    <label htmlFor="content">내용</label>
                    <textarea {...register("content")}  id="content" className="input full"></textarea>
                </div>
                <ul className="btn-wrap">
                    <li><button type="submit" className="submit-btn">게시글 등록</button></li>
                    <li><Link to='/community/list'>목록</Link></li>
                </ul>
            </form>
        </div>
        </>
    )
}

export default CommunityWrite;