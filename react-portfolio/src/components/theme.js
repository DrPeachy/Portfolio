// src/theme.js
export const theme = {
  // 1. 调色板 (Palette)
  colors: {
    primary: '#3798ff',       // 你的电光蓝
    secondary: '#a8d2ff',     // 辅色
    bg: '#f2f2f2',           // 混凝土浅灰背景
    text: {
      main: '#111111',       // 主标题黑
      secondary: '#444444',  // 正文深灰
      light: '#ffffff'       // 反白文字
    }
  },
  
  // 2. 字体系统 (Typography)
  // 对应你在 index.css 里引入的 font-family
  fonts: {
    thin: "'Gotham-Thin', sans-serif",
    light: "'Gotham-Light', sans-serif",
    book: "'Gotham-Book', sans-serif",
    medium: "'Gotham-Medium', sans-serif",
    bold: "'Gotham-Bold', sans-serif",
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