import React from "react";
import { Tab } from "components";
import { useInput } from "hooks";
import { RouteComponentProps } from "@reach/router";
import { documentsTabs } from "config";
import { useAuthContext } from "contexts";
import "./style.scss";

interface Props extends RouteComponentProps {
  children: React.ReactNode;
  tab?: string;
}
export const DocumentsLayout = ({ children, tab }: Props) => {
  const { userType } = useAuthContext();
  const tabsData = documentsTabs.map((item) => {
    return {
      ...item,
      path: `/${userType}${item.path}`,
    };
  });
  const currentTab = useInput(tab || tabsData[0].tab);

  return (
    <div className="documents-page">
      <Tab data={tabsData} {...currentTab} />

      <div className="documents-page__main">{children}</div>
    </div>
  );
};
