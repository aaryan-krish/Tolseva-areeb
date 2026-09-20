import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Fallback NLP parser for multi-lingual input
function parseLocalVoiceText(speechText: string, lang: string) {
  const lower = speechText.toLowerCase();

  // 1. Detect weight capacity
  let weight = 30; // default commercial 30kg scale
  const numMatch = speechText.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilo|किलो|किलोग्राम|क्विंटल|quintal|ton|टन|g|gm|ग्राम)?/i);
  if (numMatch && numMatch[1]) {
    weight = parseFloat(numMatch[1]);
    if (lower.includes("quintal") || lower.includes("क्विंटल")) weight *= 100;
    if (lower.includes("ton") || lower.includes("टन")) weight *= 1000;
    if (lower.includes("ग्राम") || lower.includes("gm") || lower.includes("gram")) weight = weight / 1000;
  } else {
    // Word numbers in Hindi / Indian languages
    if (/पांच|पाँच|five/i.test(lower)) weight = 5;
    else if (/दस|ten/i.test(lower)) weight = 10;
    else if (/पंद्रह|fifteen/i.test(lower)) weight = 15;
    else if (/बीस|twenty/i.test(lower)) weight = 20;
    else if (/तीस|thirty/i.test(lower)) weight = 30;
    else if (/पचास|fifty/i.test(lower)) weight = 50;
    else if (/सौ|one hundred|hundred/i.test(lower)) weight = 100;
    else if (/दो सौ|two hundred/i.test(lower)) weight = 200;
    else if (/तीन सौ|three hundred/i.test(lower)) weight = 300;
    else if (/पांच सौ|five hundred/i.test(lower)) weight = 500;
  }

  // 2. Detect machine brand/name
  let machineName = "Essae Digital Counter Scale";
  if (/phoenix|फीनिक्स|fenix/i.test(lower)) {
    machineName = "Phoenix Bench Scale";
  } else if (/avery|एवरी/i.test(lower)) {
    machineName = "Avery Berkel Commercial Scale";
  } else if (/eagle|ईगल/i.test(lower)) {
    machineName = "Eagle Precision Electronic Balance";
  } else if (/crown|क्राउन/i.test(lower)) {
    machineName = "Crown Standard Platform Scale";
  } else if (/cas|कैस/i.test(lower)) {
    machineName = "CAS Digital Retail Scale";
  } else if (/swastik|स्वास्तिक/i.test(lower)) {
    machineName = "Swastik Industrial Heavy Scale";
  } else if (/gold|jewel|सोना|ज्वेलरी|आभूषण/i.test(lower)) {
    machineName = "Precision Gold Jeweller Balance";
  } else if (/weighbridge|धर्मकांटा|धर्म कांटा/i.test(lower)) {
    machineName = "Heavy Duty Commercial Weighbridge";
  } else if (/platform|प्लेटफॉर्म|तराजू/i.test(lower)) {
    machineName = "Heavy Industrial Platform Scale";
  } else if (/kirana|grocery|किराना|दुकान|सब्जी|मंडी/i.test(lower)) {
    machineName = "Essae DS-215 Kirana Counter Scale";
  }

  // 3. Category and Accuracy Class (OIML R 76)
  let category = "Electronic Counter Scale";
  let accuracyClass: "Class I" | "Class II" | "Class III" | "Class IV" = "Class III";
  let manufacturer = "Essae-Teraoka Pvt. Ltd.";
  let modelCode = "DS252";
  let verificationIntervalValue = 5;
  let verificationIntervalUnit: "mg" | "g" | "kg" = "g";
  let modelApprovalNumber = "IND/09/2022/418";

  if (weight <= 0.5) {
    category = "Precision Gold Balance";
    accuracyClass = "Class I";
    manufacturer = "Sartorius Lab Instruments";
    modelCode = "BSA224";
    verificationIntervalValue = 1;
    verificationIntervalUnit = "mg";
    modelApprovalNumber = "IND/09/2021/102";
  } else if (weight <= 2 || /jewel|gold|सोना/i.test(lower)) {
    category = "Precision Gold Balance";
    accuracyClass = "Class II";
    manufacturer = "A&D Weighing Instruments";
    modelCode = "EK600I";
    verificationIntervalValue = 10;
    verificationIntervalUnit = "mg";
    modelApprovalNumber = "IND/09/2023/215";
  } else if (weight > 300 || /weighbridge|धर्मकांटा/i.test(lower)) {
    category = "Weighbridge";
    accuracyClass = "Class IV";
    manufacturer = "Avery India Limited";
    modelCode = "WB500";
    verificationIntervalValue = 50;
    verificationIntervalUnit = "kg";
    modelApprovalNumber = "IND/09/2020/088";
  } else if (weight > 50) {
    category = "Platform Scale";
    accuracyClass = "Class III";
    manufacturer = "Phoenix Scales Pvt. Ltd.";
    modelCode = "PF100";
    verificationIntervalValue = 20;
    verificationIntervalUnit = "g";
    modelApprovalNumber = "IND/09/2022/330";
  } else {
    category = "Electronic Counter Scale";
    accuracyClass = "Class III";
    manufacturer = "Essae-Teraoka Pvt. Ltd.";
    modelCode = "DS252";
    verificationIntervalValue = 5;
    verificationIntervalUnit = "g";
    modelApprovalNumber = "IND/09/2022/418";
  }

  const currentYear = new Date().getFullYear();
  const seqId = Math.floor(1000 + Math.random() * 9000).toString();
  const serialNumber = `FAC01-${currentYear}-${modelCode}-${seqId}`;
  const classCode = accuracyClass === "Class I" ? "S" : accuracyClass === "Class II" ? "H" : accuracyClass === "Class III" ? "M" : "O";
  const stampedIdentifier = `OIML-IND-${currentYear}-FAC01-${seqId}-${classCode}`;

  // Fee calculation
  let baseFee = 500;
  if (accuracyClass === "Class I") baseFee = 2500;
  else if (accuracyClass === "Class II") baseFee = 1500;
  else if (accuracyClass === "Class III") {
    baseFee = weight <= 50 ? 500 : weight <= 500 ? 850 : 2000;
  } else {
    baseFee = weight > 1000 ? 3500 : 800;
  }
  const statutoryFee = baseFee + 50 + Math.round((baseFee + 50) * 0.18);

  // Audio confirmation speech
  let confirmationSpeech = `मशीन '${machineName}', क्षमता ${weight} किलोग्राम दर्ज कर ली गई है। आपका चालान टिकट तैयार है। भुगतान गेटवे पर भेजा जा रहा है।`;
  if (lang === "mr") {
    confirmationSpeech = `मशीन '${machineName}', क्षमता ${weight} किलो नोंदवली आहे. आपले चलन तिकीट तयार आहे. पेमेंट गेटवे उघडत आहे.`;
  } else if (lang === "gu") {
    confirmationSpeech = `મશીન '${machineName}', ક્ષમતા ${weight} કિલો નોંધાયેલ છે. તમારું ચલણ ટિકિટ તૈયાર છે. પેમેન્ટ ગેટવે પર જઈ રહ્યા છીએ.`;
  } else if (lang === "bn") {
    confirmationSpeech = `মেশিন '${machineName}', ওজন ${weight} কেজি রেকর্ড করা হয়েছে। আপনার চালান টিকিট প্রস্তুত। পেমেন্ট গেটওয়েতে নিয়ে যাচ্ছি।`;
  } else if (lang === "ta") {
    confirmationSpeech = `இயந்திரம் '${machineName}', எடை ${weight} கிலோ பதிவு செய்யப்பட்டது. உங்கள் கட்டண டிக்கெட் தயாராக உள்ளது.`;
  } else if (lang === "te") {
    confirmationSpeech = `మెషిన్ '${machineName}', బరువు ${weight} కిలోలు నమోదు చేయబడింది. మీ చలాన్ టికెట్ సిద్ధంగా ఉంది. పేమెంట్ గేట్‌వేకి తీసుకువెళుతున్నాము.`;
  } else if (lang === "en") {
    confirmationSpeech = `Machine '${machineName}', capacity ${weight} kg verified. Verification ticket generated. Redirecting to payment gateway.`;
  }

  return {
    machineName,
    weightCategoryKg: weight,
    category,
    accuracyClass,
    manufacturer,
    modelApprovalNumber,
    verificationIntervalValue,
    verificationIntervalUnit,
    serialNumber,
    stampedIdentifier,
    languageDetected: lang,
    confirmationSpeech,
    statutoryFee,
  };
}

