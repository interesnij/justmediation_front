import React from "react";
import { User } from "components";
import styled from "styled-components";
import CloseIcon from "assets/icons/close.svg";

interface ClientProps {
  data: any;
  onClose?(): void;
  editable?: boolean;
}
export const ClientInfo = ({
  data = {},
  onClose = () => {},
  editable = true,
}: ClientProps) => {

  return (
    <ClientContainer>
      <User size="large" avatar={data?.avatar} className="my-auto"/>
      <div className="ml-3 d-flex flex-column align-items-start">
        <div>{data?.name || `${data?.first_name} ${data?.middle_name || ""} ${data?.last_name}` || "" }</div>
        <div>{data!.company || data!.organization_name || ""}</div>
        {data!.job && <div  className="mb-2">{data!.job || ""}</div>}
        <div className="mt-auto">{data!.phone || ""}</div>
        <div>{data.email}</div>
      </div>
      {editable && <ClientClose src={CloseIcon} onClick={onClose} />}
    </ClientContainer>
  );
};

const ClientContainer = styled.div`
  padding: 16px 24px;
  border: 1px solid #e0e0e1;
  width: 400px;
  background: #ffffff;
  box-sizing: border-box;
  border-radius: 4px;
  display: flex;
  color: #2e2e2e;
  font-size: 14px;
  line-height: 26px;
  font-family: "DM Sans";
  font-style: normal;
  font-weight: normal;
  position: relative;
`;

const ClientClose = styled.img`
  width: 12px;
  height: 12px;
  position: absolute;
  right: 24px;
  top: 16px;
  cursor: pointer;
  transition: all 300ms ease;
  &:hover {
    opacity: 0.7;
  }
`;
