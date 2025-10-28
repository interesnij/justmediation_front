import React from "react";

import ClipLoader2 from "react-spinners/ClipLoader";
import { css } from "@emotion/react";

export const ClipLoader = () => {
  return (
    <ClipLoader2
      size={40}
      color="#90ee90"
      css={css`
        display: block;
        margin: 20px auto;
      `}
    />
  );
};
