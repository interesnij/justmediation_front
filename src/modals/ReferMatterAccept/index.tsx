import React, { useState } from "react";
import styled from "styled-components";
import { Modal, Button, User } from "components";
import { acceptMatterReferral, ignoreMatterReferral } from "api";
import { getUserName } from "helpers";
import InfoImg from "assets/icons/info_green.svg";
import "./style.scss";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  onUpdate?(): void;
  matterData?: any;
  data?: any;
}
export const ReferMatterAcceptModal = ({
  open,
  setOpen,
  matterData,
  data,
  onUpdate = () => {},
}: Props) => {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isIgnoring, setIsIgnoring] = useState(false);

  const handleIgnore = async () => {
    setIsIgnoring(true);
    await ignoreMatterReferral(matterData?.id);
    onUpdate();
    setIsIgnoring(false);
    setOpen(false);
  };

  const handleAccept = async () => {
    setIsAccepting(true);
    await acceptMatterReferral(matterData?.id);
    onUpdate();
    setIsAccepting(false);
    setOpen(false);
  };

  return (
    <Modal
      title={`Referral from ${getUserName(data?.attorney_data)}`}
      open={open}
      setOpen={(param) => {
        setOpen(param);
      }}
    >
      <div className="new-post-modal">
        <div className="d-flex">
          <img src={InfoImg} alt="info" className="mb-auto mt-1" />
          <div className="ml-1 flex-1">
            <div className="text-green">ATTENTION:</div>
            <div className="text-dark">
              Once you accept this request, the original attorney will no longer
              have access to this matter and it’s details unless you share it.
            </div>
          </div>
        </div>
        <MatterContainer>
          <div className="text-dark font-size-lg">{matterData?.title}</div>
          <div className="text-dark">
            {`Description: ${matterData?.description}`}
          </div>
          <div className="d-flex mt-2">
            <div>
              <div className="text-gray">PRACTICE AREA</div>
              <div className="text-black">
                {matterData?.speciality_data?.title}
              </div>
            </div>
            <div className="ml-3">
              <div className="text-gray">JURISDICTION</div>
              <div className="text-black">
                {`${matterData?.city_data?.name} ${matterData?.state_data?.name} ${matterData?.country_data?.name}`}
              </div>
            </div>
          </div>
          <div className="mt-2">
            <div className="text-gray">CLIENT</div>
            <div className="d-flex">
              <User
                avatar={matterData?.client_data?.avatar}
                userName={getUserName(matterData?.client_data)}
              />
            </div>
          </div>
        </MatterContainer>

        <div className="mt-3 text-black text-font-lg">Message</div>

        <div className="mt-1 text-font-md text-gray">{data?.message}</div>

        <div className="d-flex mt-2">
          <Button
            buttonType="button"
            className="ml-auto"
            theme="white"
            size="large"
            onClick={handleIgnore}
            isLoading={isIgnoring}
          >
            Ignore
          </Button>

          <Button
            className="ml-3"
            size="large"
            isLoading={isAccepting}
            onClick={handleAccept}
          >
            Accept
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const MatterContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e0e0e1;
  box-sizing: border-box;
  border-radius: 4px;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
  margin: 24px 0px;
  padding: 24px 16px;
`;
