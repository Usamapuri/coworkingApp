import { useContext } from "react";
import { useAuth as useAuthContext } from "@/contexts/auth-context";

export function useAuth() {
  return useAuthContext();
}
