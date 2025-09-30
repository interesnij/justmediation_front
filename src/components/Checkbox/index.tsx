import React from "react";
import classNames from "classnames";
import "./style.scss";
interface Props {
  className?: string;
  value?: boolean;
  onChange?(param: boolean): void;
  children: React.ReactNode;
  isReversed?: boolean;
}
export const Checkbox: React.FC<Props> = ({
  value = false,
  onChange = () => {},
  children,
  className,
  isReversed = false
}) => {
  return (
    <div className={classNames(className)}>
      <label className={classNames("checkbox-component", {
        "checkbox-component--reversed": isReversed
      })}>
        {children}
        <input
          type="checkbox"
          checked={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.checked)
          }
        />
        <span></span>
      </label>
    </div>
  );
};
