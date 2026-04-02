import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SelectOne } from '../api/table/table-api';
import SubBanner from "../components/SubBanner";
import View from '../components/View';
import type { CommunityProps } from '../type/community/community-type';

const CommunityView = ({user} : {user : string | null}) => {
    const {commu_id} = useParams();
    const [viewData, setViewData] = useState<CommunityProps | null>(null);

    useEffect(() => {
        if(commu_id){
            const load = async() => {
                try{
                    const result = await SelectOne("community", commu_id);
                    setViewData(result);
                }catch{ 
                    alert("올바른 접근이 아닙니다.");
                }
            }
            load()
        }
    }, [commu_id])

    return(
        <>
        <SubBanner tit={"COMMUNITY"}/>
        <div id="CommunityView">
            <View user={user} viewData={viewData} table={"community"} listLink={"/community/list"} />
        </div>
        </>
    )
}

export default CommunityView;