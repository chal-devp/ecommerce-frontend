import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "../types/interface";

interface User {
  email: string;
  role: "user" | "admin";
}
type Language = "en" | "es" | "fr" | "ar";
interface StoreState {
  language: Language;
  setLanguage: (newLang: Language) => void;
  currentOrderId: string | null;
  setCurrentOrderId: (id: string) => void;
  orderPlaced: boolean;
  setOrderPlaced: (placed: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  deliveryLocation: { lat: number; lng: number } | null;
  setDeliveryLocation: (location: { lat: number; lng: number }) => void;
  cart: CartItem[];
  user: User | null;
  isLoggedIn: boolean;
  searchTerm: string;
  setCart: (cart: CartItem[]) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  setSearchTerm: (term: string) => void;
  setAuth: (status: boolean) => void;
  handleLoginSuccess: (userData: User) => void;
  handleLogOut: () => void;
  totalAmountOf: () => number;
}

// Wrap the entire store in persist(...)
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // --- INITIAL STATE ---
      cart: [], // Persist will fill this from storage automatically
      isLoggedIn: !!localStorage.getItem("token"),
      searchTerm: "",
      user: null,
      currentOrderId: null,
      orderPlaced: false,
      isLoading: false,
      deliveryLocation: null,
      language: "en",

      setLanguage: (newLang) => set({ language: newLang }), // Simple set, persist handles the rest
      // --- ACTIONS ---
      setCurrentOrderId: (id) => set({ currentOrderId: id }),
      setOrderPlaced: (placed) => set({ orderPlaced: placed }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setCart: (newCart) => set({ cart: newCart }),

      addToCart: (product: Product) => {
        set((state) => {
          const exists = state.cart.find((item) => item._id === product._id);
          if (exists) {
            return {
              cart: state.cart.map((item) =>
                item._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }
          return {
            cart: [...state.cart, { ...product, quantity: 1 } as CartItem],
          };
        });
      },

      removeFromCart: (id: string) => {
        set((state) => ({
          cart: state.cart.filter((item) => item._id !== id),
        }));
      },

      clearCart: () => set({ cart: [] }),

      setAuth: (isLoggedIn) => set({ isLoggedIn }),

      handleLoginSuccess: (userData: User) => {
        localStorage.setItem("userRole", userData.role);
        localStorage.setItem("userEmail", userData.email);

        // Set both user info AND the orderId at the same time
        set({
          isLoggedIn: true,
          user: userData,
        });
      },
      setDeliveryLocation: (location) => set({ deliveryLocation: location }),

      handleLogOut: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        set({ isLoggedIn: false, user: null, cart: [] });
      },

      setSearchTerm: (searchTerm) => set({ searchTerm }),

      totalAmountOf: () => {
        const cart = get().cart;
        return cart.reduce(
          (sum, item) => sum + Number(item.price) * item.quantity,
          0,
        );
      },
    }),
    {
      name: "food-app-storage", // The key in localStorage
    },
  ),
);

export default useStore;
