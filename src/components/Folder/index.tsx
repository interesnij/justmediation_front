import React from "react";
import { IconButton } from "components";
import { Link } from "@reach/router";
import classNames from "classnames";
import "./style.scss";

interface Props {
  children: React.ReactNode;
  label: string;
  className?: string;
  viewAll?: string;
  onPlus?: (() => void) | null;
  headerComponent?: JSX.Element;
}
export const Folder = ({
  children,
  label,
  className,
  onPlus,
  viewAll = "",
  headerComponent
}: Props) => {
  return (
    <div className={classNames("folder-control", className)}>
      <div className="folder-control__header">
        <div className="d-flex">
          <div className="folder-control__heading">{label}</div>
          <div className="folder-control__heading-after"></div>
        </div>
        <div className="d-flex">
          {onPlus && (
            <IconButton type="plus" className="my-auto" onClick={onPlus} />
          )}
          {viewAll && (
            <Link className="folder-control__view-all ml-3" to={viewAll}>
              View ALL
            </Link>
          )}
          {headerComponent}
        </div>
      </div>
      <div className="folder-control__content">{children}</div>
    </div>
  );
};

interface ItemProps {
  children?: React.ReactNode;
  className?: string;
  withSeparator?: boolean;
}
export const FolderItem = ({ 
    children, 
    className,
    withSeparator = true }: ItemProps
  ) => {
  return <div className={classNames(
    "folder-item", 
    className, 
    {'folder-item--with-separator': withSeparator })}>{children}</div>;
};
