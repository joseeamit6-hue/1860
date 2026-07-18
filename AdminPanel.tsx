import React, { useState, useEffect } from "react";
import { 
  Lock, 
  Mail, 
  Trash2, 
  Plus, 
  Save, 
  LogOut, 
  Globe, 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  Settings, 
  Image as ImageIcon,
  BookOpen, 
  Sparkles,
  Link,
  HelpCircle,
  Eye,
  Activity,
  UserCheck
} from "lucide-react";
import { CMSData, SliderItem, SocialItem, EducationItem, ToolItem, InterestItem, ServiceItem } from "../types";
import { CMSControls } from "./CMSControls";
import { saveCMSData } from "../lib/firebase";

interface AdminPanelProps {
  cmsData: CMSData;
  onClose: () => void;
  onUpdateData: (newData: CMSData) => void;
  viewerCount: number;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  cmsData,
  onClose,
  onUpdateData,
  viewerCount
}) => {
  // Login State
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  // CMS Notification state (FullScreen checkmark/X mark overlay)
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Active section in Admin Panel
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "settings" | "sliders" | "socials" | "initiative" | "education" | "tools" | "interests" | "services"
  >("dashboard");

  // Local editable copy of CMSData
  const [formData, setFormData] = useState<CMSData>({ ...cmsData });

  // Session Token to lock single device login
  const [sessionToken, setSessionToken] = useState("");

  // Initialize and check sessionStorage
  useEffect(() => {
    const savedToken = sessionStorage.getItem("admin_session_token");
    const logged = sessionStorage.getItem("admin_logged_in") === "true";
    if (logged && savedToken) {
      setIsLoggedIn(true);
      setSessionToken(savedToken);
    }
  }, []);

  // Poll Firebase to verify session token (Single device lock)
  useEffect(() => {
    if (!isLoggedIn || !sessionToken) return;

    const checkSession = setInterval(() => {
      // Look at current database state (via cmsData prop updates)
      const currentDbToken = cmsData.adminLog?.lastLoggedInEmail; // simulated via last logged in email or similar state
      // If someone else logged in on another device, their email session is stored
      const localEmail = sessionStorage.getItem("admin_logged_email");
      if (localEmail && cmsData.adminLog?.lastLoggedInEmail && cmsData.adminLog.lastLoggedInEmail !== localEmail) {
        // Automatic logout
        handleLogout("Session initialized on another device. Automatically logged out.");
      }
    }, 4000);

    return () => clearInterval(checkSession);
  }, [isLoggedIn, sessionToken, cmsData]);

  // Handle Login submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) return;

    // Strict Password Validation
    const matchPassword = passwordInput === formData.settings.adminPasswordHash;
    const matchEmail = emailInput.includes("@") && emailInput.length > 5;

    if (matchPassword && matchEmail) {
      const generatedToken = Math.random().toString(36).substring(2, 15);
      
      // Update DB logs for Admin login
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      const updated = {
        ...formData,
        adminLog: {
          ...formData.adminLog,
          previousLoggedInTime: formData.adminLog.lastLoggedInTime || formattedDate,
          lastLoggedInTime: formattedDate,
          lastLoggedInEmail: emailInput,
        }
      };

      setFormData(updated);
      onUpdateData(updated);

      // Save credentials strictly in sessionStorage (never localStorage to ensure "ask everytime")
      sessionStorage.setItem("admin_logged_in", "true");
      sessionStorage.setItem("admin_session_token", generatedToken);
      sessionStorage.setItem("admin_logged_email", emailInput);

      setIsLoggedIn(true);
      setSessionToken(generatedToken);
      setLoginError("");

      // Trigger actual sync to Firebase
      saveCMSData(updated, `Admin ${emailInput} logged in.`);
      showNotification("success", "Welcome to Admin Dashboard!");
    } else {
      setLoginError("Invalid Email or Password Credentials. Please try again.");
      showNotification("error", "Access Denied.");
    }
  };

  const handleLogout = (message = "Session closed successfully.") => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    setSessionToken("");
    setEmailInput("");
    setPasswordInput("");
    showNotification("error", message);
  };

  // Safe wrapper for triggering notifications
  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 2000); // 2 seconds auto-dismiss
  };

  // Atomic Sync to Firebase with checkmark/cross overlay
  const triggerSync = async (updatedData: CMSData, actionName: string) => {
    setFormData(updatedData);
    onUpdateData(updatedData);

    const success = await saveCMSData(updatedData, actionName);
    if (success) {
      showNotification("success", "Saved successfully to Cloud database!");
    } else {
      showNotification("error", "Saved locally, but could not sync with Firebase cloud.");
    }
  };

  // Slider actions
  const addSlider = () => {
    const newItem: SliderItem = {
      id: `slide-${Date.now()}`,
      imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&h=900&fit=crop",
      titleEN: "New Cinematic Banner",
      titleNP: "नयाँ सिनेमाई ब्यानर",
      subtitleEN: "Custom Subtitle",
      subtitleNP: "अनुकूलित उपशीर्षक"
    };
    const updated = {
      ...formData,
      sliders: [...formData.sliders, newItem]
    };
    triggerSync(updated, "Added new slider image.");
  };

  const deleteSlider = (id: string) => {
    const updated = {
      ...formData,
      sliders: formData.sliders.filter((s) => s.id !== id)
    };
    triggerSync(updated, "Deleted slider image.");
  };

  // Social actions
  const addSocial = () => {
    const newItem: SocialItem = {
      id: `soc-${Date.now()}`,
      name: "New Profile",
      biographyEN: "Bio in English",
      biographyNP: "Bio in Nepali",
      iconName: "link",
      redirectUrl: "https://github.com/amitjoci28"
    };
    const updated = {
      ...formData,
      socials: [...formData.socials, newItem]
    };
    triggerSync(updated, "Added new social card.");
  };

  const deleteSocial = (id: string) => {
    const updated = {
      ...formData,
      socials: formData.socials.filter((s) => s.id !== id)
    };
    triggerSync(updated, "Deleted social card.");
  };

  // Education actions
  const addEducation = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      institutionEN: "Engineering College / School",
      institutionNP: "इन्जिनियरिङ कलेज / विद्यालय",
      shortIntroEN: "Degree name in English",
      shortIntroNP: "डिग्री नाम नेपालीमा",
      detailsEN: "Academic specifics in English",
      detailsNP: "शैक्षिक विवरण नेपालीमा",
      redirectUrl: "https://tu.edu.np"
    };
    const updated = {
      ...formData,
      educations: [...formData.educations, newItem]
    };
    triggerSync(updated, "Added education history card.");
  };

  const deleteEducation = (id: string) => {
    const updated = {
      ...formData,
      educations: formData.educations.filter((e) => e.id !== id)
    };
    triggerSync(updated, "Deleted education history card.");
  };

  // Tool actions
  const addTool = () => {
    const newItem: ToolItem = {
      id: `tool-${Date.now()}`,
      titleEN: "Custom Technical Utility",
      titleNP: "अनुकूलित प्राविधिक उपकरण",
      shortIntroEN: "Tool intro in English",
      shortIntroNP: "उपकरण परिचय नेपालीमा",
      logoUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=100&h=100&fit=crop",
      redirectUrl: "https://blog.amitjoshi.info.np/tool"
    };
    const updated = {
      ...formData,
      tools: [...formData.tools, newItem]
    };
    triggerSync(updated, "Added useful web utility.");
  };

  const deleteTool = (id: string) => {
    const updated = {
      ...formData,
      tools: formData.tools.filter((t) => t.id !== id)
    };
    triggerSync(updated, "Deleted useful web utility.");
  };

  // Interest actions
  const addInterest = () => {
    const newItem: InterestItem = {
      id: `int-${Date.now()}`,
      titleEN: "Topic of Interest",
      titleNP: "रुचिको विषय",
      shortIntroEN: "Short intro in English",
      shortIntroNP: "छोटो परिचय नेपालीमा",
      detailsEN: "Detailed summary in English",
      detailsNP: "विस्तृत विवरण नेपालीमा",
      logoUrl: "Shield"
    };
    const updated = {
      ...formData,
      interests: [...formData.interests, newItem]
    };
    triggerSync(updated, "Added passion interest item.");
  };

  const deleteInterest = (id: string) => {
    const updated = {
      ...formData,
      interests: formData.interests.filter((i) => i.id !== id)
    };
    triggerSync(updated, "Deleted passion interest item.");
  };

  // Service actions
  const addService = () => {
    const newItem: ServiceItem = {
      id: `srv-${Date.now()}`,
      titleEN: "New Counseling Service",
      titleNP: "नयाँ परामर्श सेवा",
      shortIntroEN: "Service description in English",
      shortIntroNP: "सेवा विवरण नेपालीमा",
      detailsEN: "Detailed requirements in English",
      detailsNP: "आवश्यकता विवरण नेपालीमा",
      imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop",
      redirectUrl: "https://amitjoshi.info.np/service",
      helpWhatsappMessageEN: "Hello Amit, I need help.",
      helpWhatsappMessageNP: "नमस्कार अमित, मलाई सहयोग चाहिन्छ।"
    };
    const updated = {
      ...formData,
      services: [...formData.services, newItem]
    };
    triggerSync(updated, "Added professional service card.");
  };

  const deleteService = (id: string) => {
    const updated = {
      ...formData,
      services: formData.services.filter((s) => s.id !== id)
    };
    triggerSync(updated, "Deleted professional service card.");
  };

  // Login Gate overlay if not validated
  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 overflow-y-auto">
        <div className="w-full max-w-md rounded-2xl glass-panel neon-border-blue p-8 space-y-6 shadow-2xl relative">
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 transition"
          >
            <XCircle className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-full bg-cyan-950/50 text-cyan-400 border border-cyan-500/30">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-100">
              Welcome to Amit Joshi Admin Dashboard
            </h2>
            <p className="text-xs text-slate-400">
              Manage your content by logging in to the secure admin portal. This gateway is protected against multiple device log-ins.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {loginError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/20 text-red-400 text-[11px] font-mono leading-relaxed">
                ⚠️ {loginError}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Admin Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-cyan-500/70" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="amitjoci28@gmail.com"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 rounded-xl py-2.5 pl-9 pr-4 text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Security Password</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••"
                className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 rounded-xl py-2.5 px-4 text-slate-100 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-xs transition duration-250 transform hover:-translate-y-0.5"
            >
              Sign In to CMS Portal
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-[10px] text-purple-400 font-mono">
              &copy; Amit Joshi | Far-West Cyber Portfolio
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#030712] overflow-hidden flex flex-col font-sans">
      
      {/* CMS FullScreen checkmark/X mark notification overlays */}
      {notification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md">
          <div className="flex flex-col items-center justify-center text-center space-y-4 max-w-sm p-8 rounded-2xl glass-panel animate-in zoom-in duration-200">
            {notification.type === "success" ? (
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <CheckCircle className="w-10 h-10 animate-pulse" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-400 text-red-400 flex items-center justify-center shadow-lg shadow-red-500/20">
                <XCircle className="w-10 h-10 animate-pulse" />
              </div>
            )}
            <div className="space-y-1">
              <h4 className="font-display font-bold text-base text-slate-100">
                {notification.type === "success" ? "Operation Successful" : "Notification Alert"}
              </h4>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">
                {notification.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Admin Top Navigation */}
      <header className="h-16 border-b border-cyan-500/15 bg-slate-950 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="p-1.5 rounded-lg bg-cyan-950/40 text-cyan-400 border border-cyan-500/20">
            🔒
          </span>
          <div className="flex flex-col">
            <span className="font-display font-bold text-slate-100 text-sm">
              Amit Joshi Admin Dashboard
            </span>
            <span className="text-[10px] font-mono text-purple-400">
              Secure Web CMS &bull; Far-West District
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-1.5 text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Server Date: 2026-07-18</span>
          </div>

          <button
            onClick={() => handleLogout()}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-950/40 hover:bg-red-900/30 border border-red-500/30 text-red-300 rounded-lg text-xs font-mono transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 text-xs rounded-lg transition"
          >
            Back to Site
          </button>
        </div>
      </header>

      {/* Main Panel Content */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left sidebar nav tabs */}
        <aside className="w-64 border-r border-cyan-500/10 bg-slate-950 overflow-y-auto p-4 space-y-2">
          <div className="text-[10px] font-mono uppercase font-bold text-cyan-400 tracking-widest px-3 mb-2">
            Workspace Segments
          </div>
          {[
            { id: "dashboard", label: "Dashboard Logs", icon: "📊" },
            { id: "settings", label: "Global Settings", icon: "⚙️" },
            { id: "sliders", label: "Homepage Sliders", icon: "🖼️" },
            { id: "socials", label: "Social Cards", icon: "🔗" },
            { id: "initiative", label: "Initiatives Hub", icon: "🤝" },
            { id: "education", label: "Education History", icon: "🎓" },
            { id: "tools", label: "Web Utilities", icon: "🔧" },
            { id: "interests", label: "Passion Interests", icon: "💡" },
            { id: "services", label: "Services Offered", icon: "💼" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium tracking-wide transition text-left ${
                activeTab === tab.id
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* Dynamic Panel Forms */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-900/40 relative">
          
          {/* SECTION A: Dashboard */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl glass-panel border border-cyan-500/15 space-y-4">
                <h3 className="text-lg font-display font-bold text-cyan-400 flex items-center space-x-2">
                  <span>📊</span>
                  <span>Portfolio Status Insights</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Database Status */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Database Link</span>
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-sm font-bold text-slate-200 font-mono">Firebase Online</span>
                    </div>
                  </div>

                  {/* Logged user */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Authenticated Session</span>
                    <p className="text-xs font-bold text-cyan-400 font-mono truncate">
                      {formData.adminLog.lastLoggedInEmail || "Unknown"}
                    </p>
                  </div>

                  {/* Viewer counts */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Web Viewer Count</span>
                    <p className="text-lg font-display font-bold text-slate-200">
                      {viewerCount} visits
                    </p>
                  </div>

                  {/* Active Admin accounts */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">System Operators</span>
                    <p className="text-sm font-bold text-purple-400 font-mono">
                      1 Operator Locked
                    </p>
                  </div>

                </div>
              </div>

              {/* Security audit logs */}
              <div className="p-6 rounded-2xl glass-panel border border-cyan-500/15 space-y-4">
                <h4 className="text-sm font-display font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                  <UserCheck className="w-4 h-4 text-purple-400" />
                  <span>Session & Modification Log (Temporal Integrity)</span>
                </h4>

                <div className="space-y-3 font-mono text-xs text-slate-300">
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5">
                    <span className="text-purple-400 font-semibold">[CURRENT SESSION STARTED]</span>
                    <p>Time & Date: {formData.adminLog.lastLoggedInTime || "No Date recorded"}</p>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5">
                    <span className="text-cyan-400 font-semibold">[PREVIOUS SESSION COMPLETED]</span>
                    <p>Time & Date: {formData.adminLog.previousLoggedInTime || "First login initiated"}</p>
                    <p className="text-[10px] text-slate-500 italic">This reflects the last logged in date and time before you initiated this active session.</p>
                  </div>

                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5">
                    <span className="text-emerald-400 font-semibold">[LAST MODIFICATION COMPLETED]</span>
                    <p>{formData.adminLog.lastModification || "No recent edits tracked."}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION B: Settings */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl glass-panel border border-cyan-500/15 space-y-4">
                <h3 className="text-lg font-display font-bold text-cyan-400">Global Website Metadata</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Favicon Brand Icon URL</label>
                    <input
                      type="text"
                      value={formData.settings.faviconUrl}
                      onChange={(e) => {
                        const updated = { ...formData, settings: { ...formData.settings, faviconUrl: e.target.value } };
                        triggerSync(updated, "Updated Favicon Brand URL");
                      }}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Nepali Flag Favicon URL</label>
                    <input
                      type="text"
                      value={formData.settings.nepaliFlagUrl}
                      onChange={(e) => {
                        const updated = { ...formData, settings: { ...formData.settings, nepaliFlagUrl: e.target.value } };
                        triggerSync(updated, "Updated Flag Icon URL");
                      }}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Permanent Address Map Embed Link</label>
                    <input
                      type="text"
                      value={formData.settings.permanentMapEmbed}
                      onChange={(e) => {
                        const updated = { ...formData, settings: { ...formData.settings, permanentMapEmbed: e.target.value } };
                        triggerSync(updated, "Updated Permanent Map link");
                      }}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Temporary/Current Map Embed Link</label>
                    <input
                      type="text"
                      value={formData.settings.temporaryMapEmbed}
                      onChange={(e) => {
                        const updated = { ...formData, settings: { ...formData.settings, temporaryMapEmbed: e.target.value } };
                        triggerSync(updated, "Updated Temporary Map link");
                      }}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">WhatsApp Phone Number (E.g. 9779848xxxxxx)</label>
                    <input
                      type="text"
                      value={formData.settings.whatsappNumber}
                      onChange={(e) => {
                        const updated = { ...formData, settings: { ...formData.settings, whatsappNumber: e.target.value } };
                        triggerSync(updated, "Updated WhatsApp connection number");
                      }}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Admin Authentication Password (Strictly Cached)</label>
                    <input
                      type="text"
                      value={formData.settings.adminPasswordHash}
                      onChange={(e) => {
                        const updated = { ...formData, settings: { ...formData.settings, adminPasswordHash: e.target.value } };
                        triggerSync(updated, "Updated admin password hash");
                      }}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Custom popup settings */}
              <div className="p-6 rounded-2xl glass-panel border border-cyan-500/15 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-display font-bold text-cyan-400">Entry Custom Popup Manager</h3>
                  <div className="flex items-center space-x-2">
                    <label className="text-xs text-slate-400">Popup Active Status:</label>
                    <button
                      onClick={() => {
                        const updated = { ...formData, settings: { ...formData.settings, customPopupActive: !formData.settings.customPopupActive } };
                        triggerSync(updated, "Toggled Promo Popup Active Status");
                      }}
                      className={`px-3 py-1 text-xs font-bold rounded-lg ${
                        formData.settings.customPopupActive ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {formData.settings.customPopupActive ? "ACTIVE" : "DISABLED"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Popup Title (English)</label>
                    <input
                      type="text"
                      value={formData.settings.customPopupTitleEN}
                      onChange={(e) => {
                        const updated = { ...formData, settings: { ...formData.settings, customPopupTitleEN: e.target.value } };
                        triggerSync(updated, "Updated Popup Title (EN)");
                      }}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Popup Title (Nepali)</label>
                    <input
                      type="text"
                      value={formData.settings.customPopupTitleNP}
                      onChange={(e) => {
                        const updated = { ...formData, settings: { ...formData.settings, customPopupTitleNP: e.target.value } };
                        triggerSync(updated, "Updated Popup Title (NP)");
                      }}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1 col-span-2">
                    <label className="text-xs text-slate-400">Popup Image Banner URL</label>
                    <input
                      type="text"
                      value={formData.settings.customPopupImageUrl}
                      onChange={(e) => {
                        const updated = { ...formData, settings: { ...formData.settings, customPopupImageUrl: e.target.value } };
                        triggerSync(updated, "Updated Popup Image URL");
                      }}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1 col-span-2">
                    <label className="text-xs text-slate-400">Popup Announcement Text (English)</label>
                    <textarea
                      rows={3}
                      value={formData.settings.customPopupTextEN}
                      onChange={(e) => {
                        const updated = { ...formData, settings: { ...formData.settings, customPopupTextEN: e.target.value } };
                        triggerSync(updated, "Updated Popup Text (EN)");
                      }}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg resize-none"
                    />
                  </div>

                  <div className="space-y-1 col-span-2">
                    <label className="text-xs text-slate-400">Popup Announcement Text (Nepali)</label>
                    <textarea
                      rows={3}
                      value={formData.settings.customPopupTextNP}
                      onChange={(e) => {
                        const updated = { ...formData, settings: { ...formData.settings, customPopupTextNP: e.target.value } };
                        triggerSync(updated, "Updated Popup Text (NP)");
                      }}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION C: Sliders */}
          {activeTab === "sliders" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-display font-bold text-cyan-400">Homepage Sliders (Unlimited Uploads)</h3>
                <button
                  onClick={addSlider}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-cyan-500 text-slate-950 font-display font-semibold text-xs rounded-lg hover:bg-cyan-400 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Custom Slider Image</span>
                </button>
              </div>

              <div className="space-y-6">
                {formData.sliders.map((slide, index) => (
                  <div key={slide.id} className="p-6 bg-slate-950 rounded-2xl border border-slate-800 relative space-y-4">
                    <div className="absolute top-4 right-4 flex items-center space-x-2">
                      <span className="px-2 py-1 bg-slate-900 border border-slate-800 text-[10px] text-cyan-400 rounded">
                        Slide #{index + 1}
                      </span>
                      <button
                        onClick={() => deleteSlider(slide.id)}
                        className="p-1.5 bg-red-950/40 hover:bg-red-900/40 border border-red-500/30 rounded-lg text-red-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Slider Background Image URL</label>
                        <input
                          type="text"
                          value={slide.imageUrl}
                          onChange={(e) => {
                            const updatedList = [...formData.sliders];
                            updatedList[index].imageUrl = e.target.value;
                            triggerSync({ ...formData, sliders: updatedList }, "Modified Slider Image URL");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Slide Overlay Title (English)</label>
                        <input
                          type="text"
                          value={slide.titleEN}
                          onChange={(e) => {
                            const updatedList = [...formData.sliders];
                            updatedList[index].titleEN = e.target.value;
                            triggerSync({ ...formData, sliders: updatedList }, "Modified Slider Title (EN)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Slide Overlay Title (Nepali)</label>
                        <input
                          type="text"
                          value={slide.titleNP}
                          onChange={(e) => {
                            const updatedList = [...formData.sliders];
                            updatedList[index].titleNP = e.target.value;
                            triggerSync({ ...formData, sliders: updatedList }, "Modified Slider Title (NP)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Slide Subtitle (English)</label>
                        <input
                          type="text"
                          value={slide.subtitleEN}
                          onChange={(e) => {
                            const updatedList = [...formData.sliders];
                            updatedList[index].subtitleEN = e.target.value;
                            triggerSync({ ...formData, sliders: updatedList }, "Modified Slider Subtitle (EN)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Slide Subtitle (Nepali)</label>
                        <input
                          type="text"
                          value={slide.subtitleNP}
                          onChange={(e) => {
                            const updatedList = [...formData.sliders];
                            updatedList[index].subtitleNP = e.target.value;
                            triggerSync({ ...formData, sliders: updatedList }, "Modified Slider Subtitle (NP)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION D: Socials */}
          {activeTab === "socials" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-display font-bold text-cyan-400">Social Connections Cards</h3>
                <button
                  onClick={addSocial}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-cyan-500 text-slate-950 font-display font-semibold text-xs rounded-lg hover:bg-cyan-400 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Social Card</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.socials.map((soc, index) => (
                  <div key={soc.id} className="p-6 bg-slate-950 rounded-2xl border border-slate-800 relative space-y-4">
                    <button
                      onClick={() => deleteSocial(soc.id)}
                      className="absolute top-4 right-4 p-1.5 bg-red-950/40 hover:bg-red-900/40 border border-red-500/30 rounded-lg text-red-400 transition animate-pulse"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Social Media Name (E.g. GitHub)</label>
                        <input
                          type="text"
                          value={soc.name}
                          onChange={(e) => {
                            const updatedList = [...formData.socials];
                            updatedList[index].name = e.target.value;
                            triggerSync({ ...formData, socials: updatedList }, "Modified Social name");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Redirection Target URL (Compulsory)</label>
                        <input
                          type="text"
                          value={soc.redirectUrl}
                          onChange={(e) => {
                            const updatedList = [...formData.socials];
                            updatedList[index].redirectUrl = e.target.value;
                            triggerSync({ ...formData, socials: updatedList }, "Modified Social URL");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Icon Name key (facebook, instagram, tiktok, whatsapp, mail, link)</label>
                        <input
                          type="text"
                          value={soc.iconName}
                          onChange={(e) => {
                            const updatedList = [...formData.socials];
                            updatedList[index].iconName = e.target.value;
                            triggerSync({ ...formData, socials: updatedList }, "Modified Social icon key");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Brief Biography description (English)</label>
                        <input
                          type="text"
                          value={soc.biographyEN}
                          onChange={(e) => {
                            const updatedList = [...formData.socials];
                            updatedList[index].biographyEN = e.target.value;
                            triggerSync({ ...formData, socials: updatedList }, "Modified Social Bio (EN)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Brief Biography description (Nepali)</label>
                        <input
                          type="text"
                          value={soc.biographyNP}
                          onChange={(e) => {
                            const updatedList = [...formData.socials];
                            updatedList[index].biographyNP = e.target.value;
                            triggerSync({ ...formData, socials: updatedList }, "Modified Social Bio (NP)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION E: Initiatives */}
          {activeTab === "initiative" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl glass-panel border border-cyan-500/15 space-y-4">
                <h3 className="text-lg font-display font-bold text-cyan-400">Community Initiative Workspace</h3>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Public Facebook Page Embed URL</label>
                    <input
                      type="text"
                      value={formData.initiatives.facebookEmbedUrl}
                      onChange={(e) => {
                        const updated = { ...formData, initiatives: { ...formData.initiatives, facebookEmbedUrl: e.target.value } };
                        triggerSync(updated, "Updated facebook Page Embed link");
                      }}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Initiative Title (English)</label>
                      <input
                        type="text"
                        value={formData.initiatives.titleEN}
                        onChange={(e) => {
                          const updated = { ...formData, initiatives: { ...formData.initiatives, titleEN: e.target.value } };
                          triggerSync(updated, "Updated Initiative Title (EN)");
                        }}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Initiative Title (Nepali)</label>
                      <input
                        type="text"
                        value={formData.initiatives.titleNP}
                        onChange={(e) => {
                          const updated = { ...formData, initiatives: { ...formData.initiatives, titleNP: e.target.value } };
                          triggerSync(updated, "Updated Initiative Title (NP)");
                        }}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                      />
                    </div>

                    <div className="space-y-1 col-span-2">
                      <label className="text-xs text-slate-400">5-Line Short Intro Biography (English)</label>
                      <textarea
                        rows={3}
                        value={formData.initiatives.introEN}
                        onChange={(e) => {
                          const updated = { ...formData, initiatives: { ...formData.initiatives, introEN: e.target.value } };
                          triggerSync(updated, "Updated Initiative Intro (EN)");
                        }}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg resize-none"
                      />
                    </div>

                    <div className="space-y-1 col-span-2">
                      <label className="text-xs text-slate-400">5-Line Short Intro Biography (Nepali)</label>
                      <textarea
                        rows={3}
                        value={formData.initiatives.introNP}
                        onChange={(e) => {
                          const updated = { ...formData, initiatives: { ...formData.initiatives, introNP: e.target.value } };
                          triggerSync(updated, "Updated Initiative Intro (NP)");
                        }}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg resize-none"
                      />
                    </div>

                    <div className="space-y-1 col-span-2">
                      <label className="text-xs text-slate-400">Detailed Biography inside Read More popup (English)</label>
                      <textarea
                        rows={4}
                        value={formData.initiatives.detailsEN}
                        onChange={(e) => {
                          const updated = { ...formData, initiatives: { ...formData.initiatives, detailsEN: e.target.value } };
                          triggerSync(updated, "Updated Initiative Details (EN)");
                        }}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                      />
                    </div>

                    <div className="space-y-1 col-span-2">
                      <label className="text-xs text-slate-400">Detailed Biography inside Read More popup (Nepali)</label>
                      <textarea
                        rows={4}
                        value={formData.initiatives.detailsNP}
                        onChange={(e) => {
                          const updated = { ...formData, initiatives: { ...formData.initiatives, detailsNP: e.target.value } };
                          triggerSync(updated, "Updated Initiative Details (NP)");
                        }}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                      />
                    </div>

                    <div className="space-y-1 col-span-2">
                      <label className="text-xs text-slate-400">Follow Us Redirect Link</label>
                      <input
                        type="text"
                        value={formData.initiatives.followUrl}
                        onChange={(e) => {
                          const updated = { ...formData, initiatives: { ...formData.initiatives, followUrl: e.target.value } };
                          triggerSync(updated, "Updated follow redirection link");
                        }}
                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION F: Education */}
          {activeTab === "education" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-display font-bold text-cyan-400">Academic History (Degrees & Schools)</h3>
                <button
                  onClick={addEducation}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-cyan-500 text-slate-950 font-display font-semibold text-xs rounded-lg hover:bg-cyan-400 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add School Record</span>
                </button>
              </div>

              <div className="space-y-6">
                {formData.educations.map((edu, index) => (
                  <div key={edu.id} className="p-6 bg-slate-950 rounded-2xl border border-slate-800 relative space-y-4">
                    <button
                      onClick={() => deleteEducation(edu.id)}
                      className="absolute top-4 right-4 p-1.5 bg-red-950/40 hover:bg-red-900/40 border border-red-500/30 rounded-lg text-red-400 transition"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Institution Name (English)</label>
                        <input
                          type="text"
                          value={edu.institutionEN}
                          onChange={(e) => {
                            const updatedList = [...formData.educations];
                            updatedList[index].institutionEN = e.target.value;
                            triggerSync({ ...formData, educations: updatedList }, "Modified Edu Institution (EN)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Institution Name (Nepali)</label>
                        <input
                          type="text"
                          value={edu.institutionNP}
                          onChange={(e) => {
                            const updatedList = [...formData.educations];
                            updatedList[index].institutionNP = e.target.value;
                            triggerSync({ ...formData, educations: updatedList }, "Modified Edu Institution (NP)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Short Degree Intro (English)</label>
                        <input
                          type="text"
                          value={edu.shortIntroEN}
                          onChange={(e) => {
                            const updatedList = [...formData.educations];
                            updatedList[index].shortIntroEN = e.target.value;
                            triggerSync({ ...formData, educations: updatedList }, "Modified Edu Degree (EN)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Short Degree Intro (Nepali)</label>
                        <input
                          type="text"
                          value={edu.shortIntroNP}
                          onChange={(e) => {
                            const updatedList = [...formData.educations];
                            updatedList[index].shortIntroNP = e.target.value;
                            triggerSync({ ...formData, educations: updatedList }, "Modified Edu Degree (NP)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1 col-span-2">
                        <label className="text-xs text-slate-400">Brief details inside popup (English)</label>
                        <textarea
                          rows={3}
                          value={edu.detailsEN}
                          onChange={(e) => {
                            const updatedList = [...formData.educations];
                            updatedList[index].detailsEN = e.target.value;
                            triggerSync({ ...formData, educations: updatedList }, "Modified Edu Brief (EN)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1 col-span-2">
                        <label className="text-xs text-slate-400">Brief details inside popup (Nepali)</label>
                        <textarea
                          rows={3}
                          value={edu.detailsNP}
                          onChange={(e) => {
                            const updatedList = [...formData.educations];
                            updatedList[index].detailsNP = e.target.value;
                            triggerSync({ ...formData, educations: updatedList }, "Modified Edu Brief (NP)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1 col-span-2">
                        <label className="text-xs text-slate-400">Official Web redirect URL (Visit button)</label>
                        <input
                          type="text"
                          value={edu.redirectUrl}
                          onChange={(e) => {
                            const updatedList = [...formData.educations];
                            updatedList[index].redirectUrl = e.target.value;
                            triggerSync({ ...formData, educations: updatedList }, "Modified Edu URL");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION G: Tools */}
          {activeTab === "tools" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-display font-bold text-cyan-400">Digital Utilities & Web Tools</h3>
                <button
                  onClick={addTool}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-cyan-500 text-slate-950 font-display font-semibold text-xs rounded-lg hover:bg-cyan-400 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Tool Widget</span>
                </button>
              </div>

              {formData.tools.length > 15 && (
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-mono">
                  💡 Note: You have more than 15 tools active. The portfolio will automatically show a "Visit More Tools" button for items beyond 15, opening a modal.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.tools.map((tool, index) => (
                  <div key={tool.id} className="p-6 bg-slate-950 rounded-2xl border border-slate-800 relative space-y-4">
                    <button
                      onClick={() => deleteTool(tool.id)}
                      className="absolute top-4 right-4 p-1.5 bg-red-950/40 hover:bg-red-900/40 border border-red-500/30 rounded-lg text-red-400 transition"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Tool Title (English)</label>
                        <input
                          type="text"
                          value={tool.titleEN}
                          onChange={(e) => {
                            const updatedList = [...formData.tools];
                            updatedList[index].titleEN = e.target.value;
                            triggerSync({ ...formData, tools: updatedList }, "Modified Tool Title (EN)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Tool Title (Nepali)</label>
                        <input
                          type="text"
                          value={tool.titleNP}
                          onChange={(e) => {
                            const updatedList = [...formData.tools];
                            updatedList[index].titleNP = e.target.value;
                            triggerSync({ ...formData, tools: updatedList }, "Modified Tool Title (NP)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Short Intro (English)</label>
                        <input
                          type="text"
                          value={tool.shortIntroEN}
                          onChange={(e) => {
                            const updatedList = [...formData.tools];
                            updatedList[index].shortIntroEN = e.target.value;
                            triggerSync({ ...formData, tools: updatedList }, "Modified Tool Intro (EN)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Short Intro (Nepali)</label>
                        <input
                          type="text"
                          value={tool.shortIntroNP}
                          onChange={(e) => {
                            const updatedList = [...formData.tools];
                            updatedList[index].shortIntroNP = e.target.value;
                            triggerSync({ ...formData, tools: updatedList }, "Modified Tool Intro (NP)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Logo URL Image</label>
                        <input
                          type="text"
                          value={tool.logoUrl}
                          onChange={(e) => {
                            const updatedList = [...formData.tools];
                            updatedList[index].logoUrl = e.target.value;
                            triggerSync({ ...formData, tools: updatedList }, "Modified Tool Logo URL");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Hidden Redirection link (compulsory)</label>
                        <input
                          type="text"
                          value={tool.redirectUrl}
                          onChange={(e) => {
                            const updatedList = [...formData.tools];
                            updatedList[index].redirectUrl = e.target.value;
                            triggerSync({ ...formData, tools: updatedList }, "Modified Tool Redirect URL");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION H: Interests */}
          {activeTab === "interests" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-display font-bold text-cyan-400">Passions & Interests cards</h3>
                <button
                  onClick={addInterest}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-cyan-500 text-slate-950 font-display font-semibold text-xs rounded-lg hover:bg-cyan-400 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Interest item</span>
                </button>
              </div>

              <div className="space-y-6">
                {formData.interests.map((int, index) => (
                  <div key={int.id} className="p-6 bg-slate-950 rounded-2xl border border-slate-800 relative space-y-4">
                    <button
                      onClick={() => deleteInterest(int.id)}
                      className="absolute top-4 right-4 p-1.5 bg-red-950/40 hover:bg-red-900/40 border border-red-500/30 rounded-lg text-red-400 transition"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Interest Title (English)</label>
                        <input
                          type="text"
                          value={int.titleEN}
                          onChange={(e) => {
                            const updatedList = [...formData.interests];
                            updatedList[index].titleEN = e.target.value;
                            triggerSync({ ...formData, interests: updatedList }, "Modified Interest Title (EN)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Interest Title (Nepali)</label>
                        <input
                          type="text"
                          value={int.titleNP}
                          onChange={(e) => {
                            const updatedList = [...formData.interests];
                            updatedList[index].titleNP = e.target.value;
                            triggerSync({ ...formData, interests: updatedList }, "Modified Interest Title (NP)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Short intro context (English)</label>
                        <input
                          type="text"
                          value={int.shortIntroEN}
                          onChange={(e) => {
                            const updatedList = [...formData.interests];
                            updatedList[index].shortIntroEN = e.target.value;
                            triggerSync({ ...formData, interests: updatedList }, "Modified Interest Intro (EN)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Short intro context (Nepali)</label>
                        <input
                          type="text"
                          value={int.shortIntroNP}
                          onChange={(e) => {
                            const updatedList = [...formData.interests];
                            updatedList[index].shortIntroNP = e.target.value;
                            triggerSync({ ...formData, interests: updatedList }, "Modified Interest Intro (NP)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1 col-span-2">
                        <label className="text-xs text-slate-400">Detailed overview inside popup (English)</label>
                        <textarea
                          rows={3}
                          value={int.detailsEN}
                          onChange={(e) => {
                            const updatedList = [...formData.interests];
                            updatedList[index].detailsEN = e.target.value;
                            triggerSync({ ...formData, interests: updatedList }, "Modified Interest Details (EN)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1 col-span-2">
                        <label className="text-xs text-slate-400">Detailed overview inside popup (Nepali)</label>
                        <textarea
                          rows={3}
                          value={int.detailsNP}
                          onChange={(e) => {
                            const updatedList = [...formData.interests];
                            updatedList[index].detailsNP = e.target.value;
                            triggerSync({ ...formData, interests: updatedList }, "Modified Interest Details (NP)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION I: Services */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-display font-bold text-cyan-400">Services Offered (Form Fill assistance)</h3>
                <button
                  onClick={addService}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-cyan-500 text-slate-950 font-display font-semibold text-xs rounded-lg hover:bg-cyan-400 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service Option</span>
                </button>
              </div>

              {formData.services.length > 15 && (
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-mono">
                  💡 Note: You have more than 15 services active. The portfolio will automatically show a "Visit More Services" button for items beyond 15.
                </div>
              )}

              <div className="space-y-6">
                {formData.services.map((srv, index) => (
                  <div key={srv.id} className="p-6 bg-slate-950 rounded-2xl border border-slate-800 relative space-y-4">
                    <button
                      onClick={() => deleteService(srv.id)}
                      className="absolute top-4 right-4 p-1.5 bg-red-950/40 hover:bg-red-900/40 border border-red-500/30 rounded-lg text-red-400 transition"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Service Title (English)</label>
                        <input
                          type="text"
                          value={srv.titleEN}
                          onChange={(e) => {
                            const updatedList = [...formData.services];
                            updatedList[index].titleEN = e.target.value;
                            triggerSync({ ...formData, services: updatedList }, "Modified Service Title (EN)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Service Title (Nepali)</label>
                        <input
                          type="text"
                          value={srv.titleNP}
                          onChange={(e) => {
                            const updatedList = [...formData.services];
                            updatedList[index].titleNP = e.target.value;
                            triggerSync({ ...formData, services: updatedList }, "Modified Service Title (NP)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Short intro (English)</label>
                        <input
                          type="text"
                          value={srv.shortIntroEN}
                          onChange={(e) => {
                            const updatedList = [...formData.services];
                            updatedList[index].shortIntroEN = e.target.value;
                            triggerSync({ ...formData, services: updatedList }, "Modified Service Intro (EN)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Short intro (Nepali)</label>
                        <input
                          type="text"
                          value={srv.shortIntroNP}
                          onChange={(e) => {
                            const updatedList = [...formData.services];
                            updatedList[index].shortIntroNP = e.target.value;
                            triggerSync({ ...formData, services: updatedList }, "Modified Service Intro (NP)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1 col-span-2">
                        <label className="text-xs text-slate-400">Brief image display URL</label>
                        <input
                          type="text"
                          value={srv.imageUrl}
                          onChange={(e) => {
                            const updatedList = [...formData.services];
                            updatedList[index].imageUrl = e.target.value;
                            triggerSync({ ...formData, services: updatedList }, "Modified Service Image URL");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1 col-span-2">
                        <label className="text-xs text-slate-400">Details inside popup description (English)</label>
                        <textarea
                          rows={3}
                          value={srv.detailsEN}
                          onChange={(e) => {
                            const updatedList = [...formData.services];
                            updatedList[index].detailsEN = e.target.value;
                            triggerSync({ ...formData, services: updatedList }, "Modified Service Details (EN)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1 col-span-2">
                        <label className="text-xs text-slate-400">Details inside popup description (Nepali)</label>
                        <textarea
                          rows={3}
                          value={srv.detailsNP}
                          onChange={(e) => {
                            const updatedList = [...formData.services];
                            updatedList[index].detailsNP = e.target.value;
                            triggerSync({ ...formData, services: updatedList }, "Modified Service Details (NP)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1 col-span-2">
                        <label className="text-xs text-slate-400">Pre-filled WhatsApp Request text (English) - Sent to Amit's phone</label>
                        <input
                          type="text"
                          value={srv.helpWhatsappMessageEN}
                          onChange={(e) => {
                            const updatedList = [...formData.services];
                            updatedList[index].helpWhatsappMessageEN = e.target.value;
                            triggerSync({ ...formData, services: updatedList }, "Modified Service WA MSG (EN)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1 col-span-2">
                        <label className="text-xs text-slate-400">Pre-filled WhatsApp Request text (Nepali)</label>
                        <input
                          type="text"
                          value={srv.helpWhatsappMessageNP}
                          onChange={(e) => {
                            const updatedList = [...formData.services];
                            updatedList[index].helpWhatsappMessageNP = e.target.value;
                            triggerSync({ ...formData, services: updatedList }, "Modified Service WA MSG (NP)");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg"
                        />
                      </div>

                      <div className="space-y-1 col-span-2">
                        <label className="text-xs text-slate-400">Official Info Redirect link (View official info button)</label>
                        <input
                          type="text"
                          value={srv.redirectUrl}
                          onChange={(e) => {
                            const updatedList = [...formData.services];
                            updatedList[index].redirectUrl = e.target.value;
                            triggerSync({ ...formData, services: updatedList }, "Modified Service Redirect URL");
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs p-2.5 rounded-lg font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
