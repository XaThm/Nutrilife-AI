
import React, { createContext, useState, useContext, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import type { User } from '../types';
import { auth, db } from '../services/firebase';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, pass: string) => Promise<void>;
    signup: (email: string, pass: string, confirmPass: string) => Promise<void>;
    logout: () => void;
    loginWithGoogle: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    var [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((firebaseUser: firebase.User | null) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || 'No Email'
                });
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        setError(null);
        setIsLoading(true);
        try {
            await auth.signInWithEmailAndPassword(email, password);
        } catch (err: any) {
            setError(err.code ? err.code.replace('auth/', '').replace(/-/g, ' ') : 'Failed to sign in.');
            console.error("Login Error:", err.code);
        } finally {
            setIsLoading(false);
        }
    };

    function validateEmail(email: string) {
        // A simple regex for email validation
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const signup = async (email: string, pass: string, confirmPass: string) => {
        setError(null);
        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        if (pass !== confirmPass) {
            setError("Passwords do not match.");
            return;
        }
        if (pass.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
            if (userCredential.user) {
                const userDocRef = db.collection('users').doc(userCredential.user.uid);
                // setup new user doc
                await userDocRef.set({
                    email: userCredential.user.email,
                    createdAt: new Date(),
                    history: { products: [], overhauls: [] }
                });
            }
        } catch (err: any) {
            setError(err.code ? err.code.replace('auth/', '').replace(/-/g, ' ') : 'Failed to sign up.');
            console.error("Signup Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    async function loginWithGoogle() {
        setError(null);
        setIsLoading(true);
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            const result = await auth.signInWithPopup(provider);
            const firebaseUser = result.user;
            
            if (firebaseUser) {
                const userDocRef = db.collection('users').doc(firebaseUser.uid);
                const docSnap = await userDocRef.get();

                if (!docSnap.exists) {
                  // This is a new user, create their document in Firestore
                  console.log("New Google user, creating firestore doc...");
                  await userDocRef.set({
                    email: firebaseUser.email,
                    createdAt: new Date(),
                    history: { products: [], overhauls: [] }
                  });
                }
            }
        } catch (err: any) {
            setError(err.code ? err.code.replace('auth/', '').replace(/-/g, ' ') : 'Failed to sign in with Google.');
            console.error("Google Sign-In Error:", err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const logout = async () => {
        setError(null);
        await auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, error, login, signup, logout, loginWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
