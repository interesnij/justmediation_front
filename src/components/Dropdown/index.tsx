import React, { useRef } from "react";
import "./style.scss";
interface Props {
  data: {
    label: string;
    action: string;
  }[];
  onActionClick?(action: string): void;
  children: React.ReactNode;
  className?: string;
}
export const Dropdown = ({
  data,
  children,
  onActionClick = () => {},
  className,
}: Props) => {
  const actionRef = useRef<HTMLDivElement>(null);
  const handleAction = (action: string) => {
    actionRef.current && actionRef.current.blur();
    onActionClick(action);
  };
  return (
    <div className={`dropdown ${className}`} ref={actionRef} tabIndex={0}>
      <div className="dropdown__button">{children}</div>
      <div className="dropdown__menu">
        {data.map(({ label, action }) => {
          return (
            <div
              className="dropdown__menu-item"
              key={label}
              onClick={() => handleAction(action)}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
};
