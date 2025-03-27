import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { updateLoveCount, getBlessings } from './api'; // 確保在 api.js 中新增 updateLoveCount API

const float = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`;

const BlessingCard = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #333;
  animation: ${float} 5s ease-in-out infinite;
  white-space: nowrap;
  user-select: none;
  cursor: pointer;
  pointer-events: auto;
`;

const BlessingItem = ({ blessing, style }) => {
  const [loveCount, setLoveCount] = useState(blessing?.loveCount || 0);
  const lastUpdateRef = useRef(0);

  const handleLike = async () => {
    const now = Date.now();
    if (now - lastUpdateRef.current < 500) {
      return;
    }
    lastUpdateRef.current = now;
    const newCount = loveCount + 1;
    setLoveCount(newCount);
    try {
      await updateLoveCount(blessing.id, newCount);
    } catch (error) {
      console.error("Error updating love count", error);
    }
  };

  return (
    <BlessingCard style={style} onClick={handleLike}>
      {blessing?.text} {loveCount > 0 && <span>🤍 {loveCount}</span>}
    </BlessingCard>
  );
};

// LayerOne：按鈕區下的所有空間，z-index: 0
const LayerOneContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 450px);
  pointer-events: none;
  z-index: 0;
  @media (min-width: 769px) {
    height: calc(100% - 200px);
  }
`;


const LayerTwoContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 260px;
  pointer-events: none;
  z-index: 2;

  @media (min-width: 769px) {
    height: 500px;
  }
`;

const BlessingsDisplay = ({ optimisticBlessing }) => {
  const [blessings, setBlessings] = useState([]);

  useEffect(() => {
    // 初次載入時從 Firestore 取得祝福資料
    const fetchData = async () => {
      try {
        const data = await getBlessings();
        setBlessings(data);
      } catch (error) {
        console.error("Error fetching blessings", error);
      }
    };
    fetchData();
  }, []);

  // 將祝福依照 70:30 的比例分成兩組：LayerOne 與 LayerTwo
  const total = blessings.length;
  const layerOneCount = Math.round(total * 0.7);
  const layerOneBlessings = blessings.slice(0, layerOneCount);
  const layerTwoBlessings = blessings.slice(layerOneCount);

  // 新增最小距離閾值 (百分比單位)
  const minDistance = 10;

  // 計算兩個位置之間的歐氏距離
  const isTooClose = (p1, p2) => {
    const dx = p1.top - p2.top;
    const dy = p1.left - p2.left;
    return Math.sqrt(dx * dx + dy * dy) < minDistance;
  };

  const renderLayerOne = () => {
    // 定義 Safe Zone（百分比座標，相對於 LayerOneContainer）
    const safeZone = { top: 60, bottom: 80, left: 30, right: 70 };
    const placedPositions = [];

    return layerOneBlessings.map((blessing, index) => {
      let top, left;
      let currentPos;
      let attempts = 0;
      do {
        top = Math.random() * 100;
        left = Math.random() * 100;
        currentPos = { top, left };
        attempts++;
        if (attempts > 50) break;
      } while (
        (top >= safeZone.top && top <= safeZone.bottom && left >= safeZone.left && left <= safeZone.right) ||
        placedPositions.some(pos => isTooClose(pos, currentPos))
      );
      placedPositions.push(currentPos);
      return (
        <BlessingItem
          key={`${blessing.id}-layer1-${index}`}
          blessing={blessing}
          style={{ top: `${top}%`, left: `${left}%` }}
        />
      );
    });
  };

  const renderLayerTwo = () => {
    const placedPositions = [];
    return [...layerTwoBlessings, optimisticBlessing].map((blessing, index) => {
      let top, left;
      let currentPos;
      let attempts = 0;
      do {
        top = Math.random() * 100;
        left = Math.random() * 100;
        currentPos = { top, left };
        attempts++;
        if (attempts > 50) break;
      } while (placedPositions.some(pos => isTooClose(pos, currentPos)));
      placedPositions.push(currentPos);

      return (<>
        {blessing && <BlessingItem
          key={`${blessing?.id}-layer2-${index}`}
          blessing={blessing}
          style={{ top: `${top}%`, left: `${left}%` }}
        />
        }
      </>
      );
    })
  };

  return (
    <>
      <LayerOneContainer>{renderLayerOne()}</LayerOneContainer>
      <LayerTwoContainer>{renderLayerTwo()}</LayerTwoContainer>
    </>
  );
};

export default BlessingsDisplay;