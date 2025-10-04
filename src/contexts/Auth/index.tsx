import React, { useState, useEffect, createContext, useContext } from "react";
import { useLocalstorage } from "rooks";
import { navigate } from "@reach/router";
import { check2FA } from "api";

export interface AuthContextInterface {
  isLogined: boolean;
  key: string;
  userType: string;
  userId: string;
  planId: string;
  avatar: string;
  phone: string;
  userEmail: string;
  profile: any;
  keep: boolean;
  tfa: boolean;
  login(
    key: string,
    userType: string,
    userEmail: string,
    userId: string,
    planId: string,
    avatar: string,
    profile: any,
    keep: boolean,
    tfa: boolean,
    phone: string,
    role:string,
  ): void;
  logout(): void;
  redirectPage(): void;
  subscribe(planId: string): void;
  onboard(avatar: string, userType: string): void;
  setProfile(params): void;
  update2FA(params): void;
  setPhone(params, tfa: boolean): void;
  setProfileRaw(params): void;
}

const initialState: AuthContextInterface = {
  key: "",
  isLogined: false,
  keep: false,
  tfa: false,
  userType: "",
  userEmail: "",
  phone: "",
  userId: "",
  avatar: "",
  planId: "",
  profile: {},
  login: () => {},
  logout: () => {},
  subscribe: () => {},
  onboard: () => {},
  setProfile: () => {},
  redirectPage: () => {},
  update2FA: () => {},
  setPhone: () => {},
  setProfileRaw: () => {}
};

export const AuthContext = createContext<AuthContextInterface>(
  initialState as AuthContextInterface
);

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [value, set] = useLocalstorage("auth-state", initialState);

  const [state, setState] = useState(value);

  const login = (
    key: string,
    userType: string,
    userEmail: string,
    userId: string,
    planId: string,
    avatar: string,
    profile: any,
    keep: boolean,
    tfa: boolean,
    phone: string,
    role: string,
  ) => {
    const tempState = {
      key,
      userType,
      userEmail,
      isLogined: true,
      userId,
      planId,
      avatar,
      profile,
      keep,
      tfa,
      phone,
      role
    };
    setState({ ...state, ...tempState });
    localStorage.setItem("key", key);
    if (userType === "client") {
      navigate("/client/overview");
    } else if (userType === "mediator") {
      if (!planId) {
        navigate(`/auth/onboarding/subscription/mediator`);
      } else if (planId && !avatar) {
        navigate(`/auth/onboarding/profile/mediator`);
      } else {
        navigate(`/mediator/overview`);
      }
    } else if (userType === "paralegal") {
      if (!avatar) {
        navigate(`/auth/onboarding/paralegal`);
      } else {
        navigate(`/paralegal/overview`);
      }
    } else if (userType === "enterprise") {
      if (!avatar) {
        navigate("/auth/onboarding/enterprise");
      } else {
        navigate(`/${userType}/overview`);
      }
    } else {
      if (!avatar) {
        navigate(`/auth/onboarding/${userType}`);
      } else {
        navigate(`/${userType}/overview`);
      }
    }
  };

  const redirectPage = () => {
    const { userType, planId, avatar, profile } = state;
    if (userType === "client") {
      navigate("/client/overview");
    } else if (userType === "mediator") {
      if (!planId) {
        navigate(`/auth/onboarding/subscription/mediator`);
      } else if (planId && !avatar) {
        navigate(`/auth/onboarding/profile/mediator`);
      } else {
        navigate(`/mediator/overview`);
      }
    } else if (userType === "paralegal") {
      if (!avatar) {
        navigate(`/auth/onboarding/paralegal`);
      } else {
        navigate(`/paralegal/overview`);
      }
    } else if (userType === "enterprise") {
      if (!avatar) {
        navigate("/auth/onboarding/enterprise");
      } else {
        navigate(`/${userType}/overview`);
      }
    } else {
      if (!avatar) {
        navigate(`/auth/onboarding/${userType}`);
      } else {
        navigate(`/${userType}/overview`);
      }
    }
  };

  const subscribe = (planId: string) => {
    const updatedState: AuthContextInterface = { ...state, planId };
    setState(updatedState);
    set(updatedState);
  };

  const onboard = (avatar: string, type: string) => {
    const updatedState: AuthContextInterface = { ...state, avatar };
    set(updatedState);
    setState(updatedState);
    switch (type) {
      case "mediator":
        navigate("/mediator/overview");
        break;
      case "paralegal":
        navigate("/paralegal/overview");
        break;
      case "enterprise":
        navigate("/enterprise/overview");
        break;
      default:
        break;
    }
  };

  const logout = () => {
    localStorage.removeItem("key");
    setState(initialState);
  };

  const setProfileRaw = (params) => {
    setState({
      ...state,
      profile: params,
      avatar: params?.avatar,
      userEmail: params?.email,
    });
  }
  const setProfile = (params) => {
    if (((state.userType === "mediator" || state.userType === "paralegal") && !params?.avatar) || (state.userType === "enterprise" && !params?.admin_user_data?.avatar)) return;
    setState({
      ...state,
      profile: params,
      avatar: state.userType === "enterprise" ? params?.admin_user_data?.avatar : params?.avatar,
      userEmail: params?.email,
    });
  };

  const update2FA = (params) => {
    setState({
      ...state,
      tfa: params,
    });
  };
  const setPhone = (phone, tfa) => {
    setState({
      ...state,
      phone,
      tfa,
      profile: {
        ...state.profile,
        phone,
      }
    });
  };

  useEffect(() => {
    set(state);
    return () => {};
  }, [state, set]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        redirectPage,
        logout,
        subscribe,
        onboard,
        setProfile,
        update2FA,
        setPhone,
        setProfileRaw
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
