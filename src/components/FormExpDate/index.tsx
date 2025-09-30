import React from "react";
import classNames from "classnames";
import { useField, FieldHookConfig } from "formik";
import { nanoid } from "nanoid";
import "./style.scss";

type Props = FieldHookConfig<string> & {
  label?: string;
  type?: "text" | "password" | "email" | "number" | "phone";
  className?: string;
  placeholder?: string;
  help?: string;
  isRequired?: boolean;
  disableAutoComplete?: boolean;
};

export const FormExpDate: React.FC<Props> = ({
  label,
  className,
  help,
  type = "text",
  placeholder,
  isRequired,
  disableAutoComplete = false,
  ...props
}) => {
  const [field, meta, helpers] = useField(props);
  const id = nanoid();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    helpers.setValue(event.target.value.replace(/[^\d]/g, "").slice(0, 4));
  };

  const formatExpDate = (value: string) => {
    if (!value) return value;
    const expDate = value.replace(/[^\d]/g, "");
    if (expDate.length <= 2) return expDate;

    return `${expDate.slice(0, 2)}/${expDate.slice(2, 4)}`;
  };

  return (
    <div
      className={classNames("input-control", className, {
        error: meta.touched && meta.error,
      })}
    >
      <div className="d-flex justify-content-between">
        <label htmlFor={id} className="input-control__label">
          {label}
        </label>
        {!isRequired && <div className="input-control__required">Optional</div>}
      </div>
      <input
        value={formatExpDate(field.value)}
        id={id}
        onChange={handleChange}
        placeholder={placeholder}
        type={type}
        autoComplete={"new-password"}
        className={classNames({
          active: field.value,
        })}
      />
      <div className="input-control__footer">
        {meta.touched && meta.error && (
          <div className="input-control__validation">{meta.error}</div>
        )}
        {help && <div className="input-control__help ml-auto">{help}</div>}
      </div>
    </div>
  );
};
