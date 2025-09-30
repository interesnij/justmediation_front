import React from "react";
import { User2 } from "components";
import styled from "styled-components";

interface Props {
  className?: string;
  userName?: string;
  avatar?: string;
  email?: string;
  type?: string;
  isAdded?: boolean;
  onAdd?(): void;
}
export const UserItem = ({
  className,
  userName,
  avatar,
  email,
  type,
  isAdded = false,
  onAdd,
}: Props) => {
  return (
    <Container className={className}>
      <User2
        userName={userName}
        avatar={avatar}
        className="my-auto"
        desc={email}
      />
      <Type className="my-auto ml-auto mr-4">{type}</Type>
      {!isAdded ? (
        <AddButton className="ml-auto" onClick={onAdd}>
          Add
        </AddButton>
      ) : (
        <RemoveButton className="ml-auto" onClick={onAdd}>
          Remove
        </RemoveButton>
      )}
    </Container>
  );
};

const Container = styled.div`
  height: 60px;
  display: flex;
  background: #ffffff;
  box-shadow: inset 0px -1px 0px #e7e7ed;
`;
const Type = styled.div`
  text-align: center;
  letter-spacing: 0.005em;
  text-transform: uppercase;
  color: #2e2e2e;
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 16px;
`;

const AddButton = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 26px;
  display: flex;
  align-items: center;
  text-align: right;
  letter-spacing: -0.01em;
  color: rgba(0,0,0,.6);
`;
const RemoveButton = styled(AddButton)`
  color: #cc4b39;
`;
