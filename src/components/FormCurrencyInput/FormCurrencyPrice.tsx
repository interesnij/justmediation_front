import React from "react";
import styled from "styled-components";
import { useField, FieldHookConfig } from "formik";
import { nanoid } from "nanoid";

type HourlyProps = FieldHookConfig<string> & {
  className?: string;
  placeholder?: string;
  isRequired?: boolean;
  onChange?: (value: string) => void;
};

export const FormCurrencyPrice: React.FC<HourlyProps> = ({
  className,
  placeholder,
  isRequired,
  onChange,
  ...props
}) => {
  const [field, meta, helpers] = useField(props);
  const id = nanoid();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.validity.valid ? event.target.value : field.value)
    helpers.setValue(
      event.target.validity.valid ? event.target.value : field.value
    );
  };
  return (
    <div className="flex-1 d-flex">
      <FormHourlyInputContainer className={className}>
        <input
          value={parseInt(field.value) === 0 ? "" : field.value}
          id={id}
          pattern="[0-9.]+"
          onChange={handleChange}
          placeholder={placeholder}
        />
      </FormHourlyInputContainer>
      {meta.touched && meta.error && (
        <div className="input-control__footer validation ml-2">
          <div className="input-control__validation">{meta.error}</div>
        </div>
      )}
    </div>
  );
};

const FormHourlyInputContainer = styled.div`
  height: 26px;
  font-size: 14px;
  display: flex;
  flex: 1;
  margin: auto 0 auto 0;
  padding-right: 12px;
  border-right: 1px solid #e0e0e1;

  input {
    width: 100%;
    border: none;
    outline: none;
  }
`;
