import { useState } from "react";
import { authenticateUser } from "../../services/authService";
import { useStore } from "../../services/useStore.tsx";
import { loginSchema } from "../../schemas/authoSchema";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom"; // Added useLocation
const HandleAuthentication = () => {
  const { handleLoginSuccess, isLoading, setIsLoading } = useStore();
  const navigate = useNavigate();
  // Hook to access state passed via navigate

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit button clicked!");
    const validation = loginSchema.safeParse({ email, password });

    if (!validation.success) {
      console.log(validation.error.format());
      return;
    }

    setIsLoading(true);
    const endpoint = isLogin ? "login" : "signup";

    try {
      const data = await authenticateUser({
        email,
        password,
        phone,
        endpoint,
        role,
      });
      console.log("RAW API DATA:", data);
      if (isLogin) {
        // --- LOGIN SUCCESS LOGIC ---
        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", email);

        // This updates the Zustand store memory
        handleLoginSuccess({ email: email, role: data.role });

        console.log("Order ID saved to store:");

        if (data.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          // Navigating to map
          navigate("/CartSideBar", { replace: true });
        }
      } else {
        alert("Account created! Please login.");
        setIsLogin(true);
        // Clear fields
        setRole("user");
        setEmail("");
        setPassword("");
        setPhone("");
      } // <--- Added missing brace
    } catch (error: any) {
      console.error("Full Error Object:", error);
      if (error.response) {
        console.log("Server Error Data:", error.response.data);
        alert(`Server says: ${error.response.data.message || "Invalid Data"}`);
      } else {
        alert(error.message || "Something went wrong.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-slate-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md w-96 flex flex-col gap-4"
        >
          <h1 className="text-3xl font-bold text-slate-700 text-center">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none"
            required
            disabled={isLoading}
          />

          <div className="relative w-full max-w-sm">
            <input
              // Switch type based on showPassword state
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none pr-12"
              required
              disabled={isLoading}
            />

            {/* Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-sky-500"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {!isLogin && (
            <>
              <input
                type="number"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border p-3 rounded-lg focus:ring-2 focus:ring-sky-400 outline-none"
                disabled={isLoading}
              />
              <select
                value={role}
                // FIX 4: Correctly handle the event and cast the value
                onChange={(e) => setRole(e.target.value as "user" | "admin")}
                disabled={isLoading}
                className="border p-3 rounded-lg bg-white focus:ring-2 focus:ring-sky-400 outline-none"
              >
                <option value="user">Standard User</option>
                <option value="admin">Administrator</option>
              </select>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`p-3 rounded-lg text-white font-semibold transition ${
              !isLoading
                ? "bg-sky-500 hover:bg-sky-600"
                : "bg-slate-300 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>

          <p className="text-center text-slate-600">
            {isLogin ? "New to our shop?" : "Already have an account?"}{" "}
            <span
              onClick={() => !isLoading && setIsLogin(!isLogin)}
              className="text-sky-500 cursor-pointer font-bold hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        </form>
      </div>
    </>
  );
};

export default HandleAuthentication;
