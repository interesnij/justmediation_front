import React from "react";
import { RouteComponentProps, Router } from "@reach/router";

import { ClientLayout } from "apps/client/layouts";

import { NewsDashboardPage, NewsPage } from "pages";

export const NewsRouter: React.FC<RouteComponentProps> = () => {
  return (
    <ClientLayout showButtons={false}>
      <Router>
        <NewsDashboardPage path="/" />
        <NewsPage path="/:id" />
      </Router>
    </ClientLayout>
  );
};
