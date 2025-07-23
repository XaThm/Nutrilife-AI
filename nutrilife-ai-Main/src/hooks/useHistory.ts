
import { useState, useEffect, useCallback } from 'react';
import type { HistoryData, ProductHistoryItem, OverhaulHistoryItem } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';

const MAX_HISTORY_ITEMS = 50;

export const useHistory = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState<HistoryData>({ products: [], overhauls: [] });
    const isHistoryEnabled = !!user;

    useEffect(() => {
        async function fetchHistory() {
            if (user) {
                const userDocRef = db.collection('users').doc(user.uid);
                try {
                    const docSnap = await userDocRef.get();
                    if (docSnap.exists) {
                        const data = docSnap.data();
                        setHistory(data?.history || { products: [], overhauls: [] });
                    }
                } catch (error) {
                    console.error("Firestore read failed for user history:", error);
                }
            } else {
                // Clear history when user logs out
                setHistory({ products: [], overhauls: [] });
            }
        };

        fetchHistory();
    }, [user]);

    const syncHistoryToDb = async (newHistory: HistoryData) => {
        if (!user) return;
        const userDocRef = db.collection('users').doc(user.uid);
        try {
            // Using set with merge: true is a bit safer than update
            // as it won't fail if the document doesn't exist yet.
            await userDocRef.set({ history: newHistory }, { merge: true });
        } catch (error) {
            console.error("Firestore update failed for user history:", error);
        }
    };

    const addProductToHistory = useCallback((item: ProductHistoryItem) => {
        if (!user) return;
        
        setHistory(prevHistory => {
            const newHistory = {
                ...prevHistory,
                products: [item, ...prevHistory.products].slice(0, MAX_HISTORY_ITEMS)
            };
            syncHistoryToDb(newHistory);
            return newHistory;
        });
    }, [user]);

    const addOverhaulToHistory = useCallback((item: OverhaulHistoryItem) => {
        if (!user) return;

        setHistory(prevHistory => {
            const newHistory = {
                ...prevHistory,
                overhauls: [item, ...prevHistory.overhauls].slice(0, MAX_HISTORY_ITEMS)
            };
            syncHistoryToDb(newHistory);
            return newHistory;
        });
    }, [user]);

    const clearHistory = useCallback(() => {
        if (!user) return;
        const emptyHistory = { products: [], overhauls: [] };
        setHistory(emptyHistory);
        syncHistoryToDb(emptyHistory);
    }, [user]);

    return { history, addProductToHistory, addOverhaulToHistory, clearHistory, isHistoryEnabled };
};
