import React, {FC, memo} from "react";
import {FieldHookConfig, useField} from "formik";
import classNames from "classnames";
import "./styles.scss";

type TProps = FieldHookConfig<string> & {
  label?: string;
  type?: "text" | "number";
  className?: string;
  maxLength?: number;
  placeholder?: string;
  help?: string;
  isRequired?: boolean;
  disableAutoComplete?: boolean;
  isTouched?: boolean;
  disabled?: boolean;
  size?: "sm" | "md";
}

const FormFloatNumberComponent: FC<TProps> = ({
  label,
  className,
  help,
  type = "text",
  placeholder,
  isRequired = false,
  maxLength = 5,
  disableAutoComplete = false,
  isTouched = false,
  disabled = false,
  size,
  ...props
}) => {

  const [field, meta, helpers] = useField(props);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value || "";
    const dotIndex = value.indexOf(".");
    const valueRightDot = dotIndex > -1 ? value.slice(dotIndex + 1) : "";
    value = value.replace(/[^\d.]|\.(?=.*\.)/g, "");
    if(valueRightDot.length > 2) {
      helpers.setValue(value.slice(0, value.length - 1))
      return;
    }
    helpers.setValue(value);
  };

  return (
    <div
      className={classNames("input-control", className, size, {
        error: (isTouched || meta.touched) && meta.error,
      })}
    >
      {label && (
        <div className="d-flex justify-content-between">
          <label htmlFor="tax_rate" className="input-control__label">
            {label}
          </label>
          {!isRequired && (
            <div className="input-control__required">Optional</div>
          )}
        </div>
      )}
      <div className="position-relative">
        <input
          id="tax_rate"
          value={field.value || ""}
          onChange={handleChange}
          placeholder={placeholder}
          type={type}
          disabled={disabled}
          className={classNames({
            active: field.value,
          })}
        />
      </div>
      <div className="input-control__footer">
        {(isTouched || meta.touched) && meta.error && (
          <div className="input-control__validation">{meta.error}</div>
        )}
        {help && <div className="input-control__help ml-auto">{help}</div>}
      </div>
    </div>
  )
}

export const FormFloatNumber = memo(FormFloatNumberComponent);