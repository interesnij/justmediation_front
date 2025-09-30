import React from "react";
import styled from "styled-components";
import { getUserName } from "helpers";
interface Props {
  className?: string;
  data?: any;
  matterData?: any;
}
export const ReferralPendingMessage = ({ data, className }: Props) => {
  const handleResend = () => {};

  return (
    <Container className={className}>
      <Referral className="my-auto">PENDING</Referral>
      <div className="ml-1 my-auto">
        You have referred this matter to {getUserName(data?.attorney_data)}.
      </div>
      <View className="ml-auto my-auto" onClick={handleResend}>
        RESEND
      </View>
    </Container>
  );
};

const Container = styled.div`
  border: rgba(0, 0, 0, 0.8) 1px solid;
  display: flex;
  padding: 0 24px;
  border-radius: 4px;
  height: 48px;
  color: #2e2e2e;
  font-size: 14px;
  background: white;
`;

const View = styled.div`
  color: rgba(0, 0, 0, 0.8);
  font-size: 14px;
  transition: all 300ms ease;
  cursor: pointer;
  &:hover {
    font-weight: 700;
  }
`;
const Referral = styled.div`
  color: rgba(0, 0, 0, 0.8);
  font-weight: 700;
  text-transform: uppercase;
`;
