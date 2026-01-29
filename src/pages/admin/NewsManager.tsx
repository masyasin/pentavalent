import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { translateText } from '../../lib/translation';
import RichTextEditor from '../../components/admin/RichTextEditor';
import { Sparkles, RefreshCw } from 'lucide-react';

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
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news?')) return;

    try {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) throw error;
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
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
                          onClick={() => handleDelete(item.id)}
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingNews ? 'Edit News' : 'Add News'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
                  <input
                    type="url"
                    value={formData.featured_image}
                    onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Content (ID)</label>
                <RichTextEditor
                  content={formData.content_id}
                  onChange={(content) => setFormData({ ...formData, content_id: content })}
                  placeholder="Isi berita dalam Bahasa Indonesia..."
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Content (EN)</label>
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
    </div>
  );
};

export default NewsManager;
