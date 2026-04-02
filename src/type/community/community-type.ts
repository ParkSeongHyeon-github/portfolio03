export interface CommunityProps{
    id : string,
    subject : string,
    userName : string,
    content : string
}

export type CommunityWriteProps = Omit<CommunityProps, "id">