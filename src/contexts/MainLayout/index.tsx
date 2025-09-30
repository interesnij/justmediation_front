import React, { useState, useEffect, createContext, useContext } from "react";
import { useLocalstorage } from "rooks";

export interface MainLayoutContextInterface {
  theme: string;
  showErrorModal(title: string, message: string): void;
}
const initialState: MainLayoutContextInterface = {
  theme: "",
  showErrorModal: () => {},
};

export const MainLayoutContext = createContext<MainLayoutContextInterface>(
  initialState as MainLayoutContextInterface
);

export const useMainLayoutContext = () => useContext(MainLayoutContext);

export const MainLayoutProvider = ({ children }) => {
  const [value, set] = useLocalstorage("main-layout-state", initialState);
  const [state, setState] = useState(value);

  const showErrorModal = (title: string, message: string) => {};
  const setTheme = (params: string) => {
    setState({ ...state, theme: params });
  };

  useEffect(() => {
    set(state);
    return () => {};
  }, [state, set]);

  return (
    <MainLayoutContext.Provider value={{ ...state, showErrorModal, setTheme }}>
      {children}
    </MainLayoutContext.Provider>
  );
};
