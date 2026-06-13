import { useState, useEffect, useRef } from "react";
import { ShoppingCart, Search, Trash2, Package, Home } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useStore } from "../../services/useStore.tsx";
import LanguageSwitcher from "../../languages/LanguageSwitcher.tsx";
import { translations } from "../../languages/translations.js"; // Ensure this path is correct!

function NavBar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    cart,
    searchTerm,
    setSearchTerm,
    isLoggedIn,
    handleLogOut,
    language,
  } = useStore();
  type TranslationKeys = keyof (typeof translations)["en"];
  // Translation helper function
  const t = (key: TranslationKeys) => {
    const currentTranslations = (translations as any)[language];
    // If the key exists in the current language, use it.
    // If not, try to find it in English before falling back to the key name.
    return (
      currentTranslations?.[key] || (translations["en"] as any)[key] || key
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-slate-900 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center flex-row gap-5 px-4 text-white">
        {/* --- LOGO --- */}
        <div className="flex items-center gap-5">
          <Link to="/" className="text-2xl font-bol text-white">
            TECH_STORE
          </Link>
          <div className="hidden gap-6 md:flex">
            <Link
              to="#"
              className="text-sm font-medium hover:underline text-white"
            >
              {t("nav_home")}
            </Link>
            <Link
              to="/"
              className="text-sm font-medium text-white hover:underline"
            >
              {t("nav_products")}
            </Link>
          </div>
        </div>

        {/* --- SEARCH BAR --- */}
        <div className="relative flex flex-1 max-w-md  border border-slate-200 rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder={t("search_placeholder")}
            className="  w-full p-2 focus:outline-yellow-400 bg-slate-50 text-slate-800"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <button className=" p-3 bg-amber-500 hover:bg-amber-400 text-slate-700 transition-colors">
            <Search size={20} />
          </button>
        </div>

        {/* --- ACTIONS --- */}
        <div className="flex items-center  gap-6 justify-between">
          <LanguageSwitcher />

          {/* Cart Icon */}
          <div
            onClick={() => {
              navigate("/CartSideBar");
            }}
            className="   relative text-white hover:scale-105 border border-slate-100 p-2 cursor-pointer"
          >
            <ShoppingCart size={20} />
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-amber-500 text-[10px] text-white flex items-center justify-center font-bold">
              {cart.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>

          {/* --- USER PROFILE / DROPDOWN --- */}
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center justify-center focus:outline-none border-slate-200"
              >
                {/* The Avatar Circle */}
                <span className="w-9 h-9 bg-gradient-to-tr from-amber-500 to-amber-400 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md uppercase hover:scale-105 transition-transform">
                  {(localStorage.getItem("userEmail") || "U")[0]}
                </span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-index-100 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-slate-50 mb-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {t("account_menu")}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      navigate("/");
                      setShowDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm font-semibold transition-colors flex items-center gap-3 hover:cursor-pointer ${
                      location.pathname === "/"
                        ? "text-amber-600 bg-amber-50"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Home size={18} /> {t("browse_shop")}
                  </button>

                  <button
                    onClick={() => {
                      navigate("/profile");
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-3 hover:cursor-pointer"
                  >
                    <Package size={18} /> {t("my_profile")}
                  </button>

                  <div className="my-1 border-t border-slate-50"></div>

                  <button
                    onClick={() => {
                      handleLogOut();
                      setShowDropdown(false);
                      navigate("/");
                    }}
                    className="w-full text-right px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-3 hover:cursor-pointer"
                  >
                    <Trash2 size={18} /> {t("sign_out")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="  px-6 py-2 text-sm font-bold text-white hover:underline  hover:scale-105 border-slate-100 border transition-all shadow-lg hover:cursor-pointer"
            >
              {t("login_button")}
            </button>
          )}
          <button
            className="px-6 py-2 text-sm font-bold text-white hover:underline transtion-all hover:scale-105 shadow-lg hover:cursor-pointer border border-slate-200"
            onClick={() => navigate("/my-orders")}
          >
            My Orders
          </button>
          <button
            className="px-5 py-2 text-sm font-bold text-white hover:underline transition-transform shadow-md hover:cursor-pointer hover:scale-105 border border-slate-200"
            onClick={() => navigate("/")}
          >
            browse shop
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
