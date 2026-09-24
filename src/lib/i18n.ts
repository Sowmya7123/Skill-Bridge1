import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type LanguageCode = "en" | "te" | "hi" | "ta" | "kn" | "ml" | "mr" | "bn";

const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    "app.title": "SkillBridge",
    "home": "Home",
    "about": "About",
    "signin_reg": "Sign In / Register",
    "hero.title": "Bridging Academia & Industry Talent Platform",
    "hero.desc": "SkillBridge connects students, corporate recruiters, deans, and certified industry mentors on a single verified platform.",
    "student.portal": "Student Portal",
    "recruiter.portal": "Recruitment Suite",
    "academic.portal": "Faculty Portal",
    "mentor.portal": "Mentor Desk",
  },
  te: {
    "app.title": "స్కిల్‌బ్రిడ్జ్",
    "home": "హోమ్",
    "about": "మా గురించి",
    "signin_reg": "సైన్ ఇన్ / రిజిస్టర్",
    "hero.title": "విద్యా మరియు పరిశ్రమల ప్రతిభ వేదిక",
    "hero.desc": "స్కిల్‌బ్రిడ్జ్ విద్యార్థులు, రిక్రూటర్లు మరియు మెంటార్లను ఒకే వేదికపైకి అనుసంధానిస్తుంది.",
    "student.portal": "స్టూడెంట్ పోర్టల్",
    "recruiter.portal": "రిక్రిూటర్ సూట్",
    "academic.portal": "ఫ్యాకల్టీ పోర్టల్",
    "mentor.portal": "మెంటార్ డెస్క్",
  },
  hi: {
    "app.title": "स्किलब्रिज",
    "home": "होम",
    "about": "हमारे बारे में",
    "signin_reg": "साइन इन / रजिस्टर",
    "hero.title": "अकादमिक और उद्योग प्रतिभा मंच",
    "hero.desc": "स्किलब्रिज छात्रों, कॉर्पोरेट भर्तीकर्ताओं और सलाहकारों को एक ही मंच पर जोड़ता है।",
    "student.portal": "छात्र पोर्टल",
    "recruiter.portal": "भर्ती सुइट",
    "academic.portal": "संकाय पोर्टल",
    "mentor.portal": "मेंटॉर डेस्क",
  },
  ta: {
    "app.title": "ஸ்கில்பிரிட்ஜ்",
    "home": "முகப்பு",
    "about": "பற்றி",
    "signin_reg": "உள்நுழைக / பதிவு செய்க",
    "hero.title": "கல்வி மற்றும் தொழில்துறை திறமை தளம்",
    "hero.desc": "மாணவர்கள், நிறுவன recruiters மற்றும் mentor-களை இணைக்கும் தளம்.",
    "student.portal": "மாணவர் போர்டல்",
    "recruiter.portal": "வேலைவாய்ப்பு தளம்",
    "academic.portal": "ஆசிரியர் போர்டல்",
    "mentor.portal": "வழிகாட்டி மேசை",
  },
  kn: {
    "app.title": "ಸ್ಕಿಲ್ ಬ್ರಿಡ್ಜ್",
    "home": "ಮುಖಪುಟ",
    "about": "ನಮ್ಮ ಬಗ್ಗೆ",
    "signin_reg": "ಸೈನ್ ಇನ್ / ನೋಂದಣಿ",
    "hero.title": "ಶೈಕ್ಷಣಿಕ ಮತ್ತು ಕೈಗಾರಿಕಾ ಪ್ರತಿಭಾ ವೇದಿಕೆ",
    "hero.desc": "ವಿದ್ಯಾರ್ಥಿಗಳು, ನೇಮಕಾತದಾರರು ಮತ್ತು ಮಾರ್ಗದರ್ಶಕರನ್ನು ಒಂದೇ ವೇದಿಕೆಯಲ್ಲಿ ಸಂಪರ್ಕಿಸುತ್ತದೆ.",
    "student.portal": "ವಿದ್ಯಾರ್ಥಿ ಪೋರ್ಟಲ್",
    "recruiter.portal": "ನೇಮಕಾತಿ ಸೂಟ್",
    "academic.portal": "ಅಧ್ಯಾಪಕರ ಪೋರ್ಟಲ್",
    "mentor.portal": "ಮಾರ್ಗದರ್ಶಕ ಪೀಠ",
  },
  ml: {
    "app.title": "സ്കിൽബ്രിഡ്ജ്",
    "home": "ഹോം",
    "about": "ഞങ്ങളെക്കുറിച്ച്",
    "signin_reg": "സൈൻ ഇൻ / രജിസ്റ്റർ",
    "hero.title": "അക്കാദമിയെയും വ്യവസായ പ്രതിഭകളെയും ബന്ധിപ്പിക്കുന്ന പ്ലാറ്റ്‌ഫോം",
    "hero.desc": "വിദ്യാർത്ഥികളെയും റിക്രൂട്ടർമാരെയും മെന്റർമാരെയും ഒരൊറ്റ പ്ലാറ്റ്‌ഫോമിൽ ബന്ധിപ്പിക്കുന്നു.",
    "student.portal": "സ്റ്റുഡന്റ് പോർട്ടൽ",
    "recruiter.portal": "റക്രൂട്ട്മെന്റ് സ്യൂട്ട്",
    "academic.portal": "ഫാക്കൽറ്റി പോർട്ടൽ",
    "mentor.portal": "മെന്റർ ഡെസ്ക്",
  },
  mr: {
    "app.title": "स्किलब्रिज",
    "home": "मुखपृष्ठ",
    "about": "आमच्याबद्दल",
    "signin_reg": "साइन इन / नोंदणी",
    "hero.title": "शैक्षणिक आणि उद्योग प्रतिभा मंच",
    "hero.desc": "स्किलब्रिज विद्यार्थी, कॉर्पोरेट रिक्रूटर्स आणि मेंटर्सना एकाच व्यासपीठावर जोडते.",
    "student.portal": "विद्यार्थी पोर्टल",
    "recruiter.portal": "भर्ती संच",
    "academic.portal": "प्राध्यापक पोर्टल",
    "mentor.portal": "मेंटॉर डेस्क",
  },
  bn: {
    "app.title": "স্কিলব্রিজ",
    "home": "হোম",
    "about": "সম্পর্কে",
    "signin_reg": "সাইন ইন / রেজিস্টার",
    "hero.title": "একাডেমি ও ইন্ডাস্ট্রি ট্যালেন্ট প্ল্যাটফর্ম",
    "hero.desc": "স্কিলব্রিজ শিক্ষার্থী, নিয়োগকর্তা এবং মেন্টরদের একটি একক প্ল্যাটফর্মে সংযুক্ত করে।",
    "student.portal": "ছাত্র পোর্টাল",
    "recruiter.portal": "নিয়োগ স্যুট",
    "academic.portal": "শিক্ষক পোর্টাল",
    "mentor.portal": "মেন্টর ডেস্ক",
  }
};

interface LanguageContextType {
  lang: LanguageCode;
  setLang: (code: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<LanguageCode>("en");

  useEffect(() => {
    const saved = localStorage.getItem("skillbridge_lang") as LanguageCode;
    if (saved && TRANSLATIONS[saved]) {
      setLangState(saved);
    }
  }, []);

  const setLang = (code: LanguageCode) => {
    localStorage.setItem("skillbridge_lang", code);
    setLangState(code);
  };

  const t = (key: string) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS["en"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);