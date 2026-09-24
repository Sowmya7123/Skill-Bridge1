import { useState, useEffect } from "react";

export type LanguageCode = "en" | "te" | "hi" | "ta" | "kn" | "ml" | "mr" | "bn";

const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    "app.title": "SkillBridge",
    "hero.badge": "Unified Academia & Industry Exchange",
    "hero.title": "Bridging Academia & Industry Talent Platform",
    "hero.desc": "SkillBridge connects students, corporate recruiters, deans, and certified industry mentors on a single verified platform.",
    "btn.signin": "Sign In / Register",
    "btn.learn": "Learn More",
    "about.title": "About SkillBridge",
    "about.desc": "Our platform bridges the gap between academic institutions and top-tier global enterprise recruitment.",
  },
  te: {
    "app.title": "స్కిల్‌బ్రిడ్జ్",
    "hero.badge": "విద్యా మరియు పరిశ్రమల సమాఖ్య",
    "hero.title": "విద్యా మరియు పరిశ్రమల ప్రతిభ వేదిక",
    "hero.desc": "స్కిల్‌బ్రిడ్జ్ విద్యార్థులు, రిక్రూటర్లు మరియు మెంటార్లను ఒకే వేదికపైకి అనుసంధానిస్తుంది.",
    "btn.signin": "సైన్ ఇన్ / రిజిస్టర్",
    "btn.learn": "మరింత తెలుసుకోండి",
    "about.title": "స్కిల్‌బ్రిడ్జ్ గురించి",
    "about.desc": "విద్యా సంస్థలకు మరియు కార్పొరేట్ కంపెనీలకు మధ్య ఉన్న అంతరాన్ని మా వేదిక పూడుస్తుంది.",
  },
  hi: {
    "app.title": "स्किलब्रिज",
    "hero.badge": "एकीकृत अकादमी और उद्योग एक्सचेंज",
    "hero.title": "अकादमिक और उद्योग प्रतिभा मंच",
    "hero.desc": "स्किलब्रिज छात्रों, कॉर्पोरेट भर्तीकर्ताओं और सलाहकारों को एक ही मंच पर जोड़ता है।",
    "btn.signin": "साइन इन / रजिस्टर",
    "btn.learn": "और जानें",
    "about.title": "स्किलब्रिज के बारे में",
    "about.desc": "हमारा मंच शैक्षणिक संस्थानों और कॉर्पोरेट जगत के बीच की दूरी को कम करता है।",
  },
  ta: {
    "app.title": "ஸ்கில்பிரிட்ஜ்",
    "hero.badge": "கல்வி மற்றும் தொழில்துறை பரிமாற்றம்",
    "hero.title": "கல்வி மற்றும் தொழில்துறை திறமை தளம்",
    "hero.desc": "மாணவர்கள், நிறுவன recruiters மற்றும் mentor-களை இணைக்கும் தளம்.",
    "btn.signin": "உள்நுழைக / பதிவு செய்க",
    "btn.learn": "மேலும் அறிக",
    "about.title": "ஸ்கில்பிரிட்ஜ் பற்றி",
    "about.desc": "கல்வி நிறுவனங்களுக்கும் பெரு நிறுவனங்களுக்கும் இடையேயான இடைவெளியைக் குறைக்கிறது.",
  },
  kn: {
    "app.title": "ಸ್ಕಿಲ್ ಬ್ರಿಡ್ಜ್",
    "hero.badge": "ಶೈಕ್ಷಣಿಕ ಮತ್ತು ಕೈಗಾರಿಕಾ ವಿನಿಮಯ",
    "hero.title": "ಶೈಕ್ಷಣಿಕ ಮತ್ತು ಕೈಗಾರಿಕಾ ಪ್ರತಿಭಾ ವೇದಿಕೆ",
    "hero.desc": "ವಿದ್ಯಾರ್ಥಿಗಳು, ನೇಮಕಾತದಾರರು ಮತ್ತು ಮಾರ್ಗದರ್ಶಕರನ್ನು ಒಂದೇ ವೇದಿಕೆಯಲ್ಲಿ ಸಂಪರ್ಕಿಸುತ್ತದೆ.",
    "btn.signin": "ಸೈನ್ ಇನ್ / ನೋಂದಣಿ",
    "btn.learn": "더 ಹೆಚ್ಚು ತಿಳಿಯಿರಿ",
    "about.title": "ಸ್ಕಿಲ್ ಬ್ರಿಡ್ಜ್ ಬಗ್ಗೆ",
    "about.desc": "ಶಿಕ್ಷಣ ಸಂಸ್ಥೆಗಳು ಮತ್ತು ಕಾರ್ಪೊರೇಟ್ ಕಂಪನಿಗಳ ನಡುವಿನ ಅಂತರವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.",
  },
  ml: {
    "app.title": "സ്കിൽബ്രിഡ്ജ്",
    "hero.badge": "അക്കാദമി & ഇൻഡസ്ട്രി എക്സ്ചേഞ്ച്",
    "hero.title": "അക്കാദമിയെയും വ്യവസായ പ്രതിഭകളെയും ബന്ധിപ്പിക്കുന്ന പ്ലാറ്റ്‌ഫോം",
    "hero.desc": "വിദ്യാർത്ഥികളെയും റിക്രൂട്ടർമാരെയും മെന്റർമാരെയും ഒരൊറ്റ പ്ലാറ്റ്‌ഫോമിൽ ബന്ധിപ്പിക്കുന്നു.",
    "btn.signin": "സൈൻ ഇൻ / രജിസ്റ്റർ",
    "btn.learn": "കൂടുതൽ അറിയുക",
    "about.title": "സ്കിൽബ്രിഡ്ജിനെക്കുറിച്ച്",
    "about.desc": "വിദ്യാഭ്യാസ സ്ഥാപനങ്ങളും കോർപ്പറേറ്റ് സ്ഥാപനങ്ങളും തമ്മിലുള്ള അന്തരം കുറയ്ക്കുന്നു.",
  },
  mr: {
    "app.title": "स्किलब्रिज",
    "hero.badge": "शैक्षणिक आणि उद्योग एक्सचेंज",
    "hero.title": "शैक्षणिक आणि उद्योग प्रतिभा मंच",
    "hero.desc": "स्किलब्रिज विद्यार्थी, कॉर्पोरेट रिक्रूटर्स आणि मेंटर्सना एकाच व्यासपीठावर जोडते.",
    "btn.signin": "साइन इन / नोंदणी",
    "btn.learn": "अधिक जाणून घ्या",
    "about.title": "स्किलब्रिजबद्दल",
    "about.desc": "आमचे व्यासपीठ शैक्षणिक संस्था आणि कॉर्पोरेट कंपन्यांमधील अंतर भरून काढते.",
  },
  bn: {
    "app.title": "স্কিলব্রিজ",
    "hero.badge": "একাডেমি ও ইন্ডাস্ট্রি এক্সচেঞ্জ",
    "hero.title": "একাডেমি ও ইন্ডাস্ট্রি ট্যালেন্ট প্ল্যাটফর্ম",
    "hero.desc": "স্কিলব্রিজ শিক্ষার্থী, নিয়োগকর্তা এবং মেন্টরদের একটি একক প্ল্যাটফর্মে সংযুক্ত করে।",
    "btn.signin": "সাইন ইন / রেজিস্টার",
    "btn.learn": "আরও জানুন",
    "about.title": "স্কিলব্রিজ সম্পর্কে",
    "about.desc": "আমাদের প্ল্যাটফর্ম শিক্ষা প্রতিষ্ঠান এবং কর্পোরেট নিয়োগের মধ্যকার দূরত্ব কমায়।",
  }
};

export function useTranslation() {
  const [lang, setLang] = useState<LanguageCode>("en");

  useEffect(() => {
    const saved = localStorage.getItem("skillbridge_lang") as LanguageCode;
    if (saved && translations[saved]) {
      setLang(saved);
    }
  }, []);

  const changeLanguage = (code: LanguageCode) => {
    localStorage.setItem("skillbridge_lang", code);
    setLang(code);
    window.location.reload();
  };

  const t = (key: string) => {
    return translations[lang]?.[key] || translations["en"]?.[key] || key;
  };

  return { t, lang, changeLanguage };
}