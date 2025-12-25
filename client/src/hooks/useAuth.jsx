import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContextValue.jsx";

export const useAuth = () => useContext(AuthContext);
