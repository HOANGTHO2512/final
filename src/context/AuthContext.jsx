import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('careerDNA_user');
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                setUser(parsed);
                setIsLoggedIn(true);
            } catch (e) {
                console.error('Failed to parse user data:', e);
            }
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        setIsLoggedIn(true);
        localStorage.setItem('careerDNA_user', JSON.stringify(userData));
    };

    const register = (userData) => {
        // Same as login for frontend simulation
        login(userData);
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('careerDNA_user');
    };

    // Sync quiz data between modules
    const syncQuizData = (hollandCode) => {
        const syncData = { holland: hollandCode };
        localStorage.setItem('careerDNA_sync', JSON.stringify(syncData));
    };

    const getSyncData = () => {
        const syncRaw = localStorage.getItem('careerDNA_sync');
        if (syncRaw) {
            try {
                return JSON.parse(syncRaw);
            } catch (e) {
                return null;
            }
        }
        return null;
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoggedIn,
            login,
            register,
            logout,
            syncQuizData,
            getSyncData
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
