import { useLocation, Navigate } from "react-router-dom";
import useStore from "../services/useStore";
function PortectedForCustemer({ children }: { children: JSX.Element }) {
  const { isLoggedIn } = useStore();
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
export default PortectedForCustemer;
