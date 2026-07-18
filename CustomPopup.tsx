import React, { useState } from "react";
import { X, Facebook, Instagram, Mail, MessageSquare } from "lucide-react";
import { CMSData } from "../types";

interface CustomPopupProps {
  settings: CMSData["settings"];
  socials: CMSData["socials"];
  language: "en" | "np";
  onClose: () => void;
}

export const CustomPopup: React.FC<CustomPopupProps> = ({
  settings,
  socials,
  language,
  onClose,
}) => {
  const [expanded, setExpanded] = useState(false);

  const title = language === "np" ? settings.customPopupTitleNP : settings.customPopupTitleEN;
  const text = language === "np" ? settings.customPopupTextNP : settings.customPopupTextEN;

  // Split text to count lines or estimate lines
  const lines = text.split("\n");
  const isLongText = lines.length > 8 || text.length > 350;

  const getVisibleText = () => {
    if (!isLongText || expanded) return text;
    // Return first 8 lines or approximate character count
    if (lines.length > 8) {
      return lines.slice(0, 8).join("\n") + "...";
    }
    return text.slice(0, 320) + "...";
  };

  const getSocialIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "facebook":
        return <Facebook className="w-5 h-5" />;
      case "instagram":
        return <Instagram className="w-5 h-5" />;
      case "whatsapp":
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <Mail className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-2xl glass-panel overflow-hidden shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-300">
        
        {/* Close Button "X" */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-cyan-400 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/50 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Popup Image */}
        {settings.customPopupImageUrl && (
          <div className="relative h-48 w-full overflow-hidden bg-black/20">
            <img
              src={settings.customPopupImageUrl}
              alt="Promo banner"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <h3 className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
            {title || "Welcome!"}
          </h3>

          <div className="text-sm text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
            {getVisibleText()}
          </div>

          {isLongText && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 hover:underline transition focus:outline-none"
            >
              {expanded 
                ? (language === "np" ? "कम देखाउनुहोस्" : "Show Less") 
                : (language === "np" ? "थप देखाउनुहोस्" : "Show More")
              }
            </button>
          )}
        </div>

        {/* Footer with social media icons */}
        <div className="flex items-center justify-between p-4 bg-black/30 border-t border-white/10">
          <span className="text-xs font-mono text-cyan-400/70">Connect instantly:</span>
          <div className="flex items-center space-x-3">
            {socials.map((soc) => (
              <a
                key={soc.id}
                href={soc.redirectUrl}
                target="_blank"
                rel="noreferrer"
                title={soc.name}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-cyan-400 hover:text-cyan-300 border border-white/10 hover:border-cyan-400 transition transform hover:scale-110"
              >
                {getSocialIcon(soc.iconName)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
