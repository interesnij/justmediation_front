import React from "react";
import { MainLayout } from "layouts";
import { ATTORNEY_MENU } from "config";
import { useAuthContext } from "contexts";
interface Props {
  title?: string;
  backUrl?: string;
  children: React.ReactNode;
  showButtons?: boolean;
  userType:string;
}
export const AttorneyLayout = ({
  title,
  children,
  backUrl,
  showButtons,
  userType
}: Props) => {
  const { profile } = useAuthContext();
  const menu = ATTORNEY_MENU(userType, profile.role);
  return (
    <MainLayout
      title={title}
      menuData={menu}
      baseUrl={`/${userType}/`}
      backUrl={backUrl}
      showButtons={showButtons}
    >
      {children}
    </MainLayout>
  );
};
