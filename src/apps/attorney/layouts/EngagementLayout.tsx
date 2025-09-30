import React, { useState } from "react";
import { Tab, SearchBar } from "components";
import { RouteComponentProps, navigate } from "@reach/router";
import { useInput } from "hooks";

interface Props extends RouteComponentProps {
  children: React.ReactNode;
  tab?: string;
  userType: string;
}

export const EngagementLayout = ({ children, tab, userType }: Props) => {

  const tabData = [
    {
      path: `/${userType}/engagement`,
      tab: "Browse Inquiries",
    },
    {
      path: `/${userType}/engagement/submitted`,
      tab: "Submitted Engagements",
    },
  ];
  
  const currentTab = useInput(tab || tabData[0].tab);

  const handleSeach = (searchString?: string) => {
    if (!searchString || searchString.length<=2) return;
    navigate(`/${userType}/engagement/search?q=${searchString}`);
  }

  return (
    <div className="forums-page">
      <div className="d-flex">
        <Tab data={tabData} {...currentTab} />
        {/*<div className="forum-layout-bar">
          <SearchBar
            icon="search"
            placeholder="Search in Potential Engagements"
            className="my-auto"
            onEnter={handleSeach}
          />
        </div>*/}
      </div>
      <div className="forums-page__content">{children}</div>
    </div>
  );
};
