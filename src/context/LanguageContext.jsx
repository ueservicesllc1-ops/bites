import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../constants/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || 'es';
    });

    const toggleLanguage = () => {
        setLanguage(prev => (prev === 'es' ? 'en' : 'es'));
    };

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const t = (key) => {
        if (!key) return '';
        const keys = key.split('.');
        let value = translations[language];

        for (let k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                return key; // Fallback to key if translation not found
            }
        }
        return value;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
