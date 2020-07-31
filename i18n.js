import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resources from "./languages_resources.js";
// the translations
// (tip move them in a JSON file and import them)

i18n
  .use(initReactI18next) 
  .init({
    resources,
    lng: "pt_br",

    keySeparator: false,

    interpolation: {
      escapeValue: false 
      
    }
  });

  export default i18n;