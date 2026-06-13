import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle, Package, ArrowRight, ShoppingBag } from "lucide-react";
import confetti from "canvas-confetti";
// --- IMPORT TRANSLATIONS AND STORE ---
import { useStore } from "../services/useStore.tsx";
import { translations } from "../languages/translations";

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  type LanguageCode = keyof typeof translations;

  // 2. Get the list of valid text keys (order_confirmed, etc.)
  type TranslationKey = keyof (typeof translations)["en"];
  // --- CONNECT TO THE LANGUAGE STATE ---
  const { language } = useStore();

  // Translation helper
  const t = (key: TranslationKey) => {
    // Cast language as LanguageCode so TS knows it's a safe index
    const currentLang = language as LanguageCode;

    // Fallback logic: check current lang, then English, then the key itself
    return (
      translations[currentLang]?.[key] ||
      (translations["en"] as any)[key] ||
      key
    );
  };

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#22c55e", "#3b82f6", "#f59e0b"],
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border border-slate-100">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle size={64} className="text-green-500 animate-bounce" />
          </div>
        </div>

        {/* --- TRANSLATED TITLE --- */}
        <h1 className="text-3xl font-black text-slate-800 mb-2">
          {t("order_confirmed")}
        </h1>

        {/* --- TRANSLATED SUBTITLE --- */}
        <p className="text-slate-500 mb-8">{t("order_success_desc")}</p>

        {/* Order Info Card */}
        <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 text-left">
          <div className="flex items-center gap-3 mb-4">
            <Package className="text-blue-500" size={20} />
            <span className="font-bold text-slate-700">
              {t("status")}: {t("processing")}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t("email_confirmation_notice")}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            to="/my-orders"
            className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
          >
            {t("view_my_orders")} <ArrowRight size={18} />
          </Link>

          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 w-full bg-white text-slate-600 py-4 rounded-2xl font-bold border border-slate-200 hover:bg-slate-50 transition-all"
          >
            <ShoppingBag size={18} /> {t("continue_shopping")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
