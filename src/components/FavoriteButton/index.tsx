import React from "react";
import classNames from "classnames";
import FavoriteIcon from "assets/icons/favorite_fill.svg";
import UnfavoriteIcon from "assets/icons/favorite_empty.svg";
import "./style.scss";

interface Props {
  value?: boolean;
  className?: string;
  onChange?(param: boolean): void;
}

export const FavoriteButton = ({
  value = false,
  className,
  onChange = () => {},
}: Props) => {
  return (
    <img
      className={classNames("favorite-button", className)}
      onClick={() => onChange(!value)}
      src={value ? FavoriteIcon : UnfavoriteIcon}
      alt="favorite"
    />
  );
};
