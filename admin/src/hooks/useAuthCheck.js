import { useEffect } from "react";
import { getUser, removeToken } from "../utils/auth";

const useAuthCheck = () => {
  useEffect(() => {
    const user = getUser();

    if (!user) {
      removeToken();
      window.location.href = "/login"; // 🔄 auto redirect
    }
  }, []);
};

export default useAuthCheck;
