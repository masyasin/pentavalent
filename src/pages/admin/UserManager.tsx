import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, X, Save, Search, Shield, User as UserIcon, Mail, CheckCircle2, AlertCircle, RefreshCw, MoreVertical, Eye, EyeOff } from 'lucide-react';
import { UserRole, PermissionAction, AdminModule } from '../../contexts/AuthContext';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';
import { logUserActivity } from '../../lib/security';
import { useAuth, usePermission } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface AdminUser {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    avatar_url: string | null;
    created_at: string;
    permissions?: Record<string, PermissionAction[]>;
}

const UserManager: React.FC = () => {
    const { t } = useLanguage();

    const ADMIN_MODULES: { id: AdminModule; name: string }[] = [
        { id: 'dashboard', name: 'Dashboard' },
        { id: 'website', name: 'Website (Banners/Gallery)' },
        { id: 'company', name: t('admin.menu.company') },
        { id: 'content', name: t('admin.menu.content') },
        { id: 'recruitment', name: t('admin.menu.recruitment') },
        { id: 'investor', name: t('admin.menu.investor') },
        { id: 'messages', name: t('admin.menu.messages') },
        { id: 'security_logs', name: t('admin.menu.security_logs') },
        { id: 'audit_logs', name: t('admin.menu.activity_logs') },
        { id: 'users', name: t('admin.menu.users') },
        { id: 'db_backup', name: 'Database Backup' },
        { id: 'analytics', name: 'Analytics' },
        { id: 'settings', name: t('admin.menu.settings') },
    ];
    const { user: currentUser } = useAuth();
    const canCreate = usePermission('create', 'users');
    const canEdit = usePermission('edit', 'users');
    const canDelete = usePermission('delete', 'users');

    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [viewOnly, setViewOnly] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null; name: string }>({
        isOpen: false,
        id: null,
        name: ''
    });

    const [formData, setFormData] = useState<Partial<AdminUser> & { password?: string }>({
        email: '',
        full_name: '',
        role: 'viewer',
        avatar_url: '',
        password: '',
        permissions: {},
    });


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

    const togglePermission = (moduleId: AdminModule, action: PermissionAction) => {
        const currentPermissions = { ...(formData.permissions || {}) };
        const modulePermissions = [...(currentPermissions[moduleId] || [])];

        if (modulePermissions.includes(action)) {
            // Remove permission
            const updated = modulePermissions.filter(a => a !== action);
            
            // If we're removing 'view', remove everything else too
            if (action === 'view') {
                currentPermissions[moduleId] = [];
            } else {
                currentPermissions[moduleId] = updated;
            }
        } else {
            // Add permission
            // If we're adding any CRUD action, ensure 'view' is also added
            if (action !== 'view' && !modulePermissions.includes('view')) {
                currentPermissions[moduleId] = [...modulePermissions, 'view', action];
            } else {
                currentPermissions[moduleId] = [...modulePermissions, action];
            }
        }

        // Clean up empty modules
        if (!currentPermissions[moduleId] || currentPermissions[moduleId].length === 0) {
            delete currentPermissions[moduleId];
        }

        setFormData({ ...formData, permissions: currentPermissions });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (editingUser) {
                // Update existing user profile
                const { error: updateError } = await supabase
                    .from('users')
                    .update({
                        full_name: formData.full_name,
                        role: formData.role,
                        avatar_url: formData.avatar_url,
                        permissions: formData.permissions,
                    })
                    .eq('id', editingUser.id);

                if (updateError) throw updateError;

                logUserActivity('UPDATE', 'USERS', `Updated user: ${formData.email} (Role: ${formData.role})`, currentUser?.email);
                toast.success('User updated successfully');
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
                            avatar_url: formData.avatar_url,
                            permissions: formData.permissions || {},
                        }]);

                    if (profileError) {
                        throw profileError;
                    }

                    await logUserActivity('CREATE', 'USERS', `Created new user: ${formData.email} (Role: ${formData.role})`, currentUser?.email);
                }

                toast.success('User created successfully! They can now log in.');
            }

            setShowModal(false);
            resetForm();
            fetchUsers();
        } catch (error: any) {
            console.error('Error saving user:', error);
            toast.error(error.message || 'Failed to save user');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEditingUser(null);
        setViewOnly(false);
        setFormData({
            email: '',
            full_name: '',
            role: 'viewer',
            avatar_url: '',
            password: '',
            permissions: {},
        });
    };

    const handleEdit = (user: AdminUser) => {
        setEditingUser(user);
        setViewOnly(false);
        setFormData({
            ...user,
            permissions: user.permissions || {},
        });
        setShowModal(true);
    };

    const handleView = (user: AdminUser) => {
        setEditingUser(user);
        setViewOnly(true);
        setFormData({
            ...user,
            permissions: user.permissions || {},
        });
        setShowModal(true);
    };

    const handleDelete = (id: string, name: string) => {
        setDeleteDialog({ isOpen: true, id, name });
    };

    const confirmDelete = async () => {
        if (!deleteDialog.id) return;
        try {
            setLoading(true);
            const { error } = await supabase.from('users').delete().eq('id', deleteDialog.id);
            if (error) throw error;
            await logUserActivity('DELETE', 'USERS', `Deleted user: ${deleteDialog.name}`, currentUser?.email);
            setDeleteDialog({ isOpen: false, id: null, name: '' });
            toast.success('User deleted successfully');
            fetchUsers();
        } catch (error: any) {
            console.error('Error deleting user:', error);
            toast.error(error.message || 'Failed to delete user');
        } finally {
            setLoading(false);
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
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">{t('admin.users.title')}</h2>
                    <p className="text-gray-500">{t('admin.users.subtitle')}</p>
                </div>
                {canCreate && (
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black flex items-center gap-3 hover:bg-black transition-all shadow-xl uppercase tracking-widest text-sm"
                    >
                        <Plus size={18} />
                        {t('admin.users.add')}
                    </button>
                )}
            </div>


            {/* Search & Filter */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                        type="text"
                        placeholder={t('admin.users.search_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-50 transition-all font-medium text-sm"
                    />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest">
                    {t('admin.users.total_users').replace('{count}', filteredUsers.length.toString())}
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{t('admin.users.table.identity')}</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{t('admin.users.table.role')}</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{t('admin.users.table.registered')}</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{t('admin.users.table.control')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center text-gray-300 font-bold uppercase tracking-widest animate-pulse">{t('admin.users.loading')}</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center text-gray-400">{t('admin.users.empty')}</td>
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
                                                    onClick={() => handleView(user)}
                                                    className="p-3 bg-gray-50 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                    title="View Permissions"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                {canEdit && (
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                        title="Edit User"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                )}
                                                {canDelete && (
                                                    <button
                                                        onClick={() => handleDelete(user.id, user.full_name || user.email)}
                                                        className="p-3 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
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
                <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col scale-in-center">
                        <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl">
                                    <Shield size={32} />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic text-left">
                                        {viewOnly ? t('admin.users.modal.view_title') : editingUser ? t('admin.users.modal.edit_title') : t('admin.users.modal.create_title')}
                                    </h3>
                                    <p className="text-gray-500 mt-1 text-left">
                                        {viewOnly ? t('admin.users.modal.view_subtitle') : t('admin.users.modal.edit_subtitle')}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-full transition-all text-gray-400 hover:text-gray-900"><X size={32} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-2 text-left">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('admin.users.form.email')}</label>
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input
                                            type="email"
                                            required
                                            disabled={!!editingUser || viewOnly}
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold disabled:opacity-50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 text-left">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('admin.users.form.full_name')}</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input
                                            type="text"
                                            required
                                            disabled={viewOnly}
                                            value={formData.full_name}
                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold disabled:opacity-50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 text-left">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('admin.users.form.role')}</label>
                                    <select
                                        value={formData.role}
                                        disabled={viewOnly}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold uppercase tracking-tighter italic disabled:opacity-50"
                                    >
                                        <option value="viewer">{t('admin.users.form.role_viewer')}</option>
                                        <option value="editor">{t('admin.users.form.role_editor')}</option>
                                        <option value="admin">{t('admin.users.form.role_admin')}</option>
                                        <option value="super_admin">{t('admin.users.form.role_super_admin')}</option>
                                    </select>
                                </div>

                                {formData.role !== 'super_admin' && (
                                    <div className="space-y-4 p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('admin.users.form.granular_title')}</label>
                                            <div className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">{t('admin.users.form.dynamic_rbac')}</div>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            {ADMIN_MODULES.map((module) => (
                                                <div key={module.id} className={`grid grid-cols-1 md:grid-cols-2 gap-4 items-center p-5 rounded-2xl border transition-all ${
                                                    formData.permissions?.[module.id]?.includes('view')
                                                        ? 'bg-white border-blue-100 shadow-sm'
                                                        : 'bg-gray-50/50 border-gray-100 opacity-80'
                                                }`}>
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            type="button"
                                                            disabled={viewOnly}
                                                            onClick={() => togglePermission(module.id, 'view')}
                                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border-2 ${
                                                                formData.permissions?.[module.id]?.includes('view')
                                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200'
                                                                    : 'bg-white border-gray-200 text-gray-400 hover:border-blue-400 hover:text-blue-500 disabled:opacity-50'
                                                            }`}
                                                            title="Toggle Module Access (Read Only)"
                                                        >
                                                            <Eye size={20} />
                                                        </button>
                                                        <div className="flex flex-col text-left">
                                                            <span className={`font-black text-sm transition-colors ${
                                                                formData.permissions?.[module.id]?.includes('view') ? 'text-gray-900' : 'text-gray-400'
                                                            }`}>
                                                                {module.name}
                                                            </span>
                                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                                                {formData.permissions?.[module.id]?.includes('view') ? t('admin.users.form.access_enabled') : t('admin.users.form.no_access')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex gap-2">
                                                        {(['create', 'edit', 'delete'] as PermissionAction[]).map((action) => (
                                                            <button
                                                                key={action}
                                                                type="button"
                                                                disabled={!formData.permissions?.[module.id]?.includes('view') || viewOnly}
                                                                onClick={() => togglePermission(module.id, action)}
                                                                className={`flex-1 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border-2 ${
                                                                    formData.permissions?.[module.id]?.includes(action)
                                                                        ? 'bg-gray-900 border-gray-900 text-white shadow-md'
                                                                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-900 hover:text-gray-900 disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:border-gray-200'
                                                                }`}
                                                            >
                                                                {action}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {!editingUser && (
                                    <>
                                        <div className="space-y-2 text-left">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('admin.users.form.initial_password')}</label>
                                            <div className="relative">
                                                <Shield className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    className="w-full pl-14 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                                                    placeholder={t('admin.users.form.password_placeholder')}
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
                                        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4 text-left">
                                            <AlertCircle className="text-blue-600 mt-1" size={20} />
                                            <div className="text-xs text-blue-700 font-medium leading-relaxed">
                                                {t('admin.users.form.auth_warning')}
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
                                    {viewOnly ? t('admin.users.form.close') : t('admin.users.form.discard')}
                                </button>
                                {!viewOnly && (
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-[2] px-10 py-5 bg-gray-900 text-white font-black rounded-3xl hover:bg-blue-600 transition-all shadow-2xl flex items-center justify-center gap-4 uppercase tracking-[0.2em]"
                                    >
                                        {loading ? <RefreshCw className="animate-spin" size={24} /> : <Save size={24} />}
                                        {editingUser ? t('admin.users.form.save') : t('admin.users.form.publish')}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DeleteConfirmDialog
                isOpen={deleteDialog.isOpen}
                onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
                onConfirm={confirmDelete}
                itemName={deleteDialog.name}
                isLoading={loading}
            />
        </div>
    );
};

export default UserManager;
