import React, { useState, useEffect } from 'react';
import { TolSevaProvider, useTolSeva } from './context/TolSevaContext';
import { UnifiedLogin } from './components/auth/UnifiedLogin';
import { Navbar } from './components/layout/Navbar';
import { VendorPortal } from './components/vendor/VendorPortal';
import { InspectorPortal } from './components/inspector/InspectorPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { PublicVerificationPortal } from './components/citizen/PublicVerificationPortal';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, activeRole } = useTolSeva();

  // Detect URL parameter for QR code scanning (?mode=public_verify or ?scaleId=...)
  const [isPublicCitizenView, setIsPublicCitizenView] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return (
        params.get('mode') === 'public_verify' ||
        params.has('scaleId') ||
        params.get('view') === 'citizen' ||
        params.has('complaint')
      );
    }
    return false;
  });

  const [urlScaleId, setUrlScaleId] = useState<string | undefined>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('scaleId') || undefined;
    }
    return undefined;
  });

  const [urlComplaintId, setUrlComplaintId] = useState<string | undefined>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('complaint') || undefined;
    }
    return undefined;
  });

  // Listen for browser popstate / url changes
  useEffect(() => {
    const handleLocationCheck = () => {
      const params = new URLSearchParams(window.location.search);
      const isQr = params.get('mode') === 'public_verify' || params.has('scaleId') || params.get('view') === 'citizen' || params.has('complaint');
      if (isQr) {
        setIsPublicCitizenView(true);
        setUrlScaleId(params.get('scaleId') || undefined);
        setUrlComplaintId(params.get('complaint') || undefined);
      }
    };

    window.addEventListener('popstate', handleLocationCheck);
    return () => window.removeEventListener('popstate', handleLocationCheck);
  }, []);

  // When citizen view is open (e.g. from QR scan)
  if (isPublicCitizenView) {
    return (
      <PublicVerificationPortal
        initialInstrumentId={urlScaleId}
        initialComplaintId={urlComplaintId}
        initialTab={urlComplaintId ? 'status' : 'verify'}
        onBackToDashboard={() => {
          setIsPublicCitizenView(false);
          // Clean URL without full reload
          if (typeof window !== 'undefined' && window.history) {
            const cleanUrl = window.location.pathname;
            window.history.pushState({}, '', cleanUrl);
          }
        }}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <UnifiedLogin 
        onOpenPublicPortal={() => {
          setIsPublicCitizenView(true);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Top Navigation & Role Bar */}
      <Navbar 
        onOpenCitizenPortal={(scaleId) => {
          if (scaleId) setUrlScaleId(scaleId);
          setIsPublicCitizenView(true);
        }} 
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeRole === 'vendor' && <VendorPortal />}
        {activeRole === 'inspector' && <InspectorPortal />}
        {activeRole === 'admin' && <AdminPortal />}
      </main>

      {/* Official Statutory Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © 2026 <strong>TolSeva</strong> • National Legal Metrology Directorate, Ministry of Consumer Affairs, Food & Public Distribution, New Delhi.
          </p>
          <div className="flex items-center gap-4 text-slate-600">
            <span>Enforcing Legal Metrology Act, 2009</span>
            <span>•</span>
            <span>Smart India Hackathon 2026 (SIH)</span>
            <span>•</span>
            <span className="font-semibold text-emerald-700">NIC Cloud Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <TolSevaProvider>
      <MainAppContent />
    </TolSevaProvider>
  );
}
