import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { translateText } from '../../lib/translation';
import {
    Save, Globe, Mail, Phone, MapPin,
    Facebook, Twitter, Instagram, Linkedin,
    Youtube, Link as LinkIcon, Image as ImageIcon,
    CheckCircle2, AlertCircle, RefreshCw, Type, Sparkles
} from 'lucide-react';

interface SiteSettings {
    id: string;
    company_name: string;
    logo_url: string;
    favicon_url: string;
    contact_email: string;
    contact_phone: string;
    address: string;
    google_maps_url: string;
    social_links: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        linkedin?: string;
        youtube?: string;
    };
    footer_text_id: string;
    footer_text_en: string;
}

const SiteSettingsManager: React.FC = () => {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [translating, setTranslating] = useState<string | null>(null);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleAutoTranslate = async (sourceText: string, targetField: keyof SiteSettings) => {
        if (!sourceText || !settings) return;

        try {
            setTranslating(targetField);
            const translated = await translateText(sourceText, 'id', 'en');
            setSettings({ ...settings, [targetField]: translated });
        } catch (error) {
            console.error('Translation failed:', error);
        } finally {
            setTranslating(null);
        }
    };

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('site_settings')
                .select('*')
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                setSettings({
                    ...data,
                    social_links: data.social_links || {}
                });
            } else {
                // Fallback or initial blank state
                setSettings({
                    id: '',
                    company_name: 'PT. Penta Valent Tbk',
                    logo_url: '',
                    favicon_url: '',
                    contact_email: '',
                    contact_phone: '',
                    address: '',
                    google_maps_url: '',
                    social_links: {},
                    footer_text_id: '',
                    footer_text_en: '',
                });
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;

        setSaving(true);
        setStatus(null);

        try {
            const { error } = await supabase
                .from('site_settings')
                .upsert({
                    ...settings,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;
            setStatus({ type: 'success', message: 'Settings saved successfully!' });
            setTimeout(() => setStatus(null), 3000);
        } catch (error: any) {
            console.error('Error saving settings:', error);
            setStatus({ type: 'error', message: error.message || 'Failed to save settings' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-24">
                <RefreshCw className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Site Settings</h2>
                    <p className="text-gray-500">Configure global identity and contact information</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50 uppercase tracking-widest"
                >
                    {saving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} />}
                    Save All Changes
                </button>
            </div>

            {status && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                    }`}>
                    {status.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    <span className="font-bold">{status.message}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Core Identity */}
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 space-y-8">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                        <Globe className="text-blue-600" size={24} />
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Core Identity</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Company Name</label>
                            <input
                                type="text"
                                value={settings?.company_name}
                                onChange={(e) => setSettings({ ...settings!, company_name: e.target.value })}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-bold"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Logo URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={settings?.logo_url}
                                        onChange={(e) => setSettings({ ...settings!, logo_url: e.target.value })}
                                        className="flex-1 px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium text-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Favicon URL</label>
                                <input
                                    type="text"
                                    value={settings?.favicon_url}
                                    onChange={(e) => setSettings({ ...settings!, favicon_url: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium text-sm"
                                />
                            </div>
                        </div>

                        <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-center justify-center min-h-[120px]">
                            {settings?.logo_url ? (
                                <img src={settings.logo_url} alt="Logo Preview" className="max-h-16 object-contain" />
                            ) : (
                                <div className="text-center">
                                    <ImageIcon className="text-blue-200 mx-auto mb-2" size={32} />
                                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Logo Preview</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 space-y-8">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                        <Mail className="text-blue-600" size={24} />
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Contact Channels</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Email Support</label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <input
                                        type="email"
                                        value={settings?.contact_email}
                                        onChange={(e) => setSettings({ ...settings!, contact_email: e.target.value })}
                                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium"
                                        placeholder="support@company.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <input
                                        type="tel"
                                        value={settings?.contact_phone}
                                        onChange={(e) => setSettings({ ...settings!, contact_phone: e.target.value })}
                                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium"
                                        placeholder="+62 21 ..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Headquarters Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-5 top-6 text-gray-300" size={18} />
                                <textarea
                                    value={settings?.address}
                                    onChange={(e) => setSettings({ ...settings!, address: e.target.value })}
                                    rows={3}
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium"
                                    placeholder="Street name, City, Country..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Google Maps Embed URL</label>
                            <div className="relative">
                                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input
                                    type="text"
                                    value={settings?.google_maps_url}
                                    onChange={(e) => setSettings({ ...settings!, google_maps_url: e.target.value })}
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium"
                                    placeholder="https://www.google.com/maps/embed?..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 space-y-8">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                        <LinkIcon className="text-blue-600" size={24} />
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Social Networks</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                <Facebook size={12} className="text-blue-600" /> Facebook
                            </label>
                            <input
                                type="url"
                                value={settings?.social_links?.facebook}
                                onChange={(e) => setSettings({
                                    ...settings!,
                                    social_links: { ...settings!.social_links, facebook: e.target.value }
                                })}
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 transition-all text-sm"
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                <Twitter size={12} className="text-sky-500" /> Twitter (X)
                            </label>
                            <input
                                type="url"
                                value={settings?.social_links?.twitter}
                                onChange={(e) => setSettings({
                                    ...settings!,
                                    social_links: { ...settings!.social_links, twitter: e.target.value }
                                })}
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 transition-all text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                <Instagram size={12} className="text-pink-600" /> Instagram
                            </label>
                            <input
                                type="url"
                                value={settings?.social_links?.instagram}
                                onChange={(e) => setSettings({
                                    ...settings!,
                                    social_links: { ...settings!.social_links, instagram: e.target.value }
                                })}
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 transition-all text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                <Linkedin size={12} className="text-blue-800" /> LinkedIn
                            </label>
                            <input
                                type="url"
                                value={settings?.social_links?.linkedin}
                                onChange={(e) => setSettings({
                                    ...settings!,
                                    social_links: { ...settings!.social_links, linkedin: e.target.value }
                                })}
                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-50 transition-all text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Text */}
                <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 space-y-8">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                        <Type className="text-blue-600" size={24} />
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Footer Copywriting</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Footer Description (ID)</label>
                            <textarea
                                value={settings?.footer_text_id}
                                onChange={(e) => setSettings({ ...settings!, footer_text_id: e.target.value })}
                                rows={2}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-medium text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Footer Description (EN)</label>
                                <button
                                    type="button"
                                    onClick={() => handleAutoTranslate(settings?.footer_text_id || '', 'footer_text_en')}
                                    disabled={!!translating}
                                    className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 group"
                                >
                                    {translating === 'footer_text_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                                    <span className="text-[8px] font-black uppercase tracking-widest">Auto</span>
                                </button>
                            </div>
                            <textarea
                                value={settings?.footer_text_en}
                                onChange={(e) => setSettings({ ...settings!, footer_text_en: e.target.value })}
                                rows={2}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-medium text-sm"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SiteSettingsManager;
