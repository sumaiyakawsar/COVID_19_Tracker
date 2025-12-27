import { useState, useEffect } from 'react';

const STORAGE_KEY = 'recentlyViewed';
const MAX_ITEMS = 5;

export const useRecentCountries = () => {
    const [recentlyViewed, setRecentlyViewed] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        setRecentlyViewed(saved);
    }, []);

    const addRecent = (country) => {
        if (!country) return;

        const updated = [
            country,
            ...recentlyViewed.filter(c => c !== country),
        ].slice(0, MAX_ITEMS);

        setRecentlyViewed(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const clearRecent = () => {
        setRecentlyViewed([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    return {
        recentlyViewed,
        addRecent,
        clearRecent,
    };
};
