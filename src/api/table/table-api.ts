const baseUrl = import.meta.env.VITE_API_BASE_URL;
import type { RoomWriteProps } from "../../type/room/room-type";
import type { ReservationWriteProps } from "../../type/reservation/reservation";
import type { CommunityWriteProps } from "../../type/community/community-type";

type ApiData = RoomWriteProps | ReservationWriteProps | CommunityWriteProps

export const Insert = async<T extends ApiData>(data : T, table_name : string) => {
    const res = await fetch(baseUrl + `${table_name}`, {
        method : "post",
        headers : {"content-type" : "application/json"},
        body : JSON.stringify(data)
    })
    if(!res.ok){
        throw new Error("서버 접속 실패");
    }

    const result = await res.json();
    return result;
}

export const Update = async<T extends ApiData>(data : T, table_name : string, id : string) => {
    const res = await fetch(baseUrl + `${table_name}/${id}`, {
        method : "put",
        headers : {"content-type" : "application/json"},
        body : JSON.stringify(data)
    })
    if(!res.ok){
        throw new Error("서버 접속 실패");
    }
    return true
}

export const Select = async(params : {page?:number; subject?:string; name?:string} = {}, table_name : string) => {
    let url = `${baseUrl}${table_name}`;
    if(params.page){
        url += `?_page=${params.page}&_limit=15`
    }
    if(params.subject){
        url += `&subject_like=${params.subject}`
    }
    if(params.name){
        url += `&userName_like=${params.name}`
    }
    const res = await fetch(url);
    const totalCount = res.headers.get('X-Total-Count');
    const data = await res.json();
    return {
        data,
        totalCount: Number(totalCount)
    };
}

export const SelectOne = async(table_name : string, id : string) => {
   const res = await fetch(baseUrl + `${table_name}/${id}`);
    if(!res.ok){
        throw new Error("서버 접속 실패");
    }
    return await res.json();
}

export const Delete = async(table_name : string, id : string) => {
    const res = await fetch(baseUrl + `${table_name}/${id}`, {
        method: "delete"
    })
    if(!res.ok){
        throw new Error("서버 접속 실패");
    }
    return true;
}