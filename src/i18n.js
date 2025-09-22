import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

i18n
    .use(LanguageDetector)
    .use(initReactI18next).init({
        debug: true,
        lng: "en",
        resources: {
            en: {
                translation: {
                    home: 'Home',
                    toys: 'Toys',
                    dashboard: 'Dashboard',
                    about: 'About',
                    hello: 'Hello',
                    logout: 'Logout',
                    login: 'Already a member? Login',
                    signup: 'New user? Signup here',
                    i18: 'internationalization',
                }
            },

            he: {
                translation: {
                    home: 'עמוד הבית',
                    toys: 'צעצועים',
                    dashboard: 'סטטיסטיקה',
                    about: 'קצת עלינו',
                    hello: 'שלום',
                    logout: 'צא',
                    login: 'משתמש רשום? התחבר',
                    signup: 'משתמש חדש? הירשם פה',
                    i18: 'internationalization',
                }
            }
        }
        })