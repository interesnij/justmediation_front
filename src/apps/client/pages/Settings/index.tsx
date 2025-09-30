import React from "react";
import { RouteComponentProps } from "@reach/router";
import { FullScreenLayout } from "apps/client/layouts";
import { Tab } from "components";
import { useInput } from "hooks";
import { Profile } from "./Profile";
import { Password } from "./Password";
import { Notification } from "./Notification";
import { PaymentMethods } from "./PaymentMethods";

import "./style.scss";

const tabData = [
  {
    tab: "Profile",
  },
  {
    tab: "Password & Security",
  },
  {
    tab: "Payment Methods",
  },
  {
    tab: "Notification",
  }
];

export const ClientSettingsPage: React.FunctionComponent<RouteComponentProps> = 
  () => {
    const currentTab = useInput(tabData[0].tab);
    return (
      <FullScreenLayout title="Settings"> 
        <>
          <Tab data={tabData} {...currentTab} />
          {currentTab.value === tabData[0].tab ? (
            <Profile />
          ) : currentTab.value === tabData[1].tab ? (
            <Password />
          ) : currentTab.value === tabData[2].tab ? (
            <PaymentMethods />
          ) : currentTab.value === tabData[3].tab ? (
            <Notification />
          ) : null}
        </>
      </FullScreenLayout>
    )
  }


