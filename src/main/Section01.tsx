import { useState, useEffect } from "react"; 
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Select } from "../api/table/table-api";
import { Autoplay } from "swiper/modules";
import type { RoomProps } from "../type/room/room-type";

const Section01 = () => {

    const [roomData, setRoomData] = useState<RoomProps[]>([]);

    useEffect(() => {
        const load = async() => {
            try{
                const result = await Select({}, "room");
                setRoomData(result.data);
            }catch{
                alert("올바른 접근이 아닙니다.");
            }
        }
        load()
    }, [])

    return(
        <div id="Section01">
            <div className="tit" data-aos="fade-right" data-aos-duration="1200">
                <h2 className="pl">Relaxing moments<br />
                Room &amp; Suites</h2>
                <p>온전한 힐링과 회복에 집중할 수 있는 최상의 공간</p>
            </div>
            <div className="bg" data-aos="fade-up" data-aos-duration="1200"></div>
            {roomData && (
                <Swiper 
                    data-aos="fade-up" 
                    data-aos-duration="1200"
                    modules={[Autoplay]} 
                    speed={1200} 
                    spaceBetween={10} 
                    slidesPerView={1} 
                    autoplay={{ delay: 3000 }} 
                    loop={true}
                    breakpoints={{
                        1025: {
                        slidesPerView: 3,
                        spaceBetween: 40,
                        },
                        769: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                        },
                    }}
                    >
                    {roomData.map((val) => {
                        return(
                            <SwiperSlide key={val.id}>
                                <Link to="/room/list">
                                    <h3>{val.room_subject}</h3>
                                    <p className="pl">{val.room_content}</p>
                                    <img src={`/img/room/${val.room_subject}01.jpg`} alt={val.room_subject} />
                                </Link>
                            </SwiperSlide>
                        )
                    })}
                </Swiper>
            )}
        </div>
    )
}

export default Section01;