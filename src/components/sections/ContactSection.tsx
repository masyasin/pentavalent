import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';

const ContactSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        });

      if (error) throw error;
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting message:', error);
      setSubmitError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: t('contact.address'),
      content: 'Jl. Tanah Abang III No. 12\nJakarta Pusat 10160\nIndonesia',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Telepon',
      content: '(021) 345-6789\n(021) 345-6790',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email',
      content: 'info@pentavalent.co.id\nsales@pentavalent.co.id',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t('contact.hours'),
      content: 'Senin - Jumat: 08:00 - 17:00\nSabtu: 08:00 - 12:00\nMinggu: Tutup',
    },
  ];

  return (
    <section id="contact" className="py-32 bg-white relative overflow-hidden">
      {/* Dynamic background element */}
      <div className="absolute top-0 right-0 w-full h-[600px] opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mt-32"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-8">
          <div className="max-w-3xl">
            <span className="inline-block px-5 py-2 bg-primary/5 text-primary rounded-full text-[11px] font-black tracking-[0.2em] uppercase mb-8 border border-primary/10">
              {t('contact.tagline')}
            </span>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-none mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('contact.title.text')} <br />
              <span className="italic">{t('contact.title.italic')}</span>
            </h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">
              {t('contact.description')}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7">
            <div className="bg-gray-50 rounded-[3.5rem] p-12 md:p-16 border border-gray-100 enterprise-shadow relative group">
              <h3 className="text-3xl font-black text-primary mb-10 tracking-tighter">{t('contact.form.title')}</h3>

              {submitSuccess && (
                <div className="mb-10 p-8 bg-accent/10 border border-accent/20 rounded-3xl flex items-center gap-6 animate-pulse">
                  <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div className="text-accent font-black uppercase text-xs tracking-widest">{language === 'id' ? 'Pesan berhasil dikirim.' : 'Message processed successfully.'}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{language === 'id' ? 'Nama Lengkap' : 'Full Name'}</label>
                    <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-6 py-5 bg-white border border-gray-100 rounded-2xl focus:ring-4 ring-primary/5 outline-none font-bold text-primary transition-all" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{language === 'id' ? 'Alamat Email' : 'Email Address'}</label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-6 py-5 bg-white border border-gray-100 rounded-2xl focus:ring-4 ring-primary/5 outline-none font-bold text-primary transition-all" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{language === 'id' ? 'Nomor Kontak' : 'Contact Number'}</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-6 py-5 bg-white border border-gray-100 rounded-2xl focus:ring-4 ring-primary/5 outline-none font-bold text-primary transition-all" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{language === 'id' ? 'Subjek Pertanyaan' : 'Inquiry Subject'}</label>
                    <div className="relative">
                      <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-6 py-5 bg-white border border-gray-100 rounded-2xl focus:ring-4 ring-primary/5 outline-none font-bold text-primary appearance-none transition-all">
                        <option value="">{language === 'id' ? 'Pilih Kategori' : 'Select Category'}</option>
                        <option value="partnership">{language === 'id' ? 'Kemitraan Distribusi' : 'Distribution Partnership'}</option>
                        <option value="investor">{language === 'id' ? 'Hubungan Investor' : 'Investor Relations'}</option>
                        <option value="sales">{language === 'id' ? 'Penjualan Komersial' : 'Commercial Sales'}</option>
                        <option value="support">{language === 'id' ? 'Dukungan Teknis' : 'Technical Support'}</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{language === 'id' ? 'Detail Pesan' : 'Message Detail'}</label>
                  <textarea required rows={6} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-6 py-5 bg-white border border-gray-100 rounded-2xl focus:ring-4 ring-primary/5 outline-none font-bold text-primary resize-none transition-all"></textarea>
                </div>

                <button
                  disabled={submitting}
                  type="submit"
                  className="w-full py-6 bg-gradient-to-r from-primary to-accent text-white font-black rounded-2xl shadow-2xl hover:opacity-90 transition-all uppercase tracking-[0.2em] text-sm disabled:opacity-50"
                >
                  {submitting ? 'Transmitting...' : t('contact.form.button')}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-12">
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { label: t('contact.address.label'), content: 'Jl. Tanah Abang III No. 12, Jakarta Center', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                { label: t('contact.phone.label'), content: '(021) 345-6789 / 6790', icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
                { label: t('footer.contact'), content: 'info@pentavalent.co.id', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                { label: t('contact.hours.label'), content: 'Mon - Fri: 08:00 - 17:00', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
              ].map((info, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 enterprise-shadow group hover:bg-primary transition-all duration-500">
                  <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={info.icon} /></svg>
                  </div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-white/60 transition-colors">{info.label}</div>
                  <div className="text-sm font-black text-primary leading-tight group-hover:text-white transition-colors">{info.content}</div>
                </div>
              ))}
            </div>

            <div className="rounded-[3rem] overflow-hidden enterprise-shadow border-8 border-white h-72 grayscale hover:grayscale-0 transition-all duration-1000">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.666073203082!2d106.81280931476882!3d-6.175392995527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5d2e764b12d%3A0x3d2ad6e1e0e9bcc8!2sJl.%20Tanah%20Abang%20III%2C%20Petojo%20Sel.%2C%20Kecamatan%20Gambir%2C%20Kota%20Jakarta%20Pusat%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sen!2sid!4v1640000000000!5m2!1sen!2sid"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="HQ Location"
              />
            </div>

            <div className="enterprise-gradient rounded-[3rem] p-10 text-white relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              <h4 className="text-2xl font-black mb-4 relative z-10 tracking-tighter">Fast Response Channel</h4>
              <p className="text-blue-100/60 text-sm font-medium mb-8 relative z-10 leading-relaxed">
                Connect directly with our corporate communication team via WhatsApp for immediate professional assistance.
              </p>
              <button onClick={() => window.open('https://wa.me/6281234567890', '_blank')} className="px-8 py-4 bg-white text-primary font-black rounded-2xl hover:bg-accent hover:text-white transition-all relative z-10 shadow-2xl uppercase tracking-widest text-xs">
                Open WhatsApp Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
