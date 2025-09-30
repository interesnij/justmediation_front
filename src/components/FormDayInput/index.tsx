import React from "react";
import classNames from "classnames";
import { useField, FieldHookConfig } from "formik";
import { nanoid } from "nanoid";
import "./style.scss";
type Props = FieldHookConfig<string> & {
  label?: string;
  type?: "text" | "password" | "email" | "number" | "phone";
  className?: string;
  maxLength?: number;
  placeholder?: string;
  help?: string;
  isRequired?: boolean;
  disableAutoComplete?: boolean;
  isTouched?: boolean;
};

export const FormDayInput: React.FC<Props> = ({
  label,
  className,
  help,
  type = "number",
  placeholder,
  isRequired,
  maxLength,
  disableAutoComplete = false,
  isTouched = false,
  ...props
}) => {
  const [field, meta, helpers] = useField(props);
  const id = nanoid();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    if (type === "number") {
      value = value.replace(/[^\d]/g, "");
    }
    helpers.setValue(maxLength ? value.slice(0, maxLength) : value);
  };
  return (
    <div
      className={classNames("input-day-control", className, {
        error: (isTouched || meta.touched) && meta.error,
      })}
    >
      {label && (
        <div className="d-flex justify-content-between">
          <label htmlFor={id} className="input-day-control__label">
            {label}
          </label>
          {!isRequired && (
            <div className="input-day-control__required">Optional</div>
          )}
        </div>
      )}
      <div className="days">DAYS</div>
      <input
        value={field.value}
        id={id}
        onChange={handleChange}
        placeholder={placeholder}
        type={type}
        autoComplete={"new-password"}
        className={classNames({
          active: field.value,
        })}
      />
      <div className="input-day-control__footer">
        {(isTouched || meta.touched) && meta.error && (
          <div className="input-day-control__validation">{meta.error}</div>
        )}
        {help && <div className="input-day-control__help ml-auto">{help}</div>}
      </div>
    </div>
  );
};
