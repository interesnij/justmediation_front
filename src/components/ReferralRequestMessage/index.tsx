import React from "react";
import styled from "styled-components";
import { useModal } from "hooks";
import { ReferMatterAcceptModal } from "modals";
import { getUserName } from "helpers";
interface Props {
  className?: string;
  data?: any;
  matterData?: any;
  onUpdate?(): void;
}
export const ReferralRequestMessage = ({
  data,
  matterData,
  className,
  onUpdate = () => {},
}: Props) => {
  const viewModal = useModal();

  const handleView = () => {
    viewModal.setOpen(true);
  };

  return (
    <Container className={className}>
      <Referral className="my-auto">REFERRAL</Referral>
      <div className="ml-1 my-auto">
        {getUserName(data?.attorney_data)} referred this matter to you.
      </div>
      <View className="ml-auto my-auto" onClick={handleView}>
        View Message
      </View>
      {
        viewModal?.open &&
        <ReferMatterAcceptModal
          matterData={matterData}
          data={data}
          onUpdate={onUpdate}
          {...viewModal}
        />
      }
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
