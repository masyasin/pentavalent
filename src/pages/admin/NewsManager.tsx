import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { translateText } from '../../lib/translation';
import RichTextEditor from '../../components/admin/RichTextEditor';
import FileUpload from '../../components/admin/FileUpload';
import { Sparkles, RefreshCw, Maximize2, Minimize2, X, Newspaper, Trash2 } from 'lucide-react';
import DeleteConfirmDialog from '../../components/admin/DeleteConfirmDialog';

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
  category: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
}

const NewsManager: React.FC = () => {
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
  const [formData, setFormData] = useState({
    title_id: '',
    title_en: '',
    slug: '',
    excerpt_id: '',
    excerpt_en: '',
    content_id: '',
    content_en: '',
    featured_image: '',
    category: 'general',
    is_published: false,
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const handleAutoTranslate = async (sourceText: string, targetField: string) => {
    if (!sourceText) return;
    try {
      setTranslating(targetField);
      const translated = await translateText(sourceText);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
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
      } else {
        const { error } = await supabase
          .from('news')
          .insert({
            ...formData,
            slug,
            published_at: formData.is_published ? new Date().toISOString() : null,
          });

        if (error) throw error;
      }

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
        category: 'general',
        is_published: false,
      });
      fetchNews();
    } catch (error) {
      console.error('Error saving news:', error);
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
      setDeleteDialog({ isOpen: false, id: null, title: '' });
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['general', 'award', 'expansion', 'investor', 'partnership', 'press_release'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">News & Media</h2>
          <p className="text-gray-600">Manage news articles and press releases</p>
        </div>
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
              category: 'general',
              is_published: false,
            });
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add News
        </button>
      </div>

      {/* News Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Title</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Category</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Date</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : news.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No news articles yet</td>
                </tr>
              ) : (
                news.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.title_id}</div>
                      <div className="text-sm text-gray-500">{item.title_en}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium capitalize">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {item.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title_id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-0 md:p-4 transition-all duration-300">
          <div className={`bg-white shadow-2xl transition-all duration-500 ease-in-out flex flex-col ${isMaximized
            ? 'w-full h-full rounded-0'
            : 'max-w-6xl w-full max-h-[92vh] rounded-[2.5rem]'
            }`}>
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-[2.5rem]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <Newspaper size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">
                    {editingNews ? 'Update Article' : 'Draft New Article'}
                  </h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Content Management System</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-3 hover:bg-white hover:shadow-md rounded-xl transition-all text-gray-500 hover:text-blue-600"
                  title={isMaximized ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-3 hover:bg-white hover:shadow-md rounded-xl transition-all text-gray-500 hover:text-red-500"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title (ID)</label>
                  <input
                    type="text"
                    required
                    value={formData.title_id}
                    onChange={(e) => setFormData({ ...formData, title_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Title (EN)</label>
                    <button
                      type="button"
                      onClick={() => handleAutoTranslate(formData.title_id, 'title_en')}
                      disabled={!!translating}
                      className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1 group"
                    >
                      {translating === 'title_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                      <span className="text-[10px] font-bold uppercase tracking-widest">Auto</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <FileUpload
                  onUploadComplete={(url) => setFormData({ ...formData, featured_image: url })}
                  currentUrl={formData.featured_image}
                  label="Featured Image"
                  bucket="images"
                  type="image"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt (ID)</label>
                  <textarea
                    rows={2}
                    value={formData.excerpt_id}
                    onChange={(e) => setFormData({ ...formData, excerpt_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Ringkasan berita..."
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Excerpt (EN)</label>
                    <button
                      type="button"
                      onClick={() => handleAutoTranslate(formData.excerpt_id, 'excerpt_en')}
                      disabled={!!translating}
                      className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1 group"
                    >
                      {translating === 'excerpt_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                      <span className="text-[10px] font-bold uppercase tracking-widest">Auto</span>
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={formData.excerpt_en}
                    onChange={(e) => setFormData({ ...formData, excerpt_en: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="News excerpt in English..."
                  />
                </div>
              </div>
              <div className={`grid gap-8 ${isMaximized ? 'grid-cols-2' : 'grid-cols-1'}`}>
                <div className="space-y-4">
                  <label className="block text-sm font-black text-gray-700 uppercase tracking-widest italic flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Content (ID)
                  </label>
                  <RichTextEditor
                    content={formData.content_id}
                    onChange={(content) => setFormData({ ...formData, content_id: content })}
                    placeholder="Isi berita dalam Bahasa Indonesia..."
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-black text-gray-700 uppercase tracking-widest italic flex items-center gap-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                      Content (EN)
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAutoTranslate(formData.content_id, 'content_en')}
                      disabled={!!translating}
                      className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1 group"
                    >
                      {translating === 'content_en' ? <RefreshCw size={10} className="animate-spin" /> : <Sparkles size={10} className="group-hover:scale-125 transition-transform" />}
                      <span className="text-[10px] font-bold uppercase tracking-widest">Auto Translate</span>
                    </button>
                  </div>
                  <RichTextEditor
                    content={formData.content_en}
                    onChange={(content) => setFormData({ ...formData, content_en: content })}
                    placeholder="News content in English..."
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
                  Publish immediately
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingNews ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ ...deleteDialog, isOpen: false })}
        onConfirm={confirmDelete}
        itemName={deleteDialog.title}
        isLoading={loading}
      />
    </div>
  );
};

export default NewsManager;
