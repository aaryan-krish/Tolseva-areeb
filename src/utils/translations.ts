import { VendorLanguage } from '../types';

export interface LanguageOption {
  code: VendorLanguage;
  name: string;
  nativeName: string;
  flag: string;
  regionHint: string;
}

export const VENDOR_LANGUAGES: LanguageOption[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', regionHint: 'राष्ट्रीय भाषा (National)' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🚩', regionHint: 'महाराष्ट्र विभाग (Maharashtra)' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', regionHint: 'વેપાર અને ઉદ્યોગ (Gujarat)' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', regionHint: 'পশ্চিমবঙ্গ ও ত্রিপুরা (Bengal)' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', regionHint: 'தமிழ்நாடு (Tamil Nadu)' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', regionHint: 'ఆంధ్ర & తెలంగాణ (Telugu)' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', regionHint: 'ਪੰਜਾਬ ਤੇ ਹਰਿਆਣਾ (Punjab)' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🌐', regionHint: 'Official Government & Business' },
];

export interface TranslationStrings {
  appLanguage: string;
  changeLanguage: string;
  selectLanguagePrompt: string;
  currentLanguageBadge: string;
  portalTitle: string;
  portalSubtitle: string;
  authorizedTraderBadge: string;
  gstinLabel: string;
  voiceAiBtn: string;
  voiceAiSubtitle: string;
  manualFormBtn: string;
  
  // Stats KPI
  totalScales: string;
  totalScalesSub: string;
  provisionalActive: string;
  provisionalActiveSub: string;
  verifiedCerts: string;
  verifiedCertsSub: string;
  vigilanceAlerts: string;
  vigilanceAlertsSub: string;

  // Tabs
  myScalesTab: string;
  disputesTab: string;
  rulesTab: string;

  // Inventory & Cards
  inventoryHeader: string;
  inventorySub: string;
  tokenActiveBadge: string;
  verifiedBadge: string;
  reAuditBadge: string;
  pendingInspectionBadge: string;
  capacityLabel: string;
  accuracyClassLabel: string;
  serialNumberLabel: string;
  feePaidLabel: string;
  legalShieldValidLabel: string;
  qrTaggedLabel: string;
  reAuditReasonLabel: string;
  viewFormVBtn: string;
  downloadPdfBtn: string;

  // Search & Filter
  searchScalesPlaceholder: string;
  filterAll: string;
  filterProvisional: string;
  filterVerified: string;
  filterPending: string;

  // Voice Assistant Bar / Floating
  floatingVoiceBtn: string;
  audioFeedbackNotice: string;
  voiceLanguageSyncedNotice: string;

  // Rules tab preview
  rulesTitle: string;
  rulesDesc: string;
  rule14ImmunityTitle: string;
  rule14ImmunityText: string;

  // Disputes
  disputesPortalTitle: string;
  disputesPortalDesc: string;
  lodgeDisputeBtn: string;
  noDisputesMsg: string;

  // Toast
  langChangedToast: string;
}

