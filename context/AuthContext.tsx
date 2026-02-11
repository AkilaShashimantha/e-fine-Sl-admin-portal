'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { AdminUser, LoginCredentials, AuthResponse } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
    user: AdminUser | null;
    loading: boolean;
    login: (credentials: LoginCredentials, totpToken?: string) => Promise<boolean | { requireTwoFactor: boolean }>;
    logout: (force?: boolean) => void;
    updateUser: (userData: AdminUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            // In a real app, you might want a /me endpoint to validate token and get user data
            // For now, we'll decode the token or rely on stored user data if valid
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            logout(true);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials: LoginCredentials, totpToken?: string) => {
        try {
            const response = await api.post('/admin/login', {
                ...credentials,
                totpToken
            });

            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);

            toast.success('Login successful');
            router.push('/');
            return true;
        } catch (error: any) {
            // Check if 2FA is required
            if (error.response?.status === 403 && error.response?.data?.requireTwoFactor) {
                return { requireTwoFactor: true };
            }

            console.error('Login failed:', error);
            toast.error(error.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const logout = (force?: boolean) => {
        if (force !== true && user && !user.isTwoFactorEnabled) {
            toast.error("You must enable Two-Factor Authentication before you can log out.");
            router.push('/settings');
            return;
        }

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
        toast.success('Logged out successfully');
    };

    const updateUser = (userData: AdminUser) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