// API Health
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "TolSeva AI Voice Assistant Backend" });
});

// Voice Parsing with Gemini 3.8 Flash
app.post("/api/voice/parse", async (req, res) => {
  try {
    const { speechText, language = "hi" } = req.body;
    if (!speechText || typeof speechText !== "string") {
      return res.status(400).json({ error: "speechText is required" });
    }

    const hasRealKey = process.env.GEMINI_API_KEY && 
      process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY" && 
      !process.env.GEMINI_API_KEY.includes("MY_GEMINI");

    if (hasRealKey) {
      try {
        const prompt = `You are the TolSeva (Smart India Hackathon 2026) AI Voice Assistant for local Indian vendors.
An illiterate or local merchant has spoken in Hindi, Marathi, Gujarati, Bengali, Tamil, Telugu, or English.
Input text: "${speechText}"
Language code: "${language}"

Task: Extract machine name and weight category, determine Legal Metrology category and statutory fee.
Rules:
- machineName: brand/model name (e.g., 'Essae DS-252 Counter Scale', 'Phoenix Bench Scale', 'Avery Scale', 'Kirana Digital Scale')
- weightCategoryKg: number in kg (e.g. 15, 30, 50, 100, 300)
- category: one of 'Electronic Counter Scale', 'Platform Scale', 'Bench Scale', 'Weighbridge', 'Precision Gold Balance'
- accuracyClass: one of 'Class I', 'Class II', 'Class III', 'Class IV'
- serialNumber: OIML pattern formatted as [FactoryCode]-[Year]-[Model]-[SeqID], e.g. 'FAC01-2024-DS252-0042'
- modelApprovalNumber: string like 'IND/09/2022/418'
- verificationIntervalValue: number (e.g. 5 for Class III 30kg, 1 for Class I)
- verificationIntervalUnit: one of 'mg', 'g', 'kg'
- stampedIdentifier: format 'OIML-IND-2024-FAC01-0042-M'
- confirmationSpeech: A friendly 1-2 sentence spoken confirmation in the user's language stating the machine name and weight, telling them ticket is generated and opening payment gateway.
- statutoryFee: Total in INR (including 18% GST). Standard 30kg counter scale is 649.

Output strictly JSON:
{
  "machineName": "string",
  "weightCategoryKg": 30,
  "category": "Electronic Counter Scale",
  "accuracyClass": "Class III",
  "serialNumber": "FAC01-2024-DS252-0042",
  "modelApprovalNumber": "IND/09/2022/418",
  "verificationIntervalValue": 5,
  "verificationIntervalUnit": "g",
  "stampedIdentifier": "OIML-IND-2024-FAC01-0042-M",
  "languageDetected": "string",
  "confirmationSpeech": "string",
  "statutoryFee": 649
}`;

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Gemini API timeout")), 3500)
        );

        const geminiPromise = ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);

        if (response?.text) {
          const parsed = JSON.parse(response.text.trim());
          return res.json({ success: true, ...parsed });
        }
      } catch (geminiError: any) {
        console.warn("Gemini parsing error or timeout, falling back to local NLP:", geminiError?.message);
      }
    }

    const fallbackResult = parseLocalVoiceText(speechText, language);
    return res.json({ success: true, ...fallbackResult });
  } catch (err: any) {
    console.error("Error processing voice:", err);
    res.status(500).json({ error: err.message || "Failed to parse voice" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