export const TRANSLATIONS: Record<VendorLanguage, TranslationStrings> = {
  en: {
    appLanguage: 'App Language',
    changeLanguage: 'Change Language',
    selectLanguagePrompt: 'Choose your preferred regional trade language:',
    currentLanguageBadge: 'Language: English',
    portalTitle: 'Commercial Trader & Weighing Registry',
    portalSubtitle: 'Legally certified weighing scale inventory under Department of Consumer Affairs. Enjoy uninterrupted trade with instant 7-day provisional token generation upon statutory fee payment.',
    authorizedTraderBadge: 'Authorized Commercial Trader Portal',
    gstinLabel: 'GSTIN',
    voiceAiBtn: 'Voice-AI Assistant (बोलकर टिकट)',
    voiceAiSubtitle: 'Speak machine name & weight in your regional language',
    manualFormBtn: 'Manual Scale Form',

    totalScales: 'Total Registered Scales',
    totalScalesSub: 'In official registry',
    provisionalActive: '7-Day Provisional Active',
    provisionalActiveSub: 'Shielded from inspection fines',
    verifiedCerts: 'Fully Verified e-Certificates',
    verifiedCertsSub: 'Holographic QR issued',
    vigilanceAlerts: 'Vigilance Flag Alerts',
    vigilanceAlertsSub: 'Consumer complaints count',

    myScalesTab: 'My Weighing Instruments',
    disputesTab: 'Disputes & Grievance Tickets',
    rulesTab: 'Statutory Rules & Tolerances (LM Act 2009)',

    inventoryHeader: 'Registered Commercial Scale Inventory',
    inventorySub: 'Click "View Form V" to inspect or download 7-Day Provisional Token PDF',
    tokenActiveBadge: '7-Day Token Active',
    verifiedBadge: 'Officially Verified',
    reAuditBadge: 'Re-Audit Assigned',
    pendingInspectionBadge: 'Inspection Scheduled',
    capacityLabel: 'Capacity',
    accuracyClassLabel: 'Accuracy Class',
    serialNumberLabel: 'Serial No',
    feePaidLabel: 'Fee Paid',
    legalShieldValidLabel: 'Legal Shield Valid:',
    qrTaggedLabel: 'QR Tagged',
    reAuditReasonLabel: 'Under Higher Authority Re-Audit',
    viewFormVBtn: 'View Form V Token',
    downloadPdfBtn: 'Download PDF',

    searchScalesPlaceholder: 'Search scale by make, serial no, or category...',
    filterAll: 'All Scales',
    filterProvisional: 'Provisional Active',
    filterVerified: 'Verified',
    filterPending: 'Pending Inspection',

    floatingVoiceBtn: 'Voice-AI Assistant (बोलकर कांटा)',
    audioFeedbackNotice: 'Voice assistant available in 8 regional languages',
    voiceLanguageSyncedNotice: 'Voice Assistant language synced with app settings',

    rulesTitle: 'Legal Metrology Act, 2009 & General Rules 2011',
    rulesDesc: 'Mandatory verification guidelines, maximum permissible errors (MPE), and statutory vendor protections.',
    rule14ImmunityTitle: 'Legal Protection under Rule 14 (Provisional Form V)',
    rule14ImmunityText: 'Upon online statutory fee deposit, vendors receive 7-day immunity against on-spot compounding penalties during regular commerce.',

    disputesPortalTitle: 'Vendor Grievance & Dispute Redressal Portal',
    disputesPortalDesc: 'Log official complaints regarding inspector delays, tolerance disagreements, or harassment under Consumer Affairs Ombudsman.',
    lodgeDisputeBtn: 'Lodge New Dispute Ticket',
    noDisputesMsg: 'No active dispute tickets found.',

    langChangedToast: 'App language switched to English',
  },

  hi: {
    appLanguage: 'ऐप की भाषा (Language)',
    changeLanguage: 'भाषा बदलें',
    selectLanguagePrompt: 'अपनी पसंदीदा व्यापारिक भाषा चुनें:',
    currentLanguageBadge: 'भाषा: हिन्दी',
    portalTitle: 'व्यापारी तोल-माप पोर्टल एवं तराजू रजिस्ट्री',
    portalSubtitle: 'उपभोक्ता मामले विभाग के अंतर्गत कानूनी रूप से प्रमाणित तोल तराजू सूची। सरकारी सत्यापन शुल्क भुगतान के साथ 7-दिवसीय प्रोविजनल टोकन प्राप्त करें और निर्बाध व्यापार करें।',
    authorizedTraderBadge: 'अधिकृत व्यापारिक विक्रेता पोर्टल',
    gstinLabel: 'जीएसटीएन (GSTIN)',
    voiceAiBtn: 'बोलकर टिकट बनाएं (Voice AI)',
    voiceAiSubtitle: 'कांटे का नाम और वजन बोलें • तुरंत टिकट व टोकन',
    manualFormBtn: 'मैन्युअल फॉर्म भरें',

    totalScales: 'कुल पंजीकृत तोल कांटे',
    totalScalesSub: 'सरकारी रिकॉर्ड में दर्ज',
    provisionalActive: '7-दिवसीय प्रोविजनल सक्रिय',
    provisionalActiveSub: 'निरीक्षण जुर्माने से कानूनी सुरक्षा',
    verifiedCerts: 'सत्यापित ई-सर्टिफिकेट',
    verifiedCertsSub: 'होलोग्राफिक क्यूआर जारी',
    vigilanceAlerts: 'सतर्कता अलर्ट (शिकायतें)',
    vigilanceAlertsSub: 'ग्राहक शिकायत संख्या',

    myScalesTab: 'मेरे तोल कांटे व तराजू',
    disputesTab: 'शिकायत व निवारण टिकट',
    rulesTab: 'कानूनी नियम व सहिष्णुता (LM Act)',

    inventoryHeader: 'पंजीकृत व्यापारिक तोल कांटे व तराजू',
    inventorySub: '7-दिवसीय प्रोविजनल टोकन पीडीएफ देखने या डाउनलोड करने के लिए "फॉर्म V देखें" पर क्लिक करें',
    tokenActiveBadge: '7-दिवसीय टोकन सक्रिय',
    verifiedBadge: 'सत्यापित एवं प्रमाणित',
    reAuditBadge: 'पुनः ऑडिट आदेशित',
    pendingInspectionBadge: 'निरीक्षण प्रतीक्षित',
    capacityLabel: 'क्षमता (वजन)',
    accuracyClassLabel: 'सटीकता वर्ग (Class)',
    serialNumberLabel: 'क्रमांक (Serial No)',
    feePaidLabel: 'जमा शुल्क',
    legalShieldValidLabel: 'कानूनी सुरक्षा वैध:',
    qrTaggedLabel: 'क्यूआर प्रमाणित',
    reAuditReasonLabel: 'उच्च अधिकारी द्वारा पुनः जांच',
    viewFormVBtn: 'फॉर्म V टोकन देखें',
    downloadPdfBtn: 'पीडीएफ डाउनलोड',

    searchScalesPlaceholder: 'मॉडल, सीरियल नंबर या प्रकार खोजें...',
    filterAll: 'सभी कांटे',
    filterProvisional: 'प्रोविजनल सक्रिय',
    filterVerified: 'सत्यापित',
    filterPending: 'निरीक्षण बाकी',

    floatingVoiceBtn: 'बोलकर कांटा दर्ज करें (Voice AI)',
    audioFeedbackNotice: 'आवाज सहायक 8 भारतीय भाषाओं में उपलब्ध',
    voiceLanguageSyncedNotice: 'वॉइस असिस्टेंट की भाषा ऐप के अनुसार सेट की गई',

    rulesTitle: 'विधिक मापविज्ञान अधिनियम, 2009 एवं नियम 2011',
    rulesDesc: 'अनिवार्य सत्यापन दिशानिर्देश, अधिकतम अनुमेय त्रुटि (MPE), और व्यापारी संरक्षण नियम।',
    rule14ImmunityTitle: 'नियम 14 के तहत कानूनी संरक्षण (प्रोविजनल फॉर्म V)',
    rule14ImmunityText: 'सत्यापन शुल्क जमा करने पर 7 दिनों तक मौके पर जुर्माने या जब्ती से पूर्ण कानूनी संरक्षण प्राप्त होता है।',

    disputesPortalTitle: 'व्यापारी शिकायत एवं विवाद निवारण केंद्र',
    disputesPortalDesc: 'निरीक्षक देरी, अनुचित मांग या गलत माप के विरुद्ध उपभोक्ता लोकपाल के समक्ष आधिकारिक शिकायत दर्ज करें।',
    lodgeDisputeBtn: 'नई शिकायत दर्ज करें',
    noDisputesMsg: 'कोई सक्रिय शिकायत टिकट नहीं मिला।',

    langChangedToast: 'ऐप की भाषा बदलकर हिन्दी कर दी गई है',
  },

  mr: {
    appLanguage: 'अ‍ॅपची भाषा (Language)',
    changeLanguage: 'भाषा बदला',
    selectLanguagePrompt: 'आपली पसंतीची प्रादेशिक भाषा निवडा:',
    currentLanguageBadge: 'भाषा: मराठी',
    portalTitle: 'अधिकृत व्यापारी वजन-काटा नोंदणी पोर्टल',
    portalSubtitle: 'ग्राहक संरक्षण व कायदेशीर मापशास्त्र विभाग, महाराष्ट्र शासन अंतर्गत अधिकृत वजन काटे. सरकारी शुल्क भरताच ७ दिवसांचे प्रोव्हिजनल टोकन मिळवून दंडमुक्त व्यापार करा.',
    authorizedTraderBadge: 'अधिकृत व्यापारी पोर्टल (महाराष्ट्र)',
    gstinLabel: 'जीएसटी क्रमांक (GSTIN)',
    voiceAiBtn: 'बोलून तिकीट बनवा (Voice AI)',
    voiceAiSubtitle: 'काट्याचे नाव व वजन सांगा • तत्काळ चलन व पेमेंट',
    manualFormBtn: 'नोंदणी फॉर्म भरा',

    totalScales: 'एकूण नोंदणीकृत काटे',
    totalScalesSub: 'अधिकृत नोंदवहीत',
    provisionalActive: '७-दिवसीय प्रोव्हिजनल सक्रिय',
    provisionalActiveSub: 'दंड व जप्तीपासून कायदेशीर संरक्षण',
    verifiedCerts: 'प्रमाणित ई-प्रमाणपत्रे',
    verifiedCertsSub: 'होलोग्राफिक क्यूआर जारी',
    vigilanceAlerts: 'तक्रार व दक्षता इशारे',
    vigilanceAlertsSub: 'ग्राहक तक्रारींची संख्या',

    myScalesTab: 'माझे वजन काटे व तराजू',
    disputesTab: 'तक्रार व वाद निवारण',
    rulesTab: 'कायदेशीर नियम व मानके (LM Act)',

    inventoryHeader: 'नोंदणीकृत व्यापारी वजन काट्यांची यादी',
    inventorySub: '७-दिवसीय प्रोव्हिजनल टोकन पाहण्यासाठी "फॉर्म V पहा" वर क्लिक करा',
    tokenActiveBadge: '७-दिवसीय टोकन सक्रिय',
    verifiedBadge: 'पूर्णपणे प्रमाणित',
    reAuditBadge: 'पुनर्तपासणी आदेश',
    pendingInspectionBadge: 'तपासणी नियोजित',
    capacityLabel: 'क्षमता (वजन)',
    accuracyClassLabel: 'अचूकता वर्ग (Class)',
    serialNumberLabel: 'अनुक्रमांक (Serial No)',
    feePaidLabel: 'भरलेले शुल्क',
    legalShieldValidLabel: 'कायदेशीर संरक्षण वैध:',
    qrTaggedLabel: 'क्यूआर प्रमाणित',
    reAuditReasonLabel: 'वरिष्ठ अधिकाऱ्यांमार्फत फेरतपासणी',
    viewFormVBtn: 'फॉर्म V टोकन पहा',
    downloadPdfBtn: 'पीडीएफ डाउनलोड',

    searchScalesPlaceholder: 'मॉडेल, सिरीयल नंबर किंवा प्रकार शोधा...',
    filterAll: 'सर्व काटे',
    filterProvisional: 'प्रोव्हिजनल सक्रिय',
    filterVerified: 'प्रमाणित',
    filterPending: 'तपासणी बाकी',

    floatingVoiceBtn: 'बोलून काटा नोंदवा (Voice AI)',
    audioFeedbackNotice: '८ प्रादेशिक भाषांमध्ये उपलब्ध आवाज सहाय्यक',
    voiceLanguageSyncedNotice: 'व्हॉईस असिस्टंटची भाषा मराठीत सेट केली आहे',

    rulesTitle: 'विधिक मापविज्ञान कायदा, २००९ व नियम २०११',
    rulesDesc: 'अनिवार्य पडताळणी मार्गदर्शक तत्त्वे व व्यापारी संरक्षणाचे अधिकार.',
    rule14ImmunityTitle: 'नियम १४ अंतर्गत कायदेशीर संरक्षण (फॉर्म V)',
    rule14ImmunityText: 'ऑनलाइन सत्यापन शुल्क भरल्यावर ७ दिवस कोणत्याही दंडात्मक कारवाईपासून पूर्ण कायदेशीर संरक्षण मिळते.',

    disputesPortalTitle: 'व्यापारी तक्रार व निवारण कक्ष',
    disputesPortalDesc: 'निरीक्षक विलंब, मनमानी कारवाई किंवा छळाविरुद्ध कायदेशीर तक्रार दाखल करा.',
    lodgeDisputeBtn: 'नवीन तक्रार नोंदवा',
    noDisputesMsg: 'सध्या कोणतीही प्रलंबित तक्रार नाही.',

    langChangedToast: 'अ‍ॅपची भाषा मराठीमध्ये बदलली आहे',
  },

  gu: {
    appLanguage: 'એપની ભાષા (Language)',
    changeLanguage: 'ભાષા બદલો',
    selectLanguagePrompt: 'તમારી પસંદગીની વેપાર ભાષા પસંદ કરો:',
    currentLanguageBadge: 'ભાષા: ગુજરાતી',
    portalTitle: 'વેપારી તોલ-માપ પોર્ટલ અને વજન કાંટા રજીસ્ટ્રી',
    portalSubtitle: 'ગ્રાહક બાબતોના વિભાગ હેઠળ કાયદેસર રીતે પ્રમાણિત વજન કાંટા. સરકારી ફી ભરીને તરત જ ૭-દિવસીય પ્રોવિઝનલ ટોકન મેળવો અને મુક્તપણે વેપાર કરો.',
    authorizedTraderBadge: 'અધિકૃત કોમર્શિયલ વેપારી પોર્ટલ',
    gstinLabel: 'જીએસટી નંબર (GSTIN)',
    voiceAiBtn: 'બોલીને ટિકિટ બનાવો (Voice AI)',
    voiceAiSubtitle: 'કાંટાનું નામ અને વજન બોલો • તુરંત ટિકિટ અને પેમેન્ટ',
    manualFormBtn: 'મેન્યુઅલ ફોર્મ',

    totalScales: 'કુલ નોંધાયેલા કાંટા',
    totalScalesSub: 'સત્તાવાર રજિસ્ટરમાં',
    provisionalActive: '૭-દિવસીય પ્રોવિઝનલ સક્રિય',
    provisionalActiveSub: 'દંડ અને જપ્તી સામે કાયદાકીય સુરક્ષા',
    verifiedCerts: 'પ્રમાણિત ઈ-પ્રમાણપત્રો',
    verifiedCertsSub: 'હોલોગ્રાફિક ક્યુઆર જારી',
    vigilanceAlerts: 'વિજિલન્સ ચેતવણીઓ',
    vigilanceAlertsSub: 'ગ્રાહક ફરિયાદ સંખ્યા',

    myScalesTab: 'મારા વજન કાંટા અને ત્રાજવા',
    disputesTab: 'ફરિયાદ અને નિવારણ ટિકિટ',
    rulesTab: 'કાયદાકીય નિયમો (LM Act 2009)',

    inventoryHeader: 'નોંધાયેલા વ્યાપારી વજન કાંટાની યાદી',
    inventorySub: '૭-દિવસનું પ્રોવિઝનલ ટોકન જોવા કે ડાઉનલોડ કરવા "ફોર્મ V જુઓ" પર ક્લિક કરો',
    tokenActiveBadge: '૭-દિવસીય ટોકન સક્રિય',
    verifiedBadge: 'સંપૂર્ણ પ્રમાણિત',
    reAuditBadge: 'પુનઃ ઓડિટ આદેશ',
    pendingInspectionBadge: 'તપાસ બાકી',
    capacityLabel: 'ક્ષમતા (વજન)',
    accuracyClassLabel: 'ચોકસાઈ વર્ગ (Class)',
    serialNumberLabel: 'સીરીયલ નંબર',
    feePaidLabel: 'ભરેલ ફી',
    legalShieldValidLabel: 'કાયદાકીય રક્ષણ માન્ય:',
    qrTaggedLabel: 'ક્યુઆર ટેગ થયેલ',
    reAuditReasonLabel: 'ઉચ્ચ અધિકારી દ્વારા પુનઃ ચકાસણી',
    viewFormVBtn: 'ફોર્મ V ટોકન જુઓ',
    downloadPdfBtn: 'પીડીએફ ડાઉનલોડ',

    searchScalesPlaceholder: 'મોડેલ, સીરીયલ નંબર શોધો...',
    filterAll: 'બધા કાંટા',
    filterProvisional: 'પ્રોવિઝનલ સક્રિય',
    filterVerified: 'પ્રમાણિત',
    filterPending: 'તપાસ બાકી',

    floatingVoiceBtn: 'બોલીને કાંટો નોંધો (Voice AI)',
    audioFeedbackNotice: '૮ પ્રાદેશિક ભાષાઓમાં વોઈસ આસિસ્ટન્ટ ઉપલબ્ધ',
    voiceLanguageSyncedNotice: 'વોઈસ આસિસ્ટન્ટ ગુજરાતી ભાષામાં સેટ છે',

    rulesTitle: 'વિહિત માપવિજ્ઞાન અધિનિયમ, ૨૦૦૯',
    rulesDesc: 'ફરજિયાત ચકાસણી માર્ગદર્શિકા અને વેપારી સુરક્ષા અધિકારો.',
    rule14ImmunityTitle: 'નિયમ ૧૪ હેઠળ કાયદાકીય સુરક્ષા (ફોર્મ V)',
    rule14ImmunityText: 'ઓનલાઇન ફી ભર્યા બાદ ૭ દિવસ સુધી સ્થળ પર દંડ અથવા જપ્તી સામે સંપૂર્ણ રક્ષણ મળે છે.',

    disputesPortalTitle: 'વેપારી ફરિયાદ અને વિવાદ નિવારણ કેન્દ્ર',
    disputesPortalDesc: 'ઇન્સ્પેક્ટર વિલંબ અથવા હેરાનગતિ વિરુદ્ધ ઓનલાઇન ફરિયાદ નોંધાવો.',
    lodgeDisputeBtn: 'નવી ફરિયાદ નોંધાવો',
    noDisputesMsg: 'કોઈ સક્રિય ફરિયાદ ટિકિટ નથી.',

    langChangedToast: 'એપની ભાષા ગુજરાતીમાં બદલાઈ ગઈ છે',
  },

  bn: {
    appLanguage: 'অ্যাপের ভাষা (Language)',
    changeLanguage: 'ভাষা পরিবর্তন করুন',
    selectLanguagePrompt: 'আপনার পছন্দের আঞ্চলিক ভাষা নির্বাচন করুন:',
    currentLanguageBadge: 'ভাষা: বাংলা',
    portalTitle: 'অনুমোদিত ব্যবসায়ী ওজন পরিমাপ পোর্টাল',
    portalSubtitle: 'উপভোক্তা বিষয়ক বিভাগের অধীনে প্রত্যয়িত ওজন পরিমাপ যন্ত্র। সরকারি ফি জমা দিয়ে অবিলম্বে ৭ দিনের ফর্ম V অস্থায়ী টোকেন গ্রহণ করুন।',
    authorizedTraderBadge: 'অনুমোদিত বাণিজ্যিক ট্রেডার পোর্টাল',
    gstinLabel: 'জিএসটি নম্বর (GSTIN)',
    voiceAiBtn: 'কথা বলে টিকিট তৈরি করুন (Voice AI)',
    voiceAiSubtitle: 'মেশিনের নাম ও ওজন বলুন • সঙ্গে সঙ্গে চালান ও পেমেন্ট',
    manualFormBtn: 'ম্যানুয়াল ফর্ম পূরণ',

    totalScales: 'মোট নিবন্ধিত স্কেল',
    totalScalesSub: 'সরকারি রেজিস্ট্রিতে',
    provisionalActive: '৭ দিনের প্রোভিশনাল সক্রিয়',
    provisionalActiveSub: 'জরিমানা থেকে আইনি সুরক্ষা',
    verifiedCerts: 'যাচাইকৃত ই-সার্টিফিকেট',
    verifiedCertsSub: 'হোলোগ্রাফিক কিউআর জারি',
    vigilanceAlerts: 'অভিযোগ ও নজরদারি সতর্কতা',
    vigilanceAlertsSub: 'গ্রাহক অভিযোগ সংখ্যা',

    myScalesTab: 'আমার ওজন পরিমাপ যন্ত্রসমূহ',
    disputesTab: 'অভিযোগ ও নিষ্পত্তি টিকিট',
    rulesTab: 'আইনি বিধিমালা ও মানদণ্ড (LM Act)',

    inventoryHeader: 'নিবন্ধিত বাণিজ্যিক ওজন স্কেলের তালিকা',
    inventorySub: '৭ দিনের প্রোভিশনাল টোকেন দেখতে "ফর্ম V দেখুন" এ ক্লিক করুন',
    tokenActiveBadge: '৭ দিনের টোকেন সক্রিয়',
    verifiedBadge: 'সম্পূর্ণ যাচাইকৃত',
    reAuditBadge: 'পুনরায় অডিট আদেশ',
    pendingInspectionBadge: 'পরিদর্শন অপেক্ষমান',
    capacityLabel: 'ওজন ক্ষমতা',
    accuracyClassLabel: 'সঠিকতা শ্রেণী (Class)',
    serialNumberLabel: 'ক্রমিক নং (Serial)',
    feePaidLabel: 'প্রদত্ত ফি',
    legalShieldValidLabel: 'আইনি সুরক্ষা বৈধ:',
    qrTaggedLabel: 'কিউআর ট্যাগযুক্ত',
    reAuditReasonLabel: 'উচ্চ কর্তৃপক্ষের পুনরায় তদন্ত',
    viewFormVBtn: 'ফর্ম V টোকেন দেখুন',
    downloadPdfBtn: 'পিডিএফ ডাউনলোড',

    searchScalesPlaceholder: 'মডেল, সিরিয়াল নম্বর খুঁজুন...',
    filterAll: 'সকল স্কেল',
    filterProvisional: 'প্রোভিশনাল সক্রিয়',
    filterVerified: 'যাচাইকৃত',
    filterPending: 'পরিদর্শন বাকি',

    floatingVoiceBtn: 'কথা বলে স্কেল যোগ করুন (Voice AI)',
    audioFeedbackNotice: 'ভয়েস সহকারী ৮টি ভারতীয় ভাষায় উপলব্ধ',
    voiceLanguageSyncedNotice: 'ভয়েস সহকারী বাংলায় সেট করা হয়েছে',

    rulesTitle: 'আইনি মেট্রোলজি আইন, ২০০৯ ও বিধিমালা ২০১১',
    rulesDesc: 'বাধ্যতামূলক যাচাইকরণ নির্দেশিকা এবং ব্যবসায়ীদের আইনি সুরক্ষা।',
    rule14ImmunityTitle: 'বিধি ১৪ এর অধীনে আইনি সুরক্ষা (ফর্ম V)',
    rule14ImmunityText: 'অনলাইনে ফি প্রদানের পর ৭ দিনের জন্য অন-স্পট জরিমানার বিরুদ্ধে সম্পূর্ণ আইনি সুরক্ষা পাওয়া যায়।',

    disputesPortalTitle: 'ব্যবসায়ী অভিযোগ ও নিষ্পত্তি কেন্দ্র',
    disputesPortalDesc: 'পরিদর্শক বিলম্ব বা অসঙ্গতির বিরুদ্ধে সরকারি ন্যায়পালের কাছে অভিযোগ জানান।',
    lodgeDisputeBtn: 'নতুন অভিযোগ দায়ের করুন',
    noDisputesMsg: 'কোনো সক্রিয় অভিযোগ পাওয়া যায়নি।',

    langChangedToast: 'অ্যাপের ভাষা বাংলায় পরিবর্তিত হয়েছে',
  },

  ta: {
    appLanguage: 'செயலி மொழி (Language)',
    changeLanguage: 'மொழியை மாற்றவும்',
    selectLanguagePrompt: 'உங்கள் விருப்பமான வணிக மொழியைத் தேர்வுசெய்க:',
    currentLanguageBadge: 'மொழி: தமிழ்',
    portalTitle: 'வணிக எடை மற்றும் அளவீட்டு போர்டல்',
    portalSubtitle: 'நுகர்வோர் விவகாரத் துறையின் கீழ் சட்டப்பூர்வமாக சான்றளிக்கப்பட்ட எடை அளவீடுகள். அரசு கட்டணம் செலுத்தி 7 நாள் தற்காலிக டோக்கன் பெற்று வணிகம் தொடருங்கள்.',
    authorizedTraderBadge: 'அங்கீகரிக்கப்பட்ட வணிகர் தளம்',
    gstinLabel: 'ஜிஎஸ்டி எண் (GSTIN)',
    voiceAiBtn: 'பேசி டிக்கெட் பெறுக (Voice AI)',
    voiceAiSubtitle: 'எடை மெஷின் பெயர் மற்றும் எடையைக் கூறுங்கள் • உடனடி டோக்கன்',
    manualFormBtn: 'படிவம் நிரப்பவும்',

    totalScales: 'மொத்த பதிவு செய்யப்பட்ட எடைகள்',
    totalScalesSub: 'அதிகாரப்பூர்வ பதிவேட்டில்',
    provisionalActive: '7-நாள் தற்காலிக டோக்கன் இயங்குகிறது',
    provisionalActiveSub: 'ஆய்வு அபராதத்திலிருந்து சட்டப் பாதுகாப்பு',
    verifiedCerts: 'சரிபார்க்கப்பட்ட மின்-சான்றிதழ்கள்',
    verifiedCertsSub: 'ஹோலோகிராபிக் கியூஆர் வழங்கப்பட்டது',
    vigilanceAlerts: 'விழிப்புணர்வு எச்சரிக்கைகள்',
    vigilanceAlertsSub: 'நுகர்வோர் புகார்கள்',

    myScalesTab: 'எனது எடை இயந்திரங்கள்',
    disputesTab: 'புகார்கள் மற்றும் தீர்வு டிக்கெட்டுகள்',
    rulesTab: 'சட்ட விதிகள் (LM Act 2009)',

    inventoryHeader: 'பதிவு செய்யப்பட்ட எடை இயந்திரங்களின் பட்டியல்',
    inventorySub: '7 நாள் தற்காலிக டோக்கனைக் காண "ஃபார்ம் V காண்க" என்பதை அழுத்தவும்',
    tokenActiveBadge: '7-நாள் டோக்கன் இயங்குகிறது',
    verifiedBadge: 'முழுமையாக சரிபார்க்கப்பட்டது',
    reAuditBadge: 'மறு தணிக்கை ஒதுக்கப்பட்டது',
    pendingInspectionBadge: 'ஆய்வு நிலுவையில்',
    capacityLabel: 'கொள்ளளவு (எடை)',
    accuracyClassLabel: 'துல்லிய வகுப்பு (Class)',
    serialNumberLabel: 'வரிசை எண் (Serial No)',
    feePaidLabel: 'செலுத்தப்பட்ட கட்டணம்',
    legalShieldValidLabel: 'சட்டப் பாதுகாப்பு செல்லுபடியாகும்:',
    qrTaggedLabel: 'கியூஆர் இணைக்கப்பட்டது',
    reAuditReasonLabel: 'உயர் அதிகாரி மறு தணிக்கை',
    viewFormVBtn: 'ஃபார்ம் V டோக்கன் காண்க',
    downloadPdfBtn: 'பதிவிறக்கம் PDF',

    searchScalesPlaceholder: 'மாதிரி அல்லது வரிசை எண்ணைத் தேடுங்கள்...',
    filterAll: 'அனைத்து எடைகளும்',
    filterProvisional: 'தற்காலிக செயலில்',
    filterVerified: 'சரிபார்க்கப்பட்டது',
    filterPending: 'ஆய்வு நிலுவை',

    floatingVoiceBtn: 'பேசி பதிவு செய்க (Voice AI)',
    audioFeedbackNotice: 'குரல் உதவியாளர் 8 இந்திய மொழிகளில் கிடைக்கிறது',
    voiceLanguageSyncedNotice: 'குரல் உதவியாளர் தமிழில் அமைக்கப்பட்டது',

    rulesTitle: 'சட்ட அளவியல் சட்டம், 2009',
    rulesDesc: 'கட்டாய சரிபார்ப்பு வழிகாட்டுதல்கள் மற்றும் வணிகர் பாதுகாப்பு.',
    rule14ImmunityTitle: 'விதி 14 இன் கீழ் சட்டப் பாதுகாப்பு (ஃபார்ம் V)',
    rule14ImmunityText: 'கட்டணம் செலுத்திய பிறகு 7 நாட்களுக்கு நேரடி அபராதங்களில் இருந்து சட்டப் பாதுகாப்பு உண்டு.',

    disputesPortalTitle: 'வணிகர் குறைகேட்பு மற்றும் தீர்வு மையம்',
    disputesPortalDesc: 'ஆய்வாளர் தாமதம் அல்லது இடையூறுகளுக்கு எதிராக அதிகாரப்பூர்வ புகார் அளியுங்கள்.',
    lodgeDisputeBtn: 'புதிய புகார் பதிவு செய்க',
    noDisputesMsg: 'நடப்பு புகார்கள் எதுவும் இல்லை.',

    langChangedToast: 'செயலியின் மொழி தமிழுக்கு மாற்றப்பட்டது',
  },

  te: {
    appLanguage: 'యాప్ భాష (Language)',
    changeLanguage: 'భాషను మార్చండి',
    selectLanguagePrompt: 'మీ ప్రాధాన్య వ్యాపార భాషను ఎంచుకోండి:',
    currentLanguageBadge: 'భాష: తెలుగు',
    portalTitle: 'వాణిజ్య బరువుల మరియు కొలతల రిజిస్ట్రీ',
    portalSubtitle: 'వినియోగదారుల వ్యవహారాల శాఖ క్రింద చట్టబద్ధంగా ధృవీకరించబడిన బరువు త్రాసులు. ప్రభుత్వ రుసుము చెల్లించి వెంటనే 7 రోజుల ఫారం V తాత్కాలిక టోకెన్ పొందండి.',
    authorizedTraderBadge: 'అధికారిక వ్యాపారి పోర్టల్',
    gstinLabel: 'జీఎస్టీ నంబర్ (GSTIN)',
    voiceAiBtn: 'మాట్లాడి టికెట్ పొందండి (Voice AI)',
    voiceAiSubtitle: 'యంత్రం పేరు & బరువు చెప్పండి • తక్షణ చలాన్ & టోకెన్',
    manualFormBtn: 'మాన్యువల్ ఫారం నింపండి',

    totalScales: 'మొత్తం నమోదైన కాటాలు',
    totalScalesSub: 'అధికారిక రికార్డులో',
    provisionalActive: '7 రోజుల ప్రొవిజనల్ యాక్టివ్',
    provisionalActiveSub: 'జరిమానాల నుండి చట్టపరమైన రక్షణ',
    verifiedCerts: 'ధృవీకరించబడిన ఈ-సర్టిఫికేట్లు',
    verifiedCertsSub: 'హోలోగ్రాఫిక్ క్యూఆర్ జారీ',
    vigilanceAlerts: 'విజిలెన్స్ హెచ్చరికలు',
    vigilanceAlertsSub: 'వినియోగదారుల ఫిర్యాదులు',

    myScalesTab: 'నా బరువు కాటాలు & త్రాసులు',
    disputesTab: 'ఫిర్యాదులు & పరిష్కార టికెట్లు',
    rulesTab: 'చట్టపరమైన నిబంధనలు (LM Act 2009)',

    inventoryHeader: 'నమోదైన వాణిజ్య బరువు కాటాల జాబితా',
    inventorySub: '7 రోజుల తాత్కాలిక టోకెన్ కోసం "ఫారం V చూడండి" క్లిక్ చేయండి',
    tokenActiveBadge: '7 రోజుల టోకెన్ యాక్టివ్',
    verifiedBadge: 'పూర్తిగా ధృవీకరించబడింది',
    reAuditBadge: 'పునః తనిఖీ ఆదేశించబడింది',
    pendingInspectionBadge: 'తనిఖీ పెండింగ్',
    capacityLabel: 'సామర్థ్యం (బరువు)',
    accuracyClassLabel: 'ఖచ్చితత్వ తరగతి (Class)',
    serialNumberLabel: 'క్రమ సంఖ్య (Serial No)',
    feePaidLabel: 'చెల్లించిన ఫీజు',
    legalShieldValidLabel: 'చట్టపరమైన రక్షణ చెల్లుబాటు:',
    qrTaggedLabel: 'క్యూఆర్ ట్యాగ్ చేయబడింది',
    reAuditReasonLabel: 'ఉన్నతాధికారి పునః తనిఖీ',
    viewFormVBtn: 'ఫారం V టోకెన్ చూడండి',
    downloadPdfBtn: 'పీడీఎఫ్ డౌన్‌లోడ్',

    searchScalesPlaceholder: 'మోడల్ లేదా క్రమ సంఖ్యను వెతకండి...',
    filterAll: 'అన్ని కాటాలు',
    filterProvisional: 'ప్రొవిజనల్ యాక్టివ్',
    filterVerified: 'ధృవీకరించబడింది',
    filterPending: 'తనిఖీ మిగిలివుంది',

    floatingVoiceBtn: 'మాట్లాడి కాటాను నమోదు చేయండి (Voice AI)',
    audioFeedbackNotice: 'వాయిస్ అసిస్టెంట్ 8 ప్రాంతీయ భాషల్లో అందుబాటులో ఉంది',
    voiceLanguageSyncedNotice: 'వాయిస్ అసిస్టెంట్ తెలుగు భాషకు సెట్ చేయబడింది',

    rulesTitle: 'లీగల్ మెట్రాలజీ చట్టం, 2009 నిబంధనలు',
    rulesDesc: 'తప్పనిసరి ధృవీకరణ మార్గదర్శకాలు మరియు వ్యాపారి రక్షణ నిబంధనలు.',
    rule14ImmunityTitle: 'నిబంధన 14 క్రింద చట్టపరమైన రక్షణ (ఫారం V)',
    rule14ImmunityText: 'ఆన్‌లైన్ ఫీజు చెల్లించిన తర్వాత 7 రోజుల పాటు ఆన్-స్పాట్ జరిమానాల నుండి పూర్తి చట్టపరమైన రక్షణ ఉంటుంది.',

    disputesPortalTitle: 'వ్యాపారి ఫిర్యాదు మరియు వివాద పరిష్కార కేంద్రం',
    disputesPortalDesc: 'ఇన్‌స్పెక్టర్ ఆలస్యం లేదా వేధింపులపై అంబుడ్స్‌మన్‌కు అధికారిక ఫిర్యాదు చేయండి.',
    lodgeDisputeBtn: 'కొత్త ఫిర్యాదును నమోదు చేయండి',
    noDisputesMsg: 'యాక్టివ్ ఫిర్యాదులేవీ లేవు.',

    langChangedToast: 'యాప్ భాష తెలుగుగా మార్చబడింది',
  },

  pa: {
    appLanguage: 'ਐਪ ਦੀ ਭਾਸ਼ਾ (Language)',
    changeLanguage: 'ਭਾਸ਼ਾ ਬਦਲੋ',
    selectLanguagePrompt: 'ਆਪਣੀ ਪਸੰਦੀਦਾ ਖੇਤਰੀ ਵਪਾਰਕ ਭਾਸ਼ਾ ਚੁਣੋ:',
    currentLanguageBadge: 'ਭਾਸ਼ਾ: ਪੰਜਾਬੀ',
    portalTitle: 'ਵਪਾਰਕ ਤੋਲ-ਮਾਪ ਪੋਰਟਲ ਅਤੇ ਕੰਡਾ ਰਜਿਸਟਰੀ',
    portalSubtitle: 'ਖਪਤਕਾਰ ਮਾਮਲੇ ਵਿਭਾਗ ਅਧੀਨ ਪ੍ਰਮਾਣਿਤ ਤੋਲ ਕੰਡੇ। ਸਰਕਾਰੀ ਫੀਸ ਭਰ ਕੇ ਤੁਰੰਤ 7-ਦਿਨਾਂ ਪ੍ਰੋਵੀਜ਼ਨਲ ਟੋਕਨ ਪ੍ਰਾਪਤ ਕਰੋ ਅਤੇ ਨਿਰਵਿਘਨ ਵਪਾਰ ਕਰੋ।',
    authorizedTraderBadge: 'ਅਧਿਕਾਰਤ ਵਪਾਰਕ ਪੋਰਟਲ',
    gstinLabel: 'ਜੀਐਸਟੀ ਨੰਬਰ (GSTIN)',
    voiceAiBtn: 'ਬੋਲ ਕੇ ਟਿਕਟ ਬਣਾਓ (Voice AI)',
    voiceAiSubtitle: 'ਮਸ਼ੀਨ ਦਾ ਨਾਮ ਅਤੇ ਵਜ਼ਨ ਬੋਲੋ • ਤੁਰੰਤ ਚਲਾਨ ਅਤੇ ਭੁਗਤਾਨ',
    manualFormBtn: 'ਮੈਨੁਅਲ ਫਾਰਮ ਭਰੋ',

    totalScales: 'ਕੁੱਲ ਰਜਿਸਟਰਡ ਕੰਡੇ',
    totalScalesSub: 'ਸਰਕਾਰੀ ਰਜਿਸਟਰੀ ਵਿੱਚ',
    provisionalActive: '7-ਦਿਨਾਂ ਪ੍ਰੋਵੀਜ਼ਨਲ ਸਰਗਰਮ',
    provisionalActiveSub: 'ਜੁਰਮਾਨੇ ਤੋਂ ਕਾਨੂੰਨੀ ਸੁਰੱਖਿਆ',
    verifiedCerts: 'ਪ੍ਰਮਾਣਿਤ ਈ-ਸਰਟੀਫਿਕੇਟ',
    verifiedCertsSub: 'ਹੋਲੋਗ੍ਰਾਫਿਕ ਕਿਊਆਰ ਜਾਰੀ',
    vigilanceAlerts: 'ਚੌਕਸੀ ਚੇਤਾਵਨੀਆਂ',
    vigilanceAlertsSub: 'ਖਪਤਕਾਰ ਸ਼ਿਕਾਇਤਾਂ',

    myScalesTab: 'ਮੇਰੇ ਤੋਲ ਕੰਡੇ ਤੇ ਤੱਕੜੀਆਂ',
    disputesTab: 'ਸ਼ਿਕਾਇਤ ਅਤੇ ਨਿਪਟਾਰਾ ਟਿਕਟਾਂ',
    rulesTab: 'ਕਾਨੂੰਨੀ ਨਿਯਮ (LM Act 2009)',

    inventoryHeader: 'ਰਜਿਸਟਰਡ ਵਪਾਰਕ ਤੋਲ ਕੰਡਿਆਂ ਦੀ ਸੂਚੀ',
    inventorySub: '7-ਦਿਨਾਂ ਪ੍ਰੋਵੀਜ਼ਨਲ ਟੋਕਨ ਦੇਖਣ ਲਈ "ਫਾਰਮ V ਦੇਖੋ" ਤੇ ਕਲਿੱਕ ਕਰੋ',
    tokenActiveBadge: '7-ਦਿਨਾਂ ਟੋਕਨ ਸਰਗਰਮ',
    verifiedBadge: 'ਪੂਰੀ ਤਰ੍ਹਾਂ ਪ੍ਰਮਾਣਿਤ',
    reAuditBadge: 'ਮੁੜ ਆਡਿਟ ਹੁਕਮ',
    pendingInspectionBadge: 'ਨਿਰੀਖਣ ਬਾਕੀ',
    capacityLabel: 'ਸਮਰੱਥਾ (ਵਜ਼ਨ)',
    accuracyClassLabel: 'ਸ਼ੁੱਧਤਾ ਸ਼੍ਰੇਣੀ (Class)',
    serialNumberLabel: 'ਸੀਰੀਅਲ ਨੰਬਰ',
    feePaidLabel: 'ਭਰੀ ਫੀਸ',
    legalShieldValidLabel: 'ਕਾਨੂੰਨੀ ਸੁਰੱਖਿਆ ਮਿਆਦ:',
    qrTaggedLabel: 'ਕਿਊਆਰ ਟੈਗ ਕੀਤਾ',
    reAuditReasonLabel: 'ਉੱਚ ਅਧਿਕਾਰੀ ਦੁਆਰਾ ਮੁੜ ਜਾਂਚ',
    viewFormVBtn: 'ਫਾਰਮ V ਟੋਕਨ ਦੇਖੋ',
    downloadPdfBtn: 'ਪੀਡੀਐਫ ਡਾਊਨਲੋਡ',

    searchScalesPlaceholder: 'ਮਾਡਲ ਜਾਂ ਸੀਰੀਅਲ ਨੰਬਰ ਖੋਜੋ...',
    filterAll: 'ਸਾਰੇ ਕੰਡੇ',
    filterProvisional: 'ਪ੍ਰੋਵੀਜ਼ਨਲ ਸਰਗਰਮ',
    filterVerified: 'ਪ੍ਰਮਾਣਿਤ',
    filterPending: 'ਨਿਰੀਖਣ ਬਾਕੀ',

    floatingVoiceBtn: 'ਬੋਲ ਕੇ ਕੰਡਾ ਰਜਿਸਟਰ ਕਰੋ (Voice AI)',
    audioFeedbackNotice: 'ਆਵਾਜ਼ ਸਹਾਇਕ 8 ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਉਪਲਬਧ',
    voiceLanguageSyncedNotice: 'ਵਾਇਸ ਅਸਿਸਟੈਂਟ ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਵਿੱਚ ਸੈੱਟ ਹੈ',

    rulesTitle: 'ਲੀਗਲ ਮੈਟ੍ਰੋਲੋਜੀ ਐਕਟ, 2009',
    rulesDesc: 'ਲਾਜ਼ਮੀ ਤਸਦੀਕ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼ ਅਤੇ ਵਪਾਰੀ ਸੁਰੱਖਿਆ ਅਧਿਕਾਰ।',
    rule14ImmunityTitle: 'ਨਿਯਮ 14 ਅਧੀਨ ਕਾਨੂੰਨੀ ਸੁਰੱਖਿਆ (ਫਾਰਮ V)',
    rule14ImmunityText: 'ਆਨਲਾਈਨ ਫੀਸ ਭਰਨ ਤੋਂ ਬਾਅਦ 7 ਦਿਨਾਂ ਲਈ ਮੌਕੇ ਤੇ ਜੁਰਮਾਨੇ ਜਾਂ ਜ਼ਬਤੀ ਤੋਂ ਪੂਰੀ ਕਾਨੂੰਨੀ ਸੁਰੱਖਿਆ ਮਿਲਦੀ ਹੈ।',

    disputesPortalTitle: 'ਵਪਾਰੀ ਸ਼ਿਕਾਇਤ ਤੇ ਨਿਵਾਰਨ ਕੇਂਦਰ',
    disputesPortalDesc: 'ਇੰਸਪੈਕਟਰ ਦੇਰੀ ਜਾਂ ਤੰਗ-ਪ੍ਰੇਸ਼ਾਨ ਕਰਨ ਵਿਰੁੱਧ ਸਰਕਾਰੀ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ।',
    lodgeDisputeBtn: 'ਨਵੀਂ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ',
    noDisputesMsg: 'ਕੋਈ ਚੱਲ ਰਹੀ ਸ਼ਿਕਾਇਤ ਨਹੀਂ ਮਿਲੀ।',

    langChangedToast: 'ਐਪ ਦੀ ਭਾਸ਼ਾ ਪੰਜਾਬੀ ਵਿੱਚ ਬਦਲ ਦਿੱਤੀ ਗਈ ਹੈ',
  },
};

export function getTranslations(lang: VendorLanguage): TranslationStrings {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
