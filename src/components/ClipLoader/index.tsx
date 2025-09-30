import React from "react";

import ClipLoader2 from "react-spinners/ClipLoader";
import { css } from "@emotion/react";

export const ClipLoader = () => {
  return (
    <ClipLoader2
      size={40}
      color="rgba(0,0,0,.6)"
      css={css`
        display: block;
        margin: 20px auto;
      `}
    />
  );
};
