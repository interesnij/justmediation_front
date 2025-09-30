import React from "react";
import { css } from "@emotion/react";
import Loader from "react-spinners/ScaleLoader";

interface Props {
  className?: string;
}
export const ScaleLoader = ({ className = "" }: Props) => {
  return (
    <div className={`d-flex ${className}`}>
      <Loader
        height={24}
        width={4}
        radius={2}
        margin={2}
        color="rgba(0,0,0,.6)"
        css={css`
          display: block;
          margin: 0px auto;
        `}
      />
    </div>
  );
};
