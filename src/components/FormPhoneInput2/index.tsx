import React from "react";
import PhoneInput2 from "react-phone-input-2";
import classNames from "classnames";
import { useField, FieldHookConfig } from "formik";
import styled from "styled-components";
import { nanoid } from "nanoid";
import "react-phone-input-2/lib/style.css";
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
  disabled?: boolean;
};

export const FormPhoneInput2: React.FC<Props> = ({
                                                   label,
                                                   className,
                                                   help,
                                                   type = "text",
                                                   placeholder = "+1 (123) 456 - 7890",
                                                   isRequired,
                                                   maxLength,
                                                   disableAutoComplete = false,
                                                   isTouched = false,
                                                   disabled = false,
                                                   ...props
                                                 }) => {
  const [field, meta, helpers] = useField(props);
  const id = nanoid();

  const handleChange = (param) => {
    helpers.setValue(param.startsWith('+') ? param: '+' + param);
  };

  return (
    <Container
      className={className}
      status={
        (isTouched || meta.touched) && meta.error
          ? "error"
          : field.value
            ? "active"
            : ""
      }
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
      <PhoneInput2
        country={"us"}
        placeholder={placeholder}
        containerClass={classNames("phone-input-2-container")}
        inputStyle={{ height: 48, fontSize: 14 }}
        value={field.value}
        onChange={handleChange}
      />
      <div className="input-control__footer">
        {(isTouched || meta.touched) && meta.error && (
          <div className="input-control__validation">{meta.error}</div>
        )}
        {help && <div className="input-control__help ml-auto">{help}</div>}
      </div>
    </Container>
  );
};

interface ContainerProps {
  status: string;
}
const Container = styled.div<ContainerProps>`
  .form-phone-input-2-container {
    height: 48px;
  }
  input {
    width: 100% !important;
  }
  .flag-dropdown,
  input {
    border: 1px solid
    ${(props) =>
            props.status === "error"
                    ? "red"
                    : props.status === "active"
                            ? "rgba(0, 0, 0, 0.8)"
                            : "rgba(0, 0, 0, 0.25)"} !important;
  }
`;