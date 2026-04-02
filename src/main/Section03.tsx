import { Link } from "react-router-dom";
const Section03 = () => {
    return(
        <div id="Section03">
            <div className="bg" data-aos="fade-in" data-aos-duration="1200">
                <video muted autoPlay loop playsInline>
                    <source src={`/img/main/section03_bg.mp4`} type="video/mp4" />
                </video>
            </div>
            <div className="txt" data-aos="fade-up" data-aos-duration="1200">
                <p>your perfect stay</p>
                <span className="pl">일상에서 휴식을 찾는 것은 어려운 일이지만 <br />
                샘플 스테이에서 나만을 위한 온전한 휴식을 찾으실 수 있습니다.</span>
                <Link to="/room/list">(<span>More View</span>)</Link>
            </div>
        </div>
    )
}

export default Section03;