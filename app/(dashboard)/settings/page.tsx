'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Shield, Smartphone, QrCode, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);

    // 2FA State
    const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [secret, setSecret] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [step, setStep] = useState(1); // 1: Info, 2: Scan, 3: Verify

    // Disable 2FA State
    const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
    const [password, setPassword] = useState('');

    const handleEnable2FA = async () => {
        try {
            setLoading(true);
            const response = await api.post('/admin/2fa/generate');
            setQrCodeUrl(response.data.qrCodeUrl);
            setSecret(response.data.secret);
            setStep(2);
            setIs2FAModalOpen(true);
        } catch (error: any) {
            toast.error('Failed to generate 2FA secret');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify2FA = async () => {
        if (!verificationCode || verificationCode.length !== 6) {
            toast.error('Please enter a valid 6-digit code');
            return;
        }

        try {
            setLoading(true);
            await api.post('/admin/2fa/enable', {
                token: verificationCode,
                secret
            });

            toast.success('Two-factor authentication enabled successfully');
            setIs2FAModalOpen(false);

            // Update local user state
            if (user) {
                updateUser({ ...user, isTwoFactorEnabled: true });
            }

            // Reset state
            setStep(1);
            setVerificationCode('');
            setSecret('');
            setQrCodeUrl('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Invalid verification code');
        } finally {
            setLoading(false);
        }
    };

    const handleDisable2FA = async () => {
        if (!password) {
            toast.error('Please enter your password');
            return;
        }

        try {
            setLoading(true);
            await api.post('/admin/2fa/disable', { password });

            toast.success('Two-factor authentication disabled');
            setIsDisableModalOpen(false);
            setPassword('');

            // Update local user state
            if (user) {
                updateUser({ ...user, isTwoFactorEnabled: false });
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to disable 2FA');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Account Settings</h1>
                <p className="text-gray-500 mt-1">Manage your account security and preferences</p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-blue-600" />
                            <CardTitle>Security</CardTitle>
                        </div>
                        <CardDescription>
                            Manage your password and two-factor authentication settings
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-medium">Two-Factor Authentication (2FA)</h3>
                                    {user?.isTwoFactorEnabled ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Enabled
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                                            Disabled
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500">
                                    Add an extra layer of security to your account using Google Authenticator or Authy.
                                </p>
                            </div>
                            <Button
                                variant={user?.isTwoFactorEnabled ? "destructive" : "default"}
                                onClick={() => {
                                    if (user?.isTwoFactorEnabled) {
                                        setIsDisableModalOpen(true);
                                    } else {
                                        handleEnable2FA();
                                    }
                                }}
                            >
                                {user?.isTwoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Enable 2FA Modal */}
            <Dialog open={is2FAModalOpen} onOpenChange={setIs2FAModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Setup Two-Factor Authentication</DialogTitle>
                        <DialogDescription>
                            Protect your account with an authenticator app.
                        </DialogDescription>
                    </DialogHeader>

                    {step === 2 && (
                        <div className="space-y-4 py-4">
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="p-4 bg-white border rounded-lg shadow-sm">
                                    {qrCodeUrl && (
                                        <img src={qrCodeUrl} alt="2FA QR Code" width={180} height={180} />
                                    )}
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-sm font-medium">1. Scan QR Code</p>
                                    <p className="text-xs text-gray-500">
                                        Open Google Authenticator or Authy and scan the QR code above.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>2. Enter Verification Code</Label>
                                <Input
                                    placeholder="000000"
                                    value={verificationCode}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, '');
                                        if (val.length <= 6) setVerificationCode(val);
                                    }}
                                    maxLength={6}
                                    className="text-center letter-spacing-2 text-lg"
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIs2FAModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleVerify2FA}
                            disabled={loading || verificationCode.length !== 6}
                        >
                            {loading ? 'Verifying...' : 'Verify & Enable'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Disable 2FA Modal */}
            <Dialog open={isDisableModalOpen} onOpenChange={setIsDisableModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-red-600 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Disable Two-Factor Authentication?
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to disable 2FA? Your account will be less secure.
                            Please enter your password to confirm.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Current Password</Label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password to confirm"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDisableModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDisable2FA}
                            disabled={loading || !password}
                        >
                            {loading ? 'Disabling...' : 'Disable 2FA'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
