import React from "react";
import { navigate } from "@reach/router";
import LogoImg from "assets/images/logo.svg";
import styled, { css } from "styled-components";
import {useAuthContext} from "../../contexts";
import { isMobile } from 'react-device-detect';

interface Props {
  children: React.ReactNode;
}

type MainContentDiv = {
  isMobile: boolean;
}

export const PolicyLayout = ({ children }: Props) => {
  const { redirectPage, isLogined } = useAuthContext();
  const handleClickLogin = () => {
    isLogined ? redirectPage() : navigate("/");
  };
  return (
    <div className="login-page d-flex flex-column">
      <img
        src={LogoImg}
        alt="logo"
        className="login-page__logo"
        onClick={handleClickLogin}
      />
      <MainContent isMobile={isMobile}>{children}</MainContent>
    </div>
  );
};

const MainContent = styled.div<MainContentDiv>`
  background: #f4f5f9;
  border: 1px solid #e0e0e1;
  box-sizing: border-box;
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.09), 0px 2px 32px rgba(0, 0, 0, 0.15);
  border-radius: 20px 20px 0px 0px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 26px;
  letter-spacing: -0.01em;
  color: #2e2e2e;
  padding: 48px 24px 24px 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  h1 {
    font-style: normal;
    font-weight: normal;
    font-size: 34px;
    line-height: 122.2%;
    letter-spacing: -0.01em;
    color: #000000;
  }
  h2,
  h3 {
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    letter-spacing: -0.01em;
    color: #2e2e2e;
  }
  a {
    color: rgba(0,0,0,.6);
  }
  table,
  th,
  td {
    border: 1px solid black;
    border-collapse: collapse;
    padding: 0 12px;
  }
  ${({ isMobile }) => !isMobile && css` width: 1122px; margin: 132px auto 0;`}
  ${({ isMobile }) => isMobile && css` word-break: break-word; margin: 132px 0 0;`}
`;
