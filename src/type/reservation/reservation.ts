export interface ReservationProps{
    id : string,
    useDate : string,
    endDate : string,
    roomSubject : string,
    stayPeriod : string,
    adultCount : string,
    childCount : string,
    price : number,
    userName : string,
    userPhone : string,
    request : string
    orderId?: string
}

export type ReservationWriteProps = Omit<ReservationProps, "id">