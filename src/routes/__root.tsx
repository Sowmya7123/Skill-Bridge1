import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, useRef, createContext, useContext, type ReactNode } from "react";
import { Globe, MoreVertical, Check } from "lucide-react";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { AppStateProvider } from "@/lib/app-state";
import { reportLovableError } from "../lib/lovable-error-reporting";

// -------------------------------------------------------------
// 8-LANGUAGE GLOBAL DICTIONARY MAPPING FOR ENTIRE APP
// -------------------------------------------------------------
export type LanguageCode = "en" | "te" | "hi" | "ta" | "kn" | "ml" | "mr" | "bn";

const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    "app.title": "SkillBridge",
    "home": "Home",
    "about": "About",
    "signin_reg": "Sign In / Register",
    "hero.badge": "Unified Academia & Industry Exchange",
    "hero.title": "Bridging Academia & Industry Talent Platform",
    "hero.desc": "SkillBridge connects students, corporate recruiters, deans, and certified industry mentors on a single verified platform.",
    "btn.signin": "Sign In / Register",
    "btn.learn": "Learn More",
  },
  te: {
    "app.title": "స్కిల్‌బ్రిడ్జ్",
    "home": "హోమ్",
    "about": "మా గురించి",
    "signin_reg": "సైన్ ఇన్ / రిజిస్టర్",
    "hero.badge": "విద్యా మరియు పరిశ్రమల సమాఖ్య",
    "hero.title": "విద్యా మరియు పరిశ్రమల ప్రతిభ వేదిక",
    "hero.desc": "స్కిల్‌బ్రిడ్జ్ విద్యార్థులు, రిక్రూటర్లు మరియు మెంటార్లను ఒకే వేదికపైకి అనుసంధానిస్తుంది.",
    "btn.signin": "సైన్ ఇన్ / రిజిస్టర్",
    "btn.learn": "మరింత తెలుసుకోండి",
  },
  hi: {
    "app.title": "स्किलब्रिज",
    "home": "होम",
    "about": "हमारे बारे में",
    "signin_reg": "साइन इन / रजिस्टर",
    "hero.badge": "एकीकृत अकादमी और उद्योग एक्सचेंज",
    "hero.title": "अकादमिक और उद्योग प्रतिभा मंच",
    "hero.desc": "स्किलब्रिज छात्रों, कॉर्पोरेट भर्तीकर्ताओं और सलाहकारों को एक ही मंच पर जोड़ता है।",
    "btn.signin": "साइन इन / रजिस्टर",
    "btn.learn": "और जानें",
  },
  ta: {
    "app.title": "ஸ்கில்பிரிட்ஜ்",
    "home": "முகப்பு",
    "about": "பற்றி",
    "signin_reg": "உள்நுழைக / பதிவு செய்க",
    "hero.badge": "கல்வி மற்றும் தொழில்துறை பரிமாற்றம்",
    "hero.title": "கல்வி மற்றும் தொழில்துறை திறமை தளம்",
    "hero.desc": "மாணவர்கள், நிறுவன recruiters மற்றும் mentor-களை இணைக்கும் தளம்.",
    "btn.signin": "உள்நுழைக / பதிவு செய்க",
    "btn.learn": "மேலும் அறிக",
  },
  kn: {
    "app.title": "ಸ್ಕಿಲ್ ಬ್ರಿಡ್ಜ್",
    "home": "ಮುಖಪುಟ",
    "about": "ನಮ್ಮ ಬಗ್ಗೆ",
    "signin_reg": "ಸೈನ್ ಇನ್ / ನೋಂದಣಿ",
    "hero.badge": "ಶೈಕ್ಷಣಿಕ ಮತ್ತು ಕೈಗಾರಿಕಾ ವಿನಿಮಯ",
    "hero.title": "ಶೈಕ್ಷಣಿಕ ಮತ್ತು ಕೈಗಾರಿಕಾ ಪ್ರತಿಭಾ ವೇದಿಕೆ",
    "hero.desc": "ವಿದ್ಯಾರ್ಥಿಗಳು, ನೇಮಕಾತದಾರರು ಮತ್ತು ಮಾರ್ಗದರ್ಶಕರನ್ನು ಒಂದೇ ವೇದಿಕೆಯಲ್ಲಿ ಸಂಪರ್ಕಿಸುತ್ತದೆ.",
    "btn.signin": "ಸೈನ್ ಇನ್ / ನೋಂದಣಿ",
    "btn.learn": "ಹೆಚ್ಚು ತಿಳಿಯಿರಿ",
  },
  ml: {
    "app.title": "സ്കിൽബ്രിഡ്ജ്",
    "home": "ഹോം",
    "about": "ഞങ്ങളെക്കുറിച്ച്",
    "signin_reg": "സൈൻ ഇൻ / രജിസ്റ്റർ",
    "hero.badge": "അക്കാദമി & ഇൻഡസ്ട്രി എക്സ്ചേഞ്ച്",
    "hero.title": "അക്കാദമിയെയും വ്യവസായ പ്രതിഭകളെയും ബന്ധിപ്പിക്കുന്ന പ്ലാറ്റ്‌ഫോം",
    "hero.desc": "വിദ്യാർത്ഥികളെയും റിക്രൂട്ടർമാരെയും മെന്റർമാരെയും ഒരൊറ്റ പ്ലാറ്റ്‌ഫോമിൽ ബന്ധിപ്പിക്കുന്നു.",
    "btn.signin": "സൈൻ ഇൻ / രജിസ്റ്റർ",
    "btn.learn": "കൂടുതൽ അറിയുക",
  },
  mr: {
    "app.title": "स्किलब्रिज",
    "home": "मुखपृष्ठ",
    "about": "आमच्याबद्दल",
    "signin_reg": "साइन इन / नोंदणी",
    "hero.badge": "शैक्षणिक आणि उद्योग एक्सचेंज",
    "hero.title": "शैक्षणिक आणि उद्योग प्रतिभा मंच",
    "hero.desc": "स्किलब्रिज विद्यार्थी, कॉर्पोरेट रिक्रूटर्स आणि मेंटर्सना एकाच व्यासपीठावर जोडते.",
    "btn.signin": "साइन इन / नोंदणी",
    "btn.learn": "अधिक जाणून घ्या",
  },
  bn: {
    "app.title": "স্কিলব্রিজ",
    "home": "হোম",
    "about": "সম্পর্কে",
    "signin_reg": "সাইন ইন / রেজিস্টার",
    "hero.badge": "একাডেমি ও ইন্ডাস্ট্রি এক্সচেঞ্জ",
    "hero.title": "একাডেমি ও ইন্ডাস্ট্রি ট্যালেন্ট প্ল্যাটফর্ম",
    "hero.desc": "স্কিলব্রিজ শিক্ষার্থী, নিয়োগকর্তা এবং মেন্টরদের একটি একক প্ল্যাটফর্মে সংযুক্ত করে।",
    "btn.signin": "সাইন ইন / রেজিস্টার",
    "btn.learn": "আরও জানুন",
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

export const useTranslation = () => useContext(LanguageContext);

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SkillBridge" },
      {
        name: "description",
        content:
          "Smart automation portal connecting students, academia, and industry for personalized skill mapping and placement.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

export function GlobalLanguageMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang } = useTranslation();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (langCode: LanguageCode) => {
    setLang(langCode);
    setIsOpen(false);
  };

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: "en", label: "English", native: "English" },
    { code: "te", label: "Telugu", native: "తెలుగు" },
    { code: "hi", label: "Hindi", native: "हिंदी" },
    { code: "ta", label: "Tamil", native: "தமிழ்" },
    { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
    { code: "ml", label: "Malayalam", native: "മലയാളം" },
    { code: "mr", label: "Marathi", native: "मराठी" },
    { code: "bn", label: "Bengali", native: "বাংলা" },
  ];

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
        title="Language"
      >
        <MoreVertical className="size-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl z-50">
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1 sticky top-0 bg-white z-10">
            <Globe className="size-3.5" />
            Select Language
          </div>
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => handleLanguageSelect(item.code)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <div className="flex flex-col text-left">
                <span className="font-semibold text-slate-900">{item.native}</span>
                <span className="text-[10px] text-slate-400">{item.label}</span>
              </div>
              {lang === item.code && <Check className="size-3.5 text-blue-600 stroke-[2.5]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
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
    <QueryClientProvider client={queryClient}>
      <AppStateProvider>
        <LanguageContext.Provider value={{ lang, setLang, t }}>
          <Outlet />
          <Toaster position="top-right" richColors />
        </LanguageContext.Provider>
      </AppStateProvider>
    </QueryClientProvider>
  );
}