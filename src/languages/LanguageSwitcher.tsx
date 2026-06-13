// src/languages/LanguageSwitcher.tsx
import { useStore } from "../services/useStore";

// define language type (if not already defined in your store)
type Language = "en" | "es" | "fr" | "ar";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useStore();

  return (
    <div className="text-white">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-transparent text-sm font-bold text-white cursor-pointer outline-none border border-slate-200 rounded px-2 py-1"
      >
        {/* Apply bg-slate-900 and text-white directly to options for the dropdown look */}
        <option value="en" className="bg-slate-900 text-white">
          EN 🇺🇸
        </option>
        <option value="es" className="bg-slate-900 text-white">
          ES 🇪🇸
        </option>
        <option value="fr" className="bg-slate-900 text-white">
          FR 🇫🇷
        </option>
        <option value="ar" className="bg-slate-900 text-white">
          AR 🇸🇦
        </option>
      </select>
    </div>
  );
}
