'use client';

import { useAuth } from '@/context/AuthContext';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Header() {
    const { user } = useAuth();

    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    Welcome back, {user?.name}
                </h2>
                <p className="text-sm text-gray-500">
                    Manage traffic fines and violations
                </p>
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative rounded-full p-2 hover:bg-gray-100">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-600 p-0 text-xs flex items-center justify-center">
                        3
                    </Badge>
                </button>

                {/* User Role Badge */}
                <Badge variant="outline" className="capitalize">
                    {user?.role.replace('_', ' ')}
                </Badge>
            </div>
        </header>
    );
}
