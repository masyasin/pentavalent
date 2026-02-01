import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

interface ForgotPasswordPageProps {
  onBack: () => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onBack }) => {
  const { requestPasswordReset, resetPassword } = useAuth();
  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request');
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // OTP State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Auto-detect hash token from URL (Supabase Recovery Flow)
  const [isLinkRecovery, setIsLinkRecovery] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
        // Parse token from hash
        const params = new URLSearchParams(hash.replace('#', '?'));
        const accessToken = params.get('access_token');
        
        if (accessToken) {
            setStep('reset');
            setIsLinkRecovery(true);
        }
    }
  }, []);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await requestPasswordReset(email);

    if (result.success) {
      setStep('email_sent');
      toast.success('Email Sent', { description: 'Please check your inbox for the reset link.' });
    } else {
      const errorMsg = result.error || 'Failed to send reset email';
      setError(errorMsg);
      toast.error('Recovery Failed', { description: errorMsg });
    }

    setIsLoading(false);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let tokenToUse = '';

    if (!isLinkRecovery) {
        tokenToUse = otp.join('');
        if (tokenToUse.length < 6) {
          setError('Please enter the complete 6-digit reset token.');
          return;
        }
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    const result = await resetPassword(tokenToUse, newPassword);

    if (result.success) {
      setStep('success');
    } else {
      setError(result.error || 'Failed to reset password');
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
            ACCOUNT <span className="text-accent italic">RECOVERY</span>
          </h1>
          <p className="text-blue-200/50 text-[10px] font-black uppercase tracking-[0.4em]">Secure Verification Process</p>
        </div>

        {/* Premium Card */}
        <div className="bg-white/10 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="p-6 sm:p-8">
            {step === 'request' && (
              <form onSubmit={handleRequestReset} className="space-y-6">
                {error && (
                  <div id="reset-error-display" style={{ backgroundColor: '#dc2626', border: '1px solid #f87171', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', boxShadow: '0 0 20px rgba(220,38,38,0.4)' }}>
                    <div style={{ width: '32px', height: '32px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg style={{ width: '16px', height: '16px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p style={{ fontSize: '12px', fontWeight: '900', color: 'white', margin: 0 }}>{error}</p>
                  </div>
                )}

                <div className="group">
                  <label htmlFor="email" className="block text-[10px] font-black text-blue-200/50 uppercase tracking-[0.2em] mb-1.5 ml-1">
                    Authorization ID (Email)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-blue-300 group-focus-within:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white font-bold placeholder:text-blue-300/20 focus:outline-none focus:ring-4 focus:ring-accent/20 focus:border-accent/50 transition-all text-sm"
                      placeholder="Enter registered email"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative group/btn"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-25 group-hover/btn:opacity-60 transition duration-1000 group-hover/btn:duration-200"></div>
                  <div className="relative w-full py-4 bg-[#0D2B5F] text-white font-black rounded-xl flex items-center justify-center gap-3 border border-white/10 group-hover/btn:border-accent/50 transition-all uppercase tracking-[0.3em] overflow-hidden text-sm">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-4 border-white/20 border-t-accent rounded-full animate-spin"></div>
                        <span>Processing</span>
                      </>
                    ) : (
                      <>
                        <span>Send Instructions</span>
                        <svg className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </>
                    )}
                  </div>
                </button>
              </form>
            )}

            {step === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                {error && (
                  <div className="p-4 bg-red-600 border border-red-400 rounded-xl flex items-center gap-3 animate-shake shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                    <p className="text-xs font-black text-white text-center w-full">{error}</p>
                  </div>
                )}

                {/* Demo notice with token - Only show if NOT link recovery */}
                {!isLinkRecovery && (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <p className="text-[10px] text-yellow-200 font-bold">
                      <strong className="text-yellow-400">DEMO MODE:</strong> Token pre-filled.
                    </p>
                  </div>
                )}
                
                {isLinkRecovery && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                     </div>
                     <div>
                        <p className="text-xs font-black text-green-400 uppercase tracking-wide">Identity Verified</p>
                        <p className="text-[10px] text-green-200/60 font-medium">You can now set your new password.</p>
                     </div>
                  </div>
                )}

                {!isLinkRecovery && (
                  <div className="group space-y-4">
                    <label className="block text-[10px] font-black text-blue-200/50 uppercase tracking-[0.2em] mb-1.5 ml-1 text-center font-black">
                      Verification Reset Token
                    </label>
                    <div className="flex justify-center gap-2 sm:gap-3 mb-8">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (otpInputs.current[index] = el)}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          autoFocus={index === 0}
                          className="w-10 sm:w-12 h-14 sm:h-16 bg-white/5 border-2 border-white/10 rounded-2xl text-center text-2xl font-black text-accent focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all shadow-inner"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="group">
                  <label htmlFor="newPassword" className="block text-[10px] font-black text-blue-200/50 uppercase tracking-[0.2em] mb-1.5 ml-1">
                    New Credential
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white font-bold placeholder:text-blue-300/20 focus:outline-none focus:ring-4 focus:ring-accent/20 focus:border-accent/50 transition-all text-sm"
                      placeholder="Min. 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-300 hover:text-accent transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="confirmPassword" className="block text-[10px] font-black text-blue-200/50 uppercase tracking-[0.2em] mb-1.5 ml-1">
                    Confirm Credential
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold placeholder:text-blue-300/20 focus:outline-none focus:ring-4 focus:ring-accent/20 focus:border-accent/50 transition-all text-sm"
                    placeholder="Repeat password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative group/btn"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-25 group-hover/btn:opacity-60 transition duration-1000 group-hover/btn:duration-200"></div>
                  <div className="relative w-full py-4 bg-[#0D2B5F] text-white font-black rounded-xl flex items-center justify-center gap-3 border border-white/10 group-hover/btn:border-accent/50 transition-all uppercase tracking-[0.3em] overflow-hidden text-sm">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-4 border-white/20 border-t-accent rounded-full animate-spin"></div>
                        <span>Updating</span>
                      </>
                    ) : (
                      <>
                        <span>Reset Password</span>
                        <svg className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </>
                    )}
                  </div>
                </button>
              </form>
            )}

            {step === 'success' && (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Access Restored</h3>
                <p className="text-blue-200/60 text-xs mb-8 font-bold">Your security credentials have been updated successfully.</p>

                <button
                  onClick={onBack}
                  className="w-full relative group/btn"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-25 group-hover/btn:opacity-60 transition duration-1000 group-hover/btn:duration-200"></div>
                  <div className="relative w-full py-4 bg-[#0D2B5F] text-white font-black rounded-xl flex items-center justify-center gap-3 border border-white/10 group-hover/btn:border-accent/50 transition-all uppercase tracking-[0.3em] overflow-hidden text-sm">
                    <span>Return to Login</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        {step !== 'success' && (
          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-blue-200 font-bold transition-all group text-sm"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
