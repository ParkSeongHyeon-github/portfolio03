import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";
import { ChevronRight } from "react-feather";

import "swiper/swiper-bundle.css";

const MainBanner = () => {
    return(
        <div id="Mainbanner">
            <div className="tit-container">
                <h1>
                    <span>DISCOVER YOUR</span>
                    <span>INNER YOU</span>
                </h1>
            </div>
            <Swiper modules={[EffectFade, Autoplay]} effect="fade" speed={1200} fadeEffect={{ crossFade: true }} autoplay={{ delay: 3000 }} loop={true}>
                <SwiperSlide>
                    <img src="/img/main/main_banner_01.jpg" alt="남산타워가 보이는 숙소 이미지" />
                    <div className="content">
                        <h2>Namsan Tower View</h2>
                        <p>서울의 중심에서 남산타워 뷰를 <br />
                        바라보며 누리는 특별한 하루</p>
                        <Link to="/reservation">예약하기 <div><ChevronRight /></div></Link>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <img src="/img/main/main_banner_02.jpg" alt="아늑한 객실을 보여주는 숙소" />
                    <div className="content">
                        <h2>Signature Room</h2>
                        <p>아늑한 객실에서 펼쳐지는 <br />
                        하루의 끝, 완벽한 휴식의 시작</p>
                        <Link to="/reservation">예약하기 <div><ChevronRight /></div></Link>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <img src="/img/main/main_banner_03.jpg" alt="쾌적한 호텔 로비" />
                    <div className="content">
                        <h2>Elegant Lobby</h2>
                        <p>서울의 품격을 담은 로비에서 <br />
                        도심 속 여유와 환대를 경험하세요</p>
                        <Link to="/reservation">예약하기 <div><ChevronRight /></div></Link>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    )
}

export default MainBanner;