import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import FileUpload from '../../components/admin/FileUpload';
import {
    User as UserIcon, Camera, Mail, Shield,
    Save, RefreshCw, Key, Eye, EyeOff
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const ProfilePage: React.FC = () => {
    const { user, changePassword, updateLocalUser, updateEmail } = useAuth();
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const isSecurityView = location.pathname.includes('change_password');

    // Profile State
    const [fullName, setFullName] = useState(user?.full_name || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
    const [email, setEmail] = useState(user?.email || '');

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passLoading, setPassLoading] = useState(false);
    const [showEmailConfirm, setShowEmailConfirm] = useState(false);

    // Visibility State
    const [showCurPass, setShowCurPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConPass, setShowConPass] = useState(false);

    useEffect(() => {
        if (user) {
            setFullName(user.full_name);
            setAvatarUrl(user.avatar_url || '');
        }
    }, [user]);

    const handleUpdateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        // Jika email diubah, munculkan dialog validasi
        if (email !== user.email) {
            setShowEmailConfirm(true);
        } else {
            performUpdate();
        }
    };

    const performUpdate = async () => {
        setLoading(true);

        try {
            // Gunakan update khusus untuk ID user yang sedang login
            const { error } = await supabase
                .from('users')
                .update({
                    full_name: fullName,
                    email: email,
                    avatar_url: avatarUrl,
                })
                .eq('id', user?.id || '');

            if (error) throw error;

            // SYNC LOGIN CREDENTIALS IF EMAIL CHANGED
            if (email !== user?.email) {
                const syncResult = await updateEmail(email);
                if (!syncResult.success) {
                    throw new Error(syncResult.error || 'Profile saved, but login email failed to sync.');
                }
            }

            updateLocalUser({ full_name: fullName, avatar_url: avatarUrl, email: email });
            toast.success('Identity profile and login credentials synchronized successfully');
            setShowEmailConfirm(false);
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('Security breach: New passwords do not match');
            return;
        }

        setPassLoading(true);

        try {
            const result = await changePassword(currentPassword, newPassword);
            if (result.success) {
                toast.success('Security credentials updated. Protect your new password.');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                toast.error(result.error || 'Failed to recalibrate security credentials');
            }
        } catch (error: any) {
            console.error('Password change error:', error);
            toast.error(error.message || 'Transmission error. Please try again.');
        } finally {
            setPassLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">
                        {isSecurityView ? 'Security & Privacy' : 'My Account'}
                    </h2>
                    <p className="text-gray-500">
                        {isSecurityView
                            ? 'Manage your account security credentials'
                            : 'Manage your personal information and profile appearance'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Profile Details - Only show if NOT security view */}
                {!isSecurityView && (
                    <div className="space-y-8">
                        <form onSubmit={handleUpdateProfile} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 space-y-8">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                                <UserIcon className="text-blue-600" size={24} />
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Public Profile</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full items-start">
                                <div className="md:col-span-1">
                                    <FileUpload
                                        onUploadComplete={(url) => setAvatarUrl(url)}
                                        currentUrl={avatarUrl}
                                        label="Profile Avatar"
                                        bucket="images"
                                        type="image"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-black text-xl italic"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Administrative Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                                            />
                                        </div>
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

                        {/* Account Access Info */}
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
                )}

                {/* Password Security - Only show if security view */}
                {isSecurityView && (
                    <div className="space-y-8">
                        <form onSubmit={handlePasswordChange} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 space-y-6 max-w-2xl mx-auto">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                                <Key className="text-orange-500" size={24} />
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Change Password</h3>
                            </div>

                            <div className="space-y-6 max-md:space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Current Password</label>
                                    <div className="relative flex items-center max-md:w-full">
                                        <input
                                            type={showCurPass ? "text" : "password"}
                                            required
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-50 transition-all max-md:text-base max-md:py-3"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurPass(!showCurPass)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors max-md:min-h-[44px] max-md:flex max-md:items-center max-md:px-2"
                                        >
                                            {showCurPass ? <EyeOff size={18} className="max-md:shrink-0 max-md:w-5 max-md:h-5" /> : <Eye size={18} className="max-md:shrink-0 max-md:w-5 max-md:h-5" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">New Password</label>
                                    <div className="relative flex items-center max-md:w-full">
                                        <input
                                            type={showNewPass ? "text" : "password"}
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-50 transition-all font-mono max-md:text-base max-md:py-3"
                                            placeholder="Min 6 characters"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPass(!showNewPass)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors max-md:min-h-[44px] max-md:flex max-md:items-center max-md:px-2"
                                        >
                                            {showNewPass ? <EyeOff size={18} className="max-md:shrink-0 max-md:w-5 max-md:h-5" /> : <Eye size={18} className="max-md:shrink-0 max-md:w-5 max-md:h-5" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Confirm New Password</label>
                                    <div className="relative flex items-center max-md:w-full">
                                        <input
                                            type={showConPass ? "text" : "password"}
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-50 transition-all font-mono max-md:text-base max-md:py-3"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConPass(!showConPass)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors max-md:min-h-[44px] max-md:flex max-md:items-center max-md:px-2"
                                        >
                                            {showConPass ? <EyeOff size={18} className="max-md:shrink-0 max-md:w-5 max-md:h-5" /> : <Eye size={18} className="max-md:shrink-0 max-md:w-5 max-md:h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={passLoading}
                                className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-orange-600 transition-all shadow-xl shadow-orange-100 disabled:opacity-50 uppercase tracking-widest text-sm"
                            >
                                {passLoading ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                                Update Security Credentials
                            </button>
                        </form>
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={showEmailConfirm}
                onClose={() => setShowEmailConfirm(false)}
                onConfirm={performUpdate}
                title="Change Administrative Email?"
                message="You are about to modify your primary administrative email. This address will be used for system communications and session recovery."
                itemName={email}
                confirmText="Apply Changes"
                cancelText="Keep Current"
                type="warning"
                isLoading={loading}
            />
        </div>
    );
};

export default ProfilePage;
