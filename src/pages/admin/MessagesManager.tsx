import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';
import { useLanguage } from '../../contexts/LanguageContext';
import { Mail, Phone, Calendar, Trash2, Search, Filter, CheckCircle, Clock } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const MessagesManager: React.FC = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState('all');
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

      if (error) throw error;
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
    setDeleteDialog({ isOpen: true, id, name });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.id) return;
    try {
      setLoading(true);
      const { error } = await supabase.from('contact_messages').delete().eq('id', deleteDialog.id);
      if (error) throw error;
      setSelectedMessage(null);
      setDeleteDialog({ isOpen: false, id: null, name: '' });
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMessages = filter === 'all'
    ? messages
    : filter === 'unread'
      ? messages.filter(m => !m.is_read)
      : messages.filter(m => m.is_read);

  const unreadCount = messages.filter(m => !m.is_read).length;

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
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Message List */}
        <div className="lg:col-span-4 space-y-6">
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

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden text-left">
            <div className="divide-y divide-gray-50 max-h-[700px] overflow-y-auto custom-scrollbar">
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
                filteredMessages.map((msg) => (
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

                    <button
                      onClick={() => handleDelete(selectedMessage.id, selectedMessage.name)}
                      className="p-4 text-red-100 bg-red-600 hover:bg-black hover:text-white rounded-2xl transition-all shadow-xl shadow-red-100 self-start group"
                      title="Delete Conversation"
                    >
                      <Trash2 size={24} className="group-hover:rotate-12 transition-transform" />
                    </button>
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
                    Reply via Official Email
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
                      Choose an inquiry from the list to start reviewing and responding.
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
