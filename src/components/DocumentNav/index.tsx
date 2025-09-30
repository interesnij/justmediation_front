import React from "react";
import ArrowRightIcon from "assets/icons/arrow_right.svg";
import classNames from "classnames";
import "./style.scss";

interface Props {
  folders?: any[];
  className?: string;
  onClick?(params: any[]): void;
}
export const DocumentNav = ({
  folders = [],
  className,
  onClick = () => {},
}: Props) => {
  const handleClick = (index) => {
    onClick(folders.slice(0, index + 1));
  };

  return (
    <div className={classNames("breadcrumb-control", className)}>
      {folders.map((folder, index) => {
        return (
          <div
            className="breadcrumb-control__item"
            key={`${index}key`}
            onClick={() => handleClick(index)}
          >
            {index !== 0 && (
              <img src={ArrowRightIcon} className="my-auto" alt="arrow-right" />
            )}
            <div className="text-ellipsis cursor-pointer">{folder.title}</div>
          </div>
        );
      })}
    </div>
  );
};
