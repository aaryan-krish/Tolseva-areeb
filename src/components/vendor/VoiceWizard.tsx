import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Check, 
  Sparkles, 
  X, 
  ArrowRight, 
  RefreshCw,
  HelpCircle,
  Globe,
  Scale,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  FileText,
  Building2,
  Zap,
  PhoneCall
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { useTolSeva } from '../../context/TolSevaContext';
import { AccuracyClass, Instrument } from '../../types';

export type SupportedLanguage = 'hi' | 'mr' | 'gu' | 'bn' | 'ta' | 'te' | 'pa' | 'en';

interface LanguageConfig {
  code: SupportedLanguage;
  speechLocale: string;
  name: string;
  nativeName: string;
  flag: string;
  welcomePrompt: string;
  listeningPrompt: string;
  speakInstructions: string;
  samplePlaceholder: string;
  samples: Array<{ label: string; phrase: string; weight: number; fee: number }>;
  ticketTitle: string;
  gatewayNotice: string;
  paySuccessAudio: string;
  soundboxText: string;
}

const LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  hi: {
    code: 'hi',
    speechLocale: 'hi-IN',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    welcomePrompt: 'नमस्ते! अपने तोलने वाले कांटे का नाम और वजन बताएं, जैसे: "एसए डिजिटल तीस किलो" या "किराना कांटा पंद्रह किलो"।',
    listeningPrompt: 'सुन रहा हूँ... बोलिए...',
    speakInstructions: 'कांटे का नाम और वजन (किलो) बोलें',
    samplePlaceholder: 'उदाहरण: एसए डिजिटल 30 किलो',
    samples: [
      { label: 'किराना डिजिटल कांटा (30 kg)', phrase: 'किराना दुकान का एसए डिजिटल कांटा तीस किलो', weight: 30, fee: 649 },
      { label: 'सब्जी मंडी प्लेटफॉर्म (100 kg)', phrase: 'सब्जी मंडी का फीनिक्स प्लेटफॉर्म तराजू सौ किलो', weight: 100, fee: 1062 },
      { label: 'एवरी बेंच स्केल (50 kg)', phrase: 'एवरी बेंच कांटा पचास किलो क्षमता', weight: 50, fee: 649 },
      { label: 'ज्वेलरी सोना कांटा (2 kg)', phrase: 'सोने की दुकान का प्रिसिजन कांटा दो किलो', weight: 2, fee: 1829 },
    ],
    ticketTitle: 'सत्यापन चालान टिकट तैयार',
    gatewayNotice: 'चालान बन गया है। कानूनी सुरक्षा हेतु भुगतान पूरा करें।',
    paySuccessAudio: 'बधाई हो! टोलसेवा पर ₹{amount} प्राप्त हुए। आपका 7-दिवसीय फॉर्म V प्रोविजनल टोकन जारी कर दिया गया है।',
    soundboxText: 'टोलसेवा साउंडबॉक्स: ₹{amount} का भुगतान सफल!',
  },
  mr: {
    code: 'mr',
    speechLocale: 'mr-IN',
    name: 'Marathi',
    nativeName: 'मराठी',
    flag: '🇮🇳',
    welcomePrompt: 'नमस्कार! आपल्या वजन काट्याचे नाव आणि वजन सांगा, उदा: "किराणा काटा ३० किलो" किंवा "प्लॅटफॉर्म तराजू १०० किलो".',
    listeningPrompt: 'ऐकत आहे... बोला...',
    speakInstructions: 'काट्याचे नाव व वजन (किलो) सांगा',
    samplePlaceholder: 'उदा: एसए डिजिटल ३० किलो',
    samples: [
      { label: 'किराणा काटा (30 kg)', phrase: 'किराणा दुकानाचा एसए काटा तीस किलो', weight: 30, fee: 649 },
      { label: 'मार्केट प्लॅटफॉर्म (100 kg)', phrase: 'मार्केटचा फीनिक्स प्लॅटफॉर्म काटा शंभर किलो', weight: 100, fee: 1062 },
      { label: 'एव्हरी बेंच काटा (50 kg)', phrase: 'एव्हरी बेंच काटा पन्नास किलो', weight: 50, fee: 649 },
    ],
    ticketTitle: 'पडताळणी चलन तिकीट तयार',
    gatewayNotice: 'चलन तयार झाले आहे. कायदेशीर संरक्षणासाठी पेमेंट पूर्ण करा.',
    paySuccessAudio: 'अभिनंदन! टोलसेवा वर ₹{amount} प्राप्त झाले. आपले ७ दिवसांचे फॉर्म V प्रोव्हिजनल टोकन सक्रिय झाले आहे.',
    soundboxText: 'टोलसेवा साउंडबॉक्स: ₹{amount} पेमेंट यशस्वी!',
  },
  gu: {
    code: 'gu',
    speechLocale: 'gu-IN',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    flag: '🇮🇳',
    welcomePrompt: 'નમસ્તે! તમારા વજન કાંટાનું નામ અને ક્ષમતા બોલો, જેમ કે: "કરિયાણા કાંટો ૩૦ કિલો".',
    listeningPrompt: 'સાંભળી રહ્યો છું... બોલો...',
    speakInstructions: 'કાંટાનું નામ અને વજન બોલો',
    samplePlaceholder: 'દા.ત.: એસએ ડિજિટલ ૩૦ કિલો',
    samples: [
      { label: 'કરિયાણા કાંટો (30 kg)', phrase: 'કરિયાણા દુકાનનો એસએ કાંટો ત્રીસ કિલો', weight: 30, fee: 649 },
      { label: 'પ્લેટફોર્મ કાંટો (100 kg)', phrase: 'માર્કેટનો પ્લેટફોર્મ કાંટો સો કિલો', weight: 100, fee: 1062 },
    ],
    ticketTitle: 'ચલણ ટિકિટ તૈયાર',
    gatewayNotice: 'ચલણ તૈયાર થઈ ગયું છે. કાયદાકીય સુરક્ષા માટે પેમેન્ટ કરો.',
    paySuccessAudio: 'અભિનંદન! ટોલસેવા પર ₹{amount} જમા થયા. તમારું ૭-દિવસીય ફોર્મ V ટોકન જારી થયું છે.',
    soundboxText: 'ટોલસેવા સાઉન્ડબોક્સ: ₹{amount} સફળ!',
  },
  bn: {
    code: 'bn',
    speechLocale: 'bn-IN',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇮🇳',
    welcomePrompt: 'নমস্কার! আপনার ওজন মেশিনের নাম এবং ওজন বলুন, যেমন: "মুদি দোকান স্কেল ৩০ কেজি"।',
    listeningPrompt: 'শুনছি... বলুন...',
    speakInstructions: 'মেশিনের নাম ও ওজন (কেজি) বলুন',
    samplePlaceholder: 'যেমন: এসএ ডিজিটাল ৩০ কেজি',
    samples: [
      { label: 'দোকান স্কেল (30 kg)', phrase: 'দোকানের এসএ ডিজিটাল স্কেল ৩০ কেজি', weight: 30, fee: 649 },
      { label: 'প্ল্যাটফর্ম স্কেল (100 kg)', phrase: 'মার্কেট প্ল্যাটফর্ম স্কেল ১০০ কেজি', weight: 100, fee: 1062 },
    ],
    ticketTitle: 'চালান টিকিট প্রস্তুত',
    gatewayNotice: 'চালান তৈরি হয়েছে। আইনি সুরক্ষার জন্য পেমেন্ট করুন।',
    paySuccessAudio: 'অভিনন্দন! টোলসেবায় ₹{amount} প্রাপ্ত হয়েছে। আপনার ৭ দিনের ফর্ম V টিকিট সক্রিয়।',
    soundboxText: 'টোলসেবা সাউন্ডবক্স: ₹{amount} সফল!',
  },
  ta: {
    code: 'ta',
    speechLocale: 'ta-IN',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
    welcomePrompt: 'வணக்கம்! உங்கள் எடை இயந்திரத்தின் பெயர் மற்றும் எடையைக் கூறுங்கள்.',
    listeningPrompt: 'கேட்கிறது... பேசுங்கள்...',
    speakInstructions: 'இயந்திர பெயர் மற்றும் எடை சொல்லுங்கள்',
    samplePlaceholder: 'எ.கா: எஸ்ஸே டிஜிட்டல் 30 கிலோ',
    samples: [
      { label: 'கடை எடை மெஷின் (30 kg)', phrase: 'கடை எஸ்ஸே டிஜிட்டல் முப்பது கிலோ', weight: 30, fee: 649 },
      { label: 'பிளாட்ஃபார்ம் மெஷின் (100 kg)', phrase: 'பிளாட்ஃபார்ம் மெஷின் நூறு கிலோ', weight: 100, fee: 1062 },
    ],
    ticketTitle: 'கட்டண டிக்கெட் தயார்',
    gatewayNotice: 'டிக்கெட் தயாராகிவிட்டது. சட்டப்பூர்வ பாதுகாப்பிற்கு பணம் செலுத்தவும்.',
    paySuccessAudio: 'வாழ்த்துகள்! டோல்சேவாவில் ₹{amount} பெறப்பட்டது. உங்கள் 7 நாள் ஃபார்ம் V டோக்கன் தயார்.',
    soundboxText: 'டோல்சேவா சவுண்ட்பாக்ஸ்: ₹{amount} பெற்றது!',
  },
  te: {
    code: 'te',
    speechLocale: 'te-IN',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🇮🇳',
    welcomePrompt: 'నమస్కారం! మీ బరువు యంత్రం పేరు మరియు కెపాసిటీ చెప్పండి.',
    listeningPrompt: 'వింటున్నాను... మాట్లాడండి...',
    speakInstructions: 'యంత్రం పేరు మరియు బరువు చెప్పండి',
    samplePlaceholder: 'ఉదా: ఎస్సే డిజిటల్ 30 కిలోలు',
    samples: [
      { label: 'కిరాణా స్కేల్ (30 kg)', phrase: 'కిరాణా కొట్టు ఎస్సే డిజిటల్ ముప్పై కిలోలు', weight: 30, fee: 649 },
      { label: 'ప్లాట్‌ఫారమ్ స్కేల్ (100 kg)', phrase: 'ప్లాట్‌ఫారమ్ స్కేల్ వంద కిలోలు', weight: 100, fee: 1062 },
    ],
    ticketTitle: 'చలాన్ టికెట్ సిద్ధం',
    gatewayNotice: 'చలాన్ సిద్ధమైంది. చట్టపరమైన రక్షణ కొరకు చెల్లింపు చేయండి.',
    paySuccessAudio: 'అభినందనలు! టోల్‌సేవాలో ₹{amount} స్వీకరించబడింది. మీ 7 రోజుల ఫారం V టోకెన్ యాక్టివేట్ అయ్యింది.',
    soundboxText: 'టోల్‌సేవా సౌండ్‌బాక్స్: ₹{amount} చెల్లింపు విజయవంతం!',
  },
  pa: {
    code: 'pa',
    speechLocale: 'pa-IN',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    flag: '🇮🇳',
    welcomePrompt: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਆਪਣੇ ਕੰਡੇ ਦਾ ਨਾਮ ਅਤੇ ਵਜ਼ਨ ਦੱਸੋ, ਜਿਵੇਂ: "ਦੁਕਾਨ ਕੰਡਾ 30 ਕਿਲੋ"।',
    listeningPrompt: 'ਸੁਣ ਰਿਹਾ ਹਾਂ... ਬੋਲੋ...',
    speakInstructions: 'ਮਸ਼ੀਨ ਦਾ ਨਾਮ ਅਤੇ ਵਜ਼ਨ (ਕਿਲੋ) ਬੋਲੋ',
    samplePlaceholder: 'ਜਿਵੇਂ: ਐੱਸਏ ਡਿਜੀਟਲ 30 ਕਿਲੋ',
    samples: [
      { label: 'ਦੁਕਾਨ ਕੰਡਾ (30 kg)', phrase: 'ਦੁਕਾਨ ਦਾ ਐੱਸਏ ਡਿਜੀਟਲ ਕੰਡਾ ਤੀਹ ਕਿਲੋ', weight: 30, fee: 649 },
      { label: 'ਮੰਡੀ ਪਲੇਟਫਾਰਮ (100 kg)', phrase: 'ਮੰਡੀ ਦਾ ਪਲੇਟਫਾਰਮ ਕੰਡਾ ਸੌ ਕਿਲੋ', weight: 100, fee: 1062 },
    ],
    ticketTitle: 'ਚਲਾਨ ਟਿਕਟ ਤਿਆਰ',
    gatewayNotice: 'ਟਿਕਟ ਬਣ ਗਈ ਹੈ। ਕਾਨੂੰਨੀ ਸੁਰੱਖਿਆ ਲਈ ਭੁਗਤਾਨ ਕਰੋ।',
    paySuccessAudio: 'ਵਧਾਈਆਂ! ਟੋਲਸੇਵਾ ਤੇ ₹{amount} ਪ੍ਰਾਪਤ ਹੋਏ। ਤੁਹਾਡਾ 7-ਦਿਨਾਂ ਫਾਰਮ V ਟੋਕਨ ਜਾਰੀ ਹੋ ਗਿਆ ਹੈ।',
    soundboxText: 'ਟੋਲਸੇਵਾ ਸਾਊਂਡਬਾਕਸ: ₹{amount} ਸਫਲ!',
  },
  en: {
    code: 'en',
    speechLocale: 'en-IN',
    name: 'English',
    nativeName: 'English (IN)',
    flag: '🇮🇳',
    welcomePrompt: 'Welcome to TolSeva! Just say your weighing machine name and weight category, for example: "Essae Counter Scale 30 kg".',
    listeningPrompt: 'Listening to your voice...',
    speakInstructions: 'Say machine name and weight category (kg)',
    samplePlaceholder: 'e.g., Essae Digital Counter Scale 30 kg',
    samples: [
      { label: 'Grocery Counter Scale (30 kg)', phrase: 'Essae Digital Counter Scale thirty kilograms', weight: 30, fee: 649 },
      { label: 'Mandi Platform Scale (100 kg)', phrase: 'Phoenix heavy platform scale one hundred kg', weight: 100, fee: 1062 },
      { label: 'Avery Bench Scale (50 kg)', phrase: 'Avery commercial bench scale fifty kg', weight: 50, fee: 649 },
      { label: 'Jeweller Gold Scale (2 kg)', phrase: 'Precision gold balance two kilograms', weight: 2, fee: 1829 },
    ],
    ticketTitle: 'Verification Ticket Generated',
    gatewayNotice: 'Ticket generated. Complete statutory fee to activate 7-day legal shield.',
    paySuccessAudio: 'Congratulations! Payment of ₹{amount} received on TolSeva. Your 7-day Form V provisional token is active.',
    soundboxText: 'TolSeva Soundbox: Payment of ₹{amount} received!',
  },
};

