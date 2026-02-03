import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';
import { Info, Lock } from 'lucide-react';
import { isMalicious, sanitizeInput, isDummyData, logSecurityEvent } from '../../lib/security';

interface ContactSectionProps {
  isPageMode?: boolean;
}

const ContactSection: React.FC<ContactSectionProps> = ({ isPageMode = false }) => {
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
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  // Honeypot State
  const [honeypot, setHoneypot] = useState('');

  // Captcha State
  const [captcha, setCaptcha] = useState({ q: '', a: 0 });
  const [userCaptcha, setUserCaptcha] = useState('');

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ q: `${num1} + ${num2}`, a: num1 + num2 });
    setUserCaptcha('');
  };

  const validatePhone = (value: string) => {
    // Only allow digits, spaces, +, -, and ()
    return value.replace(/[^\d\s\+\-\(\)]/g, '');
  };

  React.useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Honeypot Check (Bots usually fill this)
    if (honeypot) {
      console.warn('Spam detected via honeypot');
      logSecurityEvent('SPAM_HONEYPOT', 'honeypot', 'Filled');
      return;
    }

    // 2. Simple Rate Limiting (Prevent rapid fire submissions)
    const now = Date.now();
    if (now - lastSubmitTime < 30000) { // 30 seconds cooldown
      setSubmitError(language === 'id' ? 'Tunggu sebentar sebelum mengirim pesan lagi' : 'Please wait before sending another message');
      return;
    }

    if (parseInt(userCaptcha) !== captcha.a) {
      setSubmitError(language === 'id' ? 'Jawaban captcha salah' : 'Incorrect captcha answer');
      generateCaptcha();
      return;
    }

    // New Data Validations
    const allFields = [
      { name: 'name', value: formData.name },
      { name: 'subject', value: formData.subject },
      { name: 'message', value: formData.message },
      { name: 'email', value: formData.email }
    ];

    for (const field of allFields) {
      if (isMalicious(field.value)) {
        logSecurityEvent('MALICIOUS_ATTEMPT', field.name, field.value);
        setSubmitError(language === 'id' ? 'Konten Tidak Diizinkan' : 'Content Not Allowed');
        return;
      }
    }

    if (isDummyData(formData.name)) {
      logSecurityEvent('SPAM_FILTERED', 'name', formData.name);
      setSubmitError(language === 'id' ? 'Nama Harus Valid' : 'Name Must Be Valid');
      return;
    }

    if (isDummyData(formData.subject)) {
      setSubmitError(language === 'id' ? 'Subjek Harus Valid' : 'Subject Must Be Valid');
      return;
    }

    if (isDummyData(formData.message)) {
      logSecurityEvent('SPAM_FILTERED', 'message', formData.message);
      setSubmitError(language === 'id' ? 'Pesan Harus Valid' : 'Message Must Be Valid');
      return;
    }

    const emailParts = formData.email.split('@');
    if (emailParts[0].length < 3 || isDummyData(emailParts[0])) {
      setSubmitError(language === 'id' ? 'Email Harus Valid' : 'Email Must Be Valid');
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 8) {
      setSubmitError(language === 'id' ? 'Nomor telepon minimal 8 angka' : 'Phone number must be at least 8 digits');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: sanitizeInput(formData.name),
          email: sanitizeInput(formData.email),
          phone: sanitizeInput(formData.phone),
          subject: sanitizeInput(formData.subject),
          consultation_type: sanitizeInput(formData.subject), // Saving the category as consultation_type
          message: sanitizeInput(formData.message),
        });

      if (error) throw error;
      setSubmitSuccess(true);
      setLastSubmitTime(Date.now());
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      generateCaptcha();
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting message:', error);
      setSubmitError(language === 'id' ? 'Terjadi kesalahan. Silakan coba lagi.' : 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    {
      label: t('contact.sidebar.hq'),
      value: 'Tanah Abang III, Jakarta',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
      )
    },
    {
      label: t('contact.sidebar.hotline'),
      value: '(021) 345-6789',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
      )
    },
    {
      label: t('contact.sidebar.correspondence'),
      value: 'info@pentavalent.co.id',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
      )
    },
    {
      label: t('contact.sidebar.operational'),
      value: '08:00 - 17:00 WIB',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      )
    }
  ];

  return (
    <section id="contact" className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
      {/* Tactical Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-40"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-200/40 rounded-full blur-[100px] animate-float"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-200/40 rounded-full blur-[100px] animate-float-slow"></div>
      </div>

      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 relative z-10">
        {!isPageMode && (
          <div className="mb-24">
            <span className="inline-block px-5 py-2 bg-primary/10 text-primary rounded-full text-[10px] font-black tracking-[0.4em] uppercase mb-8 shadow-xl shadow-primary/5">
              {t('contact.tagline')}
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-5xl xl:text-6xl py-2 mb-10 text-slate-900 border-l-8 border-accent pl-6 md:pl-10">
              {t('contact.title.text')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 italic inline-block pr-4">{t('contact.title.italic')}</span>
            </h2>
            <p className="text-base md:text-lg lg:text-lg text-slate-500 max-w-xl">
              {t('contact.description')}
            </p>

            <div className="mt-8 p-6 bg-cyan-50/50 rounded-2xl border border-cyan-100 flex items-start gap-4 max-w-xl">
              <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 shrink-0">
                <Info size={16} />
              </div>
              <p className="text-xs font-bold text-slate-600 leading-relaxed pt-1">
                {language === 'id'
                  ? "Untuk pertanyaan kerja sama bisnis, distribusi, kemitraan strategis, dan layanan korporat."
                  : "For inquiries regarding business cooperation, distribution, strategic partnerships, and corporate services."}
              </p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Neural Communication Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2rem] md:rounded-[4rem] p-6 sm:p-12 md:p-16 border border-slate-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-12 tracking-tighter">{t('contact.cta.subtitle')}</h3>

                {submitSuccess && (
                  <div className="mb-10 p-8 bg-cyan-50 border border-cyan-100 rounded-3xl flex items-center gap-6 animate-fade-in">
                    <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                      <div className="text-cyan-900 font-black uppercase text-[10px] tracking-widest mb-1">{t('contact.success.title')}</div>
                      <div className="text-cyan-700 text-sm font-bold">{t('contact.success.msg')}</div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                  {/* Honeypot Field - Hidden from humans */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="website_url"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                      {t('contact.form.identity')}
                    </label>
                    <input required type="text" placeholder={t('contact.form.name_placeholder')} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-8 focus:ring-cyan-500/5 focus:bg-white focus:border-cyan-500/30 outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300 shadow-sm" />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {t('contact.form.corporate_email')}
                    </label>
                    <input required type="email" placeholder={t('contact.form.email_placeholder')} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-8 focus:ring-blue-500/5 focus:bg-white focus:border-blue-500/30 outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300 shadow-sm" />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      {t('contact.form.phone_label')}
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder={t('contact.form.phone_placeholder')}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: validatePhone(e.target.value) })}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-8 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-500/30 outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {t('contact.form.consultation_type')}
                    </label>
                    <div className="relative">
                      <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-8 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-500/30 outline-none font-bold text-slate-900 appearance-none transition-all cursor-pointer shadow-sm">
                        <option value="">{t('contact.form.category_placeholder')}</option>
                        <option value="Business Enquiry">{t('contact.form.business')}</option>
                        <option value="Employment Enquiry">{t('contact.form.employment')}</option>
                        <option value="Media Enquiry">{t('contact.form.media')}</option>
                        <option value="Order Enquiry">{t('contact.form.order')}</option>
                        <option value="Product Complain">{t('contact.form.complain')}</option>
                        <option value="Product Return">{t('contact.form.return')}</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2.5">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      {t('contact.form.intelligence')}
                    </label>
                    <textarea required rows={4} placeholder={t('contact.form.message_placeholder')} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-8 focus:ring-slate-500/5 focus:bg-white focus:border-slate-500/30 outline-none font-bold text-slate-900 resize-none transition-all placeholder:text-slate-300 shadow-sm"></textarea>
                  </div>

                  {/* Optimized Math Captcha Portfolio */}
                  <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-6 bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-inner group/captcha">
                    <div className="flex items-center gap-5">
                      <div className="w-14 w-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-cyan-500 shadow-sm group-hover/captcha:scale-110 transition-transform duration-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">{t('contact.form.bot_protection')}</span>
                        <div className="flex items-center gap-3">
                          <span className="bg-white px-5 py-3 rounded-xl font-black text-xl tracking-tighter wow-text-primary border border-slate-200 shadow-sm min-w-[100px] text-center">{captcha.q}</span>
                          <span className="text-slate-300 font-black text-2xl">=</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 w-full relative">
                      <input
                        required
                        type="number"
                        placeholder="?"
                        value={userCaptcha}
                        onChange={(e) => setUserCaptcha(e.target.value)}
                        className="w-full px-8 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:ring-8 focus:ring-primary/5 focus:border-primary/30 outline-none font-black text-slate-900 transition-all text-center sm:text-left text-2xl shadow-sm h-[64px]"
                      />
                    </div>
                  </div>

                  {submitError && (
                    <div className="md:col-span-2 text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-50 p-4 rounded-xl border border-red-100 animate-shake">
                      {submitError}
                    </div>
                  )}

                  <div className="md:col-span-2 pt-4">
                    <button
                      disabled={submitting}
                      type="submit"
                      className="group/btn relative w-full overflow-hidden rounded-2xl wow-button-gradient py-6 text-[10px] font-black uppercase tracking-[0.4em] text-white shadow-2xl disabled:opacity-50 touch-active active:scale-[0.98] transition-all"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {submitting ? t('contact.form.submitting') : t('contact.form.submit')}
                        {!submitting && <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>}
                      </span>
                    </button>

                    <div className="mt-6 flex items-center justify-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                      <Lock size={12} className="text-slate-400" />
                      <p className="text-[10px] text-slate-400 font-bold text-center">
                        {language === 'id'
                          ? "Data yang Anda kirimkan akan diproses sesuai kebijakan privasi perusahaan."
                          : "The data you submit will be processed in accordance with the company's privacy policy."}
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Interactive Intelligence Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <div className="relative h-80 bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-xl group">
              <div className="absolute inset-0 transition-all duration-1000 group-hover:scale-105">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253848.58042025325!2d106.48640691741731!3d-6.2129721969640155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f7a7cddfa5db%3A0x4e855b5b65a13480!2sPT.%20Penta%20Valent%20Tbk!5e0!3m2!1sid!2sid!4v1769656976101!5m2!1sid!2sid"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="PT Penta Valent HQ"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-cyan-500 mb-4 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</h5>
                  <p className="text-xs font-bold text-slate-900 leading-tight">{item.value}</p>
                </div>
              ))}
            </div>

            <button onClick={() => window.open('https://wa.me/6281234567890', '_blank')} className="group relative w-full bg-gradient-to-br from-[#25D366] to-[#128C7E] p-10 rounded-[3rem] text-left overflow-hidden shadow-2xl">
              <div className="absolute -right-4 -bottom-4 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.3em]">{language === 'id' ? 'Aksi Instan' : 'Instant Action'}</span>
                </div>
                <h4 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tighter">{t('contact.fast_response')}</h4>
                <p className="text-white/60 text-sm font-bold mb-8">{language === 'id' ? 'Terhubung dengan tim dukungan eksekutif kami.' : 'Connect with our executive support team.'}</p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl group-hover:bg-[#128C7E] group-hover:text-white transition-all">
                  {t('contact.sidebar.whatsapp')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" /></svg>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div >
    </section >
  );
};

export default ContactSection;
