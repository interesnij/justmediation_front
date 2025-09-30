import { useEffect } from "react";
import { useAuthContext } from "contexts";
import { navigate } from "@reach/router";
import { getCurrentClientProfile, getCurrentProfile } from "api";
import { useQuery } from "react-query";

export const useAuth = (
  param: "attorney" | "paralegal" | "client" | "enterprise" | "other"
) => {
  const { userId, isLogined, userType, avatar, planId, setProfile } = useAuthContext();
  const { isLoading, data } = useQuery<any, Error>(
    [`${param}-profile`],
    () => {
      return param === "client"
        ? getCurrentClientProfile()
        : getCurrentProfile(userType)
    },
    { keepPreviousData: true }
  );

  useEffect(() => {
    const handleAutoLogout = e => {
      if (e.key === 'key' && e.oldValue && !e.newValue) {
        navigate("/");
      }
    }
    window.addEventListener('storage', handleAutoLogout)
    return function cleanup() {
      window.removeEventListener('storage', handleAutoLogout)
    }
  }, []);

  useEffect(() => {
    if (!data) return;
    setProfile(data);
  }, [data]);

  useEffect(() => {
    if (!isLogined || userType !== param) {
      navigate("/");
    } else {
      if (userType === "attorney") {
        if (!planId) {
          navigate(`/auth/onboarding/subscription/${userType}`);
        } else if (!avatar && planId) {
          navigate(`/auth/onboarding/profile/${userType}`);
        }
      } else if (["enterprise", "paralegal", "other"].includes(userType)) {
        if (!avatar) {
          navigate(`/auth/onboarding/${userType}`);
        }
      }
    }
    return () => {};
  }, [isLogined, userType, param, avatar, planId]);

  return isLogined;
}; 

 