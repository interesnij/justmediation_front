import {createContext, FC, useContext} from "react";
import {useSubscriptionAccess} from "./useSubscriptionAccess";

type tSubscriptionAccessContext = ReturnType<typeof useSubscriptionAccess>;
const SubscriptionAccessContext = createContext<tSubscriptionAccessContext | null>(null);
SubscriptionAccessContext.displayName = "SubscriptionAccessContext";

export const SubscriptionAccessProvider: FC = ({children}) => {
  const value = useSubscriptionAccess();
  return <SubscriptionAccessContext.Provider value={value}>{children}</SubscriptionAccessContext.Provider>;
};

export const useContextSubscriptionAccess = () => {
  const context = useContext(SubscriptionAccessContext);

  if (context === null) {
    throw new Error("<<< SubscriptionAccessContext >>> must be used within a SubscriptionAccessContextProvider");
  }

  return context as tSubscriptionAccessContext;
};
