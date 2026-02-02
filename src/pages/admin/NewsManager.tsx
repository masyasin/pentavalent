import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { translateText } from '../../lib/translation';
import RichTextEditor from '../../components/admin/RichTextEditor';
import FileUpload from '../../components/admin/FileUpload';
import { useLanguage } from '../../contexts/LanguageContext';
import { Sparkles, RefreshCw, Maximize2, Minimize2, X, Newspaper, Trash2, MessageSquare, Send, CheckCircle, XCircle, Plus, Eye, Calendar, Tag, ChevronRight, ChevronLeft, Edit2, Search } from 'lucide-react';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { toast } from 'sonner';
import { logUserActivity } from '../../lib/security';
import { useAuth, usePermission } from '../../contexts/AuthContext';

interface NewsItem {
  id: string;
  title_id: string;
  title_en: string;
  slug: string;
  excerpt_id: string;
  excerpt_en: string;
  content_id: string;
  content_en: string;
  featured_image: string;
  images: string[];
  category: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
}

interface Comment {
  id: string;
  news_id: string;
  user_name: string;
  email: string;
  content: string;
  parent_id: string | null;
  is_approved: boolean;
  is_admin_reply: boolean;
  created_at: string;
}

const NewsManager: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, hasPermission: checkPermission } = useAuth();
  const canCreate = usePermission('create', 'content');
  const canEdit = usePermission('edit', 'content');
  const canDelete = usePermission('delete', 'content');

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null; title: string }>({
    isOpen: false,
    id: null,
    title: ''
  });
  const [submitDialog, setSubmitDialog] = useState<{ isOpen: boolean; action: 'create' | 'update' }>({
    isOpen: false,
    action: 'create'
  });
  const [formData, setFormData] = useState({
    title_id: '',
    title_en: '',
    slug: '',
    excerpt_id: '',
    excerpt_en: '',
    content_id: '',
    content_en: '',
    featured_image: '',
    images: [] as string[],
    category: 'general',
    is_published: false,
  });

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedNewsItem, setSelectedNewsItem] = useState<NewsItem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [loadingComments, setLoadingComments] = useState(false);

  // Pagination & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchNews();
  }, []);


  const handleAutoTranslate = async (sourceText: string, targetField: string) => {
    if (!sourceText) return;
    try {
      setTranslating(targetField);
      const translated = await translateText(sourceText, 'id', 'en');
      setFormData(prev => ({ ...prev, [targetField]: translated }));
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setTranslating(null);
    }
  };

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitDialog({
      isOpen: true,
      action: editingNews ? 'update' : 'create'
    });
  };

  const handleConfirmSubmit = async () => {
    try {
      setLoading(true);
      const slug = formData.slug || formData.title_en.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      if (editingNews) {
        const { error } = await supabase
          .from('news')
          .update({
            ...formData,
            slug,
            published_at: formData.is_published ? new Date().toISOString() : null,
          })
          .eq('id', editingNews.id);

        if (error) throw error;
        toast.success("News article updated successfully");
        await logUserActivity('UPDATE', 'NEWS', `Updated article: ${formData.title_id}`, user?.email);
      } else {
        const { error } = await supabase
          .from('news')
          .insert({
            ...formData,
            slug,
            published_at: formData.is_published ? new Date().toISOString() : null,
          });

        if (error) throw error;
        toast.success("News article created successfully");
        await logUserActivity('CREATE', 'NEWS', `Created article: ${formData.title_id}`, user?.email);
      }

      setSubmitDialog(prev => ({ ...prev, isOpen: false }));
      setShowModal(false);
      setEditingNews(null);
      setFormData({
        title_id: '',
        title_en: '',
        slug: '',
        excerpt_id: '',
        excerpt_en: '',
        content_id: '',
        content_en: '',
        featured_image: '',
        images: [],
        category: 'general',
        is_published: false,
      });
      fetchNews();
    } catch (error: any) {
      console.error('Error saving news:', error);
      if (error.code === '23505') {
        toast.error('Failed to save: Title or Slug already exists. Please use a different title.');
      } else {
        toast.error(`Failed to save article: ${error.message || 'System error occurred'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewComments = async (item: NewsItem) => {
    setSelectedNewsItem(item);
    setShowCommentModal(true);
    fetchComments(item.id);
  };

  const fetchComments = async (newsId: string) => {
    try {
      setLoadingComments(true);
      const { data, error } = await supabase
        .from('news_comments')
        .select('*')
        .eq('news_id', newsId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch comments: ' + error.message);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleReply = async (parentId: string) => {
    if (!replyText[parentId] || !selectedNewsItem) return;

    try {
      const { error } = await supabase
        .from('news_comments')
        .insert([{
          news_id: selectedNewsItem.id,
          user_name: 'Admin Support',
          email: 'admin@pentavalent.co.id',
          content: replyText[parentId],
          parent_id: parentId,
          is_admin_reply: true,
          is_approved: true
        }]);

      if (error) throw error;

      toast.success('Reply sent');
      setReplyText(prev => ({ ...prev, [parentId]: '' }));
      fetchComments(selectedNewsItem.id);
    } catch (error: any) {
      toast.error('Failed to reply: ' + error.message);
    }
  };

  const toggleCommentApproval = async (commentId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('news_comments')
        .update({ is_approved: !currentStatus })
        .eq('id', commentId);

      if (error) throw error;
      toast.success('Comment status updated');
      if (selectedNewsItem) fetchComments(selectedNewsItem.id);
    } catch (error: any) {
      toast.error('Failed to update status: ' + error.message);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment and its replies?')) return;
    try {
      const { error } = await supabase
        .from('news_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      toast.success('Comment deleted');
      if (selectedNewsItem) fetchComments(selectedNewsItem.id);
    } catch (error: any) {
      toast.error('Failed to delete comment: ' + error.message);
    }
  };

  const handleEdit = (item: NewsItem) => {
    setEditingNews(item);
    setFormData({
      title_id: item.title_id,
      title_en: item.title_en,
      slug: item.slug,
      excerpt_id: item.excerpt_id || '',
      excerpt_en: item.excerpt_en || '',
      content_id: item.content_id || '',
      content_en: item.content_en || '',
      featured_image: item.featured_image || '',
      images: item.images || [],
      category: item.category || 'general',
      is_published: item.is_published,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string, title: string) => {
    setDeleteDialog({ isOpen: true, id, title });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.id) return;
    try {
      setLoading(true);
      const { error } = await supabase.from('news').delete().eq('id', deleteDialog.id);
      if (error) throw error;
      await logUserActivity('DELETE', 'NEWS', `Deleted article: ${deleteDialog.title}`, user?.email);
      setDeleteDialog({ isOpen: false, id: null, title: '' });
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['general', 'award', 'expansion', 'investor', 'partnership', 'press_release', 'corporate'];

  // Filter & Pagination Logic
  const filteredNews = news.filter(item =>
    item.title_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const paginatedNews = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="text-left">
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
            {t('admin.news.title')}
          </h2>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">
            {t('admin.news.subtitle')}
          </p>
        </div>
        {canCreate && (
          <button
            onClick={() => {
              setEditingNews(null);
              setFormData({
                title_id: '',
                title_en: '',
                slug: '',
                excerpt_id: '',
                excerpt_en: '',
                content_id: '',
                content_en: '',
                featured_image: '',
                images: [],
                category: 'general',
                is_published: false,
              });
              setShowModal(true);
            }}
            className="px-8 py-4 bg-blue-600 text-white rounded-[2rem] font-black flex items-center gap-3 hover:bg-black transition-all shadow-xl shadow-blue-100 uppercase tracking-widest text-xs"
          >
            <Plus size={18} />
            {t('admin.news.add')}
          </button>
        )}
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={t('common.search') || "Search articles..."}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-full pl-14 pr-6 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 rounded-[1.5rem] transition-all font-bold text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          {/* Additional filters can go here later */}
        </div>
      </div>

      {/* News Table */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden text-left">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-50">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t('admin.news.table.title')}</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t('admin.news.table.category')}</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t('admin.news.table.status')}</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t('admin.news.table.date')}</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">{t('admin.news.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center text-gray-300 font-black uppercase tracking-widest animate-pulse">
                    {t('common.loading') || 'Loading...'}
                  </td>
                </tr>
              ) : filteredNews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center text-gray-300 font-black uppercase tracking-widest">
                    {searchTerm ? 'No matches found' : 'No news articles yet'}
                  </td>
                </tr>
              ) : (
                paginatedNews.map((item) => (
                  <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                          {item.featured_image ? (
                            <img src={item.featured_image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                              <Newspaper size={20} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-gray-900 uppercase tracking-tight italic truncate max-w-[300px]">
                            {language === 'id' ? item.title_id : item.title_en}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold truncate max-w-[300px]">/{item.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-blue-100">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 ${item.is_published
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${item.is_published ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        {item.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-xs text-gray-500 font-bold">
                      {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewComments(item)}
                          className="p-3 text-blue-100 bg-blue-600 hover:bg-black hover:text-white rounded-xl transition-all shadow-lg shadow-blue-50"
                          title="View Comments"
                        >
                          <MessageSquare size={16} />
                        </button>
                        {canEdit && (
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-3 text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-100 hover:shadow-sm"
                            title="Edit Article"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(item.id, item.title_id)}
                            className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Delete Article"
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

      {/* Pagination */}
      {/* Pagination */}
      {
        filteredNews.length > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between p-4 gap-4">
            <div className="flex items-center gap-4">
              <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredNews.length)} of {filteredNews.length}
              </div>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-gray-50 border-none rounded-lg text-xs font-bold text-gray-600 focus:ring-0 cursor-pointer py-1 pl-2 pr-8"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>

            {totalPages > 1 && (
              <div className="flex bg-white rounded-xl p-1 gap-1 border border-gray-100 shadow-sm">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 hover:bg-gray-50 rounded-lg disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center px-4 font-black text-xs text-gray-900">
                  {currentPage} / {totalPages}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 hover:bg-gray-50 rounded-lg disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )
      }

      {/* Modal */}
      {
        showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-0 md:p-8 transition-all duration-300">
            <div className={`bg-white shadow-2xl transition-all duration-500 ease-in-out flex flex-col ${isMaximized
              ? 'w-full h-full rounded-0'
              : 'max-w-6xl w-full max-h-[95vh] rounded-[3rem]'
              }`}>
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-[3rem]">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                    <Newspaper size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">
                      {editingNews ? 'Update Article' : 'Draft New Article'}
                    </h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global News & Media Console</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="p-4 hover:bg-white hover:shadow-md rounded-[1.25rem] transition-all text-gray-400 hover:text-blue-600 group"
                    title={isMaximized ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} className="group-hover:scale-110" />}
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-4 hover:bg-white hover:shadow-md rounded-[1.25rem] transition-all text-gray-400 hover:text-red-500"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar text-left">
                {/* Titles Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 italic flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      Title (Bahasa Indonesia)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title_id}
                      onChange={(e) => setFormData({ ...formData, title_id: e.target.value })}
                      className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-[2rem] transition-all font-black text-2xl italic tracking-tight"
                      placeholder="Judul Berita Baru..."
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] italic flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        Title (English)
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAutoTranslate(formData.title_id, 'title_en')}
                        disabled={!!translating}
                        className="text-blue-600 hover:text-black transition-colors flex items-center gap-2 group"
                      >
                        {translating === 'title_en' ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} className="group-hover:scale-125 transition-transform" />}
                        <span className="text-[10px] font-black uppercase tracking-widest">Auto Translate</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.title_en}
                      onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                      className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-[2rem] transition-all font-black text-2xl italic tracking-tight"
                      placeholder="New Article Title..."
                    />
                  </div>
                </div>

                {/* Slug & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Slug (URL Mapping)</label>
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="leave-empty-for-auto"
                        className="flex-1 px-8 py-4 bg-slate-900 text-emerald-400 border border-slate-800 rounded-2xl transition-all font-mono text-xs tracking-wider"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const generated = formData.title_en.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                          setFormData({ ...formData, slug: generated });
                        }}
                        className="px-6 py-4 bg-slate-100 text-slate-900 rounded-2xl hover:bg-slate-200 text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        Sync
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-2">Article Category</label>
                    <div className="relative">
                      <Tag className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full pl-16 pr-8 py-4 bg-gray-50 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all font-bold text-sm appearance-none border-2"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat.replace('_', ' ').toUpperCase()}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Gallery Section */}
                <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                        <Plus size={20} />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Cinematic Gallery</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Main article slider images</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}
                      className="px-6 py-3 bg-white text-blue-600 border border-blue-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      Add Slide
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group animate-in zoom-in-95 duration-300">
                        <FileUpload
                          onUploadComplete={(url) => {
                            const newImages = [...formData.images];
                            newImages[idx] = url;
                            setFormData({ ...formData, images: newImages });
                          }}
                          currentUrl={img}
                          label={`Visual ${idx + 1}`}
                          bucket="images"
                          type="image"
                        />
                        {formData.images.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = formData.images.filter((_, i) => i !== idx);
                              setFormData({ ...formData, images: newImages });
                            }}
                            className="absolute -top-3 -right-3 w-8 h-8 bg-red-600 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl z-20 hover:scale-110 active:scale-90"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    {formData.images.length === 0 && (
                      <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-white/50">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">No Visuals Attached</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Excerpts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-2 italic">Summary (ID)</label>
                    <div className="rounded-[2rem] overflow-hidden border-2 border-transparent focus-within:border-blue-500 transition-all">
                      <RichTextEditor
                        content={formData.excerpt_id}
                        onChange={(content) => setFormData({ ...formData, excerpt_id: content })}
                        placeholder="Ringkasan berita yang menarik..."
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] italic">Summary (EN)</label>
                      <button
                        type="button"
                        onClick={() => handleAutoTranslate(formData.excerpt_id, 'excerpt_en')}
                        disabled={!!translating}
                        className="text-blue-600 hover:text-black transition-colors flex items-center gap-2 group"
                      >
                        {translating === 'excerpt_en' ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} className="group-hover:scale-125 transition-transform" />}
                        <span className="text-[10px] font-black uppercase tracking-widest">Auto</span>
                      </button>
                    </div>
                    <div className="rounded-[2rem] overflow-hidden border-2 border-transparent focus-within:border-emerald-500 transition-all">
                      <RichTextEditor
                        content={formData.excerpt_en}
                        onChange={(content) => setFormData({ ...formData, excerpt_en: content })}
                        placeholder="Captivating English summary..."
                      />
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className={`grid gap-12 ${isMaximized ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  <div className="space-y-6">
                    <label className="text-xl font-black text-gray-900 uppercase tracking-tighter italic flex items-center gap-4">
                      <span className="w-12 h-1 bg-blue-600 rounded-full"></span>
                      Full Article Content (ID)
                    </label>
                    <div className="rounded-[3rem] overflow-hidden border-2 border-slate-100 focus-within:border-blue-600 transition-all shadow-inner">
                      <RichTextEditor
                        content={formData.content_id}
                        onChange={(content) => setFormData({ ...formData, content_id: content })}
                        placeholder="Tulis isi berita selengkapnya di sini..."
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center px-2">
                      <label className="text-xl font-black text-gray-900 uppercase tracking-tighter italic flex items-center gap-4">
                        <span className="w-12 h-1 bg-emerald-500 rounded-full"></span>
                        Full Article Content (EN)
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAutoTranslate(formData.content_id, 'content_en')}
                        disabled={!!translating}
                        className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-3 group"
                      >
                        {translating === 'content_en' ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />}
                        <span className="text-[10px] font-black uppercase tracking-widest">Global Sync</span>
                      </button>
                    </div>
                    <div className="rounded-[3rem] overflow-hidden border-2 border-slate-100 focus-within:border-emerald-600 transition-all shadow-inner">
                      <RichTextEditor
                        content={formData.content_en}
                        onChange={(content) => setFormData({ ...formData, content_en: content })}
                        placeholder="Write the full English article content here..."
                      />
                    </div>
                  </div>
                </div>

                {/* Toggles & Submit */}
                <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={formData.is_published}
                        onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      />
                      <div className={`w-14 h-8 rounded-full transition-all duration-300 ${formData.is_published ? 'bg-emerald-500' : 'bg-gray-200'}`}></div>
                      <div className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-md ${formData.is_published ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                    <div className="text-left">
                      <span className="block text-[11px] font-black text-gray-900 uppercase tracking-widest">Public Visibility</span>
                      <span className="block text-[10px] text-gray-400 font-bold uppercase">{formData.is_published ? 'Live on Production' : 'Saved in Private Drafts'}</span>
                    </div>
                  </label>

                  <div className="flex gap-4 w-full md:w-auto">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 md:flex-none px-10 py-5 bg-gray-100 text-gray-500 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all active:scale-95"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      className="flex-1 md:flex-none px-12 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all shadow-2xl shadow-blue-200 active:scale-95"
                    >
                      {editingNews ? 'Update Global Article' : 'Launch New Article'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )
      }

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
        onConfirm={confirmDelete}
        itemName={deleteDialog.title}
        isLoading={loading}
      />

      {/* Comment Manager Modal */}
      {
        showCommentModal && selectedNewsItem && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
            <div className="bg-white max-w-4xl w-full max-h-[90vh] rounded-[3rem] flex flex-col overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Public Discussion</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">News: {selectedNewsItem.title_id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCommentModal(false)}
                  className="p-4 hover:bg-white hover:text-red-500 rounded-2xl transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar bg-white text-left">
                {loadingComments ? (
                  <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest animate-pulse">Scanning Discussions...</div>
                ) : comments.filter(c => !c.parent_id).length === 0 ? (
                  <div className="text-center py-24 space-y-4 border-2 border-dashed border-gray-50 rounded-[3rem]">
                    <MessageSquare className="mx-auto text-gray-100" size={64} />
                    <p className="text-gray-300 font-black uppercase tracking-[0.3em] text-[10px]">No Community Input Yet</p>
                  </div>
                ) : (
                  comments.filter(c => !c.parent_id).map(comment => (
                    <div key={comment.id} className="space-y-6">
                      <div className="group bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 hover:border-blue-200 transition-all shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center font-black text-blue-600 text-lg italic">
                              {comment.user_name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-black text-gray-900 text-base italic uppercase">{comment.user_name}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{comment.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleCommentApproval(comment.id, comment.is_approved)}
                              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm ${comment.is_approved
                                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-100'
                                : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100'
                                }`}
                            >
                              {comment.is_approved ? <CheckCircle size={12} /> : <XCircle size={12} />}
                              {comment.is_approved ? 'Approved' : 'Hidden'}
                            </button>
                            <button
                              onClick={() => deleteComment(comment.id)}
                              className="p-3 text-gray-300 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-sm"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-700 text-base leading-relaxed font-medium pl-1">{comment.content}</p>
                      </div>

                      {/* Admin Replies */}
                      <div className="ml-16 space-y-6 border-l-4 border-blue-50 pl-10">
                        {comments.filter(r => r.parent_id === comment.id).map(reply => (
                          <div key={reply.id} className="bg-blue-50/30 p-6 rounded-[2rem] border border-blue-50 flex justify-between items-start group shadow-sm">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[8px] font-black uppercase tracking-[0.2em] italic">Official Reply</span>
                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{new Date(reply.created_at).toLocaleDateString()}</span>
                              </div>
                              <p className="text-gray-800 font-bold text-sm leading-relaxed">{reply.content}</p>
                            </div>
                            <button
                              onClick={() => deleteComment(reply.id)}
                              className="p-3 text-blue-200 hover:text-red-500 hover:bg-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}

                        {/* Reply Input Area */}
                        <div className="flex gap-4 scale-95 origin-left">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              placeholder="Type your official response..."
                              value={replyText[comment.id] || ''}
                              onChange={(e) => setReplyText(prev => ({ ...prev, [comment.id]: e.target.value }))}
                              className="w-full bg-white border-2 border-slate-100 rounded-2xl px-8 py-5 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
                              onKeyPress={(e) => e.key === 'Enter' && handleReply(comment.id)}
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none italic font-black text-[10px] uppercase tracking-widest">Enterprise Support</div>
                          </div>
                          <button
                            onClick={() => handleReply(comment.id)}
                            className="w-16 h-16 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center hover:bg-black transition-all shadow-2xl shadow-blue-100 group active:scale-95"
                          >
                            <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )
      }


      {/* Submit Confirmation */}
      <ConfirmDialog
        isOpen={submitDialog.isOpen}
        onClose={() => setSubmitDialog({ ...submitDialog, isOpen: false })}
        onConfirm={handleConfirmSubmit}
        title={submitDialog.action === 'create' ? "Launch Article" : "Force Update"}
        message={submitDialog.action === 'create'
          ? "You are about to publish this piece to the global media network. Proceed?"
          : "Are you sure you want to deploy these changes to production?"}
        itemName={formData.title_id}
        isLoading={loading}
        confirmText={submitDialog.action === 'create' ? "Deploy Now" : "Push Changes"}
        type="info"
      />
    </div >
  );
};

export default NewsManager;
