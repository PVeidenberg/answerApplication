import React from "react";
import { Redirect, Route, RouteProps } from "react-router";

export interface ProtectedRouteProps extends RouteProps {
  allowed: boolean;
  redirectNotAllowed: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowed,
  redirectNotAllowed,
  ...rest
}) => {
  // redirect to given path if route is not allowed
  if (!allowed) {
    return <Redirect to={redirectNotAllowed} />;
  }

  // return normal route
  return <Route {...rest} />;
};
