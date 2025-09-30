import * as React from "react";
import { Route, Redirect } from "react-router-dom";
import { RouteProps } from "react-router";
import { useAuthContext } from "contexts/Auth";
// Hooks and Utilities

interface Props extends RouteProps {
  path: string;
  component: React.ComponentType;
  props?: any;
  /**
   * restricted = false meaning public route
   * restricted = true meaning protected route
   */
  restricted?: boolean;
}
export const PublicRoute: React.FC<Props> = ({
  component: Component,
  restricted,
  props: unauthenticatedRouteProps,
  ...rest
}) => {
  const state = useAuthContext();

  return (
    <Route
      {...rest}
      render={(props) =>
        state.isLogined && restricted ? (
          <Redirect to="/home" />
        ) : (
          <Component {...props} {...unauthenticatedRouteProps} />
        )
      }
    />
  );
};
