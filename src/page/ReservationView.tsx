import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SelectOne } from '../api/table/table-api';
import SubBanner from '../components/SubBanner';
import View from '../components/View';
import type { ReservationProps } from '../type/reservation/reservation';

const ReservationView = ({user} : {user : string | null}) => {
    const {res_id} = useParams();
    const [viewData, setViewData] = useState<ReservationProps | null>(null);

    useEffect(() => {
        if(res_id){
            const load = async() => {
                try{
                    const result = await SelectOne("reservation", res_id);
                    setViewData(result);
                }catch{ 
                    alert("올바른 접근이 아닙니다.");
                }
            }
            load()
        }
    }, [res_id])
    
    return(
        <>
        <SubBanner tit={"RESERVATION"} />
        <div id="ReservationView">
            <View user={user} viewData={viewData} table={"reservation"} listLink={"/reservation/list"}/>
        </div>
        </>
    )
}

export default ReservationView;