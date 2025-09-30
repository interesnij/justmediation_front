import React from "react";
import classNames from "classnames";
import "./style.scss";
interface Props {
  value?: string;
  onChange(value: string): void;
  placeholder?: string;
  className?: string;
}
export const Textarea = ({
  value,
  onChange,
  placeholder,
  className,
}: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };
  return (
    <textarea
      className={classNames("textarea-control", className)}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
};
