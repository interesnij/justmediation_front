import React from "react";
import PhoneInput2 from "react-phone-input-2";
import classNames from "classnames";
import "react-phone-input-2/lib/style.css";
import "./style.scss";

interface Props {
  value: string;
  placeholder?: string;
  onChange(params: string): void;
  className?: string;
}

export const PhoneInput = ({
  value,
  placeholder,
  onChange = () => {},
  className,
}: Props) => {
  return (
    <PhoneInput2
      country={"us"}
      placeholder={placeholder}
      containerClass={classNames(className, "phone-input-2-container")}
      inputStyle={{ height: 48, fontSize: 14 }}
      value={value}
      onChange={onChange}
    />
  );
};
