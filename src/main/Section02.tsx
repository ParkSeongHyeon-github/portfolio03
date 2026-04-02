import { useState } from "react";

const Section02 = () => {

    const subTit: string[] = ['햇살 아래, 여유가 머무는 곳','밤공기 속, 낭만이 머무는 곳','도심 속, 나를 위한 힐링의 시간','아침 햇살 아래, 새로운 하루의 시작','머무는 모든 순간이 프리미엄이 되는 곳'];
    const Tit: string[] = ['Infinity Pool Escape','Rooftop Lounge Night','Urban Wellness Retreat','Sunrise & Swim Package','Signature Stay Experience'];
    const des: string[] = ['투명한 수면 위로 부드럽게 번지는 햇살 속에서 온전한 휴식을 즐겨보세요.\n하루의 피로가 스르르 녹아내리는 Sample Hotel의 수영장은,\n도심 속에서도 자연의 여유를 느낄 수 있는 특별한 공간입니다.','도심의 불빛이 한눈에 펼쳐지는 루프탑 라운지에서 여유로운 한밤을 즐겨보세요.\n은은한 음악과 함께하는 칵테일 한 잔이 당신의 하루를 특별한 순간으로 바꿔드립니다.','바쁜 일상에서 벗어나 몸과 마음의 균형을 되찾아보세요.\nSample Hotel의 웰니스 프로그램은 자연과 함께하는 깊은 휴식으로 새로운 활력을 선사합니다.','따뜻한 아침 햇살이 수면 위로 번지는 순간, 상쾌한 하루가 열립니다.\n맑은 공기와 함께 즐기는 이른 수영은 당신의 하루를 더욱 빛나게 만듭니다.','Sample Hotel만의 시그니처 서비스와 감각적인 공간에서 잊지 못할 숙박 경험을 만나보세요.\n섬세한 디테일이 만들어내는 차별화된 품격이 당신의 여정을 완성합니다.'];

    const [listItem, setListItem] = useState<string>('0');

    const changeItem = (e : React.MouseEvent<HTMLLIElement>) => {
        setListItem(e.currentTarget.dataset.index!);
    }

    return(
        <div id="Section02">
            <div className="tit" data-aos="fade-right" data-aos-duration="1200">
                <h2>Enhance Your Stay</h2>
                <p>모든 공간은 ‘쉼’이라는 하나의 감정 중심</p>
            </div>
            <div className="wrap">
                <div className="left" data-aos="fade-right" data-aos-duration="1200">
                    <img src={`/img/main/section02_img${listItem}.jpg`} alt="서비스 이미지" />
                </div>
                <div className="right" data-aos="fade-left" data-aos-duration="1200">
                    <div className="sub-tit">{subTit[Number(listItem)]}</div>
                    <div className="title">{Tit[Number(listItem)]}</div>
                    <div className="des">{des[Number(listItem)]}</div>
                    <ul>
                        <li data-index="0" onClick={changeItem}><span>(01)</span>Infinity Pool Escape</li>
                        <li data-index="1" onClick={changeItem}><span>(02)</span>Rooftop Lounge Night</li>
                        <li data-index="2" onClick={changeItem}><span>(03)</span>Urban Wellness Retreat</li>
                        <li data-index="3" onClick={changeItem}><span>(04)</span>Sunrise & Swim Package</li>
                        <li data-index="4" onClick={changeItem}><span>(05)</span>Signature Stay Experience</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Section02;