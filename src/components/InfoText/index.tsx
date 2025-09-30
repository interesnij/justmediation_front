import React from "react";
import styled from "styled-components";
import InfoImg from "assets/icons/info_green.svg";

interface Props {
  className?: string;
  children: React.ReactNode;
}
export const InfoText = ({ children, className }: Props) => {
  return (
    <Container className={className}>
      <img src={InfoImg} className="my-auto" alt="info" />
      <div>{children}</div>
    </Container>
  );
};
const Container = styled.div`
  line-height: 20px;
  font-size: 12px;
  color: #2e2e2e;
  display: flex;
  img {
    width: 20px;
    margin-right: 10px;
  }
`;
