import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
    User as UserIcon, Camera, Mail, Shield,
    Save, RefreshCw, CheckCircle2, AlertCircle,
    Key
} from 'lucide-react';

const ProfilePage: React.FC = () => {
    const { user, changePassword, updateLocalUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Profile State
    const [fullName, setFullName] = useState(user?.full_name || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passLoading, setPassLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFullName(user.full_name);
            setAvatarUrl(user.avatar_url || '');
        }
    }, [user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const { error } = await supabase
                .from('users')
                .update({
                    full_name: fullName,
                    avatar_url: avatarUrl,
                })
                .eq('id', user?.id);

            if (error) throw error;

            updateLocalUser({ full_name: fullName, avatar_url: avatarUrl });
            setStatus({ type: 'success', message: 'Profile updated successfully!' });
        } catch (error: any) {
            console.error('Error updating profile:', error);
            setStatus({ type: 'error', message: error.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setStatus({ type: 'error', message: 'New passwords do not match' });
            return;
        }

        setPassLoading(true);
        setStatus(null);

        try {
            const result = await changePassword(currentPassword, newPassword);
            if (result.success) {
                setStatus({ type: 'success', message: 'Password changed successfully!' });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setStatus({ type: 'error', message: result.error || 'Failed to change password' });
            }
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message || 'An error occurred' });
        } finally {
            setPassLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">My Account</h2>
                    <p className="text-gray-500">Manage your personal information and security</p>
                </div>
            </div>

            {status && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                    {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    <span className="font-bold">{status.message}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Details */}
                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={handleUpdateProfile} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 space-y-8">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                            <UserIcon className="text-blue-600" size={24} />
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Public Profile</h3>
                        </div>

                        <div className="flex flex-col md:flex-row gap-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Avatar Image</label>
                                <div className="w-32 h-32 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative group">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserIcon className="text-gray-200" size={48} />
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                        <Camera className="text-white" size={24} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Avatar URL</label>
                                    <input
                                        type="url"
                                        value={avatarUrl}
                                        onChange={(e) => setAvatarUrl(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-medium text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-50 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black flex items-center gap-3 hover:bg-black transition-all shadow-xl disabled:opacity-50 uppercase tracking-widest text-sm"
                            >
                                {loading ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                                Save Profile
                            </button>
                        </div>
                    </form>

                    {/* Account Settings (Static) */}
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                            <Shield className="text-blue-600" size={24} />
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Account Access</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                                <div className="flex items-center gap-2 text-gray-900 font-bold">
                                    <Mail size={16} className="text-gray-300" />
                                    {user?.email}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Role</p>
                                <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-black uppercase tracking-tighter w-fit">
                                    {user?.role?.replace('_', ' ')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Password Security */}
                <div className="space-y-8">
                    <form onSubmit={handlePasswordChange} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                            <Key className="text-orange-500" size={24} />
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Security</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Current Password</label>
                                <input
                                    type="password"
                                    required
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-50 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-50 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-50 transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={passLoading}
                            className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 disabled:opacity-50 uppercase tracking-widest text-sm"
                        >
                            {passLoading ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
