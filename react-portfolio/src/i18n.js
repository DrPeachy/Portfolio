import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import zh from "./locales/zh.json";

i18n
  .use(LanguageDetector) // 自动检测用户语言
  .use(initReactI18next) // 绑定到 React
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    fallbackLng: "en", // 默认语言
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"], // 先读取 localStorage，再使用浏览器语言
      caches: ["localStorage"], // 记住用户选择
    },
  });

export default i18n;
