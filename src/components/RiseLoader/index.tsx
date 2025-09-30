import React from "react";
import { css } from "@emotion/react";
import Loader from "react-spinners/RiseLoader";

interface Props {
  className?: string;
}
export const RiseLoader = ({ className }: Props) => {
  return (
    <div className={`d-flex w-100 ${className}`}>
      <Loader
        size={15}
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
