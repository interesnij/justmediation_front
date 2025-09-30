import React from "react";
import { FaSearch, FaMapMarkedAlt, FaTimes } from "react-icons/fa";
import "./style.scss";
interface Props {
  icon?: "search" | "marker";
  value?: string;
  type?: "text" | "password" | "email";
  className?: string;
  placeholder?: string;
  onChange?(param: string): void;
}
export const Input = ({
  icon,
  value,
  className,
  type = "text",
  onChange = () => {},
  placeholder,
}: Props) => {
  const handleChange = (param: React.ChangeEvent<HTMLInputElement>) => {
    onChange(param.target.value);
  };
  const handleClose = () => {
    onChange("");
  };
  return (
    <div className={`input-container ${className}`}>
      {icon === "search" ? (
        <FaSearch />
      ) : icon === "marker" ? (
        <FaMapMarkedAlt />
      ) : null}
      <input
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
        value={value}
        placeholder={placeholder}
        type={type}
      />
      {value && <FaTimes className="close-icon" onClick={handleClose} />}
    </div>
  );
};
