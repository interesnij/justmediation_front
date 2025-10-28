import React from "react";
import { Link, useLocation } from "@reach/router";
import classNames from "classnames";
import LogoImg from "assets/images/grayscale_transparent.png";
import { NavMenuItem } from "types"; 
import "./style.scss";
import {useContextSubscriptionAccess} from "contexts";

interface Props { 
  menuData: NavMenuItem[];
  baseUrl: string;
}
export const Navbar = ({ menuData, baseUrl }: Props) => {
  const {hasSubscription, isDisabledUrl} = useContextSubscriptionAccess();

  const location = useLocation();
  const currentRoute =
    "/" +
    location.pathname.split("/")[1] +
    "/" +
    location.pathname.split("/")[2];
  return (
    <div className="navbar">
      <Link to={`${baseUrl}overview`} className="navbar__logo">
        <img src={LogoImg} alt="logo" />
      </Link>
      {menuData.map(({ title, items }) => {
        return (
          <div key={title}>
            <div className="navbar__title">{title}</div>
            <div>
              {items.map(({ label, route, icon, activeIcon }) => {
                return (
                  <Link
                    to={route}
                    key={route}
                    className={classNames(
                      "navbar__item ripple-effect ripple-effect-to-right",
                      {
                        "navbar__item--active": route === currentRoute,
                        "navbar__item--disabled": !hasSubscription && isDisabledUrl(route)
                      }
                    )}
                  >
                    {route === currentRoute ? (
                      <img src={activeIcon} alt="" />
                    ) : (
                      <img src={icon} alt="" />
                    )} 
                    <span>{label}</span>
                  </Link>
                ); 
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
