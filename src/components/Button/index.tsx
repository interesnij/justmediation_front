import React from "react";
import classNames from "classnames";
import ScaleLoader from "react-spinners/ScaleLoader";
import StartIcon from "assets/icons/start_black.svg";
import PlusIcon from "assets/icons/plus_black.svg";
import PlusGreenIcon from "assets/icons/plus_green.svg";
import PlusWhiteIcon from "assets/icons/plus_white.svg";
import { css } from "@emotion/react";
import "./style.scss";

interface Props {
  icon?: "plus" | "play";
  type?: "outline" | "normal" | "text";
  theme?: "green" | "yellow" | "seafoam" | "white" | "red" | "grey";
  size?: "normal" | "large";
  width?: number;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  widthFluid?: boolean;
  buttonType?: "button" | "submit" | "reset" | undefined;
  onClick?(param?: any): void;
  children: React.ReactNode;
}
export const Button = ({
  icon,
  type,
  width,
  buttonType = "button",
  size = "normal",
  theme = "green",
  disabled = false,
  widthFluid = false,
  isLoading = false,
  onClick = () => {},
  children,
  className,
}: Props) => {
  return (
    <button
      className={classNames(
        "btn",
        {
          "btn--outline": type === "outline",
          "btn--text": type === "text",
          "btn--disabled": disabled,
        },
        type !== "text" ? "btn--" + theme : "",
        "ripple-effect",
        size,
        className
      )}
      style={{ width: widthFluid ? "100%" : width }}
      onClick={onClick}
      disabled={disabled || isLoading}
      type={buttonType}
    >
      {icon === "plus" && theme === "green" && type === "outline" ? (
        <img src={PlusGreenIcon} alt="plus" />
      ) : icon === "plus" && theme === "green" && type === "text" ? (
        <img src={PlusIcon} alt="plus" />
      ) : icon === "plus" && theme === "green" ? (
        <img src={PlusWhiteIcon} alt="plus" />
      ) : icon === "plus" && (theme === "yellow" || theme === "seafoam") ? (
        <img src={PlusIcon} alt="plus" />
      ) : icon === "play" ? (
        <img src={StartIcon} alt="start" />
      ) : null}
      {isLoading ? (
        <ScaleLoader
          css={css`
            width: 60px;
            display: flex;
          `}
          color={
            theme === "green" && type === "outline"
              ? "rgba(0,0,0,.6)"
              : theme === "yellow" && type === "outline"
              ? "#E9C966"
              : theme === "seafoam" && type === "outline"
              ? "#C0D8CA"
              : theme === "red" && type === "outline"
              ? "#CC4B39"
              : theme === "white"
              ? "rgba(0,0,0,.6)"
              : "white"
          }
          height={35}
          width={4}
          radius={3}
          margin={10}
        />
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
};
