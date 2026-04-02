const SubBanner = ({tit} : {tit : string}) => {
    return(
        <div id="SubBanner">
            <div className="bg"></div>
            <div className="tit">
                <h1>{tit}</h1>
                <p>도심 속 안란한 휴식을 느끼다, 샘플호텔</p>
            </div>
        </div>
    )
}

export default SubBanner;