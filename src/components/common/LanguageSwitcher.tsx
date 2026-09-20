import React, { useState, useRef, useEffect } from 'react';
import { Globe, Languages, Check, ChevronDown, Sparkles, Volume2 } from 'lucide-react';
import { useTolSeva } from '../../context/TolSevaContext';
import { VENDOR_LANGUAGES, LanguageOption } from '../../utils/translations';
import { VendorLanguage } from '../../types';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'pills' | 'compact';
  className?: string;
  showVoiceNote?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'dropdown',
  className = '',
  showVoiceNote = false,
}) => {
  const { vendorLanguage, setVendorLanguage, t } = useTolSeva();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLangOption = VENDOR_LANGUAGES.find(l => l.code === vendorLanguage) || VENDOR_LANGUAGES[0];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (lang: VendorLanguage) => {
    setVendorLanguage(lang);
    setIsOpen(false);

    // Optional audio confirmation in the selected language if speech synthesis is available
    if ('speechSynthesis' in window) {
      try {
        const option = VENDOR_LANGUAGES.find(l => l.code === lang);
        if (option) {
          const utterances: Record<VendorLanguage, string> = {
            hi: 'भाषा हिन्दी सेट की गई है।',
            mr: 'मराठी भाषा निवडली आहे.',
            gu: 'ગુજરાતી ભાષા પસંદ કરેલ છે.',
            bn: 'বাংলা ভাষা নির্বাচন করা হয়েছে।',
            ta: 'தமிழ் மொழி தேர்ந்தெடுக்கப்பட்டது.',
            te: 'తెలుగు భాష ఎంచుకోబడింది.',
            pa: 'ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਚੁਣੀ ਗਈ ਹੈ।',
            en: 'Language switched to English.',
          };
          const u = new SpeechSynthesisUtterance(utterances[lang] || 'Language updated');
          u.lang = lang === 'en' ? 'en-IN' : `${lang}-IN`;
          u.rate = 1.0;
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(u);
        }
      } catch {
        // Safe fallback
      }
    }
  };

  // Pill variant: Excellent for vendor dashboard header for instant 1-click access
  if (variant === 'pills') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Languages className="w-4 h-4 text-indigo-600" />
            <span>{t.appLanguage}</span>
            <span className="text-[10px] font-normal text-slate-400">
              ({t.selectLanguagePrompt})
            </span>
          </label>
          <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {activeLangOption.nativeName} ({activeLangOption.name})
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {VENDOR_LANGUAGES.map((lang) => {
            const isSelected = lang.code === vendorLanguage;
            return (
              <button
                key={lang.code}
                id={`lang-pill-${lang.code}`}
                onClick={() => handleSelectLanguage(lang.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                }`}
                title={lang.regionHint}
              >
                <span>{lang.flag}</span>
                <span>{lang.nativeName}</span>
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </button>
            );
          })}
        </div>

        {showVoiceNote && (
          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.voiceLanguageSyncedNotice}</span>
          </p>
        )}
      </div>
    );
  }

  // Compact variant: Ideal for quick inline usage
  if (variant === 'compact') {
    return (
      <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition border border-slate-200"
          aria-expanded={isOpen}
          title={t.changeLanguage}
        >
          <span>{activeLangOption.flag}</span>
          <span className="font-semibold">{activeLangOption.nativeName}</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {t.changeLanguage}
            </div>
            {VENDOR_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelectLanguage(lang.code)}
                className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition ${
                  lang.code === vendorLanguage
                    ? 'bg-indigo-50 text-indigo-900 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{lang.flag}</span>
                  <div>
                    <span className="font-medium text-slate-900 block leading-tight">{lang.nativeName}</span>
                    <span className="text-[10px] text-slate-400">{lang.name}</span>
                  </div>
                </div>
                {lang.code === vendorLanguage && <Check className="w-3.5 h-3.5 text-indigo-600" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default Dropdown Variant: Full featured with region hints and flags
  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        id="navbar-language-switcher-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 transition border border-slate-200/80 shadow-xs group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-sky-600 group-hover:rotate-45 transition-transform duration-300" />
          <span className="text-sm">{activeLangOption.flag}</span>
          <span className="font-bold text-slate-800">{activeLangOption.nativeName}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 divide-y divide-slate-100">
          <div className="px-3.5 py-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-sky-600" />
                {t.changeLanguage}
              </span>
              <span className="text-[10px] text-sky-600 bg-sky-50 font-bold px-2 py-0.5 rounded-full border border-sky-100">
                8 Languages
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              {t.selectLanguagePrompt}
            </p>
          </div>

          <div className="py-1 max-h-72 overflow-y-auto">
            {VENDOR_LANGUAGES.map((lang) => {
              const isSelected = lang.code === vendorLanguage;
              return (
                <button
                  key={lang.code}
                  id={`lang-dropdown-option-${lang.code}`}
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-sky-50 text-sky-900 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg shrink-0">{lang.flag}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{lang.nativeName}</span>
                        <span className="text-[10px] text-slate-400">({lang.name})</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        {lang.regionHint}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="px-3 py-2 bg-slate-50/80 rounded-b-2xl">
            <p className="text-[10px] text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Voice AI automatically adapts to this language</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
