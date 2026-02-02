import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { Download, Mail, Phone, Calendar, Trash2, Search, Filter, CheckCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { logUserActivity } from '../../lib/security';
import { useAuth, usePermission } from '../../contexts/AuthContext';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  consultation_type?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const MessagesManager: React.FC = () => {
  const { t } = useLanguage();
  const { user, hasPermission: checkPermission } = useAuth();
  const canDelete = usePermission('delete', 'messages');

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null; name: string }>({
    isOpen: false,
    id: null,
    name: ''
  });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('MessagesManager: Fetched messages', data);
      if (error) {
        console.error('MessagesManager: Error fetching', error);
        throw error;
      }
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
      fetchMessages();
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const handleDelete = (id: string, name: string) => {
    console.log('MessagesManager: Requesting delete for', id);
    setDeleteDialog({ isOpen: true, id, name });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.id) return;
    try {
      console.log('MessagesManager: Deleting ID', deleteDialog.id);
      const { error } = await supabase.from('contact_messages').delete().eq('id', deleteDialog.id);
      if (error) throw error;

      logUserActivity('DELETE', 'MESSAGES', `Deleted message from: ${deleteDialog.name}`, user?.email);
      toast.success(t('admin.messages.delete_success') || 'Message deleted permanently');
      setSelectedMessage(null);
      setDeleteDialog({ isOpen: false, id: null, name: '' });

      // Delay fetch to allow Supabase to propagate changes
      setTimeout(() => {
        fetchMessages();
      }, 500);
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error(t('admin.messages.delete_error') || 'Failed to delete message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

    const exportToExcel = () => {
        try {
            const dataToExport = filteredMessages.map(msg => ({
                'Date': new Date(msg.created_at).toLocaleString(),
                'Name': msg.name,
                'Email': msg.email,
                'Phone': msg.phone || 'N/A',
                'Subject': msg.subject || t('admin.messages.no_subject'),
                'Consultation Type': msg.consultation_type || t('admin.messages.consultation_general'),
                'Message': msg.message,
                'Status': msg.is_read ? t('admin.messages.filter.read') : t('admin.messages.filter.unread')
            }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Contact Messages');

      const filename = `InboxExport_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, filename);
      toast.success('Inbox exported successfully');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export inbox');
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'unread') return !m.is_read;
    if (filter === 'read') return m.is_read;
    return true;
  });

  const unreadCount = messages.filter(m => !m.is_read).length;

  // Pagination Logic
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const paginatedMessages = filteredMessages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
            {t('admin.messages.title')}
          </h2>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">
            {unreadCount > 0
              ? t('admin.messages.subtitle_unread').replace('{count}', unreadCount.toString())
              : t('admin.messages.subtitle_all_read')}
          </p>
        </div>
        <button
          onClick={exportToExcel}
          disabled={loading || messages.length === 0}
          className="px-8 py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 flex items-center gap-3 shadow-sm disabled:opacity-50"
        >
          <Download size={18} />
          {t('admin.messages.export_excel') || 'Export Inbox to Excel'}
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Message List */}
        <div className="lg:col-span-4 space-y-6">

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder={t('admin.messages.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-[2rem] shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-bold text-xs"
            />
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-2 rounded-[2rem] border border-gray-100 shadow-sm flex gap-1">
            {['all', 'unread', 'read'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === type
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
                  }`}
              >
                {t(`admin.messages.filter.${type}`)}
                {type === 'unread' && unreadCount > 0 && (
                  <span className="w-4 h-4 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden text-left flex flex-col">
            <div className="divide-y divide-gray-50 max-h-[700px] overflow-y-auto custom-scrollbar flex-1">
              {loading ? (
                <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">
                  {t('common.loading') || 'Loading...'}
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-16 text-center space-y-4">
                  <Mail className="mx-auto text-gray-100" size={48} />
                  <p className="text-gray-300 font-black uppercase tracking-widest text-[10px]">
                    {t('admin.messages.empty')}
                  </p>
                </div>
              ) : (
                paginatedMessages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => {
                      setSelectedMessage(msg);
                      if (!msg.is_read) markAsRead(msg.id);
                    }}
                    className={`w-full text-left p-6 transition-all border-l-4 group ${selectedMessage?.id === msg.id
                      ? 'bg-blue-50 border-blue-600 shadow-inner'
                      : 'border-transparent hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-black uppercase tracking-tight italic truncate ${!msg.is_read ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                            {msg.name}
                          </p>
                          {!msg.is_read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse flex-shrink-0"></span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate font-bold uppercase tracking-tight">
                          {msg.subject || 'No subject'}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium uppercase tracking-widest pt-1">
                          <Calendar size={10} />
                          {new Date(msg.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-white hover:shadow-sm rounded-xl disabled:opacity-30 transition-all text-gray-500"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 hover:bg-white hover:shadow-sm rounded-xl disabled:opacity-30 transition-all text-gray-500"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Message Content */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 min-h-[600px] flex flex-col text-left">
            {selectedMessage ? (
              <div className="h-full flex flex-col">
                {/* Message Header */}
                <div className="p-10 border-b border-gray-50 bg-gray-50/30 rounded-t-[3rem]">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center font-black text-blue-600 text-xl italic">
                          {selectedMessage.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">
                            {selectedMessage.subject || 'No subject'}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                              {selectedMessage.name}
                            </span>
                            <span className="text-gray-300">•</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">
                              {selectedMessage.email}
                            </span>
                          </div>
                        </div>
                        {selectedMessage.consultation_type && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {selectedMessage.consultation_type}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4 pt-2">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                          <Phone size={14} className="text-blue-500" />
                          <span className="text-[11px] font-bold text-gray-600">{selectedMessage.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-[11px] font-bold text-gray-600">
                            {new Date(selectedMessage.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {canDelete && (
                      <button
                        onClick={() => handleDelete(selectedMessage.id, selectedMessage.name)}
                        className="p-4 text-red-100 bg-red-600 hover:bg-black hover:text-white rounded-2xl transition-all shadow-xl shadow-red-100 self-start group"
                        title="Delete Conversation"
                      >
                        <Trash2 size={24} className="group-hover:rotate-12 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Message Body */}
                <div className="p-12 flex-1">
                  <div className="bg-gray-50/50 p-10 rounded-[2.5rem] border border-gray-50 relative">
                    <div className="absolute top-6 right-8 opacity-10">
                      <Mail size={120} />
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed font-medium whitespace-pre-wrap relative z-10">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="p-10 border-t border-gray-50 flex justify-end">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your inquiry'}`}
                    className="inline-flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200 font-black uppercase tracking-widest text-xs group"
                  >
                    <Mail size={18} className="group-hover:-rotate-12 transition-transform" />
                    {t('admin.messages.reply_btn')}
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-20 text-center">
                <div className="space-y-6 max-w-sm">
                  <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto text-gray-200">
                    <Search size={48} />
                  </div>
                  <div className="space-y-2">
                    <p className="font-black text-gray-900 uppercase tracking-tighter italic text-xl">
                      {t('admin.messages.select_prompt')}
                    </p>
                    <p className="text-gray-400 font-medium text-sm">
                      {t('admin.messages.select_desc')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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

export default MessagesManager;
