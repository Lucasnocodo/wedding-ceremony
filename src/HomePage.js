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
import LT from "./pics/LT.jpg";
import weddingV from "./pics/wedding-vlog.mov";
import { getBlessings } from "./api";

const VIDEO_ID = "npEFXqZdnSA";

// Star animation and component remain unchanged
const twinkle = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
`;

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

// Main container
const Container = styled.div`
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #132181 0%, #0070BE 30%, #6D1088 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
`;

// Background decoration and black overlay
const BackgroundDecoration = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
`;

const BlackOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  z-index: 0;
`;

// Video container for PC view (with thumbnail display)
const VideoContainer = styled.div`
  width: 100vw;
  height: auto;
  max-height: 30vh;
  overflow: hidden;
  z-index: 1;
`;

const BannerVideo = styled.video`
  width: 100vw;
  object-fit: cover;
  object-position: center;
`;

const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

// Button container for PC view
const ButtonContainer = styled.div`
  margin-top: 50px;
  margin-bottom: 20px;
  z-index: 1;
  display: flex;
  width: 100%;
  gap: 200px;
  justify-content: center;
`;

// Generic button styling
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

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 10px 20px;
  }
`;

// Couple container remains for PC view
const CoupleContainer = styled.div`
  margin-top: 40px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 700px;
  pointer-events: none;
  width: 100%;

  @media (max-width: 768px) {
    height: 500px;
  }
`;

// New keyframes for Fall Girl and Fall Guy animations with "kiss" effect
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
  96% {transform: translateX(10%) translateY(0); /* Kiss */}
  98% {transform: translateX(0) translateY(0);}
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
  96% {transform: translateX(-10%) translateY(0); /* Kiss */}
  98% {transform: translateX(0) translateY(0);}
  100% { transform: translateX(150%) translateY(0); }
`;

// Updated Fall Girl and Fall Guy images using new keyframes
const FallGirlImage = styled.img`
  width: 650px;
  height: auto;
  animation: ${fallGirlCycle} 35s infinite;
  margin-right: -70px;
  pointer-events: none;
  user-select: none;
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
  @media (max-width: 768px) {
    width: 100vw;
    margin-left: -105px;
    margin-top: -85px;
  }
`;

// PC-only and Mobile-only containers
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

const MobileOnly = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
`;

// Mobile: Game Boy style components
const GameBoyContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  position: relative;
`;

const ScreenContainer = styled.div`
  position: relative;
  width: calc(100vw - 16px);
  aspect-ratio: 4 / 3;
  background: #000;
  border: 8px solid #444;
  border-radius: 8px;
  overflow: hidden;
  z-index: 2;
`;

const ControlsContainer = styled.div`
  position: relative;
  width: 100%;
  height: 150px;
`;

/* Mobile buttons (unchanged) */
const CrossButtonContainer =styled.div`
  position: absolute;
  left: 30px;
  bottom: 22px;
`
const CrossButton = styled.img`
  width: 120px;
  height: 120px;
  cursor: pointer;
  user-select: none;
  pointer-events: auto;
`;

const CrossText = styled.span`
  z-index: 1;
  position: absolute;
  left: 51.5%;
  top: 47%;
  width: 70px;
  transform: translate(-50%, -50%);
  color: #ba1b4d;
  font-weight: bold;
`

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

const GameBoyVideo = styled.video`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

function HomePage() {
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
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    getBlessings().then((data) => setBlessings(data));
  }, []);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const openYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${VIDEO_ID}`, "_blank");
  };

  const handleNewBlessing = (newBlessing) => {
    setOptimisticBlessings(newBlessing);
  };

  const handleBlessingModalOpen = () => {
    setShowModal(true);
  };

  return (
    <Container>
      <BlackOverlay />
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
        <VideoContainer>
          {!videoReady && <BannerImage src={LT} alt="Thumbnail" />}
          <BannerVideo
            src={weddingV}
            autoPlay
            muted
            loop
            onCanPlay={() => setVideoReady(true)}
            style={{ display: videoReady ? "block" : "none" }}
          />
        </VideoContainer>
        <ButtonContainer>
          <Button onClick={openYouTube}>Youtube上觀看影片</Button>
          <Button onClick={handleBlessingModalOpen}>送上祝福</Button>
        </ButtonContainer>
      </PCOnly>
      <MobileOnly>
        <GameBoyContainer>
          <ScreenContainer id="player">
            {!videoReady && <BannerImage src={LT} alt="Thumbnail" />}
            <GameBoyVideo
              src={weddingV}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              onCanPlay={() => setVideoReady(true)}
              style={{ display: videoReady ? "block" : "none" }}
            />
          </ScreenContainer>
          <ControlsContainer>
            <CrossButtonContainer>
            <CrossButton src={cross} onClick={() => setShowModal(true)} />
              <CrossText>送上祝福</CrossText>
            </CrossButtonContainer>
            <AButton src={isMuted ? soundsOn : mute} onClick={toggleMute} />
            <BButton src={yt} onClick={openYouTube} />
          </ControlsContainer>
        </GameBoyContainer>
      </MobileOnly>
      <CoupleContainer>
        <FallGirlImage src={FallGirl} alt="Fall Girl" />
        <FallGuyImage src={FallGuy} alt="Fall Guy" />
      </CoupleContainer>
      {showModal && (
        <BlessingsModal
          onClose={() => setShowModal(false)}
          onNewBlessing={handleNewBlessing}
        />
      )}
      <BlessingsDisplay
        blessings={blessings}
        optimisticBlessing={optimisticBlessings}
      />
    </Container>
  );
}

export default HomePage;