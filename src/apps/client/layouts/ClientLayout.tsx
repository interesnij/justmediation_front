import React from "react";
import { MainLayout } from "layouts";
import { CLIENT_MENU } from "config";
interface Props {
  title?: string;
  backUrl?: string;
  children: React.ReactNode;
  showButtons?: boolean;
}
export const ClientLayout = ({ title, children, backUrl }: Props) => {
  return (
    <MainLayout
      title={title}
      menuData={CLIENT_MENU}
      baseUrl="/client/"
      backUrl={backUrl}
      showButtons={false}
    >
      {children}
    </MainLayout>
  );
};
