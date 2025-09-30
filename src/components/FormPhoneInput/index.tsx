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
  disabled?: boolean;
};

export const FormPhoneInput: React.FC<Props> = ({
  label,
  className,
  help,
  type = "text",
  placeholder,
  isRequired,
  disableAutoComplete = false,
  disabled = false,
  ...props
}) => {
  const id = nanoid();
  const [field, meta, helpers] = useField(props);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    helpers.setValue(event.target.value.replace(/[^\d]/g, "").slice(0, 10));
  };

  const formatPhoneText = (value: string) => {
    // if input value is falsy eg if the user deletes the input, then just return
    if (!value) return value;

    // clean the input for any non-digit values.
    const phoneNumber = value.replace(/[^\d]/g, "");

    // phoneNumberLength is used to know when to apply our formatting for the phone number
    const phoneNumberLength = phoneNumber.length;

    // we need to return the value with no formatting if its less then four digits
    // this is to avoid weird behavior that occurs if you  format the area code to early
    if (phoneNumberLength < 4) return phoneNumber;

    // if phoneNumberLength is greater than 4 and less the 7 we start to return
    // the formatted number
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }

    // finally, if the phoneNumberLength is greater then seven, we add the last
    // bit of formatting and return it.
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
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
        value={formatPhoneText(field.value)}
        id={id}
        onChange={handleChange}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
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
