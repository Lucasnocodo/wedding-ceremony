import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

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
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  max-width: 200px;
  font-size: 0.9rem;
  color: #333;
  animation: ${float} 5s ease-in-out infinite;
  white-space:nowrap;
`;

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

// LayerTwo：從螢幕底部向上 60px 區域，z-index: 2
const LayerTwoContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 160px;
  pointer-events: none;
  z-index: 2;

  @media (min-width: 769px) {
    height: 400px;
  }
`;

const BlessingsDisplay = () => {
  const [blessings, setBlessings] = useState([]);

  useEffect(() => {
    // 模擬 API 請求
    const fetchBlessings = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = [
        { id: 1, text: "祝你們百年好合！" },
        { id: 2, text: "永浴愛河！" },
        { id: 3, text: "幸福美滿！" },
        { id: 4, text: "早生貴子！" },
        { id: 5, text: "恩恩愛愛！" },
        { id: 6, text: "祝你們百年好合！" },
        { id: 7, text: "永浴愛河！" },
        { id: 8, text: "幸福美滿！" },
        { id: 9, text: "早生貴子！" },
        { id: 10, text: "恩恩愛愛！" },
        { id: 11, text: "恩恩愛愛！" },
        { id: 12, text: "祝你們百年好合！" },
        { id: 13, text: "永浴愛河！" },
        { id: 14, text: "幸福美滿！" },
        { id: 15, text: "早生貴子！" },
        { id: 16, text: "恩恩愛愛！" },
        { id: 17, text: "永浴愛河！" },
        { id: 18, text: "幸福美滿！" },
        { id: 19, text: "早生貴子！" },
        { id: 20, text: "恩恩愛愛！" },
        { id: 21, text: "恩恩愛愛！" },
        { id: 22, text: "祝你們百年好合！" },
        { id: 23, text: "永浴愛河！" },
        { id: 24, text: "幸福美滿！" },
        { id: 25, text: "早生貴子！" },
        { id: 26, text: "恩恩愛愛！" },
        // 更多祝福...
      ];
      setBlessings(data);
    };

    fetchBlessings();
  }, []);

  const total = blessings.length;
  const layerOneCount = Math.round(total * 0.7);
  const layerOneBlessings = blessings.slice(0, layerOneCount);
  const layerTwoBlessings = blessings.slice(layerOneCount);

  // LayerOne：使用 Safe Zone 來避免落在 Fall Guys 臉部區域
  // 新增最小距離閾值 (百分比單位)
  const minDistance = 10; // 可根據需求調整

  // 計算兩個位置之間的歐氏距離
  const isTooClose = (p1, p2) => {
    const dx = p1.top - p2.top;
    const dy = p1.left - p2.left;
    return Math.sqrt(dx * dx + dy * dy) < minDistance;
  };

  const renderLayerOne = () => {
    // 定義 Safe Zone（百分比座標，相對於 LayerOneContainer）
    const safeZone = { top: 60, bottom: 80, left: 30, right: 70 };
    const placedPositions = []; // 用來儲存已生成的位置

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
        <BlessingCard
          key={`${blessing.id}-layer1-${index}`}
          style={{ top: `${top}%`, left: `${left}%` }}
        >
          {blessing.text}
        </BlessingCard>
      );
    });
  };

  const renderLayerTwo = () => {
    const placedPositions = [];
    return layerTwoBlessings.map((blessing, index) => {
      let top, left;
      let position;
      let attempts = 0;
      do {
        top = Math.random() * 100;
        left = Math.random() * 100;
        position = { top, left };
        attempts++;
        if (attempts > 50) break;
      } while (placedPositions.some(pos => isTooClose(pos, position)));
      placedPositions.push(position);
      return (
        <BlessingCard
          key={`${blessing.id}-layer2-${index}`}
          style={{ top: `${top}%`, left: `${left}%` }}
        >
          {blessing.text}
        </BlessingCard>
      );
    });
  };

  return (
    <>
      <LayerOneContainer>{renderLayerOne()}</LayerOneContainer>
      <LayerTwoContainer>{renderLayerTwo()}</LayerTwoContainer>
    </>
  );
};

export default BlessingsDisplay;