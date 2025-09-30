import React from "react";
import styled from "styled-components";
interface Props {
  children: React.ReactNode;
  label: string;
  className?: string;
}

export const StripeElement = ({ children, label, className }: Props) => {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <Container>{children}</Container>
    </div>
  );
};
const Label = styled.label`
  color: #000;
  font-size: 14px;
  line-height: 26px;
`;
const Container = styled.div`
  height: 48px;
  padding: 15px;
  border: 1px solid rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  border-radius: 4px;
  &.active,
  &:focus,
  &:active,
  &:hover {
    border: 1px solid rgba(0, 0, 0, 0.8)b;
    outline: none;
  }
`;
