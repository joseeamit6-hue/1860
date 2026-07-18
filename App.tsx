import React, { useState, useEffect } from "react";
import { NeonNetwork } from "./components/NeonNetwork";
import { PortfolioView } from "./components/PortfolioView";
import { AdminPanel } from "./components/AdminPanel";
import { CustomPopup } from "./components/CustomPopup";
import { loadCMSData, saveCMSData, db } from "./lib/firebase";
import { CMSData } from "./types";
import { DEFAULT_CMS_DATA } from "./lib/defaultData";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function App() {
  const [cmsData, setCmsData] = useState<CMSData>(DEFAULT_CMS_DATA);
  const [language, setLanguage] = useState<"en" | "np">("en");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [viewerCount, setViewerCount] = useState<number>(314); // Elegant fallback seed
  const [loading, setLoading] = useState<boolean>(true);
  const [showAdminGate, setShowAdminGate] = useState<boolean>(false);

  // Monitor url to reveal admin gates or auto-open admin overlay
  useEffect(() => {
    const checkIsAdminRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      return (
        path.endsWith("/admin") || 
        path.endsWith("/admin.html") || 
        path.includes("/admin/") || 
        hash.includes("admin") || 
        search.includes("admin")
      );
    };

    if (checkIsAdminRoute()) {
      setShowAdminGate(true);
      setIsAdminOpen(true);
    }

    const handleLocationChange = () => {
      if (checkIsAdminRoute()) {
        setShowAdminGate(true);
        setIsAdminOpen(true);
      }
    };

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  // Load initial dataset on mount
  useEffect(() => {
    async function initializeApp() {
      try {
        const data = await loadCMSData();
        setCmsData(data);

        // Manage Entry Custom Promo Popup status
        const isPopupActive = data.settings?.customPopupActive;
        const alreadyShown = sessionStorage.getItem("portfolio_popup_shown") === "true";
        if (isPopupActive && !alreadyShown) {
          setIsPopupOpen(true);
        }
      } catch (error) {
        console.warn("CMS initialization failed, falling back to local dataset.", error);
      } finally {
        setLoading(false);
      }
    }
    initializeApp();
  }, []);

  // Increment website viewer count in Firestore securely
  const incrementViewerCount = async () => {
    try {
      const viewerDocRef = doc(db, "cms", "metrics");
      const docSnap = await getDoc(viewerDocRef);
      if (docSnap.exists()) {
        const currentCount = docSnap.data().count || 314;
        const newCount = currentCount + 1;
        await setDoc(viewerDocRef, { count: newCount }, { merge: true });
        setViewerCount(newCount);
      } else {
        await setDoc(viewerDocRef, { count: 315 }, { merge: true });
        setViewerCount(315);
      }
    } catch {
      // Offline/permission graceful fallback increment
      setViewerCount((prev) => prev + 1);
    }
  };

  const handleUpdateCMSData = (newData: CMSData) => {
    setCmsData(newData);
  };

  const handleClosePopup = () => {
    sessionStorage.setItem("portfolio_popup_shown", "true");
    setIsPopupOpen(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#030712] flex flex-col items-center justify-center space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-t-2 border-cyan-400 border-r-2 border-transparent animate-spin" />
          <span className="absolute text-xs">🌐</span>
        </div>
        <div className="text-center">
          <p className="text-xs font-mono text-cyan-400 tracking-widest uppercase">
            Loading Amit Joshi's Cyber Portfolio
          </p>
          <p className="text-[10px] text-slate-500 font-mono">Establishing secure Firebase connection node...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen selection:bg-cyan-500/30 selection:text-cyan-300 overflow-x-hidden transition-colors duration-500 ${isDarkMode ? "bg-[#020617] text-slate-200" : "bg-slate-50 text-slate-900"}`}>
      
      {/* Dynamic Animated background network canvas */}
      <NeonNetwork isDarkMode={isDarkMode} />

      {/* Frosted Glass Background Ambient Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {isDarkMode ? (
          <>
            {/* Dot Grid Layer */}
            <div className="absolute inset-0 radial-grid opacity-20" />
            
            {/* Subtle Corner and Ambient Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[120px] rounded-full animate-pulse duration-[10000ms]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse duration-[12000ms]" />
            <div className="absolute top-[40%] right-[10%] w-[35%] h-[35%] bg-blue-600/5 blur-[100px] rounded-full" />
          </>
        ) : (
          <>
            {/* Soft Light Dot Grid */}
            <div className="absolute inset-0 radial-grid opacity-10" />
            
            {/* Elegant Soft Light Pastel Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-200/45 blur-[100px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200/45 blur-[100px] rounded-full" />
            <div className="absolute top-[40%] right-[10%] w-[35%] h-[35%] bg-blue-100/35 blur-[90px] rounded-full" />
          </>
        )}
      </div>

      {/* Main Public Portfolio Frame */}
      <PortfolioView
        cmsData={cmsData}
        language={language}
        setLanguage={setLanguage}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onAdminClick={() => setIsAdminOpen(true)}
        incrementViews={incrementViewerCount}
        showAdminGate={showAdminGate}
      />

      {/* Entry Customizable Promo Announcement Popup */}
      {isPopupOpen && (
        <CustomPopup
          settings={cmsData.settings}
          socials={cmsData.socials}
          language={language}
          onClose={handleClosePopup}
        />
      )}

      {/* Access Controlled Administration Workspace Overlay */}
      {isAdminOpen && (
        <AdminPanel
          cmsData={cmsData}
          onClose={() => setIsAdminOpen(false)}
          onUpdateData={handleUpdateCMSData}
          viewerCount={viewerCount}
        />
      )}

    </div>
  );
}
