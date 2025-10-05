import React from "react";
import { FullScreen } from "layouts";
import { navigate } from "@reach/router";

interface IProps {
  children: JSX.Element | JSX.Element[];
  title: string;
}

export const FullScreenLayout: React.FC<IProps> = ({ children, title }) => {
  const goBack = () => {
    navigate(-1);
  };
  return (
    <FullScreen
      title={title}
      onClose={goBack}
      withFooter={false}
      contentTheme="grey"
    >
      {children}
    </FullScreen>
  );
};
