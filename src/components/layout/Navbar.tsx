import React, { useState } from 'react';
import { 
  Scale, 
  LogOut, 
  User, 
  Shield, 
  Building2, 
  MapPin, 
  Bell,
  ChevronDown,
  QrCode
} from 'lucide-react';
import { useTolSeva } from '../../context/TolSevaContext';
import { UserRole } from '../../types';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { PublicVerificationModal } from '../common/PublicVerificationModal';
import { TolSevaLogo } from '../common/TolSevaLogo';

interface NavbarProps {
  onOpenCitizenPortal?: (instrumentId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCitizenPortal }) => {
  const { currentUser, activeRole, switchRole, logout, instruments } = useTolSeva();
  const [isPublicModalOpen, setIsPublicModalOpen] = useState(false);

  const redFlagsCount = instruments.filter(i => i.flagStatus === 'red').length;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Indian Tricolor National Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between">
        {/* Brand & Emblem */}
        <div className="flex items-center gap-3">
          <TolSevaLogo variant="horizontal" size="sm" colorMode="light" />
        </div>

        {/* Dynamic Role Switcher Pill Bar */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => switchRole('vendor')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeRole === 'vendor'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden sm:inline">Trader</span> Portal
          </button>

          <button
            onClick={() => switchRole('inspector')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeRole === 'inspector'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Inspector</span> Field
          </button>

          <button
            onClick={() => switchRole('admin')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              activeRole === 'admin'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">Apex</span> Admin
          </button>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Public Citizen QR Web Verification Trigger */}
          <button
            onClick={() => {
              if (onOpenCitizenPortal) {
                onOpenCitizenPortal();
              } else {
                setIsPublicModalOpen(true);
              }
            }}
            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            title="Open Public Citizen QR Verification Web Portal"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Citizen QR Portal</span>
          </button>

          {/* App Language Switcher for Vendor / All users */}
          <LanguageSwitcher variant="dropdown" />

          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-bold text-slate-900 leading-tight">
              {currentUser?.name}
            </span>
            <span className="text-[11px] text-slate-500">
              {currentUser?.designation || currentUser?.businessName}
            </span>
          </div>

          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
            title="Sign Out to Login Screen"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Public QR Verification & Grievance Web Popup */}
      {isPublicModalOpen && (
        <PublicVerificationModal
          isOpen={isPublicModalOpen}
          onClose={() => setIsPublicModalOpen(false)}
        />
      )}
    </header>
  );
};
