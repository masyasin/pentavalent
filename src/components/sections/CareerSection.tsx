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
    <section id="careers" className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-20 mb-32">
          <div className="lg:w-1/2">
            <span className="inline-block px-5 py-2 bg-primary/5 text-primary rounded-full text-[11px] font-black tracking-[0.2em] uppercase mb-8 border border-primary/10">
              Careers at Penta Valent
            </span>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-none mb-10 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Join the <br />
              <span className="italic">Future of Healthcare</span>
            </h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed mb-10">
              We are looking for visionary professionals to help us redefine healthcare distribution in Indonesia. Grow your career with a national leader committed to excellence.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('open-positions');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-10 py-5 bg-gradient-to-r from-primary to-accent text-white font-black text-sm uppercase tracking-widest shadow-2xl hover:opacity-90 transition-all rounded-2xl"
              >
                View Openings
              </button>
              <div className="px-10 py-5 bg-white border border-gray-100 rounded-2xl text-primary font-black text-sm uppercase tracking-widest enterprise-shadow hover:-translate-y-1 transition-all cursor-pointer">
                Our Culture
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 relative group">
            <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] blur-2xl group-hover:bg-primary/10 transition-all duration-700"></div>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000"
              alt="Team Collaboration"
              className="relative rounded-[2.5rem] enterprise-shadow grayscale hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute -bottom-10 -left-10 glass-panel p-10 rounded-[2.5rem] enterprise-shadow border-white/60 animate-bounce">
              <div className="text-4xl font-black text-primary mb-1">500+</div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Employees Nationwide</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-32">
          {[
            { title: 'Innovation Driven', desc: 'Work with the latest distribution technology and systems.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            { title: 'National Scale', desc: 'Impact healthcare access for millions of people across Indonesia.', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
            { title: 'Continuous Growth', desc: 'Access to professional development and leadership programs.', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' }
          ].map((perk, i) => (
            <div key={i} className="p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100 hover:bg-primary group transition-all duration-500">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={perk.icon} /></svg>
              </div>
              <h3 className="text-2xl font-black text-primary group-hover:text-white mb-4 tracking-tight">{perk.title}</h3>
              <p className="text-gray-500 group-hover:text-white/60 font-medium leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>

        <div id="open-positions" className="mb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 px-4 gap-8">
            <div>
              <span className="text-[11px] font-black text-accent uppercase tracking-[0.3em] mb-4 block">Current Opportunities</span>
              <h3 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Open Positions</h3>
            </div>
            <div className="flex flex-wrap gap-2 p-1.5 bg-gray-50 rounded-[2rem] border border-gray-100 shadow-inner">
              {['All', 'Operation', 'Commercial', 'Support'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${selectedCategory === cat
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20 scale-105'
                    : 'text-gray-400 hover:text-primary hover:bg-white'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-50 rounded-3xl animate-pulse"></div>
              ))
            ) : (filteredCareers || []).length > 0 ? (
              (filteredCareers || []).map((career) => (
                <div key={career.id} className="group p-8 md:p-12 bg-white rounded-[2.5rem] border border-gray-100 enterprise-shadow hover:ring-4 ring-primary/5 transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-4 py-1.5 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">{career.department}</span>
                      <span className="px-4 py-1.5 bg-accent/5 text-accent text-[10px] font-black uppercase tracking-widest rounded-full">{career.location}</span>
                    </div>
                    <h4 className="text-2xl md:text-3xl font-black text-primary mb-2 group-hover:text-accent transition-colors">
                      {career.title}
                    </h4>
                    <p className="text-gray-500 font-medium line-clamp-1">
                      {language === 'id' ? career.description_id : career.description_en}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setSelectedCareer(career)}
                      className="px-8 py-5 text-primary font-black uppercase tracking-widest text-xs hover:bg-primary/5 rounded-2xl transition-all"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => { setSelectedCareer(career); setShowApplicationForm(true); }}
                      className="px-10 py-5 bg-primary text-white font-black rounded-2xl hover:bg-accent hover:-translate-y-1 transition-all shadow-xl whitespace-nowrap"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                <p className="text-gray-400 font-black uppercase tracking-widest">No positions currently open. Check back soon!</p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Career Detail Modal */}
        {selectedCareer && !showApplicationForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-xl" onClick={() => setSelectedCareer(null)}></div>
            <div className="relative w-full max-w-3xl bg-white rounded-[3rem] enterprise-shadow overflow-hidden group">
              <div className="p-12 sm:p-16">
                <div className="flex items-start justify-between mb-12">
                  <div>
                    <h3 className="text-4xl font-black text-primary mb-6 tracking-tighter leading-none">{selectedCareer.title}</h3>
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="px-5 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">{selectedCareer.department}</span>
                      <span className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">{selectedCareer.location}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedCareer(null)} className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="space-y-12">
                  <div>
                    <h4 className="text-xl font-black text-primary mb-6 flex items-center gap-4">
                      <span className="w-10 h-1 bg-accent rounded-full"></span>
                      Description
                    </h4>
                    <p className="text-gray-500 font-medium leading-relaxed text-lg whitespace-pre-line">
                      {language === 'id' ? selectedCareer.description_id : selectedCareer.description_en}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-primary mb-6 flex items-center gap-4">
                      <span className="w-10 h-1 bg-accent rounded-full"></span>
                      Requirements
                    </h4>
                    <p className="text-gray-500 font-medium leading-relaxed text-lg whitespace-pre-line">
                      {language === 'id' ? selectedCareer.requirements_id : selectedCareer.requirements_en}
                    </p>
                  </div>
                </div>
                <div className="mt-16 pt-12 border-t border-gray-50 flex flex-col sm:flex-row gap-6">
                  <button onClick={() => setShowApplicationForm(true)} className="flex-1 px-12 py-6 bg-primary text-white font-black rounded-2xl hover:bg-accent transition-all shadow-2xl text-lg uppercase tracking-widest">
                    Apply for this position
                  </button>
                  <button onClick={() => setSelectedCareer(null)} className="px-12 py-6 bg-gray-50 text-gray-400 font-black rounded-2xl hover:bg-gray-100 transition-all text-lg">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showApplicationForm && selectedCareer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-xl" onClick={() => { setShowApplicationForm(false); setSelectedCareer(null); }}></div>
            <div className="relative w-full max-w-2xl bg-white rounded-[3rem] enterprise-shadow overflow-hidden group">
              <div className="enterprise-gradient p-12 text-white text-center">
                <h3 className="text-3xl font-black mb-2">Apply for {selectedCareer.title}</h3>
                <p className="text-blue-100/60 font-medium uppercase text-[10px] tracking-widest">{selectedCareer.department} | {selectedCareer.location}</p>
              </div>

              {submitSuccess ? (
                <div className="p-20 text-center">
                  <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce">
                    <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h4 className="text-3xl font-black text-primary mb-4 tracking-tighter">Application Sent!</h4>
                  <p className="text-gray-500 text-lg font-medium">Our talent acquisition team will review your profile and contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="p-12 space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                    <input required type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 ring-primary/5 focus:bg-white transition-all outline-none font-medium" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                      <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 ring-primary/5 focus:bg-white transition-all outline-none font-medium" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Phone Number</label>
                      <input required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 ring-primary/5 focus:bg-white transition-all outline-none font-medium" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Cover Letter / Message</label>
                    <textarea rows={4} value={formData.coverLetter} onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 ring-primary/5 focus:bg-white transition-all outline-none font-medium resize-none"></textarea>
                  </div>
                  <button
                    disabled={submitting}
                    type="submit"
                    className="w-full py-6 bg-accent text-white font-black rounded-2xl shadow-2xl hover:bg-primary transition-all uppercase tracking-widest text-sm disabled:opacity-50"
                  >
                    {submitting ? 'Submitting Application...' : 'Submit Application'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CareerSection;
