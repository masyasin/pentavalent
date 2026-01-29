import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  description_id: string;
  description_en: string;
  requirements_id: string;
  requirements_en: string;
  deadline: string;
}

const CareerSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCareers(data || []);
    } catch (error) {
      console.error('Error fetching careers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCareer) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          career_id: selectedCareer.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          cover_letter: formData.coverLetter,
        });

      if (error) throw error;
      setSubmitSuccess(true);
      setFormData({ fullName: '', email: '', phone: '', coverLetter: '' });
      setTimeout(() => {
        setShowApplicationForm(false);
        setSubmitSuccess(false);
        setSelectedCareer(null);
      }, 3000);
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const employmentTypeLabels: { [key: string]: string } = {
    'full_time': 'Full Time',
    'part_time': 'Part Time',
    'contract': 'Contract',
    'internship': 'Internship',
  };

  const departmentColors: { [key: string]: string } = {
    'Sales': 'bg-green-100 text-green-700',
    'Operations': 'bg-blue-100 text-blue-700',
    'Technology': 'bg-purple-100 text-purple-700',
    'Finance': 'bg-yellow-100 text-yellow-700',
    'Quality': 'bg-red-100 text-red-700',
    'default': 'bg-gray-100 text-gray-700',
  };

  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredCareers = careers.filter(career => {
    if (selectedCategory === 'All') return true;
    const dept = career.department?.toLowerCase() || '';
    const cat = selectedCategory.toLowerCase();

    if (cat === 'operation' && (dept === 'operation' || dept === 'operations')) return true;
    if (cat === 'commercial' && (dept === 'commercial' || dept === 'sales' || dept === 'marketing')) return true;
    if (cat === 'support' && (dept === 'support' || dept === 'technology' || dept === 'finance' || dept === 'hr' || dept === 'human resources')) return true;

    return dept === cat;
  });

  return (
    <section id="careers" className="py-40 bg-white relative overflow-hidden">
      {/* Talent Ecosystem Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-50/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="max-w-[1700px] mx-auto px-8 md:px-12 lg:px-16 relative z-10">
        {/* Career Intelligence Header */}
        <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-32">
          <div className="max-w-3xl">
            <span className="inline-block px-5 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black tracking-[0.4em] uppercase mb-8 shadow-xl shadow-slate-900/10">
              Future Talent Pipeline
            </span>
            <h2 className="text-6xl sm:text-7xl font-black text-slate-900 tracking-tighter leading-none">
              Bangun <span className="text-cyan-500 italic">Masa Depan</span> <br />
              Kesehatan Bersama Kami
            </h2>
          </div>
          <div className="flex items-center gap-8 pb-4">
            <div className="text-right">
              <div className="text-4xl font-black text-slate-900 leading-none">500+</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Global Professionals</div>
            </div>
            <div className="w-px h-12 bg-slate-100"></div>
            <div className="text-right">
              <div className="text-4xl font-black text-cyan-500 leading-none">34</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Strategic Hubs</div>
            </div>
          </div>
        </div>

        {/* Opportunity Intelligence Directory */}
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Tactical Filters Sidebar */}
          <div className="lg:col-span-3 space-y-10">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Filter Bidang</h4>
              <div className="flex flex-col gap-2">
                {['All', 'Operation', 'Commercial', 'Support'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`group flex items-center justify-between px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 translate-x-2'
                      : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    {cat}
                    <div className={`w-1.5 h-1.5 rounded-full ${selectedCategory === cat ? 'bg-cyan-400' : 'bg-slate-200 group-hover:bg-slate-400'} transition-colors`}></div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white space-y-6">
              <h5 className="text-xl font-black tracking-tighter">Talent Scout</h5>
              <p className="text-slate-400 text-xs font-bold leading-relaxed">
                Tidak menemukan posisi yang cocok? Kirim resume anda ke bank talenta kami.
              </p>
              <button className="w-full py-4 bg-cyan-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all">
                Submit CV General
              </button>
            </div>
          </div>

          {/* Opportunity Grid */}
          <div className="lg:col-span-9 space-y-6">
            {loading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-40 bg-slate-50 rounded-[2.5rem] animate-pulse"></div>
                ))}
              </div>
            ) : filteredCareers.length > 0 ? (
              filteredCareers.map((career) => (
                <div
                  key={career.id}
                  className="group relative bg-white border border-slate-100 rounded-[3rem] p-10 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 flex flex-col md:flex-row md:items-center justify-between gap-8 overflow-hidden"
                >
                  {/* Hover Accent */}
                  <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black text-cyan-600 uppercase tracking-widest bg-cyan-50 px-3 py-1 rounded-lg">
                        {career.department}
                      </span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {career.location}
                      </span>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 group-hover:text-cyan-600 transition-colors tracking-tighter">
                      {career.title}
                    </h3>
                    <p className="text-slate-400 text-sm font-bold line-clamp-1 max-w-xl">
                      {language === 'id' ? career.description_id : career.description_en}
                    </p>
                  </div>

                  <div className="relative z-10 flex gap-4">
                    <button
                      onClick={() => setSelectedCareer(career)}
                      className="px-8 py-4 bg-slate-50 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => { setSelectedCareer(career); setShowApplicationForm(true); }}
                      className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-600 hover:shadow-xl hover:shadow-cyan-500/20 transition-all"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-32 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200 text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2">Belum ada posisi tersedia</h4>
                <p className="text-slate-400 font-bold">Silakan cek kembali di waktu mendatang.</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Logic remains the same, but styled... */}
        {selectedCareer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => { setSelectedCareer(null); setShowApplicationForm(false); }}></div>
            <div className="relative w-full max-w-4xl bg-white rounded-[4rem] shadow-2xl overflow-hidden animate-fade-in-up">
              {!showApplicationForm ? (
                <div className="p-16">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <div className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-4">Position Details</div>
                      <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{selectedCareer.title}</h3>
                    </div>
                    <button onClick={() => setSelectedCareer(null)} className="p-4 bg-slate-50 rounded-full hover:bg-slate-100 transition-all">
                      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-16 mb-16">
                    <div className="space-y-6">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                        Description
                      </h4>
                      <p className="text-slate-500 font-bold leading-loose text-sm whitespace-pre-line">
                        {language === 'id' ? selectedCareer.description_id : selectedCareer.description_en}
                      </p>
                    </div>
                    <div className="space-y-6">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Requirements
                      </h4>
                      <p className="text-slate-500 font-bold leading-loose text-sm whitespace-pre-line">
                        {language === 'id' ? selectedCareer.requirements_id : selectedCareer.requirements_en}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setShowApplicationForm(true)} className="w-full py-6 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-cyan-500 transition-all">
                    Lanjutkan Pendaftaran
                  </button>
                </div>
              ) : (
                <div className="p-16">
                  <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">Submit Application</h3>
                  <p className="text-slate-400 text-sm font-bold mb-10">Mendaftarkan posisi untuk {selectedCareer.title}</p>

                  {submitSuccess ? (
                    <div className="py-20 text-center space-y-6">
                      <div className="w-20 h-20 bg-cyan-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <h4 className="text-3xl font-black text-slate-900 tracking-tighter">Aplikasi Terkirim!</h4>
                      <p className="text-slate-400 font-bold">Tim talent kami akan mereview profil anda segera.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleApply} className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nama Lengkap</label>
                          <input required type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 ring-cyan-500/5 focus:bg-white focus:border-cyan-500/30 outline-none font-bold text-slate-900 transition-all" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Koorporat</label>
                          <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 ring-cyan-500/5 focus:bg-white focus:border-cyan-500/30 outline-none font-bold text-slate-900 transition-all" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Cover Letter / Pesan Singkat</label>
                        <textarea rows={4} value={formData.coverLetter} onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 ring-cyan-500/5 focus:bg-white focus:border-cyan-500/30 outline-none font-bold text-slate-900 transition-all resize-none"></textarea>
                      </div>
                      <button disabled={submitting} type="submit" className="w-full py-6 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-cyan-500 transition-all disabled:opacity-50">
                        {submitting ? 'Sedang Mengirim...' : 'Submit Application'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CareerSection;
