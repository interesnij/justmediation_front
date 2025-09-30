import React from "react";
import { Navbar, Header } from "components";
import ReactTooltip from "react-tooltip";
import { RouteComponentProps } from "@reach/router";
import { NavMenuItem } from "types";
import { useModal } from "hooks";
import { AddTimeEntry } from "modals";
import "./style.scss";

interface Props extends RouteComponentProps {
  children: React.ReactNode;
  title?: string;
  backUrl?: string;
  baseUrl: string;
  showButtons?: boolean;
  menuData: NavMenuItem[];
}
export const MainLayout = ({
  children,
  title,
  backUrl,
  baseUrl,
  menuData,
  showButtons = true,
}: Props) => {
  const timeModal = useModal();
  const handleTimerStop = () => {
    timeModal.setOpen(true);
  };
  return (
    <div className="main-layout">
      <Navbar menuData={menuData} baseUrl={baseUrl} />
      <div className="main-layout__content">
        <Header
          title={title}
          backUrl={backUrl}
          showButtons={showButtons}
          onTimerStop={handleTimerStop}
        />
        <div className="main-layout__content-main">{children}</div>
      </div>
      <ReactTooltip place="bottom" effect="solid" />
      {
        timeModal?.open &&
        <AddTimeEntry {...timeModal} />
      }
    </div>
  );
};
