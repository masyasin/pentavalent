import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Plus, Edit2, Trash2, X, Save,
    Search, Shield, User as UserIcon,
    Mail, CheckCircle2, AlertCircle, RefreshCw,
    MoreVertical, Eye, EyeOff
} from 'lucide-react';
import { UserRole } from '../../contexts/AuthContext';

interface AdminUser {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    avatar_url: string | null;
    created_at: string;
}

const UserManager: React.FC = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState<Partial<AdminUser> & { password?: string }>({
        email: '',
        full_name: '',
        role: 'viewer',
        avatar_url: '',
        password: '',
    });

    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            if (editingUser) {
                // Update existing user profile
                const { error: updateError } = await supabase
                    .from('users')
                    .update({
                        full_name: formData.full_name,
                        role: formData.role,
                        avatar_url: formData.avatar_url,
                    })
                    .eq('id', editingUser.id);

                if (updateError) throw updateError;

                setStatus({ type: 'success', message: 'User updated successfully' });
            } else {
                // CREATE NEW USER
                if (!formData.password || formData.password.length < 6) {
                    throw new Error('Password must be at least 6 characters');
                }

                // To create a user without logging out, we need a separate client instance
                // that doesn't persist the session.
                const { createClient } = await import('@supabase/supabase-js');
                const tempClient = createClient(
                    ((import.meta as any).env?.VITE_SUPABASE_URL) || 'https://bkjfepimzoubwthqldiq.supabase.co',
                    ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJramZlcGltem91Ynd0aHFsZGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTIwNjYsImV4cCI6MjA4NTE4ODA2Nn0.XI3n0Oje0IFRnHy5nhT-uD1zfKDQUv8Zup98Y6_wTcw',
                    { auth: { persistSession: false } }
                );

                // 1. Create the Auth User
                const { data: authData, error: authError } = await tempClient.auth.signUp({
                    email: formData.email!,
                    password: formData.password!,
                    options: {
                        data: {
                            full_name: formData.full_name,
                        }
                    }
                });

                if (authError) throw authError;

                // 2. Insert into the public users table using the NEW ID from Auth
                if (authData.user) {
                    const { error: profileError } = await supabase
                        .from('users')
                        .insert([{
                            id: authData.user.id,
                            email: formData.email,
                            full_name: formData.full_name,
                            role: formData.role,
                            avatar_url: formData.avatar_url
                        }]);

                    if (profileError) {
                        // If profile insert fails, we might have an orphan Auth user, 
                        // but usually this happens if RLS is not set up correctly.
                        throw profileError;
                    }
                }

                setStatus({ type: 'success', message: 'User created successfully! They can now log in.' });
            }

            setShowModal(false);
            resetForm();
            fetchUsers();
        } catch (error: any) {
            console.error('Error saving user:', error);
            setStatus({ type: 'error', message: error.message || 'Failed to save user' });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEditingUser(null);
        setFormData({
            email: '',
            full_name: '',
            role: 'viewer',
            avatar_url: '',
            password: '',
        });
    };

    const handleEdit = (user: AdminUser) => {
        setEditingUser(user);
        setFormData(user);
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Permanently remove this user? This action cannot be undone.')) return;
        try {
            const { error } = await supabase.from('users').delete().eq('id', id);
            if (error) throw error;
            fetchUsers();
            setStatus({ type: 'success', message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const filteredUsers = users.filter(u =>
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'super_admin': return 'bg-red-50 text-red-600 border-red-100';
            case 'admin': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'editor': return 'bg-blue-50 text-blue-600 border-blue-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">User Management</h2>
                    <p className="text-gray-500">Manage administrative access and permissions</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black flex items-center gap-3 hover:bg-black transition-all shadow-xl uppercase tracking-widest text-sm"
                >
                    <Plus size={18} />
                    Add New User
                </button>
            </div>

            {status && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                    {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    <span className="font-bold">{status.message}</span>
                </div>
            )}

            {/* Search & Filter */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                        type="text"
                        placeholder="Search name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-50 transition-all font-medium text-sm"
                    />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest">
                    Total: {filteredUsers.length} Users
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">User Identity</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Access Role</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Registered</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center text-gray-300 font-bold uppercase tracking-widest animate-pulse">Syncing User Database...</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center text-gray-400">No users found match your search</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100">
                                                    {user.avatar_url ? (
                                                        <img src={user.avatar_url} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <UserIcon size={20} className="text-gray-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 uppercase tracking-tighter italic">{user.full_name || 'No Name'}</p>
                                                    <p className="text-xs text-gray-400 font-medium">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-tighter ${getRoleColor(user.role)}`}>
                                                {user.role?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="text-xs text-gray-500 font-medium">
                                                {new Date(user.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(user)}
                                                    className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-3 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col scale-in-center">
                        <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
                                    <Shield size={32} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">
                                        {editingUser ? 'Modify Access' : 'Create Access'}
                                    </h3>
                                    <p className="text-gray-500 mt-1">Configure permissions for administrative user</p>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-full transition-all text-gray-400 hover:text-gray-900"><X size={32} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input
                                            type="email"
                                            required
                                            disabled={!!editingUser}
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold disabled:opacity-50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input
                                            type="text"
                                            required
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">System Permissions (Role)</label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold uppercase tracking-tighter italic"
                                    >
                                        <option value="viewer">Viewer (Read Only)</option>
                                        <option value="editor">Editor (Content Management)</option>
                                        <option value="admin">Admin (System Management)</option>
                                        <option value="super_admin">Super Admin (Full Access)</option>
                                    </select>
                                </div>

                                {!editingUser && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Initial Password</label>
                                            <div className="relative">
                                                <Shield className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    className="w-full pl-14 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                                                    placeholder="Minimum 6 characters"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
                                            <AlertCircle className="text-blue-600 mt-1" size={20} />
                                            <div className="text-xs text-blue-700 font-medium leading-relaxed">
                                                By publishing this user, an account will be created automatically in the authentication system with the password provided.
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex gap-6 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-10 py-5 border-2 border-gray-100 text-gray-400 font-black rounded-3xl hover:bg-gray-50 transition-all uppercase tracking-widest"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-[2] px-10 py-5 bg-gray-900 text-white font-black rounded-3xl hover:bg-blue-600 transition-all shadow-2xl flex items-center justify-center gap-4 uppercase tracking-[0.2em]"
                                >
                                    {loading ? <RefreshCw className="animate-spin" size={24} /> : <Save size={24} />}
                                    {editingUser ? 'Save Changes' : 'Publish User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManager;
