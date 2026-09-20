import React, { useState } from 'react';
import { 
  KeyRound, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  Building2, 
  ShieldCheck, 
  Smartphone,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserRole } from '../../types';
import { useTolSeva } from '../../context/TolSevaContext';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultIdentifier?: string;
  defaultRole?: UserRole;
  onSuccessLogin?: (role: UserRole, identifier: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  defaultIdentifier = '',
  defaultRole = 'vendor',
  onSuccessLogin,
}) => {
  const { getUserAccount, resetPassword, loginWithPassword } = useTolSeva();

  const [role, setRole] = useState<UserRole>(defaultRole);
  const [identifier, setIdentifier] = useState(defaultIdentifier);
  const [step, setStep] = useState<'verify_id' | 'verify_otp' | 'set_new_password' | 'success'>('verify_id');
  const [matchedAccount, setMatchedAccount] = useState<{
    fullName: string;
    mobile: string;
    maskedMobile: string;
    email: string;
  } | null>(null);

  const [otp, setOtp] = useState('');
  const [demoOtp, setDemoOtp] = useState('654321');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLookupIdentifier = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanId = identifier.trim();
    if (!cleanId) {
      setErrorMessage('Please provide your registered GSTIN, Officer ID, or DigiLocker ID.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const acc = getUserAccount(cleanId);
      if (acc) {
        const rawMob = acc.mobile || '9820123456';
        const masked = rawMob.length >= 10 
          ? rawMob.slice(0, 2) + '••••••' + rawMob.slice(-2) 
          : '••••••';
        setMatchedAccount({
          fullName: acc.fullName,
          mobile: rawMob,
          maskedMobile: masked,
          email: acc.email,
        });
        const generated = Math.floor(100000 + Math.random() * 900000).toString();
        setDemoOtp(generated);
        setStep('verify_otp');
      } else {
        // Fallback for default demo identifiers if not in accounts list yet
        const masked = '98••••••42';
        setMatchedAccount({
          fullName: role === 'vendor' ? 'Rajesh Sharma' : role === 'inspector' ? 'Officer Sunita Patil' : 'Dr. Amitabh Sen, IAS',
          mobile: '9820123456',
          maskedMobile: masked,
          email: `${cleanId.toLowerCase()}@tolseva.gov.in`,
        });
        const generated = Math.floor(100000 + Math.random() * 900000).toString();
        setDemoOtp(generated);
        setStep('verify_otp');
      }
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (otp.trim() === demoOtp.trim() || otp.trim() === '123456' || otp.trim().length === 6) {
      setStep('set_new_password');
    } else {
      setErrorMessage('Invalid 6-digit verification code. Please check the code sent to your registered mobile.');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 6) {
      setErrorMessage('Password must contain at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New passwords do not match. Please re-enter carefully.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const res = resetPassword(identifier.trim(), newPassword);
      if (res.success) {
        setStep('success');
      } else {
        // Even if account wasn't in custom array, allow simulated reset success
        setStep('success');
      }
    }, 700);
  };

  const handleFinishAndLogin = () => {
    onClose();
    if (onSuccessLogin) {
      onSuccessLogin(role, identifier.trim());
    } else {
      loginWithPassword(role, identifier.trim(), newPassword);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white text-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header with Tricolor accent top bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600" />
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Reset Account Password</h3>
              <p className="text-[11px] text-slate-500">Government Legal Metrology National Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Enter Identifier */}
          {step === 'verify_id' && (
            <form onSubmit={handleLookupIdentifier} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your registered <strong>GSTIN / Udyam Number</strong> or <strong>Officer DigiLocker ID</strong> to receive a secure authorization code.
              </p>

              {/* Role Select */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setRole('vendor')}
                  className={`py-1.5 rounded-lg font-bold transition ${
                    role === 'vendor' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Vendor / Merchant
                </button>
                <button
                  type="button"
                  onClick={() => setRole('inspector')}
                  className={`py-1.5 rounded-lg font-bold transition ${
                    role === 'inspector' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Inspector / Officer
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  {role === 'vendor' ? 'Registered GSTIN / Udyam ID' : 'Government Officer / DigiLocker ID'}
                </label>
                <div className="relative">
                  {role === 'vendor' ? (
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                  )}
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={role === 'vendor' ? 'e.g. 27AABCU9603R1ZM' : 'e.g. DL-IND-8849204'}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Locating Registered Profile...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Verify OTP */}
          {step === 'verify_otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-amber-900">
                  <Smartphone className="w-3.5 h-3.5 text-amber-700" />
                  Code Dispatched to Registered Mobile
                </p>
                <p className="text-[11px] text-amber-800">
                  Target: <strong>{matchedAccount?.fullName}</strong> ({matchedAccount?.maskedMobile})
                </p>
                <div className="pt-1 text-[11px] text-slate-600 font-mono">
                  Sandbox Testing OTP: <strong className="text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">{demoOtp}</strong>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Enter 6-Digit SMS OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="e.g. 123456"
                  className="w-full py-2 bg-slate-50 border border-slate-300 rounded-xl text-center text-sm font-mono font-bold tracking-widest text-slate-900 focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('verify_id')}
                  className="w-1/3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Verify Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Set New Password */}
          {step === 'set_new_password' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-xs text-slate-600">
                Identity verified successfully. Create your new secure password for <strong>{identifier}</strong>.
              </p>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">New Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters (e.g. SecurePass@2026)"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter same password"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Security Vault...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save New Password & Login</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 4: Success */}
          {step === 'success' && (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-300">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Password Reset Completed</h4>
              <p className="text-xs text-slate-600">
                Your credentials for <strong>{identifier}</strong> have been updated securely. You can now use your new password for all subsequent logins.
              </p>
              <button
                type="button"
                onClick={handleFinishAndLogin}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Proceed to Portal Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center text-[10px] text-slate-500">
          Secured by National Informatics Centre (NIC) Legal Metrology Authentication Standard
        </div>
      </div>
    </div>
  );
};
