import React from "react";
import DropDownIco from "assets/icons/caret_down_white.svg";
import classnames from "classnames";
import "./style.scss";

interface Props {
  className?: string;
  children?: React.ReactNode;
  menuData: { id: string; title: string }[];
  onClick?(param?: string): void;
  disabled?: boolean;
}

export const DropdownButton = ({
  className,
  children,
  menuData,
  onClick = () => {},
  disabled
}: Props) => {
  const handleAction = (param: any) => {
    onClick(param);
  };
  return (
    <div tabIndex={0} className={classnames("document-new-button", className, {disabled})}>
      <div className={classnames("menu-button")}>
        <span>{children}</span>
        <img src={DropDownIco} className="menu-button-icon" alt="drop-down" />
      </div>
      <div className="menu-dropdown">
        {menuData.map(({ title, id }) => {
          return (
            <div key={id} onClick={() => handleAction(id)}>
              {title}
            </div>
          );
        })}
      </div>
    </div>
  );
};
