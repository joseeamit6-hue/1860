import React, { useState, useEffect, useRef } from "react";
import { 
  Facebook, 
  Instagram, 
  Mail, 
  MessageSquare, 
  Search, 
  MapPin, 
  ExternalLink, 
  Menu, 
  X, 
  ChevronRight,
  Shield,
  Briefcase,
  Layers,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Check
} from "lucide-react";
import { CMSData, SliderItem, SocialItem, EducationItem, ToolItem, InterestItem, ServiceItem } from "../types";
import { NepaliCalendar } from "./NepaliCalendar";

interface PortfolioViewProps {
  cmsData: CMSData;
  language: "en" | "np";
  setLanguage: (lang: "en" | "np") => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  onAdminClick: () => void;
  incrementViews: () => void;
  showAdminGate?: boolean;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  cmsData,
  language,
  setLanguage,
  isDarkMode,
  setIsDarkMode,
  onAdminClick,
  incrementViews,
  showAdminGate = false
}) => {
  const { settings, sliders, socials, initiatives, educations, tools, interests, services, blogs } = cmsData;

  // Active hash route state
  const [activeTab, setActiveTab] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResponse, setSearchResponse] = useState<string | null>(null);
  const [searchTargetSection, setSearchTargetSection] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  // Sliders state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Modals state
  const [activeModal, setActiveModal] = useState<{
    type: "bio" | "connect" | "initiative" | "education" | "tool" | "interest" | "service" | "tools-more" | "services-more" | "success";
    data?: any;
  } | null>(null);

  // Suggestion Form state
  const [suggestionForm, setSuggestionForm] = useState({
    name: "",
    address: "",
    contact: "",
    suggestion: ""
  });

  // Reference for scrolling
  const sectionRefs = {
    home: useRef<HTMLDivElement>(null),
    social: useRef<HTMLDivElement>(null),
    initiative: useRef<HTMLDivElement>(null),
    blog: useRef<HTMLDivElement>(null),
    education: useRef<HTMLDivElement>(null),
    tool: useRef<HTMLDivElement>(null),
    interest: useRef<HTMLDivElement>(null),
    services: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null)
  };

  // Increment view count on mount
  useEffect(() => {
    incrementViews();
  }, []);

  // Sync hash path to activeTab
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#/", "").replace("#", "");
      if (hash && sectionRefs[hash as keyof typeof sectionRefs]) {
        setActiveTab(hash);
        sectionRefs[hash as keyof typeof sectionRefs].current?.scrollIntoView({ behavior: "smooth" });
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    // Initial load
    handleHashChange();
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Ken Burns slider interval
  useEffect(() => {
    if (sliders.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % sliders.length);
    }, 7000); // 7 seconds per slide
    return () => clearInterval(interval);
  }, [sliders]);

  const navigateToSection = (section: string) => {
    setActiveTab(section);
    setMobileMenuOpen(false);
    window.location.hash = `#/${section}`;
    sectionRefs[section as keyof typeof sectionRefs]?.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle Gemini search API call
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchResponse(null);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchQuery,
          siteContent: {
            biography: { en: settings.connectTextEN, np: settings.connectTextNP },
            sliders: sliders.map(s => ({ title: s.titleEN, subtitle: s.subtitleEN })),
            education: educations.map(e => ({ name: e.institutionEN, intro: e.shortIntroEN })),
            services: services.map(s => ({ title: s.titleEN, intro: s.shortIntroEN })),
            tools: tools.map(t => ({ title: t.titleEN, intro: t.shortIntroEN })),
            initiatives: { title: initiatives.titleEN, details: initiatives.detailsEN }
          }
        })
      });

      const data = await response.json();
      if (data.answer) {
        setSearchResponse(data.answer);
        setSearchTargetSection(data.targetSection);
        
        // Auto-scroll to matched section after a brief delay
        if (data.scrollNeeded && data.targetSection) {
          setTimeout(() => {
            navigateToSection(data.targetSection);
          }, 1500);
        }
      }
    } catch (err) {
      console.error(err);
      setSearchResponse("Failed to establish secure AI link. Please scroll manually.");
    } finally {
      setSearching(false);
    }
  };

  // Handle Suggestion Form submission
  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, address, contact, suggestion } = suggestionForm;
    if (!name || !suggestion) return;

    // Format WhatsApp message
    const waText = `*New Suggestion from Portfolio Website*
----------------------------------------
*Name:* ${name}
*Address:* ${address || "Not Provided"}
*Contact:* ${contact || "Not Provided"}
*Suggestion:* ${suggestion}`;

    const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(waText)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, "_blank");

    // Clear form and show success modal
    setSuggestionForm({ name: "", address: "", contact: "", suggestion: "" });
    setActiveModal({ type: "success" });
  };

  const getSocialIcon = (name: string, className = "w-5 h-5") => {
    switch (name.toLowerCase()) {
      case "facebook":
        return <Facebook className={className} />;
      case "instagram":
        return <Instagram className={className} />;
      case "whatsapp":
        return <MessageSquare className={className} />;
      default:
        return <Mail className={className} />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
      
      {/* 1. Header (Static layout with glow elements) */}
      <header className={`sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-all duration-300 shadow-lg ${
        isDarkMode 
          ? "bg-black/35 border-white/10" 
          : "bg-white/45 border-black/10"
      }`}>
        {/* Top bar */}
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo, Name, Connect Tab */}
          <div className="flex items-center space-x-3">
            <img 
              src={settings.faviconUrl} 
              alt="Favicon" 
              className="w-8 h-8 rounded-full border border-cyan-400 shadow-cyan-500/50 object-cover shadow"
            />
            <div className="flex flex-col">
              <span className="font-display font-bold text-cyan-400 tracking-tight leading-none">
                {settings.siteName}
              </span>
              <button 
                onClick={() => navigateToSection("contact")}
                className="text-[10px] font-mono text-purple-400 hover:text-purple-300 tracking-wider text-left uppercase font-bold"
              >
                {language === "np" ? settings.connectTextNP : settings.connectTextEN} &raquo;
              </button>
            </div>

            {/* Nepali Flag Icon */}
            <img 
              src={settings.nepaliFlagUrl} 
              alt="NP Flag" 
              className="w-5 h-auto rounded shadow-sm border border-cyan-500/10"
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {[
              { id: "home", labelEN: "Home", labelNP: "गृहपृष्ठ" },
              { id: "education", labelEN: "Education", labelNP: "शिक्षा" },
              { id: "initiative", labelEN: "Initiatives", labelNP: "पहलहरू" },
              { id: "blog", labelEN: "Blogs", labelNP: "ब्लगहरू" },
              { id: "services", labelEN: "Services", labelNP: "सेवाहरू" },
              { id: "tool", labelEN: "Useful Tools", labelNP: "उपकरणहरू" },
              { id: "interest", labelEN: "Interests", labelNP: "रुचिहरू" },
              { id: "social", labelEN: "Socials", labelNP: "सम्पर्क" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigateToSection(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition ${
                  activeTab === tab.id
                    ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                    : "text-slate-400 hover:text-cyan-300 hover:bg-slate-900/40"
                }`}
              >
                {language === "np" ? tab.labelNP : tab.labelEN}
              </button>
            ))}
          </nav>

          {/* Action buttons (EN/NP, Dark/Light, Admin portal) */}
          <div className="flex items-center space-x-2">
            
            {/* Language Toggle EN | नेपाली */}
            <button
              onClick={() => setLanguage(language === "en" ? "np" : "en")}
              className={`px-2.5 py-1 rounded text-xs font-bold border transition duration-250 ${
                isDarkMode 
                  ? "bg-white/5 border-white/10 hover:border-cyan-400 text-cyan-400 hover:bg-white/10" 
                  : "bg-black/5 border-black/10 hover:border-cyan-600 text-cyan-600 hover:bg-black/10"
              }`}
            >
              {language === "en" ? "नेपाली" : "EN"}
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-1.5 rounded border transition duration-250 ${
                isDarkMode 
                  ? "bg-white/5 border-white/10 hover:border-cyan-400 text-cyan-400 hover:bg-white/10" 
                  : "bg-black/5 border-black/10 hover:border-cyan-600 text-cyan-600 hover:bg-black/10"
              }`}
              title="Theme Toggle"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>

            {/* Admin Console Gate */}
            {showAdminGate && (
              <button
                onClick={onAdminClick}
                className={`hidden sm:inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] font-mono border rounded transition duration-250 ${
                  isDarkMode 
                    ? "bg-purple-950/20 border-purple-500/20 hover:border-purple-400 hover:bg-purple-900/20 text-purple-300" 
                    : "bg-purple-50 border-purple-200 hover:border-purple-500 hover:bg-purple-100 text-purple-700"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 bg-slate-900 text-slate-400 hover:text-cyan-400 rounded transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden p-4 bg-slate-950 border-t border-cyan-500/10 grid grid-cols-2 gap-2 animate-in slide-in-from-top duration-250">
            {[
              { id: "home", labelEN: "Home", labelNP: "गृहपृष्ठ" },
              { id: "education", labelEN: "Education", labelNP: "शिक्षा" },
              { id: "initiative", labelEN: "Initiatives", labelNP: "पहलहरू" },
              { id: "blog", labelEN: "Blogs", labelNP: "ब्लगहरू" },
              { id: "services", labelEN: "Services", labelNP: "सेवाहरू" },
              { id: "tool", labelEN: "Useful Tools", labelNP: "उपकरणहरू" },
              { id: "interest", labelEN: "Interests", labelNP: "रुचिहरू" },
              { id: "social", labelEN: "Socials", labelNP: "सम्पर्क" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigateToSection(tab.id)}
                className={`py-2 px-3 text-xs font-mono rounded text-left transition ${
                  activeTab === tab.id ? "bg-cyan-500/10 text-cyan-400 font-bold" : "text-slate-400 hover:text-cyan-300"
                }`}
              >
                {language === "np" ? tab.labelNP : tab.labelEN}
              </button>
            ))}
            {showAdminGate && (
              <button
                onClick={() => { setMobileMenuOpen(false); onAdminClick(); }}
                className="col-span-2 py-2 text-center text-xs font-mono bg-purple-950/20 text-purple-300 border border-purple-500/20 rounded mt-2"
              >
                🔑 CMS Admin Portal
              </button>
            )}
          </div>
        )}

        {/* Dynamic Clock and Search Row */}
        <div className={`border-t px-4 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto w-full backdrop-blur-md rounded-b-2xl shadow-md transition duration-300 ${
          isDarkMode 
            ? "bg-black/30 border-white/5" 
            : "bg-white/45 border-black/5"
        }`}>
          
          {/* Real-time Clock */}
          <NepaliCalendar language={language} />

          {/* Social media quick launcher */}
          <div className="flex items-center space-x-3">
            {socials.slice(0, 5).map((soc) => (
              <a
                key={soc.id}
                href={soc.redirectUrl}
                target="_blank"
                rel="noreferrer"
                title={soc.name}
                className={`transition duration-200 ${
                  isDarkMode 
                    ? "text-cyan-400 hover:text-purple-400 hover:scale-110" 
                    : "text-cyan-600 hover:text-purple-600 hover:scale-110"
                }`}
              >
                {getSocialIcon(soc.iconName)}
              </a>
            ))}
          </div>

          {/* Gemini search bar integration */}
          <form onSubmit={handleSearch} className="relative w-full max-w-xs flex items-center">
            <Search className={`absolute left-3.5 w-4 h-4 ${isDarkMode ? "text-cyan-400/80" : "text-cyan-600/80"}`} />
            <input
              type="text"
              placeholder={language === "np" ? "Gemini AI मार्फत खोज्नुहोस्..." : "Search with Gemini AI..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-xs rounded-xl py-2 pl-9 pr-8 transition backdrop-blur-md focus:outline-none border ${
                isDarkMode 
                  ? "bg-white/5 border-white/10 text-slate-100 placeholder-slate-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400" 
                  : "bg-black/5 border-black/10 text-slate-950 placeholder-slate-500 focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600"
              }`}
            />
            {searching && (
              <span className="absolute right-3 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            )}
          </form>
        </div>
      </header>

      {/* Floating Gemini Search Result Alert */}
      {searchResponse && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-xl glass-panel neon-border-cyan p-4 shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="flex items-start justify-between space-x-2">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 tracking-wider">
                🤖 Gemini Search Assist
              </span>
              <p className="text-xs text-slate-200 font-sans leading-relaxed">
                {searchResponse}
              </p>
              {searchTargetSection && (
                <div className="text-[10px] text-purple-400 font-mono italic">
                  Navigating to: #{searchTargetSection}
                </div>
              )}
            </div>
            <button 
              onClick={() => setSearchResponse(null)}
              className="text-slate-400 hover:text-slate-200 p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Primary content layouts */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-24">

        {/* 2. Homepage Section (sliders + full biography) */}
        <section 
          ref={sectionRefs.home}
          id="home" 
          className="relative rounded-3xl overflow-hidden glass-panel border border-cyan-500/10 min-h-[75vh] flex flex-col justify-end p-8 sm:p-12"
        >
          {/* Background Cinematic Slider */}
          {sliders.length > 0 && (
            <div className="absolute inset-0 z-0">
              <img
                src={sliders[currentSlideIndex].imageUrl}
                alt="Cinematic background"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover ken-burns brightness-[0.22] transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
            </div>
          )}

          {/* Floating Text overlay */}
          <div className="relative z-10 max-w-2xl space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-400/30 text-xs font-mono text-cyan-400">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>{language === "np" ? "अमित जोशीको आधिकारीक वेबसाइट" : "Official Website of Amit Joshi"}</span>
            </span>

            {sliders.length > 0 && (
              <div className="space-y-1">
                <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                  {language === "np" ? sliders[currentSlideIndex].titleNP : sliders[currentSlideIndex].titleEN}
                </h1>
                <p className="text-sm sm:text-lg text-slate-300 font-sans tracking-wide">
                  {language === "np" ? sliders[currentSlideIndex].subtitleNP : sliders[currentSlideIndex].subtitleEN}
                </p>
              </div>
            )}

            {/* Short biography text box (4 lines shown) */}
            <div className={`p-5 rounded-2xl border backdrop-blur-md space-y-3 transition duration-300 ${
              isDarkMode 
                ? "bg-slate-950/60 border-white/10 text-slate-300" 
                : "bg-white/60 border-black/10 text-slate-800"
            }`}>
              <p className="text-xs sm:text-sm leading-relaxed font-sans line-clamp-4">
                {language === "np" 
                  ? "म अमित जोशी, सुदूरपश्चिम नेपालको एक प्रविधि अनुसन्धानकर्ता, सफ्टवेयर इन्जिनियर र साइबर-सुरक्षा विश्लेषक हुँ। विगतका वर्षहरूमा, मैले ग्रामीण समुदायहरूमा डिजिटल साक्षरता ल्याउन र हाम्रा स्थानीय प्रशासनिक निकायहरूका लागि नि:शुल्क र खुला स्रोत प्रविधि साधनहरू प्रदान गर्न समर्पित रूपमा काम गरेको छु।"
                  : "I am Amit Joshi, a dedicated tech researcher, software engineer, and cyber-security analyst from Far-West Nepal. Over the years, I have worked deeply towards bringing digital literacy to rural communities and delivering free open-source e-governance administrative utilities."
                }
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                {/* Read Full Biography button */}
                <button
                  onClick={() => setActiveModal({
                    type: "bio",
                    data: {
                      fullTextEN: "Amit Joshi is a pioneering software architect from Nepal. Graduating with honours in B.Sc. CSIT from Tribhuvan University, Amit discovered critical vulnerabilities in regional public directories. He subsequently founded Sankalpa Tech, carrying e-governance advisory tools to Far-West districts. He designs custom high-speed applications, promotes digital sanitization campaigns, and constructs Bikram Sambat calendar utilities. Amit aims to raise localized technology capabilities across public classrooms.",
                      fullTextNP: "अमित जोशी नेपालका एक अग्रणी सफ्टवेयर आर्किटेक्ट हुन्। त्रिभुवन विश्वविद्यालयबाट B.Sc. CSIT मा उत्कृष्ट श्रेणीमा स्नातक उत्तीर्ण गरेपछि, अमितले क्षेत्रीय सार्वजनिक डाइरेक्टरीहरूमा महत्वपूर्ण सुरक्षा कमजोरीहरू पत्ता लगाए। उनले सुदूरपश्चिमका जिल्लाहरूमा ई-गभर्नेन्स सल्लाहकार उपकरणहरू पुर्‍याउन सङ्कल्प प्रविधि स्थापना गरे। उनी उच्च-गतिका वेब एप्लिकेसनहरू डिजाइन गर्छन्, डिजिटल स्वच्छता अभियानहरू प्रवर्द्धन गर्छन् र विक्रम संवत क्यालेन्डर उपयोगिताहरू निर्माण गर्छन्।"
                    }
                  })}
                  className={`px-4 py-2 rounded-xl font-display font-semibold text-xs transition transform hover:-translate-y-0.5 shadow-md ${
                    isDarkMode 
                      ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400 hover:shadow-cyan-500/30" 
                      : "bg-cyan-600 text-white hover:bg-cyan-500 hover:shadow-cyan-600/30"
                  }`}
                >
                  {language === "np" ? "पूरा जीवनी पढ्नुहोस्" : "Read Full Biography"}
                </button>

                {/* Connect to Me Option button */}
                <button
                  onClick={() => setActiveModal({ type: "connect" })}
                  className={`px-4 py-2 rounded-xl border font-display font-semibold text-xs transition duration-200 ${
                    isDarkMode 
                      ? "bg-white/5 border-cyan-400/30 hover:border-cyan-400 text-cyan-400 hover:bg-white/10" 
                      : "bg-black/5 border-cyan-600/30 hover:border-cyan-600 text-cyan-600 hover:bg-black/10"
                  }`}
                >
                  {language === "np" ? "मलाई जोड्नुहोस्" : "Connect to Me"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3. My Social Media Section (Glowing Glassmorphism cards) */}
        <section 
          ref={sectionRefs.social}
          id="social" 
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-cyan-400">
              {language === "np" ? "सामाजिक जडानहरू" : "My Social Media Connections"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-xl mx-auto">
              {language === "np" ? "मेरो डिजिटल कर्नरहरू अन्वेषण गर्नुहोस् र प्रत्यक्ष अन्तरक्रियाका लागि जोडिनुहोस्।" : "Connect with my official profiles to follow my daily work logs and tips."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {socials.map((soc) => (
              <a
                key={soc.id}
                href={soc.redirectUrl}
                target="_blank"
                rel="noreferrer"
                className={`group p-6 rounded-2xl border transition duration-300 flex flex-col justify-between backdrop-blur-md ${
                  isDarkMode 
                    ? "bg-white/5 hover:bg-white/10 border-white/10 hover:border-cyan-400/50 shadow-lg" 
                    : "bg-black/5 hover:bg-black/10 border-black/10 hover:border-cyan-600/50 shadow"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`p-3 rounded-xl transition ${
                      isDarkMode 
                        ? "bg-cyan-950/50 text-cyan-400 group-hover:text-purple-400 group-hover:bg-purple-950/30" 
                        : "bg-cyan-50 text-cyan-600 group-hover:text-purple-600 group-hover:bg-purple-50"
                    }`}>
                      {getSocialIcon(soc.iconName, "w-6 h-6")}
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 transition" />
                  </div>
                  <div className="space-y-1">
                    <h3 className={`font-display font-bold text-lg transition ${
                      isDarkMode ? "text-slate-100 group-hover:text-cyan-400" : "text-slate-900 group-hover:text-cyan-600"
                    }`}>
                      {soc.name}
                    </h3>
                    <p className={`text-xs leading-relaxed font-sans ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                      {language === "np" ? soc.biographyNP : soc.biographyEN}
                    </p>
                  </div>
                </div>
                <div className={`pt-4 text-[10px] font-mono tracking-wider uppercase font-semibold ${
                  isDarkMode ? "text-cyan-400 group-hover:text-cyan-300" : "text-cyan-600 group-hover:text-cyan-700"
                }`}>
                  {language === "np" ? "प्रोफाइल हेर्नुहोस् &raquo;" : "Visit Profile &raquo;"}
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 4. My Initiative Section (FB embed feed + follow buttons) */}
        <section 
          ref={sectionRefs.initiative}
          id="initiative" 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-6">
            <span className="px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs font-mono text-purple-300">
              {language === "np" ? "सामुदायिक योगदान" : "Community Initiatives"}
            </span>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl font-display font-bold tracking-tight text-cyan-400">
                {language === "np" ? initiatives.titleNP : initiatives.titleEN}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
                {language === "np" ? initiatives.introNP : initiatives.introEN}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveModal({
                  type: "initiative",
                  data: {
                    title: language === "np" ? initiatives.titleNP : initiatives.titleEN,
                    details: language === "np" ? initiatives.detailsNP : initiatives.detailsEN
                  }
                })}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-display font-semibold text-xs hover:bg-cyan-400 transition transform hover:-translate-y-0.5"
              >
                {language === "np" ? "थप पढ्नुहोस्" : "Read More"}
              </button>

              <a
                href={initiatives.followUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-400 text-slate-200 text-xs font-display font-semibold transition"
              >
                <span>{language === "np" ? "हामीलाई पछ्याउनुहोस्" : "Follow Us"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Facebook Feed Embed Widget */}
          <div className={`rounded-3xl overflow-hidden p-6 flex justify-center items-center min-h-[450px] border transition duration-300 ${isDarkMode ? "glass-panel border-white/10" : "glass-panel-light border-black/10"}`}>
            {initiatives.facebookEmbedUrl ? (
              <iframe
                src={initiatives.facebookEmbedUrl}
                style={{ border: "none", overflow: "hidden", width: "100%", height: "500px" }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                className="rounded-2xl shadow-xl bg-slate-950"
              />
            ) : (
              <div className="text-center text-slate-400 py-12">
                No active Facebook Feed Link specified in CMS.
              </div>
            )}
          </div>
        </section>

        {/* 5. Blog Posts Section (safe iframe embed) */}
        <section 
          ref={sectionRefs.blog}
          id="blog" 
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-cyan-400">
              {language === "np" ? "आधिकारिक ब्लग पोस्टहरू" : "Official Blog Posts"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              {language === "np" ? "मेरो वेब विचारहरू र प्रविधि ट्यूटोरियलहरू सिधै पढ्नुहोस्।" : "Explore tech essays and step-by-step programming insights directly."}
            </p>
          </div>

          <div className={`rounded-3xl overflow-hidden h-[650px] relative border transition duration-300 ${isDarkMode ? "glass-panel border-white/10" : "glass-panel-light border-black/10"}`}>
            <iframe
              src={blogs.iframeUrl}
              className="w-full h-full border-0 rounded-3xl bg-slate-950"
              title="Amit Joshi Blog Feed"
            />
          </div>
        </section>

        {/* 6. My Education Section */}
        <section 
          ref={sectionRefs.education}
          id="education" 
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-cyan-400">
              {language === "np" ? "शैक्षिक पृष्ठभूमि" : "My Education History"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              {language === "np" ? "मेरो शैक्षिक यात्रा र प्राविधिक डिग्रीहरूको विस्तृत इतिहास।" : "A chronicle of my academic background and engineering degree credentials."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {educations.map((edu) => (
              <div
                key={edu.id}
                onClick={() => setActiveModal({ type: "education", data: edu })}
                className={`group p-6 rounded-2xl border cursor-pointer transition duration-300 flex flex-col justify-between space-y-4 backdrop-blur-md ${
                  isDarkMode 
                    ? "bg-white/5 hover:bg-white/10 border-white/10 hover:border-cyan-400/50 shadow-lg" 
                    : "bg-black/5 hover:bg-black/10 border-black/10 hover:border-cyan-600/50 shadow"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="p-2.5 rounded-xl bg-purple-950/40 text-purple-400 border border-purple-500/20">
                      <GraduationCap className="w-5 h-5" />
                    </span>
                    <h3 className="font-display font-bold text-lg text-slate-100 group-hover:text-cyan-400 transition">
                      {language === "np" ? edu.institutionNP : edu.institutionEN}
                    </h3>
                  </div>
                  <p className="text-xs text-cyan-400 font-mono font-medium">
                    {language === "np" ? edu.shortIntroNP : edu.shortIntroEN}
                  </p>
                </div>
                <div className="text-[10px] font-mono tracking-wider text-purple-400 uppercase font-semibold group-hover:text-cyan-400">
                  {language === "np" ? "शैक्षिक विवरण हेर्नुहोस् &raquo;" : "View Academic Details &raquo;"}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Some Useful Tools Section */}
        <section 
          ref={sectionRefs.tool}
          id="tool" 
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-cyan-400">
              {language === "np" ? "केही उपयोगी वेब उपकरणहरू" : "Some Useful Tools & Utilities"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              {language === "np" ? "नेपालका स्थानीय नागरिकहरूका लागि निर्मित नि:शुल्क ई-डिजिटल उपकरणहरू।" : "Free localization widgets crafted for citizens of Far-West Nepal."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.slice(0, 15).map((tool) => (
              <div
                key={tool.id}
                onClick={() => setActiveModal({ type: "tool", data: tool })}
                className={`group p-5 rounded-2xl border cursor-pointer transition duration-300 space-y-4 backdrop-blur-md ${
                  isDarkMode 
                    ? "bg-white/5 hover:bg-white/10 border-white/10 hover:border-cyan-400/50 shadow-lg" 
                    : "bg-black/5 hover:bg-black/10 border-black/10 hover:border-cyan-600/50 shadow"
                }`}
              >
                <div className="relative h-32 w-full overflow-hidden rounded-xl bg-slate-950">
                  <img
                    src={tool.logoUrl}
                    alt={tool.titleEN}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-all duration-350 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-base text-slate-100 group-hover:text-cyan-400 transition">
                    {language === "np" ? tool.titleNP : tool.titleEN}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {language === "np" ? tool.shortIntroNP : tool.shortIntroEN}
                  </p>
                </div>
                <div className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                  {language === "np" ? "उपकरण खोल्नुहोस् &raquo;" : "Launch Utility &raquo;"}
                </div>
              </div>
            ))}
          </div>

          {/* Visit More Tools Button if total > 15 */}
          {tools.length > 15 && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setActiveModal({ type: "tools-more" })}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-cyan-500/30 text-cyan-400 font-display font-semibold text-xs transition hover:border-cyan-400"
              >
                {language === "np" ? "थप उपकरणहरू हेर्नुहोस्" : "Visit More Tools"}
              </button>
            </div>
          )}
        </section>

        {/* 8. My Interest Section */}
        <section 
          ref={sectionRefs.interest}
          id="interest" 
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-cyan-400">
              {language === "np" ? "प्राविधिक रुचि र जुनून" : "My Passion & Interests"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              {language === "np" ? "मलाई उत्प्रेरित गर्ने प्राविधिक क्षेत्रहरू र नैतिक ह्याकिङ।" : "Fields that capture my coding time outside of e-governance development."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {interests.map((intr) => (
              <div
                key={intr.id}
                onClick={() => setActiveModal({ type: "interest", data: intr })}
                className={`group p-6 rounded-2xl border cursor-pointer transition duration-300 flex items-start space-x-4 backdrop-blur-md ${
                  isDarkMode 
                    ? "bg-white/5 hover:bg-white/10 border-white/10 hover:border-cyan-400/50 shadow-lg" 
                    : "bg-black/5 hover:bg-black/10 border-black/10 hover:border-cyan-600/50 shadow"
                }`}
              >
                <span className="p-3 rounded-xl bg-purple-950/40 text-purple-400 group-hover:text-cyan-400 transition">
                  <Shield className="w-6 h-6" />
                </span>
                <div className="space-y-1.5">
                  <h3 className="font-display font-bold text-base text-slate-100 group-hover:text-cyan-400 transition">
                    {language === "np" ? intr.titleNP : intr.titleEN}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-2">
                    {language === "np" ? intr.shortIntroNP : intr.shortIntroEN}
                  </p>
                  <span className="inline-block text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                    {language === "np" ? "विवरण हेर्नुहोस् &raquo;" : "View Brief &raquo;"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 9. Services Offered Section */}
        <section 
          ref={sectionRefs.services}
          id="services" 
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-cyan-400">
              {language === "np" ? "मेरो सेवाहरू" : "Professional Services Offered"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              {language === "np" ? "प्रशासनिक फारम बुझाउने सहायता र प्रविधि सल्लाह सेवाहरू।" : "Personalised tech counseling and government application form advisories."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.slice(0, 15).map((srv) => (
              <div
                key={srv.id}
                onClick={() => setActiveModal({ type: "service", data: srv })}
                className={`group p-6 rounded-2xl border cursor-pointer transition duration-300 grid grid-cols-1 sm:grid-cols-3 gap-4 backdrop-blur-md ${
                  isDarkMode 
                    ? "bg-white/5 hover:bg-white/10 border-white/10 hover:border-cyan-400/50 shadow-lg" 
                    : "bg-black/5 hover:bg-black/10 border-black/10 hover:border-cyan-600/50 shadow"
                }`}
              >
                <div className="sm:col-span-1 h-32 w-full rounded-xl overflow-hidden bg-slate-950">
                  <img
                    src={srv.imageUrl}
                    alt={srv.titleEN}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="sm:col-span-2 flex flex-col justify-between space-y-2">
                  <div className="space-y-1.5">
                    <h3 className="font-display font-bold text-base text-slate-100 group-hover:text-cyan-400 transition">
                      {language === "np" ? srv.titleNP : srv.titleEN}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-sans">
                      {language === "np" ? srv.shortIntroNP : srv.shortIntroEN}
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                    {language === "np" ? "सेवा विवरण &raquo;" : "Launch Service &raquo;"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Visit More Services Button if total > 15 */}
          {services.length > 15 && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setActiveModal({ type: "services-more" })}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-cyan-500/30 text-cyan-400 font-display font-semibold text-xs transition hover:border-cyan-400"
              >
                {language === "np" ? "थप सेवाहरू हेर्नुहोस्" : "Visit More Services"}
              </button>
            </div>
          )}
        </section>

        {/* 13. Map Integration Segment (Permanent vs current) */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-cyan-400">
              {language === "np" ? "स्थान र ठेगाना नक्सा" : "Map Integration & Geolocation"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              {language === "np" ? "मेरो स्थायी र वर्तमान बस्ने ठाउँहरूको नक्सा जडान।" : "Geographic mapping of my permanent address and temporary/current base."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Permanent Map */}
            <div className={`rounded-3xl p-6 border space-y-4 transition duration-300 ${isDarkMode ? "glass-panel border-white/10" : "glass-panel-light border-black/10"}`}>
              <div className="flex items-center space-x-2 text-cyan-400 font-display font-semibold">
                <MapPin className="w-5 h-5 text-purple-400" />
                <span>{language === "np" ? "स्थायी ठेगाना (दार्चुला)" : "Permanent Address (Darchula)"}</span>
              </div>
              <div className="h-64 rounded-2xl overflow-hidden border border-cyan-500/10 relative">
                <iframe
                  src={settings.permanentMapEmbed}
                  className="w-full h-full border-0"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Permanent Address Map"
                />
              </div>
            </div>

            {/* Current Map */}
            <div className={`rounded-3xl p-6 border space-y-4 transition duration-300 ${isDarkMode ? "glass-panel border-white/10" : "glass-panel-light border-black/10"}`}>
              <div className="flex items-center space-x-2 text-cyan-400 font-display font-semibold">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <span>{language === "np" ? "वर्तमान/अस्थायी ठेगाना (काठमाडौं)" : "Temporary/Current Address (Kathmandu)"}</span>
              </div>
              <div className="h-64 rounded-2xl overflow-hidden border border-cyan-500/10 relative">
                <iframe
                  src={settings.temporaryMapEmbed}
                  className="w-full h-full border-0"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Temporary Address Map"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 10. Suggestion Box Section */}
        <section 
          ref={sectionRefs.contact}
          id="contact" 
          className={`max-w-2xl mx-auto rounded-3xl p-8 border space-y-6 transition duration-300 ${isDarkMode ? "glass-panel border-white/10" : "glass-panel-light border-black/10"}`}
        >
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-display font-bold text-cyan-400">
              {language === "np" ? "सुझाव र प्रतिक्रिया बाकस" : "Suggestion Box"}
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {language === "np" 
                ? "मेरो डिजिटल सेवाहरूलाई कसरी अझ राम्रो बनाउन सकिन्छ भन्ने बारे आफ्ना विचारहरू साझा गर्नुहोस्। पेश भएपछि यो व्हाट्सएप मार्फत पठाइनेछ।" 
                : "Share your thoughts on how I can make my localization tools better. Submitted forms will route to my WhatsApp."
              }
            </p>
          </div>

          <form onSubmit={handleSuggestionSubmit} className="space-y-4 font-sans text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400">{language === "np" ? "नाम (अनिवार्य)" : "Name (Compulsory)"}</label>
                <input
                  type="text"
                  required
                  value={suggestionForm.name}
                  onChange={(e) => setSuggestionForm({ ...suggestionForm, name: e.target.value })}
                  placeholder="Amit Joshi"
                  className={`w-full border rounded-xl p-3 focus:outline-none transition ${
                    isDarkMode 
                      ? "bg-white/5 border-white/10 hover:border-cyan-400 text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-cyan-400" 
                      : "bg-black/5 border-black/10 hover:border-cyan-600 text-slate-950 placeholder-slate-400 focus:ring-1 focus:ring-cyan-600"
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400">{language === "np" ? "ठेगाना" : "Address"}</label>
                <input
                  type="text"
                  value={suggestionForm.address}
                  onChange={(e) => setSuggestionForm({ ...suggestionForm, address: e.target.value })}
                  placeholder="Darchula / Kathmandu"
                  className={`w-full border rounded-xl p-3 focus:outline-none transition ${
                    isDarkMode 
                      ? "bg-white/5 border-white/10 hover:border-cyan-400 text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-cyan-400" 
                      : "bg-black/5 border-black/10 hover:border-cyan-600 text-slate-950 placeholder-slate-400 focus:ring-1 focus:ring-cyan-600"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">{language === "np" ? "सम्पर्क नम्बर" : "Contact Number"}</label>
              <input
                type="text"
                value={suggestionForm.contact}
                onChange={(e) => setSuggestionForm({ ...suggestionForm, contact: e.target.value })}
                placeholder="+977 9848XXXXXX"
                className={`w-full border rounded-xl p-3 focus:outline-none transition ${
                  isDarkMode 
                    ? "bg-white/5 border-white/10 hover:border-cyan-400 text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-cyan-400" 
                    : "bg-black/5 border-black/10 hover:border-cyan-600 text-slate-950 placeholder-slate-400 focus:ring-1 focus:ring-cyan-600"
                }`}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">{language === "np" ? "सुझाव / प्रतिक्रिया (अनिवार्य)" : "Suggestion (Compulsory)"}</label>
              <textarea
                required
                rows={4}
                value={suggestionForm.suggestion}
                onChange={(e) => setSuggestionForm({ ...suggestionForm, suggestion: e.target.value })}
                placeholder={language === "np" ? "आफ्नो रचनात्मक सुझाव यहाँ लेख्नुहोस्..." : "Type your constructive recommendation here..."}
                className={`w-full border rounded-xl p-3 focus:outline-none transition resize-none ${
                  isDarkMode 
                    ? "bg-white/5 border-white/10 hover:border-cyan-400 text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-cyan-400" 
                    : "bg-black/5 border-black/10 hover:border-cyan-600 text-slate-950 placeholder-slate-400 focus:ring-1 focus:ring-cyan-600"
                }`}
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-display font-bold transition transform hover:-translate-y-0.5 shadow-md ${
                isDarkMode 
                  ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400 hover:shadow-cyan-500/20" 
                  : "bg-cyan-600 text-white hover:bg-cyan-500 hover:shadow-cyan-600/20"
              }`}
            >
              {language === "np" ? "व्हाट्सएप मार्फत पठाउनुहोस्" : "Submit via WhatsApp"}
            </button>
          </form>
        </section>

      </main>

      {/* 11. Footer Section */}
      <footer className={`mt-24 border-t py-12 text-xs text-center font-sans transition duration-300 ${
        isDarkMode 
          ? "border-white/10 bg-black/40 text-slate-400" 
          : "border-black/10 bg-white/40 text-slate-600"
      }`}>
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-cyan-400 font-mono text-[11px]">
            <a href="#/terms" onClick={() => alert("Terms & Conditions: Amit Joshi's web utilities are licensed under Apache-2.0. Clean security use only.")} className="hover:underline transition">
              {language === "np" ? "नियम र सर्तहरू" : "Terms & Conditions"}
            </a>
            <span>|</span>
            <a href="#/privacy" onClick={() => alert("Privacy Policy: Suggestions submit directly via WhatsApp. This app collects no browser cookies or tracking profiles.")} className="hover:underline transition">
              {language === "np" ? "गोपनीयता नीति" : "Privacy Policy"}
            </a>
          </div>

          <div className="text-slate-500 max-w-sm mx-auto space-y-1 leading-relaxed">
            <p className="font-display font-medium text-slate-300">
              &copy; 2026 Amit Joshi. All Rights Reserved.
            </p>
            <p className="text-[10px] font-mono text-purple-400/80">
              Wanna Design? Contact Me via WhatsApp:{" "}
              <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noreferrer" className="underline hover:text-cyan-400">
                {settings.whatsappNumber}
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Modal Popup Overlays */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className={`relative w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-6 border transition duration-300 animate-in fade-in zoom-in duration-200 ${
            isDarkMode ? "glass-panel border-white/10 text-slate-100" : "glass-panel-light border-black/10 text-slate-950"
          }`}>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-display font-bold text-cyan-400">
                {activeModal.type === "bio" && (language === "np" ? "अमित जोशीको पूरा जीवनी" : "Full Biography")}
                {activeModal.type === "connect" && (language === "np" ? "मसँग जोडिनुहोस्" : "Connect with Amit")}
                {activeModal.type === "initiative" && activeModal.data?.title}
                {activeModal.type === "education" && (language === "np" ? "शैक्षिक प्रमाणपत्र विवरण" : "Academic History Details")}
                {activeModal.type === "tool" && (language === "np" ? "उपकरण नियन्त्रण" : "Web Tool Launcher")}
                {activeModal.type === "interest" && (language === "np" ? "रुचि तथा जुनून विवरण" : "Passion & Interest brief")}
                {activeModal.type === "service" && (language === "np" ? "सेवा प्रस्ताव विवरण" : "Service Overview")}
                {activeModal.type === "tools-more" && (language === "np" ? "थप प्राविधिक उपकरणहरू" : "More Digital Tools")}
                {activeModal.type === "services-more" && (language === "np" ? "थप व्यावसायिक सेवाहरू" : "More E-Services")}
                {activeModal.type === "success" && (language === "np" ? "सफलतापूर्वक पठाइयो" : "Action Completed")}
              </h4>
              <button 
                onClick={() => setActiveModal(null)}
                className={`p-1.5 rounded-lg border transition duration-200 ${
                  isDarkMode 
                    ? "bg-white/5 text-slate-400 hover:text-cyan-400 border-white/10 hover:border-cyan-400/50" 
                    : "bg-black/5 text-slate-600 hover:text-cyan-600 border-black/10 hover:border-cyan-600/50"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal content body */}
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-wrap max-h-[60vh] overflow-y-auto pr-2">
              
              {/* Full Biography */}
              {activeModal.type === "bio" && (
                <p>{language === "np" ? activeModal.data?.fullTextNP : activeModal.data?.fullTextEN}</p>
              )}

              {/* Connect to Me Option Popup with icon & user details */}
              {activeModal.type === "connect" && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-400">
                    {language === "np" ? "तलका आधिकारिक लिंकहरू प्रयोग गरी सुदूरपश्चिममा मेरो कार्यालय वा व्यक्तिगत प्रोफाइलसँग सीधा सम्पर्क राख्नुहोस्।" : "Connect directly to my professional nodes and workspace."}
                  </p>
                  <div className="space-y-3">
                    {socials.map((soc) => (
                      <a
                        key={soc.id}
                        href={soc.redirectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex items-center justify-between p-3 rounded-xl border transition duration-200 ${
                          isDarkMode 
                            ? "bg-white/5 border-white/10 hover:border-cyan-400 hover:bg-white/10" 
                            : "bg-black/5 border-black/10 hover:border-cyan-600 hover:bg-black/10"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="p-2 bg-cyan-950/50 text-cyan-400 rounded-lg">
                            {getSocialIcon(soc.iconName, "w-4 h-4")}
                          </span>
                          <span className="font-display font-semibold text-slate-200">{soc.name}</span>
                        </div>
                        <span className="text-[10px] text-cyan-400 font-mono underline">@{settings.siteName.toLowerCase().replace(" ", "")} &raquo;</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Initiative brief */}
              {activeModal.type === "initiative" && (
                <p>{activeModal.data?.details}</p>
              )}

              {/* Education full */}
              {activeModal.type === "education" && activeModal.data && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl border ${
                    isDarkMode ? "bg-cyan-950/20 border-cyan-500/20" : "bg-cyan-50 border-cyan-100"
                  }`}>
                    <span className="text-xs font-mono text-cyan-400 uppercase font-bold">{language === "np" ? "शैक्षिक योग्यता" : "Academic Title"}:</span>
                    <h5 className={`font-display font-bold text-sm ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
                      {language === "np" ? activeModal.data.shortIntroNP : activeModal.data.shortIntroEN}
                    </h5>
                  </div>
                  <p>{language === "np" ? activeModal.data.detailsNP : activeModal.data.detailsEN}</p>
                  <a
                    href={activeModal.data.redirectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 px-4 py-2 bg-cyan-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-cyan-400 transition"
                  >
                    <span>{language === "np" ? "आधिकारिक वेबसाइटमा जानुहोस्" : "Visit Institution"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Tool launch */}
              {activeModal.type === "tool" && activeModal.data && (
                <div className="space-y-4">
                  <h5 className="font-display font-bold text-sm text-cyan-400">
                    {language === "np" ? activeModal.data.titleNP : activeModal.data.titleEN}
                  </h5>
                  <p>{language === "np" ? activeModal.data.shortIntroNP : activeModal.data.shortIntroEN}</p>
                  <a
                    href={activeModal.data.redirectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 px-4 py-2 bg-cyan-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-cyan-400 transition"
                  >
                    <span>{language === "np" ? "उपकरण सुरु गर्नुहोस्" : "Launch Active Utility"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Interest brief */}
              {activeModal.type === "interest" && activeModal.data && (
                <div className="space-y-3">
                  <h5 className="font-display font-bold text-sm text-cyan-400">
                    {language === "np" ? activeModal.data.titleNP : activeModal.data.titleEN}
                  </h5>
                  <p>{language === "np" ? activeModal.data.detailsNP : activeModal.data.detailsEN}</p>
                </div>
              )}

              {/* Service Details with View Official & Help Fill buttons */}
              {activeModal.type === "service" && activeModal.data && (
                <div className="space-y-4">
                  <h5 className="font-display font-bold text-sm text-cyan-400">
                    {language === "np" ? activeModal.data.titleNP : activeModal.data.titleEN}
                  </h5>
                  <p>{language === "np" ? activeModal.data.detailsNP : activeModal.data.detailsEN}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <a
                      href={activeModal.data.redirectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex justify-center items-center space-x-1 px-4 py-2.5 border text-xs font-bold rounded-xl transition ${
                        isDarkMode 
                          ? "bg-white/5 border-cyan-500/20 text-cyan-400 hover:border-cyan-400 hover:bg-white/10" 
                          : "bg-black/5 border-cyan-600/20 text-cyan-600 hover:border-cyan-600 hover:bg-black/10"
                      }`}
                    >
                      <span>{language === "np" ? "आधिकारिक जानकारी" : "View Official Info"}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <a
                      href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                        language === "np" ? activeModal.data.helpWhatsappMessageNP : activeModal.data.helpWhatsappMessageEN
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex justify-center items-center space-x-1 px-4 py-2.5 text-xs font-bold rounded-xl transition shadow-sm ${
                        isDarkMode 
                          ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400" 
                          : "bg-cyan-600 text-white hover:bg-cyan-500"
                      }`}
                    >
                      <span>{language === "np" ? "फारम भर्न मद्दत गर्नुहोस्" : "Help Me Filling"}</span>
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Visit More Tools Popup */}
              {activeModal.type === "tools-more" && (
                <div className="grid grid-cols-1 gap-3 max-h-[50vh] overflow-y-auto">
                  {tools.map((tool) => (
                    <a
                      key={tool.id}
                      href={tool.redirectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex items-center justify-between p-3 rounded-xl border transition duration-200 ${
                        isDarkMode 
                          ? "bg-white/5 border-white/10 hover:border-cyan-400 hover:bg-white/10 text-slate-200" 
                          : "bg-black/5 border-black/10 hover:border-cyan-600 hover:bg-black/10 text-slate-900"
                      }`}
                    >
                      <div>
                        <h6 className="font-display font-bold text-slate-200">
                          {language === "np" ? tool.titleNP : tool.titleEN}
                        </h6>
                        <p className="text-[11px] text-slate-400">{language === "np" ? tool.shortIntroNP : tool.shortIntroEN}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-cyan-400" />
                    </a>
                  ))}
                </div>
              )}

              {/* Visit More Services Popup */}
              {activeModal.type === "services-more" && (
                <div className="grid grid-cols-1 gap-3 max-h-[50vh] overflow-y-auto">
                  {services.map((srv) => (
                    <div
                      key={srv.id}
                      className={`p-3 rounded-xl border space-y-2 transition duration-200 ${
                        isDarkMode 
                          ? "bg-white/5 border-white/10 text-slate-200" 
                          : "bg-black/5 border-black/10 text-slate-900"
                      }`}
                    >
                      <h6 className="font-display font-bold text-slate-200">
                        {language === "np" ? srv.titleNP : srv.titleEN}
                      </h6>
                      <p className="text-[11px] text-slate-400">{language === "np" ? srv.shortIntroNP : srv.shortIntroEN}</p>
                      <div className="flex space-x-2 pt-1">
                        <a href={srv.redirectUrl} target="_blank" rel="noreferrer" className="text-[10px] text-cyan-400 underline">
                          {language === "np" ? "वेबसाइट" : "Official Link"}
                        </a>
                        <a 
                          href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(language === "np" ? srv.helpWhatsappMessageNP : srv.helpWhatsappMessageEN)}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[10px] text-purple-400 underline"
                        >
                          {language === "np" ? "फारम सहायता" : "WhatsApp Help"}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Form submit success */}
              {activeModal.type === "success" && (
                <div className="flex flex-col items-center justify-center text-center py-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400 flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-display font-bold text-base text-slate-100">
                      {language === "np" ? "सुझाव व्हाट्सएपमा पठाइयो" : "Form Sent!"}
                    </h5>
                    <p className="text-xs text-slate-400 max-w-xs">
                      {language === "np" 
                        ? "धन्यवाद! तपाईंको सुझाव व्हाट्सएप मार्फत अमित जोशीलाई सफलतापूर्वक निर्देशित गरिएको छ।" 
                        : "Thank you! Your constructive feedback has been routed to Amit Joshi's secure messaging channel."
                      }
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className={`px-4 py-2 border rounded-lg text-xs transition duration-200 ${
                      isDarkMode 
                        ? "bg-white/5 border-white/10 text-cyan-400 hover:border-cyan-400" 
                        : "bg-black/5 border-black/10 text-cyan-600 hover:border-cyan-600"
                    }`}
                  >
                    {language === "np" ? "बन्द गर्नुहोस्" : "Dismiss"}
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
