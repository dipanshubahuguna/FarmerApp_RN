import i18n from 'i18next';
import {
 initReactI18next
} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import en from './translations/en/Index';
import hin from './translations/hin/Index';

// en = {
//     hey: 'Hey',
//     languageSelector:'Select Language'
// }

// hin = {
//     hey: 'नमस्ते',
//     languageSelector:'भाषाओं का चयन करें'
// }

const LANGUAGES = {
 en,
 hin,
};
const LANG_CODES = Object.keys(LANGUAGES);
const LANGUAGE_DETECTOR = {
 type: 'languageDetector',
 async: true,
 detect: callback => {
  AsyncStorage.getItem('user-language', (err, language) => {
   if (err || !language) {
    if (err) {
     console.log('Error fetching Languages from asyncstorage ', err);
    } else {
     console.log('No language is set, choosing English as fallback');
    }
    const findBestAvailableLanguage = RNLocalize.findBestAvailableLanguage(LANG_CODES);
    callback(findBestAvailableLanguage.languageTag || 'en');
    return;
   }
   callback(language);
  });
 },
 init: () => {},
 cacheUserLanguage: language => {
  AsyncStorage.setItem('user-language', language);
 },
};
i18n
 .use(LANGUAGE_DETECTOR)
 .use(initReactI18next)
 .init({
  resources: LANGUAGES,
  react: {
   useSuspense: false,
  },
  interpolation: {
   escapeValue: false,
  },
 });