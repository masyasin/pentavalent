import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Database, Download, RefreshCw, AlertCircle, FileCode, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { logUserActivity } from '../../lib/security';
import { useAuth } from '../../contexts/AuthContext';

const DatabaseBackupManager: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [lastBackup, setLastBackup] = useState<string | null>(null);

    const generateSQLBackup = async () => {
        setLoading(true);
        try {
            const tables = [
                // Core Auth & Logging
                'users', 
                'user_activity_logs', 
                'security_logs',
                
                // Website Content & Settings
                'site_settings',
                'nav_menus',
                'hero_slides',
                
                // Company & About
                'company_timeline',
                'corporate_values',
                'management',
                'certifications',
                
                // Business & Partners
                'business_lines',
                'business_features',
                'business_stats',
                'business_images',
                'partners',
                'branches',
                
                // News & Media
                'news',
                'news_comments',
                'newsletter_subscribers',
                
                // Careers & Applications
                'careers',
                'job_applications',
                
                // Investor Relations
                'investor_documents',
                'investor_financials',
                'investor_stock',
                'investor_highlights',
                'investor_calendar',
                'rups_schedules'
            ];

            let sqlOutput = `-- PENTA VALENT COMPREHENSIVE DATABASE BACKUP\n`;
            sqlOutput += `-- Generated on: ${new Date().toLocaleString()}\n`;
            sqlOutput += `-- Administrator: ${user?.email || 'System'}\n\n`;
            sqlOutput += `SET statement_timeout = 0;\nSET lock_timeout = 0;\nSET client_encoding = 'UTF8';\n\n`;

            for (const table of tables) {
                sqlOutput += `-- DATA FOR TABLE: public.${table}\n`;
                const { data, error } = await supabase.from(table).select('*');
                
                if (error) {
                    console.warn(`Could not export table ${table}:`, error.message);
                    sqlOutput += `-- ERROR EXPORTING ${table}: ${error.message}\n\n`;
                    continue;
                }

                if (data && data.length > 0) {
                    sqlOutput += `DELETE FROM public.${table};\n`;
                    data.forEach(row => {
                        const keys = Object.keys(row).join(', ');
                        const values = Object.values(row).map(val => {
                            if (val === null) return 'NULL';
                            if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
                            if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
                            return val;
                        }).join(', ');
                        sqlOutput += `INSERT INTO public.${table} (${keys}) VALUES (${values});\n`;
                    });
                    sqlOutput += `\n`;
                } else {
                    sqlOutput += `-- No data found in ${table}\n\n`;
                }
            }

            // Create blob and download
            const blob = new Blob([sqlOutput], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pentavalent_backup_${new Date().toISOString().split('T')[0]}.sql`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setLastBackup(new Date().toLocaleString());
            toast.success('Database SQL backup generated successfully');
            await logUserActivity('EXPORT', 'DATABASE', 'Generated full database SQL backup', user?.email);

        } catch (error: any) {
            console.error('Backup failed:', error);
            toast.error('Failed to generate backup: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
            <div className="text-left">
                <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                    Database <span className="text-blue-600 underline decoration-blue-100 decoration-8 underline-offset-4">Backup</span>
                </h2>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                    Generate and download full SQL snapshots of your system data
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm space-y-8 flex flex-col justify-between">
                    <div className="space-y-6">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <Database size={32} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">SQL Snapshot</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                This will generate a standard SQL file containing `INSERT` statements for all major tables. 
                                Useful for migrations or local development mirrors.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={generateSQLBackup}
                        disabled={loading}
                        className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200 uppercase tracking-widest text-xs disabled:opacity-50"
                    >
                        {loading ? <RefreshCw className="animate-spin" size={20} /> : <Download size={20} />}
                        {loading ? 'Processing Protocol...' : 'Generate SQL Backup'}
                    </button>
                </div>

                <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm space-y-8">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
                        <FileCode className="text-emerald-500" size={24} />
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">System Status</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Backup Readiness</span>
                            <span className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                                <CheckCircle2 size={14} /> Ready
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tables Detected</span>
                            <span className="text-gray-900 font-bold text-xs">28 Modules Detected</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Operation</span>
                            <span className="text-gray-900 font-bold text-xs">{lastBackup || 'No backup this session'}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-start gap-4">
                            <Database className="text-blue-500 shrink-0" size={20} />
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest">Scope Informasi</p>
                                <p className="text-[10px] text-blue-700 font-medium leading-relaxed">
                                    Mencakup konten website, struktur menu, profil perusahaan, investor relations, karir, dan log audit.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
                            <AlertCircle className="text-amber-500 shrink-0" size={20} />
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Catatan Teknis</p>
                                <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                                    Backup ini fokus pada <strong>Data (Row Content)</strong>. Trigger, Functions, dan RLS Policies harus dikelola langsung melalui dashboard Supabase.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatabaseBackupManager;
