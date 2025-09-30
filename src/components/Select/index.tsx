import { useRef } from "react";
import classNames from "classnames";
import DropDownIcon from "assets/icons/arrow-drop-down.svg";
import "./style.scss";

interface Props {
  data: {
    title: string;
    id: any;
  }[];
  value: any;
  className?: string;
  label?: string;
  backgroundColor?: string;
  width?: number;
  alignRight?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  onChange(param): void;
  onSelect?(param): void;
}

export const Select = ({
  data,
  value,
  onChange,
  label,
  className,
  backgroundColor = "#eee",
  width = 160,
  alignRight = false,
  disabled = false,
  onSelect = () => {},
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleChange = (params) => {
    if (params !== value) {
      onChange(params);
      onSelect(params);
    }
    containerRef.current && containerRef.current.blur();
  };
  return (
    <div className={classNames("d-flex", className)}>
      {label && <span className="select-label my-auto">{label}</span>}
      <div
        ref={containerRef}
        tabIndex={disabled === true ? undefined : 0}
        className="select-container"
      >
        <div className="menu-button">
          <span>
            {data.length > 0
              ? data.find((item) => item.id === value)?.title
              : ""}
          </span>
          <img
            src={DropDownIcon}
            className="menu-button__drop-down"
            alt="drop-down"
          />
        </div>
        <div
          className={classNames("menu-dropdown", { "align-right": alignRight })}
        >
          {data.map((item) => {
            return (
              <div
                className={classNames(
                  "menu-item",
                  item.id === value ? "active" : ""
                )}
                key={item.id}
                onClick={() => handleChange(item.id)}
                style={{ width }}
              >
                {item.title}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
