import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Plus, Edit2, Trash2, Globe, Facebook,
    Instagram, Twitter, Linkedin, Youtube,
    Share2, ExternalLink, Save, X, Hash
} from 'lucide-react';

interface Channel {
    id: string;
    platform: string;
    url: string;
    icon_name: string;
    is_active: boolean;
    sort_order: number;
}

const ChannelsManager: React.FC = () => {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingChannel, setEditingChannel] = useState<Channel | null>(null);

    const [formData, setFormData] = useState({
        platform: 'facebook',
        url: '',
        icon_name: '',
        is_active: true,
        sort_order: 0
    });

    useEffect(() => {
        fetchChannels();
    }, []);

    const fetchChannels = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('social_channels')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;
            setChannels(data || []);
        } catch (error) {
            console.error('Error fetching channels:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingChannel) {
                const { error } = await supabase
                    .from('social_channels')
                    .update(formData)
                    .eq('id', editingChannel.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('social_channels')
                    .insert(formData);
                if (error) throw error;
            }

            setShowModal(false);
            resetForm();
            fetchChannels();
        } catch (error) {
            console.error('Error saving channel:', error);
        }
    };

    const resetForm = () => {
        setEditingChannel(null);
        setFormData({
            platform: 'facebook',
            url: '',
            icon_name: '',
            is_active: true,
            sort_order: channels.length
        });
    };

    const handleEdit = (channel: Channel) => {
        setEditingChannel(channel);
        setFormData({
            platform: channel.platform,
            url: channel.url,
            icon_name: channel.icon_name || '',
            is_active: channel.is_active,
            sort_order: channel.sort_order
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to remove this channel?')) return;
        try {
            const { error } = await supabase.from('social_channels').delete().eq('id', id);
            if (error) throw error;
            fetchChannels();
        } catch (error) {
            console.error('Error deleting channel:', error);
        }
    };

    const getPlatformIcon = (platform: string) => {
        const p = platform.toLowerCase();
        if (p.includes('facebook')) return <Facebook size={24} />;
        if (p.includes('instagram')) return <Instagram size={24} />;
        if (p.includes('twitter') || p.includes('x')) return <Twitter size={24} />;
        if (p.includes('linkedin')) return <Linkedin size={24} />;
        if (p.includes('youtube')) return <Youtube size={24} />;
        return <Globe size={24} />;
    };

    const getPlatformColor = (platform: string) => {
        const p = platform.toLowerCase();
        if (p.includes('facebook')) return 'text-blue-600 bg-blue-50 bg-blue-500';
        if (p.includes('instagram')) return 'text-pink-600 bg-pink-50 bg-pink-500';
        if (p.includes('twitter') || p.includes('x')) return 'text-gray-900 bg-gray-50 bg-gray-900';
        if (p.includes('linkedin')) return 'text-blue-700 bg-blue-50 bg-blue-700';
        if (p.includes('youtube')) return 'text-red-600 bg-red-50 bg-red-600';
        return 'text-gray-600 bg-gray-50 bg-gray-600';
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Channel Settings</h2>
                    <p className="text-gray-500 text-sm">Manage social media and communication channels</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black flex items-center gap-3 hover:bg-black transition-all shadow-xl shadow-gray-200 uppercase tracking-widest text-xs"
                >
                    <Plus size={20} />
                    Add New Channel
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full p-20 text-center text-gray-400 font-black uppercase tracking-widest">Loading channels...</div>
                ) : channels.length === 0 ? (
                    <div className="col-span-full bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100">
                        <Share2 className="text-gray-200 mx-auto mb-6" size={64} />
                        <h3 className="text-2xl font-black text-gray-900 uppercase">No Channels Connected</h3>
                        <p className="text-gray-500 mt-2 italic">Add your social media profiles to connect with your audience</p>
                    </div>
                ) : (
                    channels.map((channel) => (
                        <div key={channel.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group relative overflow-hidden">
                            <div className="flex items-start justify-between relative z-10">
                                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg ${getPlatformColor(channel.platform).split(' ')[2]}`}>
                                    {getPlatformIcon(channel.platform)}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(channel)} className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(channel.id)} className="w-10 h-10 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">{channel.platform}</h3>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${channel.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {channel.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-2xl text-sm font-medium text-gray-500 break-all border border-gray-100/50">
                                    <ExternalLink size={14} className="flex-shrink-0" />
                                    {channel.url}
                                </div>
                            </div>

                            {/* Decorative background number */}
                            <div className="absolute -bottom-6 -right-6 text-9xl font-black text-gray-50/50 -z-0 pointer-events-none select-none">
                                {channel.sort_order}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] max-w-xl w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">
                                    {editingChannel ? 'Update Channel' : 'Connect Channel'}
                                </h3>
                                <p className="text-gray-500 text-sm">Configure your platform details</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-2xl transition-all text-gray-400 hover:text-gray-900">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Platform Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.platform}
                                        onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-black text-gray-900 uppercase tracking-tight"
                                        placeholder="e.g. Instagram"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Sort Order</label>
                                    <div className="relative">
                                        <Hash className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                        <input
                                            type="number"
                                            value={formData.sort_order}
                                            onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                                            className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-black text-gray-900"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Channel URL</label>
                                <div className="relative">
                                    <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <input
                                        type="url"
                                        required
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-8 bg-blue-50 rounded-[2rem]">
                                <div>
                                    <p className="text-sm font-black text-blue-900 uppercase tracking-widest">Active Channel</p>
                                    <p className="text-xs text-blue-600 font-medium">Toggle to show or hide this channel on the website</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-16 h-9 bg-blue-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
                                </label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-8 py-5 border-2 border-gray-100 text-gray-400 font-black rounded-2xl hover:bg-gray-50 transition-all uppercase tracking-widest text-xs">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 px-8 py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200 uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                                    <Save size={18} />
                                    Save Channel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChannelsManager;
