import React from "react";
import { Tab } from "components";
import { useInput } from "hooks";
import { FullScreenModal } from "components";
import { useAuthContext } from "contexts";
import { MyAccount } from "./MyAccount";
import { Subscription } from "./Subscription";
import { Notification } from "./Notification";
import { Integrations } from "./Integrations";
import { MatterStages } from "./MatterStages";
import { TeamSettings } from "./TeamSettings";
import styled from "styled-components";
import "./style.scss";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  userType: string;
}
export const SettingsModal = ({ open, setOpen, userType }: Props) => {
  let reset = () => {};
  const {profile} =  useAuthContext()

  const getTabData = () => {
    // paralegal | other
    if (userType && ['paralegal', 'other'].indexOf(userType) !== -1)
      return [
        { tab: "My Account"    },
        { tab: "Notification"  },
        { tab: "Integrations"  },
      ];
    // enterprise | mediator
    const menu = [
      { tab: "My Account"    },
      { tab: "Subscription"  },
    ]
    if (userType==='enterprise') { // [NEED] or mediator that has a team
      menu.push({ tab: "Team Settings" })
    }
    const addedMenu = [
      { tab: "Notification"  }, 
      { tab: "Integrations"  }, 
    ]
    if(!profile.role ||profile.role==="Mediator") {
      addedMenu.push({ tab: "Matter stages" })
    }
    return [
      ...menu,
     ...addedMenu
    ]
  }

  const currentTab = useInput("My Account");

  const getContent = () => {
    switch (currentTab.value) {
      case "My Account": return <MyAccount />;
      case "Subscription": return <Subscription />;
      case "Team Settings": return <TeamSettings />;
      case "Notification": return <Notification />;
      case "Integrations": return <Integrations />;
      case "Matter stages": return <MatterStages />;
      default:
        return null;
    }
  }

  return (
    <FullScreenModal
      title="Settings"
      noFooter
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <Tab 
        data={getTabData()} 
        {...currentTab} 
      />
      <Content>
        {getContent()}
      </Content>
    </FullScreenModal>
  );
};

const Content = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
`;
