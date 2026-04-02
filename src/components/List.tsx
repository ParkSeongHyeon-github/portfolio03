import { Link } from "react-router-dom"
import type { ReservationProps } from "../type/reservation/reservation"
import type { CommunityProps } from "../type/community/community-type"
import "../css/list.css"

interface ListProps {
    subject : string,
    name : string,
    data : ReservationProps[] | CommunityProps[],
    subjectKey : keyof ReservationProps | keyof CommunityProps,
    nameKey : keyof ReservationProps,
    table : string
}

const List = ({subject, name, data, subjectKey, nameKey, table} : ListProps) => {
    return(
        <table className="list-table">
            <thead>
                <tr>
                    <th className="number">NO</th>
                    <th>{subject}</th>
                    <th className="name">{name}</th>
                </tr>
            </thead>
            <tbody>
                {data.map((val:any, index) => {
                    return(
                        <tr key={val.id}>
                            <td>{index + 1}</td>
                            <td className="link-td">
                                <Link to={`/${table}/view/${val.id}`}>
                                    {val[subjectKey]}
                                    {val.useDate && val.endDate && (
                                        <span>({val.useDate} ~ {val.endDate})</span>
                                    )}
                                    {table === 'reservation' && (
                                        <span className={`${val.orderId ? "com" : "wait"}`}>[{val.orderId ? "결제완료" : "결제대기중"}]</span>
                                    )}
                                </Link>
                            </td>
                            <td>{val[nameKey]}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default List;