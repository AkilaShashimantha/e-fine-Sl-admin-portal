import api from './api';
import { LoginData, AuthResponse, User } from '@/types';

// Admin login
export async function login(credentials: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/admin/login', credentials);
    return response.data;
}

// Get current user from token
export function getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
}

// Save user session
export function saveUserSession(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}

// Clear user session
export function clearUserSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
}

// Check if user has required role
export function hasRole(user: User | null, roles: string[]): boolean {
    if (!user) return false;
    return roles.includes(user.role);
}
