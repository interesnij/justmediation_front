import React from "react";
import { Tab } from "components";
import { useInput } from "hooks";
import { ClientLayout } from "apps/client/layouts";
interface Props {
  tab?: string;
  children: React.ReactNode;
}

const tabData = [
  { tab: "Overview", path: "/client/overview" },
  { tab: "Matters", path: "/client/overview/matters" },
  { tab: "Invoices & Payments", path: "/client/overview/invoices" },
];

export const DashboardLayout = ({ tab, children }: Props) => {
  const currentTab = useInput(tab || tabData[0].tab);
  return (
    <ClientLayout title="Dashboard">
      <Tab data={tabData} {...currentTab} />
      <div className="client-home-page">{children}</div>
    </ClientLayout>
  );
};
