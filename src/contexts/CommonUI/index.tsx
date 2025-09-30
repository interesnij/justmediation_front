import React, { useState, useEffect, createContext, useContext } from "react";
import { useLocalstorage } from "rooks";
import { ErrorModal, AlertModal } from "modals";
import { useModal } from "hooks";
export interface CommonUIContextInterface {
  theme: string;
  showErrorModal(title: string, message: any): void;
  showAlert(title: string, message: any): void;
}
const initialState: CommonUIContextInterface = {
  theme: "",
  showErrorModal: () => {},
  showAlert: () => {},
};

export const CommonUIContext = createContext<CommonUIContextInterface>(
  initialState as CommonUIContextInterface
);

export const useCommonUIContext = () => useContext(CommonUIContext);

export const CommonUIProvider = ({ children }) => {
  const errorModal = useModal();
  const alertModal = useModal();
  const [value, set] = useLocalstorage("ui-state", initialState);
  const [state, setState] = useState(value);
  const [errorTitle, setErrorTitle] = useState("Error");
  const [errorMessage, setErrorMessage] = useState<any>({});
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showErrorModal = (title: string = "Error", message: any) => {
    setErrorTitle(title);
    setErrorMessage(message);
    errorModal.setOpen(true);
  };

  const showAlert = (title: string = "", message: any) => {
    setAlertTitle(title);
    setAlertMessage(message);
    alertModal.setOpen(true);
  };
  const setTheme = (params: string) => {
    setState({ ...state, theme: params });
  };

  useEffect(() => {
    set(state);
    return () => {};
  }, [state, set]);

  return (
    <CommonUIContext.Provider
      value={{ ...state, showErrorModal, showAlert, setTheme }}
    >
      {children}
      {
        errorModal?.open &&
        <ErrorModal {...errorModal} title={errorTitle} error={errorMessage} />
      }
      {
        alertModal?.open &&
        <AlertModal {...alertModal} title={alertTitle} message={alertMessage} />
      }
    </CommonUIContext.Provider>
  );
};
