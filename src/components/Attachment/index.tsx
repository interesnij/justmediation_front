import React from "react";
import styled from "styled-components";
import DocIcon from "assets/icons/document.svg";
import DownIcon from "assets/icons/download_green.svg";

interface DocProps {
  name: string;
  size?: string;
  className?: string;
  url?: string | undefined;
}
export const Attachment = ({ name, size, className, url }: DocProps) => {
  return (
    <Container className={className}>
      <img src={DocIcon} alt="doc" />
      <div className="my-auto">{name}</div>
      {size &&
        <span className={`ml-1 my-auto size`}>
          ({size})
        </span>
      }
      {url &&
        <Actions className="actions">
          <DownloadIcon className="download" onClick={() =>
            window.open(url)
          }>
            <img
              title="Download file"
              src={DownIcon}
              alt="download"
            />

          </DownloadIcon>
        </Actions>
      }
    </Container>
  );
};

const Container = styled.div`
  padding: 8px 14px;
  display: flex;
  background: #fafafa;
  border: 0.5px solid #e0e0e1;
  box-sizing: border-box;
  border-radius: 4px;
  width: 240px;
  margin-right: 8px;
  color: #2e2e2e;
  transition: all 300ms ease;
  position: relative;
  div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    margin-left: 10px;
  }
  .size {
    white-space: nowrap;
  }

  &.message-attachment:hover {
    box-shadow: 0 1px 2px rgb(0 0 0 / 5%), 0 2px 8px rgb(0 0 0 / 8%);
    border: 1px solid rgba(0, 0, 0, 0.8);
    .actions {
      opacity: 1;
      
    }
  }
`;

const Actions = styled.span`
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 0 4px 6px;
  right: 8px;
  font-size: 16px;
  box-sizing: border-box;
  opacity: 0;
  transition: all 300ms ease;
`

const DownloadIcon = styled.span`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  transition: all 300ms ease;
`
