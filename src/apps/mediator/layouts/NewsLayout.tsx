import React from "react";
import { RouteComponentProps, Router } from "@reach/router";
import { MediatorLayout } from "apps/mediator/layouts";
import { NewsDashboardPage, NewsPage } from "pages";
import { useAuthContext } from "contexts";

export const NewsRouter: React.FC<RouteComponentProps> = () => {
  const { userType } = useAuthContext();
  return (
    <MediatorLayout showButtons={false} userType={userType}>
      <Router>
        <NewsDashboardPage path="/" />
        <NewsPage path="/:id" />
      </Router>
    </MediatorLayout>
  );
};
