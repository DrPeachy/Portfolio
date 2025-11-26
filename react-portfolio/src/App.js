import React from 'react';
import styled from 'styled-components'; // 引入 styled
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useTranslation } from "react-i18next";
// === 1. 引入 Theme 模块 ===
import { ThemeProvider } from 'styled-components';
import { theme } from './components/theme'; // 引入刚才创建的配置文件

import MyNavbar from './components/Navbar';
import Cursor from './components/Cursor';
import About from './components/About';
import Home from './components/Home';
import Game from './components/Game';
import Showcase from './components/Showcase';
import Model from './components/Model';
import Resume from './components/Resume';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';
import GameDebugger from './components/GameDebugger';
import "./i18n";

const AppLayout = styled.div`
  min-height: 100vh; /* 确保至少占满一屏 */
  display: flex;
  flex-direction: column; /* 垂直排列 */
  position: relative;
  /* 这里的 overflow-x: hidden 很重要，防止 3D 背景或动画撑开横向滚动条 */
  overflow-x: hidden; 
`;

const MainContent = styled.div`
  flex: 1; /* 占据剩余所有空间 */
  width: 100%;
  /* 如果你的 Navbar 是 fixed (80px)，这里不需要加 padding-top，
     因为 HeroSection 本身就需要全屏背景。
     但如果是其他页面，可能需要 padding-top: 80px; 
     这点要注意，不过你的 HeroSection 设计是全屏的，所以这里先不加。
  */
`;

function App() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        {/* 用 AppLayout 替换原来的 <div className="App"> */}
        <AppLayout>
          <ScrollToTop />
          <MyNavbar />
          <Cursor />
          <GameDebugger /> {/* 这个最好确保它是 fixed 或 absolute 的 */}

          {/* 把 Routes 包裹在 MainContent 里 */}
          <MainContent>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/me" element={<About />} />
              <Route path="/game" element={<Game />} />
              <Route path="/showcase" element={<Showcase />} />
              <Route path="/model" element={<Model />} />
              <Route path="/resume" element={<Resume />} />
            </Routes>
          </MainContent>

          {/* Footer 会因为 AppLayout 的 flex 布局和自身的 margin-top: auto 自动沉底 */}
          <Footer />
        </AppLayout>
      </Router>
    </ThemeProvider>
  );
}

export default App;