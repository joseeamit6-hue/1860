import React from "react";
import { TextFormatConfig } from "../types";

interface CMSControlsProps {
  value: TextFormatConfig;
  onChange: (updated: TextFormatConfig) => void;
}

const VIBGYOR_COLORS = [
  { name: "Violet", value: "#8b5cf6" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#10b981" },
  { name: "Yellow", value: "#f59e0b" },
  { name: "Orange", value: "#f97316" },
  { name: "Red", value: "#ef4444" }
];

export const CMSControls: React.FC<CMSControlsProps> = ({ value, onChange }) => {
  const updateField = <K extends keyof TextFormatConfig>(field: K, val: TextFormatConfig[K]) => {
    onChange({
      ...value,
      [field]: val
    });
  };

  return (
    <div className="p-4 bg-slate-900/90 rounded-xl border border-cyan-500/20 text-slate-300 space-y-4">
      <div className="text-xs font-mono font-semibold tracking-wider text-cyan-400 uppercase">
        Typography & Style Settings (Live Preview Enabled)
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Style Buttons & Alignment */}
        <div className="space-y-3">
          <label className="block text-xs font-medium text-slate-400">Styling & Alignment</label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => updateField("bold", !value.bold)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                value.bold ? "bg-cyan-500 text-slate-950 shadow" : "bg-slate-800 hover:bg-slate-700"
              }`}
            >
              B
            </button>
            <button
              type="button"
              onClick={() => updateField("italic", !value.italic)}
              className={`px-3 py-1.5 rounded-lg text-xs italic transition ${
                value.italic ? "bg-cyan-500 text-slate-950 shadow" : "bg-slate-800 hover:bg-slate-700"
              }`}
            >
              I
            </button>
            <button
              type="button"
              onClick={() => updateField("underline", !value.underline)}
              className={`px-3 py-1.5 rounded-lg text-xs underline transition ${
                value.underline ? "bg-cyan-500 text-slate-950 shadow" : "bg-slate-800 hover:bg-slate-700"
              }`}
            >
              U
            </button>

            <div className="h-6 w-px bg-slate-700 mx-1" />

            <button
              type="button"
              onClick={() => updateField("align", "left")}
              className={`px-2 py-1.5 rounded-lg text-xs transition ${
                value.align === "left" || !value.align ? "bg-cyan-500 text-slate-950" : "bg-slate-800"
              }`}
            >
              Left
            </button>
            <button
              type="button"
              onClick={() => updateField("align", "center")}
              className={`px-2 py-1.5 rounded-lg text-xs transition ${
                value.align === "center" ? "bg-cyan-500 text-slate-950" : "bg-slate-800"
              }`}
            >
              Center
            </button>
            <button
              type="button"
              onClick={() => updateField("align", "right")}
              className={`px-2 py-1.5 rounded-lg text-xs transition ${
                value.align === "right" ? "bg-cyan-500 text-slate-950" : "bg-slate-800"
              }`}
            >
              Right
            </button>
          </div>
        </div>

        {/* Color Palette (VIBGYOR) & Color Mixer */}
        <div className="space-y-3">
          <label className="block text-xs font-medium text-slate-400">Color Palette</label>
          <div className="flex flex-wrap gap-1.5">
            {VIBGYOR_COLORS.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => updateField("color", c.value)}
                style={{ backgroundColor: c.value }}
                title={c.name}
                className={`w-6 h-6 rounded-full border transition-transform ${
                  value.color === c.value ? "scale-125 border-white" : "border-transparent"
                }`}
              />
            ))}
            <div className="flex items-center ml-2 space-x-1.5">
              <input
                type="color"
                value={value.color || "#22d3ee"}
                onChange={(e) => updateField("color", e.target.value)}
                className="w-7 h-7 rounded bg-transparent border-0 cursor-pointer"
              />
              <span className="text-xs font-mono">{value.color || "Default"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
        {/* Letter Spacing */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-400">Letter Spacing</label>
          <select
            value={value.letterSpacing || "normal"}
            onChange={(e) => updateField("letterSpacing", e.target.value)}
            className="w-full text-xs bg-slate-800 border border-slate-700 rounded-lg py-1.5 px-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="normal">Normal</option>
            <option value="wide">Wide (0.05em)</option>
            <option value="wider">Wider (0.1em)</option>
            <option value="widest">Widest (0.2em)</option>
          </select>
        </div>

        {/* Line Spacing */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-400">Line Spacing</label>
          <select
            value={value.lineSpacing || "normal"}
            onChange={(e) => updateField("lineSpacing", e.target.value)}
            className="w-full text-xs bg-slate-800 border border-slate-700 rounded-lg py-1.5 px-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="normal">Normal</option>
            <option value="relaxed">Relaxed</option>
            <option value="loose">Loose</option>
          </select>
        </div>

        {/* Text Distance (Margin Top) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-400">Margin Distance</label>
          <select
            value={value.marginTop || "mt-2"}
            onChange={(e) => updateField("marginTop", e.target.value)}
            className="w-full text-xs bg-slate-800 border border-slate-700 rounded-lg py-1.5 px-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="mt-0">None (0px)</option>
            <option value="mt-2">Small (8px)</option>
            <option value="mt-4">Medium (16px)</option>
            <option value="mt-8">Large (32px)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Utility function to apply formatting configurations dynamically
export const getFormattingClasses = (config?: TextFormatConfig): string => {
  if (!config) return "";
  let classes = "";
  if (config.bold) classes += " font-bold";
  if (config.italic) classes += " italic";
  if (config.underline) classes += " underline";

  if (config.align === "center") classes += " text-center";
  else if (config.align === "right") classes += " text-right";
  else classes += " text-left";

  if (config.letterSpacing === "wide") classes += " tracking-wide";
  else if (config.letterSpacing === "wider") classes += " tracking-wider";
  else if (config.letterSpacing === "widest") classes += " tracking-widest";

  if (config.lineSpacing === "relaxed") classes += " leading-relaxed";
  else if (config.lineSpacing === "loose") classes += " leading-loose";

  if (config.marginTop) classes += ` ${config.marginTop}`;

  return classes;
};
