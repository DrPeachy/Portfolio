import React, { useEffect, useState } from 'react';
// 1. 删除 Bootstrap 的 Grid 组件，保留 Image (或者你也换成原生 img)
import Image from 'react-bootstrap/Image'; 
// 2. 引入你自己的布局组件
import { GridContainer } from './styled/Layouts'; 

import FadeInScaleUpOnScroll from './FadeInScaleUpOnScroll';
import DraggableTags from './DraggableTags';
import TiltCard from './TiltCard';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components'; // 如果需要局部微调

gsap.registerPlugin(ScrollTrigger);

// === 可以在这里加个局部样式，美化一下标题 ===
const SectionTitle = styled.h2`
  text-align: center;
  margin-top: 4rem;
  margin-bottom: 1rem;
  font-family: ${props => props.theme.fonts.thin};
  font-size: 2.5rem;
  color: ${({theme}) => theme.colors.text.main};
  letter-spacing: 2px;
  text-transform: uppercase;
`;

const staticGameData = {
  morph: { link: 'https://1067838263.itch.io/morph', imageFileName: 'morph.jpg' },
  planet: { link: 'https://1067838263.itch.io/planet', imageFileName: 'planet.jpg' },
  knight: { link: 'https://bluetitanium.itch.io/knight-and-spear', imageFileName: 'knight.jpg' },
  tetris: { link: 'https://1067838263.itch.io/tetrisrush', imageFileName: 'tetris.jpg' },
  seagull: { link: 'https://pyc23.itch.io/seagull-express', imageFileName: 'seagull.jpg' }
};

const importAll = (r) => {
  let images = {};
  r.keys().forEach((item) => { images[item.replace('./', '')] = r(item); });
  return images;
};

const gameImages = importAll(require.context('../img/games', false, /\.(png|jpe?g|svg)$/));

const Game = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { t } = useTranslation();

  const gameData = Object.keys(staticGameData).reduce((acc, key) => {
    acc[key] = {
      ...staticGameData[key],
      title: t(`game.gamedata.${key}.title`),
      tags: t(`game.gamedata.${key}.tags`, { returnObjects: true })
    };
    return acc;
  }, {});

  useEffect(() => {
    // 图片预加载逻辑保持不变...
    const imageElements = Object.keys(gameData).map((gameKey) => {
      const img = document.createElement('img');
      img.src = gameImages[gameData[gameKey].imageFileName];
      return img;
    });
    Promise.all(imageElements.map((img) => new Promise((resolve) => {
        img.onload = resolve; img.onerror = resolve;
    }))).then(() => {
      setImagesLoaded(true);
      ScrollTrigger.refresh();
    });
  }, []);

  return (
    // 不再需要 Fluid Container，直接用 div 或者 fragment
    <div style={{ paddingBottom: '100px' }}> 
      {Object.entries(gameData).map(([gameKey, gameInfo], index) => (
        <div key={index}>
          <SectionTitle>{gameInfo.title}</SectionTitle>

          {/* 关键修改点：
             用 GridContainer 替代了 <Row> 和 <Col>
             flex 布局会自动把这一左一右排好
          */}
          <GridContainer>
            
            {/* 左侧：图片区域 */}
            <FadeInScaleUpOnScroll start="top 80%">
                <TiltCard 
                  src={gameImages[gameInfo.imageFileName]} 
                  alt={gameInfo.title} 
                  fluid // Bootstrap Image 的属性，保持响应式
                  style={{
                    borderRadius: '20px', // 改小一点圆角，更现代
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)', // 更柔和的阴影
                    // 如果你想去掉 Bootstrap Image，直接用 <img style={{width: '100%', ...}} />
                  }} 
                />
            </FadeInScaleUpOnScroll>

            {/* 右侧：标签区域 */}
            {/* 这里的 div 相当于原来的 Col，但因为 GridContainer 是 flex，它自然会占据位置 */}
            <div style={{ width: '100%', maxWidth: '500px' }}> 
              <FadeInScaleUpOnScroll start="top 80%">
                <DraggableTags 
                  tags={gameInfo.tags} 
                  index={index} 
                  colors={['#3798ff']} // 统一用你的主色调
                  playLink={gameInfo.link} 
                />
              </FadeInScaleUpOnScroll>
            </div>

          </GridContainer>
        </div>
      ))}
    </div>
  );
};

export default Game;