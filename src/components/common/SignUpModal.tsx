import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  Lock, 
  Mail, 
  Smartphone, 
  User, 
  MapPin, 
  CheckSquare,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserRole } from '../../types';
import { useTolSeva } from '../../context/TolSevaContext';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
  onSuccess?: () => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'vendor',
  onSuccess,
}) => {
  const { signUpUser } = useTolSeva();

  const [role, setRole] = useState<UserRole>(defaultRole);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [district, setDistrict] = useState('Mumbai Suburban');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage(role === 'vendor' ? 'Please enter a valid GSTIN or Udyam number.' : 'Please enter your Officer ID.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (!agreedTerms) {
      setErrorMessage('You must accept the Statutory Legal Metrology Terms & Public Disclosures.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const res = signUpUser({
        role,
        identifier: identifier.trim().toUpperCase(),
        password,
        fullName: fullName.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        businessName: role === 'vendor' ? (businessName.trim() || 'Retail Trading Enterprise') : undefined,
        district: district.trim(),
      });

      if (res.success) {
        onClose();
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(res.error || 'Failed to complete registration. Please try again.');
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white text-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Indian Flag Top Accent Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600 shrink-0" />

        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center shrink-0">
              {role === 'vendor' ? <Building2 className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Register Once for TolSeva Portal
              </h3>
              <p className="text-[11px] text-slate-500">
                Create ID & Password for permanent 1-click access
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Role Choice */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Account Type</label>
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setRole('vendor')}
                className={`py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                  role === 'vendor'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Vendor / Trader</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('inspector')}
                className={`py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                  role === 'inspector'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Inspector / Officer</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Primary Identifier */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                {role === 'vendor' ? 'GSTIN or Udyam Aadhaar Number *' : 'Officer DigiLocker ID / Department ID *'}
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
                  onChange={(e) => setIdentifier(e.target.value.toUpperCase())}
                  placeholder={role === 'vendor' ? 'e.g. 27AABCU9603R1ZM' : 'e.g. DL-IND-8849204'}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                />
              </div>
              <span className="text-[10px] text-slate-500">
                This will be your permanent Login ID.
              </span>
            </div>

            {/* Name and Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={role === 'vendor' ? 'e.g. Rajesh Sharma' : 'e.g. Officer Sunita Patil'}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Mobile Number *</label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="10-digit Mobile"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            {/* Email and Business / District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Official Email *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">District / Region</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Mumbai Suburban"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            {role === 'vendor' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Shop / Commercial Establishment Trade Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Sharma Provisions & Daily Mart"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                />
              </div>
            )}

            {/* Set Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Create Password *</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-sky-600 hover:text-sky-800 flex items-center gap-0.5"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:bg-white transition font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:bg-white transition font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Legal Consent & Public Grievance Transparency Notice */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-amber-400 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-[11px] text-amber-950 leading-relaxed">
                  I agree to sign up under the <strong>Legal Metrology Act, 2009</strong> rules. I acknowledge that all commercial scale stamping records and consumer grievances are recorded in the <strong>public inspection registry</strong> accessible to statutory authorities and citizens.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-gradient-to-r from-amber-600 via-sky-600 to-emerald-700 hover:opacity-95 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering Credentials...</span>
                </>
              ) : (
                <>
                  <span>Complete Sign Up & Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <span>Already registered? Use your ID and password on the login screen.</span>
          <button
            type="button"
            onClick={onClose}
            className="text-sky-600 font-bold hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
