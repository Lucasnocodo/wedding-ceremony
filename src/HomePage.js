import React, { useState, useMemo, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import BlessingsModal from "./BlessingsModal";
import FallGirl from "./pics/fallgirl.png";
import FallGuy from "./pics/fallguy.png";
import BlessingsDisplay from "./BlessingsDisplay";
import cross from "./pics/cross.png";
import mute from "./pics/mute.png";
import soundsOn from "./pics/soundsOn.png";
import yt from "./pics/yt.png";
import weddingV from './pics/wedding-vlog.mov'
import { getBlessings } from "./api";


const VIDEO_ID = "Y2E71oe0aSM"; // 請替換成你的 YouTube 影片 ID

// 星星閃爍動畫
const twinkle = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
`;

// 星星元件
const Star = styled.div`
  position: absolute;
  background: white;
  border-radius: 50%;
  animation: ${twinkle} ${(props) => props.$duration}s infinite ease-in-out;
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  top: ${(props) => props.$top}%;
  left: ${(props) => props.$left}%;
  opacity: 0.8;
`;

// 主要容器，設定夢幻背景與排版
const Container = styled.div`
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #132181 0%, #0070BE 30%, #6D1088 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

// 背景裝飾區，放置星星
const BackgroundDecoration = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
`;

// 黑色遮罩
const BlackOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  z-index: 0;
`;


// 影片播放器容器
const VideoContainer = styled.div`
  width: 100vw;
  height: auto;
  max-height: 30vh;
  overflow: hidden;
  z-index: 1;
`;


// 按鈕容器
const ButtonContainer = styled.div`
  margin-top: 50px;
  margin-bottom: 20px;
  z-index: 1;
  display: flex;
  width: 100%;
  gap: 200px;
  justify-content: center;
`;

// 通用按鈕樣式
const Button = styled.button`
  background: #ff7eb3;
  border: none;
  padding: 12px 24px;
  font-size: 1.2rem;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background: #ff5e99;
  }

  /* RWD：縮小字體、調整 padding */
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 10px 20px;
  }
`;

// 夫妻角色動畫區塊
const CoupleContainer = styled.div`
  margin-top: 40px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  /* bottom: calc((-1000px - 50vh)/5); */
  max-height: 700px;
  pointer-events: none;
  width: 100%;

  /* RWD：縮小容器，避免角色擠不下 */
  @media (max-width: 768px) {
    /* position: absolute; */
    height: 500px;

  }
`;

// 飛入 + 漂浮 + 飛出 keyframes (節錄)
const fallGirlCycle = keyframes`
  0% { transform: translateX(-150%) translateY(0); }
  6% { transform: translateX(0) translateY(0); }
  14.8% { transform: translateX(0) translateY(-10px); }
  23.6% { transform: translateX(0) translateY(0); }
  32.4% { transform: translateX(0) translateY(10px); }
  41.2% { transform: translateX(0) translateY(0); }
  50% { transform: translateX(0) translateY(-10px); }
  58.8% { transform: translateX(0) translateY(0); }
  67.6% { transform: translateX(0) translateY(10px); }
  76.4% { transform: translateX(0) translateY(0); }
  85.2% { transform: translateX(0) translateY(-10px); }
  94% { transform: translateX(0) translateY(0); }
  100% { transform: translateX(-150%) translateY(0); }
`;

const fallGuyCycle = keyframes`
  0% { transform: translateX(150%) translateY(0); }
  6% { transform: translateX(0) translateY(0); }
  14.8% { transform: translateX(0) translateY(-10px); }
  23.6% { transform: translateX(0) translateY(0); }
  32.4% { transform: translateX(0) translateY(10px); }
  41.2% { transform: translateX(0) translateY(0); }
  50% { transform: translateX(0) translateY(-10px); }
  58.8% { transform: translateX(0) translateY(0); }
  67.6% { transform: translateX(0) translateY(10px); }
  76.4% { transform: translateX(0) translateY(0); }
  85.2% { transform: translateX(0) translateY(-10px); }
  94% { transform: translateX(0) translateY(0); }
  100% { transform: translateX(150%) translateY(0); }
`;

// 角色圖示
const FallGirlImage = styled.img`
  width: 650px;
  height: auto;
  animation: ${fallGirlCycle} 35s infinite;
  margin-right: -70px;
  pointer-events: none;
  user-select: none;
  /* RWD：在小螢幕上縮小角色大小 */
  @media (max-width: 768px) {
    width: 100vw;
    margin-right: -40px;
  }
`;

const FallGuyImage = styled.img`
  width: 650px;
  height: auto;
  animation: ${fallGuyCycle} 35s infinite;
  margin-left: -120px;
  margin-top: -90px;
  pointer-events: none;
  user-select: none;
  /* RWD：在小螢幕上縮小角色大小 */
  @media (max-width: 768px) {
    width: 100vw;
    margin-left: -105px;
    margin-top: -85px;
  }
`;
/* 僅在電腦版顯示 */
const PCOnly = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  user-select: none;
  @media (max-width: 768px) {
    display: none;
  }
`;
/* 僅在手機版顯示 */
const MobileOnly = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
`;


/* 螢幕區域 (可放影片或其它內容) */
const ScreenContainer = styled.div`
  position: relative;
  width: calc(100vw - 16px);
  aspect-ratio: 4 / 3; /* 維持 4:3 比例 */
  background: #000;
  border: 8px solid #444;
  border-radius: 8px;
  overflow: hidden;
  z-index: 2;
`;

/* 按鈕區域 (十字 + A + B) */
const ControlsContainer = styled.div`
  position: relative;
  width: 100%;
  height: 150px; 
`;

/* 十字按鈕 */
const CrossButton = styled.img`
  position: absolute;
  width: 120px;
  height: 120px;
  left: 30px;
  bottom: 22px;
  cursor: pointer;
  user-select: none;
  pointer-events: auto;
`;

/* A 按鈕 */
const AButton = styled.img`
  position: absolute;
  width: 54px;
  height: 54px;
  right: 21px;
  top: 10px;
  user-select: none;
  pointer-events: auto;
  cursor: pointer;
`;

/* B 按鈕 */
const BButton = styled.img`
  position: absolute;
  width: 54px;
  height: 54px;
  right: 57px;
  bottom: 20px;
  user-select: none;
  pointer-events: auto;
  cursor: pointer;
`;

// 遊戲機外框容器：限制手機版的顯示區域
const GameBoyContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  position: relative;
`;

const BannerVideo = styled.video`
  object-fit: cover;
  object-position: center;
`

const GameBoyVideo = styled.video`
  height: 100%;
  width: 100%;
  object-fit: cover;
`


function HomePage() {
  // 產生 50 顆隨機星星
  const starCount = 50;

  const stars = useMemo(() => {
    return Array.from({ length: starCount }).map(() => {
      return {
        size: Math.random() * 3 + 1,
        duration: Math.random() * 2 + 1,
        top: Math.random() * 100,
        left: Math.random() * 100,
      };
    });
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [blessings, setBlessings] = useState([]);
  const [optimisticBlessings, setOptimisticBlessings] = useState(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    getBlessings().then(data => setBlessings(data));
  }, []);


  const toggleMute = () => {
    setIsMuted(pre=> !pre)
  };

  const openYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${VIDEO_ID}`, "_blank");
  };

  const handleNewBlessing = (newBlessing) => {
    setOptimisticBlessings(newBlessing);
  };

  const handleBlessingModalOpen = () => {
    setShowModal(true)
  }

  return (
    <Container>
      <BlackOverlay />
      {/* 背景星星 */}
      <BackgroundDecoration>
        {stars.map((star, index) => (
          <Star
            key={index}
            $size={star.size}
            $duration={star.duration}
            $top={star.top}
            $left={star.left}
          />
        ))}
      </BackgroundDecoration>
      <PCOnly>

        {/* 影片區 */}
        <VideoContainer>
          <BannerVideo src={weddingV} autoPlay muted loop />
        </VideoContainer>
        {/* 按鈕區 */}
        <ButtonContainer>
          <Button>Youtube上觀看影片</Button>
          <Button onClick={handleBlessingModalOpen}>送上祝福</Button>
        </ButtonContainer>

      </PCOnly>
      <MobileOnly>
        <GameBoyContainer>

        <ScreenContainer>
          
        <GameBoyVideo src={weddingV} autoPlay muted={isMuted} loop />
        </ScreenContainer>
          {/* 按鈕區 */}
          <ControlsContainer>
            <CrossButton src={cross} onClick={() => setShowModal(true)} />
            <AButton src={isMuted ? soundsOn : mute} onClick={toggleMute} />
            <BButton src={yt} onClick={openYouTube} />
          </ControlsContainer>
        </GameBoyContainer>

      </MobileOnly>
      <CoupleContainer>
        <FallGirlImage src={FallGirl} alt="Fall Girl" />
        <FallGuyImage src={FallGuy} alt="Fall Guy" />
      </CoupleContainer>
      {/* 祝福 Modal 與展示 */}
      {showModal && (
        <BlessingsModal
          onClose={() => setShowModal(false)}
          onNewBlessing={handleNewBlessing}
        />
      )}
      <BlessingsDisplay blessings={blessings} optimisticBlessing={optimisticBlessings} />
    </Container>
  );
}

export default HomePage;