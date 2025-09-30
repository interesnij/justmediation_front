import React from "react";
import { RouteComponentProps } from "@reach/router";
export const NotFoundPage: React.FunctionComponent<RouteComponentProps> = () => {
  return (
    <div className="w-100 h-100">
      <h1 className="m-auto text-center">Not Found</h1>
    </div>
  );
};
