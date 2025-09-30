import React, { useRef } from "react";
import styled from "styled-components";
import { useField, FieldHookConfig } from "formik";
import classNames from "classnames";
import ArrowIcon from "assets/icons/arrow-drop-down.svg";

type CurrencyProps = FieldHookConfig<number> & {
  values?: {
    title: string;
    id: number;
  }[];
  label?: string;
  className?: string;
  placeholder?: string;
  help?: string;
  isRequired?: boolean;
};

export const FormCurrencySelect: React.FC<CurrencyProps> = ({
  label,
  className,
  help,
  values = [],
  placeholder,
  isRequired,
  ...props
}) => {
  const [field, meta, helpers] = useField(props);

  const actionRef = useRef<HTMLDivElement>(null);

  const handleChange = (param) => {
    actionRef.current && actionRef.current.blur();
    helpers.setValue(param);
  };

  return (
    <CurrencyContainer>
      <div
        className="select-control__container w-100"
        ref={actionRef}
        tabIndex={0}
      >
        <div
          className={classNames("select-control__main border-none w-100", {
            active: field.value,
          })}
        >
          <div className="d-flex">
            <span className="my-auto">
              {field.value
                ? values.find((item) => item.id === field.value)?.title
                : placeholder}
            </span>
          </div>
          <img
            src={ArrowIcon}
            className="select-control__arrow ml-auto"
            alt="arrow"
          />
        </div>
        <div className={classNames("select-control__menu")}>
          {values.map(({ id, title }) => {
            return (
              <div
                className={classNames("select-control__menu-item", {
                  active: field.value === id,
                })}
                key={id}
                onClick={() => handleChange(id)}
              >
                <span>{title}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="select-control__footer">
        {meta.touched && meta.error && (
          <div className="select-control__validation">{meta.error}</div>
        )}
        {help && <div className="select-control__help ml-auto">{help}</div>}
      </div>
    </CurrencyContainer>
  );
};

const CurrencyContainer = styled.div`
  width: 88px;
  display: flex;
  flex-direction: column;
`;
