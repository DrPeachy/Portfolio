// src/theme.js
export const theme = {
  // 1. 调色板 (Palette)
  colors: {
    primary: '#3798ff',       // 电光蓝 (Electric Blue)
    secondary: '#a8d2ff',     // 浅蓝 (Light Blue)
    bg: '#f2f2f2',           // 混凝土浅灰背景 (Concrete Gray)
    text: {
      main: '#111111',       // 主标题黑 (Almost Black)
      secondary: '#444444',  // 正文深灰 (Dark Gray)
      light: '#ffffff'       // 反白文字 (White)
    }
  },
  
  // 2. 字体系统 (Typography)
  // 核心逻辑："'英文优先字体', '中文优先字体', 兜底字体"
  // 这样浏览器渲染英文用 Gotham，渲染中文自动 fallback 到 Alibaba
  fonts: {
    // 极细体 (35/100)
    thin: "'Gotham-Thin', 'Alibaba-Thin', sans-serif",
    
    // 细体 (45/300)
    // light: "'Gotham-Light', 'Alibaba-Light', sans-serif",
    
    // 常规/正文 (55/400) - Gotham 的 "Book" 对应标准 Regular
    book: "'Gotham-Book', 'Alibaba-Regular', sans-serif",
    
    // 中等 (65/500)
    // medium: "'Gotham-Medium', 'Alibaba-Medium', sans-serif",
    
    // 粗体 (85/700)
    bold: "'Gotham-Bold', 'Alibaba-Bold', sans-serif",
    
    // 特粗 (95/800)
    // extraBold: "'Gotham-Black', 'Alibaba-ExtraBold', sans-serif",
    
    // 极粗 (105/900)
    // heavy: "'Gotham-Ultra', 'Alibaba-Heavy', sans-serif", // Ultra 对应 Heavy
  },
  
  // 3. 间距系统 (Spacing) - 保持韵律感
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '2rem',
    lg: '4rem',
    xl: '8rem'
  },

  // 4. 阴影系统 (Shadows)
  shadows: {
    soft: '0 10px 30px rgba(0,0,0,0.1)',
    neon: '0 0 10px #3798ff'
  }
};