import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  CreditCard, 
  QrCode, 
  Building2, 
  Scale, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Mic,
  Coins,
  Loader2,
  ChevronDown,
  Camera,
  MapPin,
  Phone,
  HelpCircle,
  Search,
  Check,
  RotateCcw,
  Sliders,
  Store
} from 'lucide-react';
import { AccuracyClass, CapacityUnit, VerificationIntervalUnit, Instrument } from '../../types';
import { useTolSeva } from '../../context/TolSevaContext';
import { VoiceWizard } from './VoiceWizard';
import { ProvisionalTokenModal } from './ProvisionalTokenModal';
import { POPULAR_MACHINE_CATALOG, MachineCatalogEntry } from '../../data/machineCatalog';

interface InstrumentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// OIML Serial Number Regex Pattern:
// [Factory Code (2-6 chars)]-[Year (4 digits)]-[Model (2-10 alphanumeric)]-[Sequential Production ID (3-8 alphanumeric)]
export const SERIAL_NUMBER_REGEX = /^[A-Z0-9]{2,6}-\d{4}-[A-Z0-9]{2,10}-[A-Z0-9]{3,8}$/i;

export const InstrumentRegistrationModal: React.FC<InstrumentRegistrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { registerInstrument, currentUser } = useTolSeva();

  // Wizard Sub-steps: 1: Simple 4-Input Registration, 2: Fee & Payment, 3: Success & Token
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // 1. Machine Model Selection & Searchable Dropdown State
  const [selectedMachineId, setSelectedMachineId] = useState<string>('essae-ds252');
  const [modelSearchQuery, setModelSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-populated / backend lookup fields
  const currentModelConfig = POPULAR_MACHINE_CATALOG.find(m => m.id === selectedMachineId) || POPULAR_MACHINE_CATALOG[0];

  const [manufacturer, setManufacturer] = useState(currentModelConfig.manufacturer);
  const [brandModel, setBrandModel] = useState(currentModelConfig.modelDesignation);
  const [category, setCategory] = useState(currentModelConfig.category);
  const [accuracyClass, setAccuracyClass] = useState<AccuracyClass>(currentModelConfig.accuracyClass);
  const [modelApprovalNumber, setModelApprovalNumber] = useState(currentModelConfig.modelApprovalNumber);
  const [verificationIntervalValue, setVerificationIntervalValue] = useState<number>(currentModelConfig.verificationIntervalValue);
  const [verificationIntervalUnit, setVerificationIntervalUnit] = useState<VerificationIntervalUnit>(currentModelConfig.verificationIntervalUnit);

  // 2. Max Capacity Input
  const [maxCapacityValue, setMaxCapacityValue] = useState<number>(currentModelConfig.defaultCapacity);
  const [maxCapacityUnit, setMaxCapacityUnit] = useState<CapacityUnit>(currentModelConfig.defaultCapacityUnit);

  // 3. Single Serial Number Input & Validation
  const [serialNumberInput, setSerialNumberInput] = useState('FAC01-2024-DS252-0042');
  const [serialError, setSerialError] = useState('');
  const [showHelperPhoto, setShowHelperPhoto] = useState(false);
  const [isOcrScanning, setIsOcrScanning] = useState(false);
  const [ocrSuccessAlert, setOcrSuccessAlert] = useState(false);

  // 4. Shop Address & Mobile Number (Pre-filled from profile)
  const defaultAddress = currentUser?.zone ? `${currentUser.businessName || 'Shop No. 12'}, Market Area, ${currentUser.district || 'Mumbai Suburban'}` : 'Shop 14, Main Market, Santacruz West';
  const [shopLocation, setShopLocation] = useState(defaultAddress);
  const [district, setDistrict] = useState(currentUser?.district || 'Mumbai Suburban');
  const [pincode, setPincode] = useState('400054');
  const [vendorContact, setVendorContact] = useState('+91 98201 44521');
  const [businessName, setBusinessName] = useState(currentUser?.businessName || 'Sharma Provisions & Daily Mart');
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [gpsSuccessAlert, setGpsSuccessAlert] = useState(false);

  // Accordion for Advanced Technical Details (Hidden/Collapsed by default)
  const [isAdvancedAccordionOpen, setIsAdvancedAccordionOpen] = useState(false);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [registeredInstrument, setRegisteredInstrument] = useState<Instrument | null>(null);

  // Modals & Voice
  const [isVoiceWizardOpen, setIsVoiceWizardOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  // Update technical specs when a machine model is picked from searchable dropdown
  const handleSelectModel = (entry: MachineCatalogEntry) => {
    setSelectedMachineId(entry.id);
    setManufacturer(entry.manufacturer);
    setBrandModel(entry.modelDesignation);
    setCategory(entry.category);
    setAccuracyClass(entry.accuracyClass);
    setModelApprovalNumber(entry.modelApprovalNumber);
    setMaxCapacityValue(entry.defaultCapacity);
    setMaxCapacityUnit(entry.defaultCapacityUnit);
    setVerificationIntervalValue(entry.verificationIntervalValue);
    setVerificationIntervalUnit(entry.verificationIntervalUnit);

    // Update default serial sample to match this model code if currently sample
    const yr = new Date().getFullYear();
    const seq = Math.floor(1000 + Math.random() * 9000).toString();
    const newSerial = `${entry.factoryCodePrefix}-${yr}-${entry.modelCode}-${seq}`;
    setSerialNumberInput(newSerial);
    setSerialError('');

    setIsDropdownOpen(false);
    setModelSearchQuery('');
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-time serial validation
  const validateSerialFormat = (val: string): boolean => {
    const clean = val.trim().toUpperCase();
    if (!clean) {
      setSerialError('Please enter the machine serial number.');
      return false;
    }
    if (!SERIAL_NUMBER_REGEX.test(clean)) {
      setSerialError('Serial format should look like: FAC01-2024-DS252-0042 (found on your machine metallic plate)');
      return false;
    }
    setSerialError('');
    return true;
  };

  const handleSerialChange = (val: string) => {
    const uppercaseVal = val.toUpperCase();
    setSerialNumberInput(uppercaseVal);
    validateSerialFormat(uppercaseVal);
  };

  // Mock Camera OCR Tag Scanner
  const handleMockOcrScan = () => {
    setIsOcrScanning(true);
    setOcrSuccessAlert(false);

    setTimeout(() => {
      setIsOcrScanning(false);
      // Auto-extract scanned serial and match model
      const yr = new Date().getFullYear();
      const detectedSerial = `${currentModelConfig.factoryCodePrefix}-${yr}-${currentModelConfig.modelCode}-${Math.floor(1000 + Math.random() * 9000)}`;
      setSerialNumberInput(detectedSerial);
      setSerialError('');
      setOcrSuccessAlert(true);
      setTimeout(() => setOcrSuccessAlert(false), 4000);
    }, 1200);
  };

  // 1-Click GPS Location Geocoding
  const handleUseCurrentGps = () => {
    setIsLocatingGps(true);
    setGpsSuccessAlert(false);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocatingGps(false);
          const lat = pos.coords.latitude.toFixed(4);
          const lng = pos.coords.longitude.toFixed(4);
          setShopLocation(`Shop counter at GPS (${lat} N, ${lng} E), ${district}`);
          setGpsSuccessAlert(true);
          setTimeout(() => setGpsSuccessAlert(false), 3000);
        },
        () => {
          // Fallback if denied
          setIsLocatingGps(false);
          setShopLocation('Shop 14, Main Bazaar, Santacruz West, Mumbai');
          setGpsSuccessAlert(true);
          setTimeout(() => setGpsSuccessAlert(false), 3000);
        },
        { timeout: 5000 }
      );
    } else {
      setIsLocatingGps(false);
      setShopLocation('Shop 14, Main Bazaar, Santacruz West, Mumbai');
      setGpsSuccessAlert(true);
      setTimeout(() => setGpsSuccessAlert(false), 3000);
    }
  };

  // Calculate equivalent capacity in kg for standard fee logic & verification checks
  const getCapacityInKg = (): number => {
    if (maxCapacityUnit === 'g') return maxCapacityValue / 1000;
    if (maxCapacityUnit === 't') return maxCapacityValue * 1000;
    return maxCapacityValue;
  };
  const capacityKg = getCapacityInKg();

  // Dynamic Stamped Identifier generation based on Legal Metrology Rule 14
  // Format: OIML-IND-[YEAR]-[FACTORY_OR_STATE]-[PROD_ID]-[CLASS_MARK]
  const classCodeLetter = accuracyClass === 'Class I' ? 'S' : accuracyClass === 'Class II' ? 'H' : accuracyClass === 'Class III' ? 'M' : 'O';
  const parts = serialNumberInput.split('-');
  const factoryPart = parts[0] || currentModelConfig.factoryCodePrefix;
  const yearPart = parts[1] || new Date().getFullYear().toString();
  const seqPart = parts[3] || '0042';
  const stampedIdentifier = `OIML-IND-${yearPart}-${factoryPart}-${seqPart}-${classCodeLetter}`;

  // Statutory Fee Calculation based on OIML Class & Capacity
  const calculateStatutoryFee = () => {
    let base = 500;
    if (accuracyClass === 'Class I') base = 2500;
    else if (accuracyClass === 'Class II') base = 1500;
    else if (accuracyClass === 'Class III') {
      base = capacityKg <= 50 ? 500 : capacityKg <= 500 ? 850 : 2000;
    } else if (accuracyClass === 'Class IV') {
      base = capacityKg > 1000 ? 3500 : 400;
    }
    const adminSurcharge = 50;
    const gst18 = Math.round((base + adminSurcharge) * 0.18);
    const total = base + adminSurcharge + gst18;
    return { base, adminSurcharge, gst18, total };
  };

  const fees = calculateStatutoryFee();

  const handleProceedToStep2 = () => {
    const isValid = validateSerialFormat(serialNumberInput);
    if (!isValid) return;
    setStep(2);
  };

  const handleProcessPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      const paymentId = `PAY-UPI-${Math.floor(10000000 + Math.random() * 90000000)}`;

      const newInst = registerInstrument({
        category,
        brandModel,
        serialNumber: serialNumberInput.trim().toUpperCase(),
        capacityKg,
        accuracyClass,
        businessName: businessName || currentUser?.businessName || 'Authorized Merchant',
        vendorName: currentUser?.name || 'Local Merchant',
        vendorContact,
        shopLocation,
        district,
        pincode,
        feePaid: fees.total,
        paymentId,
        manufacturer,
        modelApprovalNumber,
        maxCapacityValue,
        maxCapacityUnit,
        verificationIntervalValue,
        verificationIntervalUnit,
        stampedIdentifier,
      });

      setRegisteredInstrument(newInst);
      setStep(3);
    }, 1400);
  };

  const filteredCatalog = POPULAR_MACHINE_CATALOG.filter(item => 
    item.modelDesignation.toLowerCase().includes(modelSearchQuery.toLowerCase()) ||
    item.manufacturer.toLowerCase().includes(modelSearchQuery.toLowerCase()) ||
    item.friendlyCategory.toLowerCase().includes(modelSearchQuery.toLowerCase()) ||
    item.popularFor.toLowerCase().includes(modelSearchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      <div 
        id="instrument-registration-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
      >
        <div 
          id="instrument-registration-modal-card"
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full my-6 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-base tracking-tight">Register Your Weighing Machine</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Simplified Vendor Form
                  </span>
                </div>
                <p className="text-xs text-indigo-200 mt-0.5">
                  Instant 7-Day Legal Shield • Form-V Government Verification
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="voice-wizard-launch-btn"
                onClick={() => setIsVoiceWizardOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                title="Speak in your mother tongue"
              >
                <Mic className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span className="hidden sm:inline">बोलकर भरें (Voice)</span>
              </button>
              <button
                id="close-registration-modal-btn"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stepper Indicator */}
          <div className="bg-slate-50 border-b border-slate-200 px-5 sm:px-6 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className={`font-semibold flex items-center gap-1.5 ${step === 1 ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  1
                </span>
                Machine Details
              </span>
              <span className="text-slate-300">/</span>
              <span className={`font-semibold flex items-center gap-1.5 ${step === 2 ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  2
                </span>
                Statutory Fee (₹{fees.total})
              </span>
              <span className="text-slate-300">/</span>
              <span className={`font-semibold flex items-center gap-1.5 ${step === 3 ? 'text-emerald-700 font-bold' : 'text-slate-500'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  3
                </span>
                Token Issued
              </span>
            </div>

            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Takes &lt; 60 seconds
            </span>
          </div>

          {/* Form Body */}
          <div className="p-5 sm:p-6 overflow-y-auto max-h-[72vh] space-y-5">
            {step === 1 && (
              <div className="space-y-5">

                {/* 1. Searchable Machine Model Selector */}
                <div className="space-y-1.5" ref={dropdownRef}>
                  <label className="text-xs font-bold text-slate-900 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-indigo-600" />
                      <span>1. Select Machine Make & Model</span>
                      <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-[11px] font-normal text-slate-500">
                      Auto-fills approval & accuracy class
                    </span>
                  </label>

                  {/* Dropdown Input / Selected Trigger */}
                  <div className="relative">
                    <button
                      type="button"
                      id="machine-model-dropdown-trigger"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full px-3.5 py-3 text-left bg-white border border-slate-300 hover:border-indigo-500 rounded-xl flex items-center justify-between transition shadow-2xs group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0 text-xs">
                          {currentModelConfig.modelDesignation.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="truncate">
                          <span className="font-bold text-slate-900 text-xs block group-hover:text-indigo-700">
                            {currentModelConfig.modelDesignation}
                          </span>
                          <span className="text-[11px] text-slate-500 block truncate">
                            {currentModelConfig.manufacturer} • {currentModelConfig.accuracyClassLabel}
                          </span>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Searchable Options Popover */}
                    {isDropdownOpen && (
                      <div className="absolute z-20 top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in duration-150">
                        {/* Search Input */}
                        <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                          <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                          <input
                            type="text"
                            placeholder="Type to search (e.g., Essae, Phoenix, Gold Scale)..."
                            value={modelSearchQuery}
                            onChange={(e) => setModelSearchQuery(e.target.value)}
                            className="w-full text-xs bg-transparent border-none focus:outline-none text-slate-800 placeholder:text-slate-400 py-1"
                            autoFocus
                          />
                        </div>

                        {/* List of Models */}
                        <div className="max-h-56 overflow-y-auto divide-y divide-slate-100">
                          {filteredCatalog.length > 0 ? (
                            filteredCatalog.map(item => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => handleSelectModel(item)}
                                className={`w-full p-2.5 text-left hover:bg-indigo-50/70 transition flex items-center justify-between cursor-pointer ${
                                  item.id === selectedMachineId ? 'bg-indigo-50/90 font-bold' : ''
                                }`}
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-900">{item.modelDesignation}</span>
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 font-mono">
                                      {item.defaultCapacity} {item.defaultCapacityUnit}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-500 mt-0.5">
                                    {item.friendlyCategory} • Best for: {item.popularFor}
                                  </div>
                                </div>
                                {item.id === selectedMachineId && (
                                  <Check className="w-4 h-4 text-indigo-600 shrink-0 ml-2" />
                                )}
                              </button>
                            ))
                          ) : (
                            <div className="p-4 text-center text-xs text-slate-500">
                              No machine model matches "{modelSearchQuery}".
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Friendly Selected Badge */}
                  <div className="flex items-center justify-between text-[11px] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                    <span className="text-slate-600">
                      Category: <strong className="text-slate-800">{currentModelConfig.friendlyCategory}</strong>
                    </span>
                    <span className="text-indigo-700 font-semibold">
                      Class: {currentModelConfig.accuracyClassLabel}
                    </span>
                  </div>
                </div>

                {/* 2. Single Serial Number Input + Camera OCR Button */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="serial-number-single-input" className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>2. Complete Serial Number</span>
                      <span className="text-rose-500">*</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowHelperPhoto(!showHelperPhoto)}
                      className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{showHelperPhoto ? 'Hide Photo Guide' : 'Where is my Serial No.?'}</span>
                    </button>
                  </div>

                  {/* Input Row with Camera OCR Button */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        id="serial-number-single-input"
                        type="text"
                        value={serialNumberInput}
                        onChange={(e) => handleSerialChange(e.target.value)}
                        placeholder="e.g. FAC01-2024-DS252-0042"
                        className={`w-full px-3.5 py-2.5 text-xs font-mono font-bold bg-white border rounded-xl focus:outline-none tracking-wide uppercase transition ${
                          serialError ? 'border-rose-400 bg-rose-50/20 text-rose-900' : 'border-slate-300 focus:border-indigo-600 text-slate-900'
                        }`}
                      />
                      {!serialError && serialNumberInput && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3 top-3" />
                      )}
                    </div>

                    {/* Scan Tag with Camera Button */}
                    <button
                      type="button"
                      id="scan-tag-camera-btn"
                      onClick={handleMockOcrScan}
                      disabled={isOcrScanning}
                      className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shrink-0 cursor-pointer shadow-xs disabled:opacity-50"
                      title="Point phone camera to metallic serial tag on scale"
                    >
                      {isOcrScanning ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                          <span>Scanning Tag...</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4 text-amber-400" />
                          <span>Scan Tag</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Helper Photo Guide Banner */}
                  {showHelperPhoto && (
                    <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2 text-xs text-indigo-950 animate-in fade-in duration-200">
                      <div className="flex items-start gap-2.5">
                        <div className="w-16 h-16 rounded-lg bg-slate-800 border border-slate-700 text-white flex flex-col items-center justify-center p-1 text-center shrink-0">
                          <span className="text-[8px] uppercase tracking-wider text-slate-400 font-mono">PLATE</span>
                          <span className="text-[10px] font-bold text-amber-300 font-mono">FAC01-24</span>
                          <span className="text-[8px] text-emerald-400 font-mono">DS252-0042</span>
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-bold text-xs text-indigo-900">How to find your Serial Number:</h5>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            Look at the <strong>metallic aluminium plate</strong> or barcode sticker stamped on the side or underneath your machine. It shows the factory code, year, model code, and production number.
                          </p>
                          <span className="inline-block text-[10px] font-mono text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                            Example: FAC01-2024-DS252-0042
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {ocrSuccessAlert && (
                    <div className="p-2 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-900 flex items-center gap-1.5 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Tag detected! Auto-filled serial number: <strong>{serialNumberInput}</strong></span>
                    </div>
                  )}

                  {serialError ? (
                    <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{serialError}</span>
                    </p>
                  ) : (
                    <p className="text-[10px] text-slate-400">
                      Standard format: [Factory Code]-[Year]-[Model]-[Sequence ID]
                    </p>
                  )}
                </div>

                {/* 3. Max Capacity Input */}
                <div className="space-y-1.5">
                  <label htmlFor="max-capacity-single-input" className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>3. Max Weight Capacity</span>
                    <span className="text-rose-500">*</span>
                  </label>

                  <div className="flex gap-2">
                    <input
                      id="max-capacity-single-input"
                      type="number"
                      min={0.001}
                      step="any"
                      value={maxCapacityValue}
                      onChange={(e) => setMaxCapacityValue(parseFloat(e.target.value) || 0)}
                      className="flex-1 px-3.5 py-2.5 text-xs font-bold bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 text-slate-900"
                      placeholder="e.g. 30"
                    />
                    <select
                      id="max-capacity-unit-selector"
                      value={maxCapacityUnit}
                      onChange={(e) => setMaxCapacityUnit(e.target.value as CapacityUnit)}
                      className="w-28 px-3 py-2.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 text-indigo-900 cursor-pointer"
                    >
                      <option value="kg">kg (Kilogram)</option>
                      <option value="g">g (Gram)</option>
                      <option value="t">t (Tonne)</option>
                    </select>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Equivalent capacity: <strong className="text-slate-700">{capacityKg} kg</strong> (Used to calculate standard government inspection fee).
                  </span>
                </div>

                {/* 4. Shop Address & Mobile (Pre-filled from Profile + 1-Click GPS) */}
                <div className="space-y-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-indigo-600" />
                      <span>4. Shop Address & Contact Mobile</span>
                    </span>

                    {/* 1-Click GPS Button */}
                    <button
                      type="button"
                      id="use-gps-location-btn"
                      onClick={handleUseCurrentGps}
                      disabled={isLocatingGps}
                      className="text-[11px] text-indigo-700 hover:text-indigo-900 font-semibold bg-white hover:bg-indigo-50 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1 transition cursor-pointer shadow-2xs disabled:opacity-50"
                    >
                      {isLocatingGps ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
                          <span>Getting GPS...</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3 h-3 text-rose-500" />
                          <span>Use Current GPS</span>
                        </>
                      )}
                    </button>
                  </div>

                  {gpsSuccessAlert && (
                    <div className="p-1.5 bg-emerald-50 border border-emerald-200 rounded text-[11px] text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>GPS location captured and verified!</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label htmlFor="shop-address-field" className="text-[10px] font-medium text-slate-600 block mb-0.5">
                        Shop Address (Counter Location)
                      </label>
                      <input
                        id="shop-address-field"
                        type="text"
                        value={shopLocation}
                        onChange={(e) => setShopLocation(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                        placeholder="Shop Address"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-mobile-field" className="text-[10px] font-medium text-slate-600 block mb-0.5">
                        Mobile Number for SMS & WhatsApp Token
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        <input
                          id="contact-mobile-field"
                          type="text"
                          value={vendorContact}
                          onChange={(e) => setVendorContact(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                          placeholder="+91 98201 XXXXX"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Collapsible Accordion: Advanced Technical Details (Auto-Filled) */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <button
                    type="button"
                    id="toggle-advanced-specs-accordion"
                    onClick={() => setIsAdvancedAccordionOpen(!isAdvancedAccordionOpen)}
                    className="w-full px-4 py-2.5 bg-slate-100/70 hover:bg-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Advanced Technical Details (Auto-Filled from Manufacturer Lookup)</span>
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <span>{isAdvancedAccordionOpen ? 'Hide' : 'Show'}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAdvancedAccordionOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {isAdvancedAccordionOpen && (
                    <div className="p-4 bg-slate-50/50 space-y-3 border-t border-slate-200 text-xs animate-in fade-in duration-150">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-slate-700">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">OIML Accuracy Class:</span>
                          <span className="font-bold text-indigo-800">{accuracyClass}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Model Approval No.:</span>
                          <span className="font-mono font-bold text-slate-800">{modelApprovalNumber}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">OIML e-Value (Interval):</span>
                          <span className="font-mono font-bold text-slate-800">{verificationIntervalValue} {verificationIntervalUnit}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Manufacturer:</span>
                          <span className="font-semibold text-slate-800 truncate block">{manufacturer}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Rule 14 Stamped Identifier:</span>
                          <span className="font-mono font-bold text-amber-700">{stampedIdentifier}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                        These parameters are derived under Legal Metrology General Rules 2011 Rule 24 and will be recorded in the official government registry.
                      </p>
                    </div>
                  )}
                </div>

                {/* Step 1 Footer Action */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                  <div className="text-xs text-slate-600">
                    Statutory Fee: <strong className="text-emerald-700 font-extrabold">₹{fees.total}</strong> (incl. 18% GST)
                  </div>

                  <button
                    type="button"
                    id="proceed-to-fee-btn"
                    onClick={handleProceedToStep2}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm cursor-pointer"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Fee Schedule & Digital Payment */}
            {step === 2 && (
              <div className="space-y-5">
                {/* Fee Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                        Statutory Verification Fee Schedule
                      </h4>
                    </div>
                    <span className="text-xs text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded font-mono">
                      {brandModel} • {maxCapacityValue} {maxCapacityUnit}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Base Legal Metrology Fee ({currentModelConfig.friendlyCategory}):</span>
                      <span className="font-semibold text-slate-800">₹{fees.base}.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Digital Portal & Holographic Sticker Surcharge:</span>
                      <span className="font-semibold text-slate-800">₹{fees.adminSurcharge}.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST @ 18% (Statutory Metrology Services):</span>
                      <span className="font-semibold text-slate-800">₹{fees.gst18}.00</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                      <span>Total Statutory Payable Amount:</span>
                      <span className="text-emerald-700 font-black text-base">₹{fees.total}.00</span>
                    </div>
                  </div>
                </div>

                {/* Machine Summary Pill */}
                <div className="bg-white border border-slate-200 rounded-xl p-3 text-xs flex items-center justify-between shadow-2xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{brandModel}</span>
                    <span className="text-[11px] font-mono text-indigo-700">Serial: {serialNumberInput}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                    Rule 14 Compliant
                  </span>
                </div>

                {/* Payment Methods */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Select Digital Payment Channel
                  </h4>

                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      id="payment-upi-btn"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'upi'
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <QrCode className="w-5 h-5 text-indigo-600" />
                      <span className="text-xs">UPI / QR Code</span>
                    </button>

                    <button
                      type="button"
                      id="payment-netbanking-btn"
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'netbanking'
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <Building2 className="w-5 h-5 text-indigo-600" />
                      <span className="text-xs">NetBanking</span>
                    </button>

                    <button
                      type="button"
                      id="payment-card-btn"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-indigo-600" />
                      <span className="text-xs">Debit / Card</span>
                    </button>
                  </div>

                  {/* Payment Simulator Box */}
                  <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Bharat BillPay / NPCI Mock Gateway</span>
                      <span className="text-emerald-400 font-mono">256-Bit SSL Secured</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-800/80 p-3 rounded-lg">
                      <div className="w-16 h-16 bg-white rounded-lg p-1 flex flex-col items-center justify-center shrink-0">
                        <QrCode className="w-12 h-12 text-slate-900" />
                        <span className="text-[6px] text-slate-600 font-bold">BHIM UPI</span>
                      </div>
                      <div className="text-xs space-y-0.5">
                        <p className="font-semibold text-white">Scan via Google Pay, PhonePe, or Paytm</p>
                        <p className="text-slate-400 text-[11px]">
                          VPA: <span className="font-mono text-indigo-300">legalmetrology.mah@sbi</span>
                        </p>
                        <p className="text-amber-300 text-[11px] font-medium">
                          Instant 7-Day legal shield issued upon payment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    id="back-to-specs-btn"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Back to Form
                  </button>

                  <button
                    type="button"
                    id="authorize-payment-btn"
                    onClick={handleProcessPayment}
                    disabled={isProcessingPayment}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-sm cursor-pointer"
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Confirming with Bank Gateway...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Pay ₹{fees.total}.00 & Generate Token</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Success & Active Token */}
            {step === 3 && registeredInstrument && (
              <div className="text-center py-6 space-y-5">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Statutory Registration & Payment Complete!
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Your 7-Day Provisional Token is active immediately. You are legally protected from inspection fines or seizures under Rule 14.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-left max-w-lg mx-auto space-y-2.5">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Token ID:</span>
                    <span className="font-mono font-bold text-slate-900">{registeredInstrument.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Serial Number:</span>
                    <span className="font-mono font-bold text-indigo-700">{registeredInstrument.serialNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Make & Model:</span>
                    <span className="font-semibold text-slate-800">{registeredInstrument.brandModel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Model Approval:</span>
                    <span className="font-mono text-slate-800">{registeredInstrument.modelApprovalNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Official Stamped ID:</span>
                    <span className="font-mono text-amber-700 font-bold">{registeredInstrument.stampedIdentifier || stampedIdentifier}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200">
                    <span className="text-slate-500">Legal Protection Period:</span>
                    <span className="font-bold text-emerald-700">{registeredInstrument.provisionalTokenExpiry} (7 Days)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assigned Inspector:</span>
                    <span className="font-semibold text-slate-800">{registeredInstrument.assignedInspectorName}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    id="view-provisional-token-modal-btn"
                    onClick={() => setIsTokenModalOpen(true)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>View Official Form V Token</span>
                  </button>

                  <button
                    type="button"
                    id="return-dashboard-btn"
                    onClick={onClose}
                    className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Voice Wizard & Token Viewers */}
      <VoiceWizard
        isOpen={isVoiceWizardOpen}
        onClose={() => setIsVoiceWizardOpen(false)}
        onRegisteredSuccess={(inst) => {
          setIsVoiceWizardOpen(false);
          setRegisteredInstrument(inst);
          setStep(3);
        }}
      />

      {registeredInstrument && (
        <ProvisionalTokenModal
          instrument={registeredInstrument}
          isOpen={isTokenModalOpen}
          onClose={() => setIsTokenModalOpen(false)}
        />
      )}
    </>
  );
};
