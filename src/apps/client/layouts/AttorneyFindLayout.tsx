import React from "react";
import { Tab } from "components";
import { useInput } from "hooks";
import { ClientLayout } from "apps/client/layouts";

const tabData = [
  {
    tab: "Representation",
    path: "/client/find",
  },
  {
    tab: "Search",
    path: "/client/find/search",
  },
  {
    tab: "Favorites",
    path: "/client/find/favorites",
  },
];

interface Props {
  children: React.ReactNode;
  tab?: string;
  className?: string;
}
export const AttorneyFindLayout = ({ children, tab, className = '' }: Props) => {
  const currentTab = useInput(tab || tabData[0].tab);

  return (
    <ClientLayout title="Find an Attorney">
      <div className={`find-page ${className}`}>
        <Tab data={tabData} {...currentTab} />
        <div className="find-page__main">{children}</div>
      </div>
    </ClientLayout>
  );
};
