import React from "react";
import classNames from "classnames";
import { useField, FieldHookConfig } from "formik";
import { nanoid } from "nanoid";

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

export const FormTimeInput: React.FC<Props> = ({
  label,
  className,
  help,
  type = "text",
  placeholder,
  isRequired,
  maxLength,
  disableAutoComplete = false,
  isTouched = false,
  ...props
}) => {
  const id = nanoid();
  const onBlur = (event) => {
    const value = event.target.value;
    const seconds = Math.max(0, getSecondsFromHHMMSS(value));

    const time = toHHMMSS(seconds);
    // setValue(time);

    helpers.setValue(time);
  };

  const getSecondsFromHHMMSS = (value) => {
    const [str1, str2, str3] = value.split(":");

    const val1 = Number(str1);
    const val2 = Number(str2);
    const val3 = Number(str3);

    if (!isNaN(val1) && isNaN(val2) && isNaN(val3)) {
      return val1;
    }

    if (!isNaN(val1) && !isNaN(val2) && isNaN(val3)) {
      return val1 * 60 + val2;
    }

    if (!isNaN(val1) && !isNaN(val2) && !isNaN(val3)) {
      return val1 * 60 * 60 + val2 * 60 + val3;
    }

    return 0;
  };

  const toHHMMSS = (secs) => {
    const secNum = parseInt(secs.toString(), 10);
    const hours = Math.floor(secNum / 3600);
    const minutes = Math.floor(secNum / 60) % 60;
    const seconds = secNum % 60;

    return [hours, minutes, seconds]
      .map((val) => (val < 10 ? `0${val}` : val))
      .join(":");
  };
  const [field, meta, helpers] = useField(props);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;
    if (type === "number") {
      value = value.replace(/[^\d]/g, "");
    }
    helpers.setValue(maxLength ? value.slice(0, maxLength) : value);
  };
  return (
    <div
      className={classNames("input-control", className, {
        error: (isTouched || meta.touched) && meta.error,
      })}
    >
      {label && (
        <div className="d-flex justify-content-between">
          <label htmlFor={id} className="input-control__label">
            {label}
          </label>
          {!isRequired && (
            <div className="input-control__required">Optional</div>
          )}
        </div>
      )}
      <input
        value={field.value}
        id={id}
        onChange={handleChange}
        placeholder={placeholder}
        type={type}
        onBlur={onBlur}
        autoComplete={"new-password"}
        className={classNames({
          active: field.value,
        })}
      />
      <div className="input-control__footer">
        {(isTouched || meta.touched) && meta.error && (
          <div className="input-control__validation">{meta.error}</div>
        )}
        {help && <div className="input-control__help ml-auto">{help}</div>}
      </div>
    </div>
  );
};