interface ParsedVoiceTicket {
  ticketNumber: string;
  machineName: string;
  weightCategoryKg: number;
  category: string;
  accuracyClass: AccuracyClass;
  statutoryFee: number;
  confirmationSpeech: string;
  serialNumber: string;
  manufacturer?: string;
  modelApprovalNumber?: string;
  verificationIntervalValue?: number;
  verificationIntervalUnit?: 'mg' | 'g' | 'kg';
  stampedIdentifier?: string;
}

interface VoiceWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onFillFormData?: (data: {
    category: string;
    brandModel: string;
    capacityKg: number;
    serialNumber: string;
    accuracyClass: AccuracyClass;
    manufacturer?: string;
    modelApprovalNumber?: string;
    verificationIntervalValue?: number;
    verificationIntervalUnit?: 'mg' | 'g' | 'kg';
    stampedIdentifier?: string;
  }) => void;
  onRegisteredSuccess?: (instrument: Instrument) => void;
}

export const VoiceWizard: React.FC<VoiceWizardProps> = ({
  isOpen,
  onClose,
  onFillFormData,
  onRegisteredSuccess,
}) => {
  const { registerInstrument, currentUser, vendorLanguage, setVendorLanguage } = useTolSeva();

  // Wizard Stage:
  // 'listen' -> listening to vendor's voice
  // 'ticket' -> automatically generated ticket with countdown to payment
  // 'payment' -> payment gateway with UPI QR & one-click pay
  // 'success' -> Form V provisional token issued
  const [stage, setStage] = useState<'listen' | 'ticket' | 'payment' | 'success'>('listen');

  const [language, setLanguage] = useState<SupportedLanguage>(() => (vendorLanguage as SupportedLanguage) || 'hi');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Synchronize language when vendorLanguage changes
  useEffect(() => {
    if (vendorLanguage) {
      setLanguage(vendorLanguage as SupportedLanguage);
    }
  }, [vendorLanguage, isOpen]);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Generated Ticket State
  const [ticketData, setTicketData] = useState<ParsedVoiceTicket | null>(null);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'upi_qr' | 'gpay' | 'phonepe' | 'paytm' | 'cash_audit'>('upi_qr');
  const [isPaying, setIsPaying] = useState(false);
  const [soundboxAlert, setSoundboxAlert] = useState(false);
  const [createdInstrument, setCreatedInstrument] = useState<Instrument | null>(null);

  // Auto redirect timer countdown
  const [countdown, setCountdown] = useState<number>(3);

  // Web Speech API recognition reference
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const langConfig = LANGUAGES[language];

  // Speech Synthesis Helper
  const speak = (text: string) => {
    if (!soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langConfig.speechLocale;
      utterance.rate = 0.93;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis unavailable:', e);
    }
  };

  // Welcome prompt on open or language switch
  useEffect(() => {
    if (isOpen && stage === 'listen') {
      speak(langConfig.welcomePrompt);
    }
  }, [isOpen, language, stage]);

  // Handle countdown from ticket -> payment
  useEffect(() => {
    let timer: any;
    if (stage === 'ticket' && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (stage === 'ticket' && countdown === 0) {
      goToPaymentGateway();
    }
    return () => clearTimeout(timer);
  }, [stage, countdown]);

  // Clean up on close
  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsListening(false);
      setTranscript('');
      setStage('listen');
      setTicketData(null);
      setCreatedInstrument(null);
      setSoundboxAlert(false);
      setCountdown(3);
    }
  }, [isOpen]);

  // Process free-form spoken text
  const handleProcessSpeech = async (spokenText: string) => {
    if (!spokenText.trim()) return;
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/voice/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          speechText: spokenText,
          language,
        }),
      });

      const data = await response.json();
      if (data.success) {
        const ticketNum = `TOL-VOICE-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
        const currentYr = new Date().getFullYear();
        const fallbackSerial = `FAC01-${currentYr}-DS252-${Math.floor(1000 + Math.random() * 9000)}`;

        const parsedTicket: ParsedVoiceTicket = {
          ticketNumber: ticketNum,
          machineName: data.machineName || 'Essae Digital Counter Scale',
          weightCategoryKg: data.weightCategoryKg || 30,
          category: data.category || 'Electronic Counter Scale',
          accuracyClass: (data.accuracyClass as AccuracyClass) || 'Class III',
          statutoryFee: data.statutoryFee || 649,
          confirmationSpeech: data.confirmationSpeech || `मशीन '${data.machineName}', क्षमता ${data.weightCategoryKg} kg दर्ज।`,
          serialNumber: data.serialNumber || fallbackSerial,
          manufacturer: data.manufacturer || 'Essae-Teraoka Pvt. Ltd.',
          modelApprovalNumber: data.modelApprovalNumber || 'IND/09/2022/418',
          verificationIntervalValue: data.verificationIntervalValue || 5,
          verificationIntervalUnit: data.verificationIntervalUnit || 'g',
          stampedIdentifier: data.stampedIdentifier || `OIML-IND-${currentYr}-FAC01-0042-M`,
        };

        setTicketData(parsedTicket);
        setStage('ticket');
        setCountdown(3);

        // Speak the confirmation and notice about payment gateway
        const voiceAck = `${parsedTicket.confirmationSpeech} ${langConfig.gatewayNotice}`;
        speak(voiceAck);
      } else {
        throw new Error(data.error || 'Unable to parse speech');
      }
    } catch (err: any) {
      console.warn('Backend parse error, falling back locally:', err);
      // Local client-side fallback
      const weightMatch = spokenText.match(/\d+/);
      const detectedWeight = weightMatch ? parseInt(weightMatch[0], 10) : 30;
      const currentYr = new Date().getFullYear();
      const seqId = Math.floor(1000 + Math.random() * 9000).toString();
      const accuracyCls: AccuracyClass = detectedWeight <= 2 ? 'Class II' : detectedWeight > 300 ? 'Class IV' : 'Class III';
      const classCode = accuracyCls === 'Class II' ? 'H' : accuracyCls === 'Class IV' ? 'O' : 'M';

      const parsedTicket: ParsedVoiceTicket = {
        ticketNumber: `TOL-VOICE-${currentYr}-${Math.floor(10000 + Math.random() * 90000)}`,
        machineName: detectedWeight > 50 ? 'Phoenix Bench Scale' : 'Essae DS-252 Counter Scale',
        weightCategoryKg: detectedWeight,
        category: detectedWeight > 50 ? 'Platform Scale' : 'Electronic Counter Scale',
        accuracyClass: accuracyCls,
        statutoryFee: detectedWeight > 50 ? 1062 : 649,
        confirmationSpeech: `मशीन और वजन ${detectedWeight} किलो दर्ज कर लिया गया है।`,
        serialNumber: `FAC01-${currentYr}-${detectedWeight > 50 ? 'PF100' : 'DS252'}-${seqId}`,
        manufacturer: detectedWeight > 50 ? 'Phoenix Scales Pvt. Ltd.' : 'Essae-Teraoka Pvt. Ltd.',
        modelApprovalNumber: detectedWeight > 50 ? 'IND/09/2022/330' : 'IND/09/2022/418',
        verificationIntervalValue: detectedWeight > 50 ? 20 : 5,
        verificationIntervalUnit: 'g',
        stampedIdentifier: `OIML-IND-${currentYr}-FAC01-${seqId}-${classCode}`,
      };
      setTicketData(parsedTicket);
      setStage('ticket');
      setCountdown(3);
      speak(langConfig.gatewayNotice);
    } finally {
      setIsProcessing(false);
      setIsListening(false);
    }
  };

  // Start real browser speech recognition with fallback
  const startListening = () => {
    setErrorMessage('');
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Browser doesn't support Web Speech API - trigger sample simulation
      setIsListening(true);
      setTranscript(langConfig.listeningPrompt);
      setTimeout(() => {
        setIsListening(false);
        const sample = langConfig.samples[0].phrase;
        setTranscript(`"${sample}"`);
        handleProcessSpeech(sample);
      }, 2000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = langConfig.speechLocale;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript(langConfig.listeningPrompt);
      };

      recognition.onresult = (event: any) => {
        const currentTranscript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join('');
        setTranscript(`"${currentTranscript}"`);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event error:', event.error);
        setIsListening(false);
        // If mic permission blocked or error, fallback to first sample
        const fallbackPhrase = langConfig.samples[0].phrase;
        setTranscript(`"${fallbackPhrase}"`);
        handleProcessSpeech(fallbackPhrase);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (transcript && transcript !== langConfig.listeningPrompt) {
          handleProcessSpeech(transcript.replace(/"/g, ''));
        }
      };

      recognition.start();
    } catch (err) {
      console.warn('Failed to start SpeechRecognition:', err);
      setIsListening(false);
      // Fallback
      const sample = langConfig.samples[0].phrase;
      setTranscript(`"${sample}"`);
      handleProcessSpeech(sample);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setIsListening(false);
  };

  // Skip countdown and jump directly to payment gateway
  const goToPaymentGateway = () => {
    setStage('payment');
    const payNotice = language === 'hi' 
      ? `कृपया ₹${ticketData?.statutoryFee || 649} का भुगतान करें। क्यूआर कोड स्कैन करें या यूपीआई से भुगतान करें।`
      : `Please pay statutory verification fee of ₹${ticketData?.statutoryFee || 649} to activate Form V token.`;
    speak(payNotice);
  };

  // Complete Payment & Generate 7-Day Provisional Certificate
  const handleCompletePayment = () => {
    if (!ticketData) return;
    setIsPaying(true);

    setTimeout(() => {
      setIsPaying(false);
      setSoundboxAlert(true);

      // Register the instrument into TolSeva Context & LocalStorage!
      const newInst = registerInstrument({
        category: ticketData.category,
        brandModel: ticketData.machineName,
        serialNumber: ticketData.serialNumber,
        capacityKg: ticketData.weightCategoryKg,
        accuracyClass: ticketData.accuracyClass,
        manufacturer: ticketData.manufacturer || 'Essae-Teraoka Pvt. Ltd.',
        modelApprovalNumber: ticketData.modelApprovalNumber || 'IND/09/2022/418',
        maxCapacityValue: ticketData.weightCategoryKg,
        maxCapacityUnit: 'kg',
        verificationIntervalValue: ticketData.verificationIntervalValue || 5,
        verificationIntervalUnit: ticketData.verificationIntervalUnit || 'g',
        stampedIdentifier: ticketData.stampedIdentifier,
        businessName: currentUser?.businessName || 'Sharma Kirana Store',
        vendorName: currentUser?.name || 'Local Merchant',
        vendorContact: '+91 98201 44521',
        shopLocation: 'Shop 14, Main Market, Santacruz West',
        district: 'Mumbai Suburban',
        pincode: '400054',
        feePaid: ticketData.statutoryFee,
        paymentId: `UPI-${Math.floor(10000000 + Math.random() * 90000000)}`,
      });

      setCreatedInstrument(newInst);
      setStage('success');

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Soundbox & celebration announcement
      const audioSuccess = langConfig.paySuccessAudio.replace('{amount}', ticketData.statutoryFee.toString());
      speak(audioSuccess);

      if (onRegisteredSuccess) {
        onRegisteredSuccess(newInst);
      }
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        id="voice-assistant-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          id="voice-assistant-modal-container"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col my-auto"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-indigo-900/50">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-amber-300 shadow-inner">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base sm:text-lg tracking-tight">TolSeva Voice-AI</h3>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs">
                    बोलकर टिकट
                  </span>
                </div>
                <p className="text-xs text-indigo-200">
                  {language === 'hi' 
                    ? 'मशीन का नाम व वजन बोलें • स्वतः टिकट व तुरंत पेमेंट'
                    : 'Just say machine name & weight • Auto-ticket & instant pay'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                id="voice-sound-toggle-btn"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-xl transition ${soundEnabled ? 'bg-indigo-600/60 text-white' : 'bg-white/10 text-slate-400'}`}
                title={soundEnabled ? 'आवाज चालू (Mute)' : 'आवाज बंद (Unmute)'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                id="voice-assistant-close-btn"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Language Selector Bar (Indian Languages) */}
          <div className="bg-slate-100/90 px-3 sm:px-4 py-2 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1 shrink-0">
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span>भाषा (Language):</span>
            </span>
            <div className="flex items-center gap-1 shrink-0">
              {(Object.keys(LANGUAGES) as SupportedLanguage[]).map(langKey => {
                const isCurrent = language === langKey;
                return (
                  <button
                    key={langKey}
                    id={`lang-btn-${langKey}`}
                    onClick={() => {
                      setLanguage(langKey);
                      setVendorLanguage(langKey);
                      setTranscript('');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {LANGUAGES[langKey].nativeName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Wizard Body Content */}
          <div className="p-5 sm:p-6 space-y-6 flex-1">
            
            {/* STAGE 1: VOICE LISTENING */}
            {stage === 'listen' && (
              <div className="space-y-6">
                {/* Big Instruction Notice */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50/60 border border-indigo-100 rounded-2xl p-4 text-center space-y-1.5 shadow-xs">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2.5 py-0.5 rounded-full inline-block">
                    {langConfig.speakInstructions}
                  </span>
                  <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {langConfig.welcomePrompt}
                  </p>
                </div>

                {/* Big Central Microphone Button */}
                <div className="flex flex-col items-center justify-center py-3 space-y-4">
                  <div className="relative">
                    {isListening && (
                      <>
                        <motion.div
                          animate={{ scale: [1, 1.45, 1], opacity: [0.6, 0, 0.6] }}
                          transition={{ repeat: Infinity, duration: 1.6 }}
                          className="absolute inset-0 rounded-full bg-rose-500 blur-sm pointer-events-none"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0.2, 0.8] }}
                          transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
                          className="absolute inset-0 rounded-full bg-rose-400 pointer-events-none"
                        />
                      </>
                    )}

                    <button
                      id="voice-mic-main-button"
                      onClick={isListening ? stopListening : startListening}
                      disabled={isProcessing}
                      className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center text-white transition-all shadow-xl cursor-pointer ${
                        isListening
                          ? 'bg-rose-600 ring-8 ring-rose-200'
                          : 'bg-gradient-to-tr from-indigo-700 via-indigo-600 to-blue-600 hover:scale-105 shadow-indigo-200 hover:shadow-indigo-300'
                      }`}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-12 h-12 animate-spin" />
                      ) : isListening ? (
                        <Mic className="w-12 h-12 animate-pulse" />
                      ) : (
                        <Mic className="w-12 h-12" />
                      )}
                      <span className="text-[10px] font-black uppercase tracking-wider mt-1">
                        {isListening ? 'रुकें (Stop)' : 'बोलें (Tap to Speak)'}
                      </span>
                    </button>
                  </div>

                  {/* Status Indicator */}
                  <div className="text-center space-y-1">
                    <p className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1.5">
                      {isListening ? (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                          <span className="text-rose-600">{langConfig.listeningPrompt}</span>
                        </>
                      ) : isProcessing ? (
                        <span className="text-indigo-600 flex items-center gap-1">
                          <Loader2 className="w-4 h-4 animate-spin" /> AI प्रोसेस हो रहा है...
                        </span>
                      ) : (
                        <span>माइक दबाएं और बोलें (Tap mic & speak)</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500">
                      कोई फॉर्म भरने की जरूरत नहीं — मशीन का नाम और वजन बताएं
                    </p>
                  </div>

                  {/* Transcript Display Box */}
                  {transcript && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 flex items-start gap-2.5 shadow-xs"
                    >
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider text-slate-500">
                          पहचाना गया इनपुट (Detected Audio):
                        </span>
                        <span className="text-sm font-semibold text-indigo-900">{transcript}</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* 1-Tap Illiterate Friendly Preset Chips */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>एक टच में चुनें (Quick Voice Chips):</span>
                    </span>
                    <span className="text-[11px] text-slate-400">शोर में भी काम करे</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {langConfig.samples.map((sample, idx) => (
                      <button
                        key={idx}
                        id={`quick-sample-${idx}`}
                        onClick={() => {
                          setTranscript(`"${sample.phrase}"`);
                          handleProcessSpeech(sample.phrase);
                        }}
                        disabled={isProcessing}
                        className="p-3 bg-slate-50 hover:bg-indigo-50/80 hover:border-indigo-300 border border-slate-200 rounded-xl text-left transition flex items-center justify-between group"
                      >
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-900 block">
                            {sample.label}
                          </span>
                          <span className="text-[11px] text-slate-500 block line-clamp-1">
                            "{sample.phrase}"
                          </span>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            ₹{sample.fee}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 2: TICKET GENERATED AUTOMATICALLY WITH COUNTDOWN */}
            {stage === 'ticket' && ticketData && (
              <div className="space-y-5 text-center">
                {/* Auto Transition Banner */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col items-center justify-center space-y-1 text-emerald-900">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mb-1">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-extrabold text-lg text-emerald-950">
                    {langConfig.ticketTitle}!
                  </h4>
                  <p className="text-xs text-emerald-800 max-w-md">
                    {ticketData.confirmationSpeech}
                  </p>
                  <div className="mt-2 flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-emerald-200 text-xs font-bold text-emerald-700">
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>पेमेंट गेटवे पर जा रहे हैं ({countdown}s)...</span>
                  </div>
                </div>

                {/* Generated Ticket Card */}
                <div className="bg-slate-50 border-2 border-indigo-200 rounded-2xl p-5 text-left space-y-3 relative overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        सत्यापन चालान टिकट (Provisional Ticket)
                      </span>
                      <span className="font-mono text-sm font-extrabold text-indigo-700">
                        {ticketData.ticketNumber}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      Rule 14 LM Act
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">मशीन (Machine Name):</span>
                      <span className="font-bold text-slate-900 text-sm">{ticketData.machineName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">वजन क्षमता (Weight Capacity):</span>
                      <span className="font-bold text-indigo-700 text-sm">{ticketData.weightCategoryKg} kg</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">श्रेणी व एक्यूरेसी (OIML R 76):</span>
                      <span className="font-semibold text-slate-800">{ticketData.accuracyClass} ({ticketData.category})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">सरकारी शुल्क (Statutory Fee):</span>
                      <span className="font-extrabold text-emerald-700 text-base">₹{ticketData.statutoryFee}.00</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">सीरियल नंबर (Serial Number):</span>
                      <span className="font-mono text-slate-800 font-bold">{ticketData.serialNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">सत्यापन अंतराल (e-Interval):</span>
                      <span className="font-mono text-slate-800">{ticketData.verificationIntervalValue || 5} {ticketData.verificationIntervalUnit || 'g'}</span>
                    </div>
                  </div>

                  {ticketData.stampedIdentifier && (
                    <div className="bg-slate-900 text-slate-200 px-3 py-2 rounded-lg text-[11px] font-mono flex items-center justify-between border border-slate-800">
                      <span className="text-slate-400 text-[10px]">Rule 14 Stamped ID:</span>
                      <span className="text-amber-300 font-bold">{ticketData.stampedIdentifier}</span>
                    </div>
                  )}

                  <div className="bg-indigo-50/70 rounded-xl p-2.5 text-[11px] text-indigo-900 flex items-center gap-2 border border-indigo-100">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>7 दिन तक सरकारी निरीक्षण व जुर्माने से पूर्ण कानूनी छूट प्राप्त होगी।</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    id="retry-voice-input-btn"
                    onClick={() => {
                      setStage('listen');
                      setTranscript('');
                    }}
                    className="px-4 py-3 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>फिर से बोलें (Retry)</span>
                  </button>

                  <button
                    id="direct-payment-gateway-btn"
                    onClick={goToPaymentGateway}
                    className="flex-1 py-3 px-5 text-sm font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                  >
                    <span>अभी भुगतान करें (Pay ₹{ticketData.statutoryFee})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 3: PAYMENT GATEWAY */}
            {stage === 'payment' && ticketData && (
              <div className="space-y-5">
                {/* Amount Header */}
                <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block">
                      सरकारी सत्यापन शुल्क (Legal Metrology Verification Fee)
                    </span>
                    <span className="text-2xl font-black text-white">
                      ₹{ticketData.statutoryFee}.00
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-indigo-200 block">टोकन अवधि</span>
                    <span className="text-xs font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded">
                      7 Days Legal Shield
                    </span>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Dynamic QR Code Scanner */}
                  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 flex flex-col items-center text-center space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <QrCode className="w-4 h-4 text-indigo-600" />
                      <span>QR कोड स्कैन करें (Scan with any UPI)</span>
                    </div>

                    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center">
                      <div className="w-36 h-36 bg-slate-900 rounded-xl p-2 flex items-center justify-center relative overflow-hidden">
                        {/* Realistic Mock QR pattern */}
                        <div className="w-full h-full border-2 border-dashed border-white/40 flex flex-col items-center justify-center text-white text-center p-2">
                          <QrCode className="w-16 h-16 text-white mb-1" />
                          <span className="text-[8px] font-mono tracking-wider font-bold">UPI: TOLSEVA@SBI</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-semibold mt-2">
                        GPay • PhonePe • Paytm • BHIM
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600">
                      मोबाइल से स्कैन करें अथवा नीचे दिए गए बटन पर टैप करें
                    </p>
                  </div>

                  {/* Right: 1-Tap UPI Apps & Pay */}
                  <div className="space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-700 block">
                        यूपीआई विकल्प चुनें (Choose UPI Option):
                      </span>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          id="pay-gpay-btn"
                          onClick={() => setPaymentMethod('gpay')}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-left transition flex items-center gap-2 ${
                            paymentMethod === 'gpay'
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                              : 'border-slate-200 bg-white text-slate-700'
                          }`}
                        >
                          <span className="w-3 h-3 rounded-full bg-blue-600" />
                          <span>Google Pay</span>
                        </button>

                        <button
                          id="pay-phonepe-btn"
                          onClick={() => setPaymentMethod('phonepe')}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-left transition flex items-center gap-2 ${
                            paymentMethod === 'phonepe'
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                              : 'border-slate-200 bg-white text-slate-700'
                          }`}
                        >
                          <span className="w-3 h-3 rounded-full bg-purple-600" />
                          <span>PhonePe</span>
                        </button>

                        <button
                          id="pay-paytm-btn"
                          onClick={() => setPaymentMethod('paytm')}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-left transition flex items-center gap-2 ${
                            paymentMethod === 'paytm'
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                              : 'border-slate-200 bg-white text-slate-700'
                          }`}
                        >
                          <span className="w-3 h-3 rounded-full bg-sky-500" />
                          <span>Paytm UPI</span>
                        </button>

                        <button
                          id="pay-bhim-btn"
                          onClick={() => setPaymentMethod('upi_qr')}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-left transition flex items-center gap-2 ${
                            paymentMethod === 'upi_qr'
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                              : 'border-slate-200 bg-white text-slate-700'
                          }`}
                        >
                          <span className="w-3 h-3 rounded-full bg-emerald-600" />
                          <span>BHIM / Net</span>
                        </button>
                      </div>
                    </div>

                    {/* Fee Breakdown Compact */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] space-y-1 text-slate-600">
                      <div className="flex justify-between">
                        <span>मूल सत्यापन शुल्क (Base Fee):</span>
                        <span>₹{ticketData.statutoryFee - Math.round((ticketData.statutoryFee) * 0.18 / 1.18) - 50}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>डिजिटल सरचार्ज (Admin Surcharge):</span>
                        <span>₹50</span>
                      </div>
                      <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
                        <span>कुल देय (Total with 18% GST):</span>
                        <span className="text-emerald-700 font-black">₹{ticketData.statutoryFee}.00</span>
                      </div>
                    </div>

                    {/* High-Contrast Pay Button */}
                    <button
                      id="voice-complete-payment-btn"
                      onClick={handleCompletePayment}
                      disabled={isPaying}
                      className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition cursor-pointer"
                    >
                      {isPaying ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>भुगतान प्रोसेस हो रहा है...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          <span>₹{ticketData.statutoryFee} का भुगतान करें (Pay Now)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 4: SUCCESS & PROVISIONAL TOKEN ISSUED */}
            {stage === 'success' && createdInstrument && (
              <div className="space-y-5 text-center">
                {/* Confetti & Soundbox Notification */}
                <div className="bg-emerald-50 border-2 border-emerald-400 rounded-3xl p-5 space-y-2">
                  <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-black text-xl text-emerald-950">
                    भुगतान सफल • फॉर्म V टोकन जारी!
                  </h4>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto">
                    {langConfig.paySuccessAudio.replace('{amount}', createdInstrument.feePaid.toString())}
                  </p>

                  {/* Soundbox Badge */}
                  <div className="inline-flex items-center gap-2 bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-full mt-2 shadow-xs">
                    <Volume2 className="w-4 h-4 animate-bounce" />
                    <span>{langConfig.soundboxText.replace('{amount}', createdInstrument.feePaid.toString())}</span>
                  </div>
                </div>

                {/* Issued Token Card Summary */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2.5 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-mono font-bold text-slate-800">
                      ID: {createdInstrument.id}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">
                      7-Day Legal Shield Active
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[10px]">मशीन (Machine):</span>
                      <span className="font-bold text-slate-900">{createdInstrument.brandModel}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">वजन क्षमता (Weight):</span>
                      <span className="font-bold text-indigo-700">{createdInstrument.capacityKg} kg</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">सीरियल नंबर (Serial):</span>
                      <span className="font-mono text-slate-900">{createdInstrument.serialNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">वैधता (Valid Until):</span>
                      <span className="font-bold text-amber-700">{createdInstrument.provisionalTokenExpiry}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    id="finish-voice-wizard-btn"
                    onClick={onClose}
                    className="w-full sm:flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>डैशबोर्ड पर देखें (Go to Dashboard)</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Footer Assistance note */}
          <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
              <span>टोलसेवा सहायता: 1800-11-4000 (निःशुल्क)</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-600">
              Department of Consumer Affairs, GoI
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
