export interface ServiceProps{
    serviceKey : string,
    serviceVal : string
}

export interface RoomProps{
    id : string,
    room_subject : string,
    room_content : string,
    service : ServiceProps[],
    bed : string,
    person_base: string,
    person_max: string,
    weekday : string,
    friday : string,
    weekend : string,
    room_img : string[]
}

export type RoomWriteProps = Omit<RoomProps, "id">