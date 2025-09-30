import React from "react";
import { RouteComponentProps, Router } from "@reach/router";
import { AttorneyLayout } from "apps/attorney/layouts";
import { MyDocuments, Templates, DocumentEditPage } from "pages";
import { useAuthContext } from "contexts";

export const DocumentsRouter: React.FC<RouteComponentProps> = () => {
  const { userType } = useAuthContext();
  return (
    <AttorneyLayout title="Documents" userType={userType}>
      <Router>
        <MyDocuments path="/" />
        <MyDocuments path="/documents" />
        <DocumentEditPage path="/edit" />
        <Templates path="/templates" />
      </Router>
    </AttorneyLayout>
  );
};
