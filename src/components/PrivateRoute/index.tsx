import * as React from "react";
import { RouteComponentProps } from "@reach/router";

export const PrivateRoute: React.FC<RouteComponentProps> = () => {
  // Show the component only when the user is logged in
  // Otherwise, redirect the user to /auth/login page
  return <div />;
};
