import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginPageProps {
  onForgotPassword: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onForgotPassword }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState({ n1: 0, n2: 0 });
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    setCaptcha({
      n1: Math.floor(Math.random() * 10) + 1,
      n2: Math.floor(Math.random() * 10) + 1
    });
    setCaptchaInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Captcha validation
    if (parseInt(captchaInput) !== captcha.n1 + captcha.n2) {
      setError('Invalid captcha result. Please try again.');
      generateCaptcha();
      return;
    }

    setIsLoading(true);

    const result = await login(email, password);

    if (!result.success) {
      setError(result.error || 'Login failed');
      generateCaptcha();
    }

    setIsLoading(false);
  };

  return (
    <div className="h-screen bg-[#0A2351] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="relative w-full max-w-lg scale-90 sm:scale-100">
        {/* Floating Logo Branding */}
        <div className="text-center mb-4 transform transition-all duration-1000 animate-float">
          <div className="inline-block p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 mb-2 shadow-2xl">
            <img
              src="/logo.png"
              alt="PT. Penta Valent Tbk"
              className="h-10 w-auto"
            />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tighter mb-0.5">
            ADMIN <span className="text-accent italic">PORTAL</span>
          </h1>
          <p className="text-blue-200/50 text-[10px] font-black uppercase tracking-[0.4em]">Secure Enterprise Access</p>
        </div>

        {/* Premium Login Card */}
        <div className="bg-white/10 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-shake">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-red-200">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="group space-y-2">
                  <label htmlFor="email" className="block text-[11px] font-black text-blue-200/60 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                    Authorization ID (Email)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-blue-300 group-focus-within:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white font-bold placeholder:text-blue-300/20 focus:outline-none focus:ring-8 focus:ring-accent/5 focus:border-accent/50 transition-all text-sm shadow-inner"
                      placeholder="Enter Admin Email"
                    />
                  </div>
                </div>

                <div className="group space-y-2">
                  <label htmlFor="password" className="block text-[11px] font-black text-blue-200/60 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Security Credential
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-blue-300 group-focus-within:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-12 py-4 text-white font-bold placeholder:text-blue-300/20 focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-accent/50 transition-all text-sm shadow-inner"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-300 hover:text-accent transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Styled Math Captcha Elite */}
                <div className="bg-white/5 rounded-[2rem] p-6 border border-white/10 relative group/captcha overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none"></div>
                  <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                    <div className="flex-shrink-0 text-center sm:text-left flex flex-col items-center sm:items-start gap-2">
                      <p className="text-[10px] font-black text-accent uppercase tracking-[0.4em]">Grid Verification</p>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-black text-white tracking-tighter tabular-nums bg-white/5 px-6 py-3 rounded-2xl border-2 border-white/10 shadow-2xl min-w-[120px] text-center">
                          {captcha.n1} <span className="text-accent">+</span> {captcha.n2}
                        </div>
                        <button
                          type="button"
                          onClick={generateCaptcha}
                          className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-accent hover:text-white transition-all text-blue-300 border border-white/10 active:scale-90"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 w-full flex flex-col gap-2">
                      <label htmlFor="captcha" className="block text-[10px] font-black text-blue-200/50 uppercase tracking-[0.2em] text-center sm:text-left">Result</label>
                      <input
                        id="captcha"
                        type="number"
                        required
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        className="w-full bg-white/10 border-2 border-white/20 rounded-2xl px-6 py-4 text-white font-black text-2xl placeholder:text-white/10 focus:outline-none focus:border-accent focus:ring-8 focus:ring-accent/10 transition-all text-center h-[64px] shadow-inner"
                        placeholder="?"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" />
                    <div className="w-4 h-4 border-2 border-white/20 rounded group-hover:border-accent transition-colors"></div>
                    <svg className="w-2.5 h-2.5 text-accent absolute top-0.5 left-0.5 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
                  </div>
                  <span className="text-xs font-bold text-blue-200/70 hover:text-white transition-colors">Remember</span>
                </label>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-xs font-black text-accent hover:text-white uppercase tracking-widest transition-colors"
                >
                  Recovery
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative group/btn touch-active active:scale-[0.98] transition-all"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-25 group-hover/btn:opacity-60 transition duration-1000 group-hover/btn:duration-200"></div>
                <div className="relative w-full py-5 bg-[#0D2B5F] text-white font-black rounded-xl flex items-center justify-center gap-3 border border-white/20 group-hover/btn:border-accent/50 transition-all uppercase tracking-[0.4em] overflow-hidden text-[11px] shadow-2xl">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-4 border-white/20 border-t-accent rounded-full animate-spin"></div>
                      <span>Authenticating</span>
                    </>
                  ) : (
                    <>
                      <span>Initialize Access</span>
                      <svg className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </>
                  )}
                </div>
              </button>
            </form>
          </div>
        </div>

        {/* Exit Branding */}
        <div className="mt-6 text-center">
          <a href="/" className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-blue-200 font-bold transition-all group text-sm">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Main Infrastructure
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

