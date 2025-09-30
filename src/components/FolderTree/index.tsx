import React from "react";
import { RiseLoader } from "components";
import styled from "styled-components";
import FolderImg from "assets/icons/folder.svg";
import FolderGrayImg from "assets/icons/folder_gray.svg";
import DocumentImg from "assets/icons/document.svg";
import DocumentGrayImg from "assets/icons/document_gray.svg";

interface Props {
  className?: string;
  data?: any[];
  value?: any;
  isLoading?: boolean;
  isFolderSelectable?: boolean;
  onChange?(params): void;
  onFolderClick?(params): void;
}
export const FolderTree = ({
  className,
  data = [],
  value,
  isLoading = false,
  isFolderSelectable = true,
  onChange = () => {},
  onFolderClick = () => {},
}: Props) => {
  return (
    <Container className={className}>
      {isLoading ? (
        <div className="d-flex flex-column flex-1 justify-content-center">
          <RiseLoader className="my-auto" />
        </div>
      ) : (
        data
          .filter((row) => (isFolderSelectable ? row.type === "Folder" : true))
          .map((item, index) => (
            <Row
              key={`${index}key`}
              active={value.id === item.id}
              onClick={() =>
                item.type === "Folder" && isFolderSelectable
                  ? onChange(item)
                  : item.type === "Document" && !isFolderSelectable
                  ? onChange(item)
                  : (() => {})()
              }
              onDoubleClick={() =>
                item.type === "Folder" && onFolderClick(item)
              }
            >
              <img
                src={
                  item.type === "Folder" && item.id === value.id
                    ? FolderImg
                    : item.type === "Folder" && item.id !== value.id
                    ? FolderGrayImg
                    : item.type === "Document" && item.id === value.id
                    ? DocumentImg
                    : DocumentGrayImg
                }
                alt="folder"
              />
              <span className="ml-2 my-auto text-ellipsis">{item.title}</span>
            </Row>
          ))
      )}
    </Container>
  );
};

const Container = styled.div`
  height: 360px;
  overflow-y: auto;
  border: 1px solid #e0e0e1;
  box-sizing: border-box;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
`;
interface RowProps {
  active: boolean;
}
const Row = styled.div<RowProps>`
  height: 42px;
  min-height: 42px;
  display: flex;
  color: #2e2e2e;
  font-weight: normal;
  cursor: pointer;
  transition: all 300ms ease;
  font-size: 14px;
  line-height: 26px;
  background: ${(props) => (props.active ? "#D9EFE2" : "#fff")};
  box-shadow: inset 0px -1px 0px rgba(219, 219, 219, 0.5);
  padding: 0 16px;
  img {
    width: 24px;
  }
  span {
    width: 240px;
  }
  &:hover {
    background: #e2e2e2;
  }
`;
