import React from "react";
import { User } from "components";
import styled from "styled-components";

interface Props {
  data: string[];
}

export const ChatThreadAvatar = ({ data }: Props) => {
  return (
    <>
      {data.length === 1 ? (
        <User avatar={data[0]} />
      ) : (
        <>
          <User size="tiny" className="ml-auto" avatar={data[1]} />
          <Wrapper>
            <User size="tiny" avatar={data[0]} />
          </Wrapper>
        </>
      )}
    </>
  );
};

const Wrapper = styled.div`
  margin-top: -12px;
  margin-right: 8px;
`;
