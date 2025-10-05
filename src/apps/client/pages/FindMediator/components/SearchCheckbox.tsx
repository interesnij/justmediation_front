import React from "react";
import classNames from "classnames";

interface Props {
  className?: string;
  value?: boolean;
  onChange?(param: boolean): void;
  children: React.ReactNode;
}
export const SearchCheckbox: React.FC<Props> = ({
  value = false,
  onChange = () => {},
  children,
  className,
}) => {
  return (
    <div className={classNames(className)}>
      <label className="search-check">
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
