// src/languages/translations.ts

export const translations = {
  en: {
    // Navigation
    nav_home: "Home",
    nav_products: "Products",
    search_placeholder: "Search products...",
    login_button: "Sign in",

    // User Menu
    account_menu: "Account Menu",
    browse_shop: "Browse Shop",
    my_profile: "My Profile",
    sign_out: "Sign Out",

    // Order Success Page
    order_confirmed: "Order Confirmed!",
    order_success_desc:
      "Thank you for your purchase. Your order has been placed successfully.",
    status: "Status",
    processing: "Processing",
    email_confirmation_notice:
      "You will receive an email confirmation shortly with details.",
    view_my_orders: "View My Orders",
    continue_shopping: "Continue Shopping",
  },
  es: {
    // Navigation
    nav_home: "Inicio",
    nav_products: "Productos",
    search_placeholder: "Buscar productos...",
    login_button: "Ingresar / Unirse",

    // User Menu
    account_menu: "Menú de Cuenta",
    browse_shop: "Ver Tienda",
    my_profile: "Mi Perfil",
    sign_out: "Cerrar Sesión",

    // Order Success Page
    order_confirmed: "¡Pedido Confirmado!",
    order_success_desc:
      "Gracias por su compra. Su pedido ha sido realizado con éxito.",
    status: "Estado",
    processing: "Procesando",
    email_confirmation_notice:
      "Recibirá una confirmación por correo electrónico pronto.",
    view_my_orders: "Ver Mis Pedidos",
    continue_shopping: "Continuar Comprando",
  },
  fr: {
    // Navigation
    nav_home: "Accueil",
    nav_products: "Produits",
    search_placeholder: "Rechercher...",
    login_button: "Connexion",

    // User Menu
    account_menu: "Menu Compte",
    browse_shop: "Boutique",
    my_profile: "Mon Profil",
    sign_out: "Déconnexion",

    // Order Success Page
    order_confirmed: "Commande Confirmée!",
    order_success_desc:
      "Merci pour votre achat. Votre commande a été passée avec succès.",
    status: "Statut",
    processing: "Traitement",
    email_confirmation_notice:
      "Vous recevrez bientôt un e-mail de confirmation.",
    view_my_orders: "Voir mes commandes",
    continue_shopping: "Continuer mes achats",
  },
  ar: {
    // Navigation
    nav_home: "الرئيسية",
    nav_products: "المنتجات",
    search_placeholder: "بحث عن منتجات...",
    login_button: "تسجيل الدخول",

    // User Menu
    account_menu: "قائمة الحساب",
    browse_shop: "تصفح المتجر",
    my_profile: "ملفي الشخصي",
    sign_out: "تسجيل الخروج",

    // Order Success Page
    order_confirmed: "تم تأكيد الطلب!",
    order_success_desc: "شكراً لشرائك. تم تقديم طلبك بنجاح.",
    status: "الحالة",
    processing: "قيد المعالجة",
    email_confirmation_notice: "ستتلقى تأكيداً عبر البريد الإلكتروني قريباً.",
    view_my_orders: "عرض طلباتي",
    continue_shopping: "مواصلة التسوق",
  },
} as const;

// Optional: Useful types for your components
export type LanguageCode = keyof typeof translations;
export type TranslationKey = keyof (typeof translations)["en"];
