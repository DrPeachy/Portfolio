import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 当路由变化时，将页面滚动到顶部
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 150);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
