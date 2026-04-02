import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Insert, SelectOne, Update } from "../api/table/table-api";
import { ChangeNumber } from "../utils/number";
import { Plus, Minus } from "react-feather";
import SubBanner from "../components/SubBanner";
import ResultMessage from "../components/ResultMessage";
import type { RoomWriteProps } from "../type/room/room-type";
import type { ResultProps } from "../type/result/result-type";
import type { ServiceProps } from "../type/room/room-type";
import "../css/room.css"

const RoomWrite = ({user} : {user : string | null}) => {
    const nav = useNavigate();
    const {room_id} = useParams();
    const [Service, setService] = useState<ServiceProps[]>([
        {
            serviceKey : '',
            serviceVal : ''
        }
    ]);
    const [result, setResult] = useState<ResultProps | null>(null);
    const {register, handleSubmit, reset} = useForm<RoomWriteProps>();

    const PlusItem = () => {
        setService(prev => [...prev, {serviceKey : '', serviceVal : ''}])
    }
    const MinusItem = (index : number) => {
        setService(prev => prev.filter((_, i) => i !== index))
    }
    const ChangeService = (index: number, field: "serviceKey" | "serviceVal", value: string) => {
        setService(prev => {
            const copy = [...prev];
            copy[index][field] = value;
            return copy;
        });
    };

    const Upload = async(data : RoomWriteProps) => {
        const files = Array.from(data.room_img ?? []);
        const fileNames = files.map((file : any) => {
            return file.name ? file.name : file;
        });
        const newData = {...data, room_img : fileNames, service : Service}

        if(!room_id){
            try{
                await Insert(newData, "room");
                setResult({
                    type : "success",
                    message : "객실이 정상적으로 등록되었습니다."
                })
            }catch{
                setResult({
                    type : "error",
                    message : "객실 등록에 실패했습니다."
                })
            }
        }else{
             try{
                await Update(newData, "room", room_id);
                setResult({
                    type : "success",
                    message : "객실이 정상적으로 수정되었습니다."
                })
            }catch{
                setResult({
                    type : "error",
                    message : "객실 등록에 실패했습니다."
                })
            }
        }
    }

    useEffect(() => {
        if(room_id){
            const load = async() => {
                try{
                    const result = await SelectOne("room", room_id);
                    reset(result);
                    setService(result.service);
                }catch{
                    setResult({
                        type : "error",
                        message : "객실 정보를 불러오는데 실패했습니다."
                    })
                }
            }
            load()
        }
    }, [room_id])

    if(!user || user !== "10"){
        nav("/")
    }

    return(
        <>
            <SubBanner tit={"ROOM VIEW"}/>
            <div id="RoomWrite">
                {result && <ResultMessage title={"객실 등록"} type={result.type} message={result.message} onClose={() => setResult(null)} link={"/room/list"}/>}
                <h2>객실 등록</h2>
                <form onSubmit={handleSubmit(Upload)}>
                    <div className="item">
                        <label htmlFor="room_subject">객실명</label>
                        <input type="text" {...register("room_subject", {required : true})} id="room_subject" className="input full"/>
                    </div>
                    <div className="item">
                        <label htmlFor="bed">베드구성</label>
                        <input type="text" {...register("bed", {required : true})} id="bed"  className="input"/>
                    </div>
                    <div className="item">
                        <label htmlFor="person_base">인원(기준/최대)</label>
                        <input type="text" {...register("person_base", {required : true})} id="person_base" className="input" onChange={ChangeNumber}/>
                        <span>/</span>
                        <label htmlFor="person_max" className="sound_only"></label>
                        <input type="text" {...register("person_max", {required : true})} id="person_max" className="input" onChange={ChangeNumber}/>
                        <span>명</span>
                    </div>
                    <div className="item">
                        <label htmlFor="service">서비스</label>
                        <div className="multi">
                            {Service && Service.map((val, index) => {
                                return(
                                    <div key={index}>
                                        <input type="text" value={val.serviceKey} className="input" placeholder="서비스명" onChange={(e) => ChangeService(index, "serviceKey", e.target.value)}/>
                                        <input type="text" value={val.serviceVal} className="input" placeholder="상세내용" onChange={(e) => ChangeService(index, "serviceVal", e.target.value)}/>
                                        {Service.length > 1 && (
                                            <button type="button" className="minus-btn"   onClick={() => MinusItem(index)}><Minus size={18}/></button>
                                        )}
                                    </div>
                                    
                                )
                            })}
                        </div>
                        <button type="button" className="plus-btn" onClick={PlusItem}><Plus size={18}/></button>
                    </div>
                    <div className="item">
                        <label htmlFor="weekday">주중 가격</label>
                        <input type="text" {...register("weekday", {required : true})} id="weekday" className="input" onChange={ChangeNumber}/>
                        <span>원</span>
                    </div>
                    <div className="item">
                        <label htmlFor="friday">금요일 가격</label>
                        <input type="text" {...register("friday", {required : true})} id="friday" className="input" onChange={ChangeNumber}/>
                        <span>원</span>
                    </div>
                    <div className="item">
                        <label htmlFor="weekend">주말 가격</label>
                        <input type="text" {...register("weekend", {required : true})} id="weekend" className="input" onChange={ChangeNumber}/>
                        <span>원</span>
                    </div>
                    <div className="item">
                        <label htmlFor="room_content">객실 내용</label>
                        <textarea {...register("room_content", {required : true})} id="room_content" className="input full"></textarea>
                    </div>
                    <div className="item">
                        <label htmlFor="room_img">객실 이미지</label>
                        <input type="file" {...register("room_img")} id="room_img"  className="input file" multiple/>
                    </div>
                    <ul className="btn-wrap">
                        <li><button type="submit">매물 등록</button></li>
                        <li><Link to='/room/list'>취소</Link></li>
                    </ul>
                </form>
            </div>
        </>
    )
}

export default RoomWrite;