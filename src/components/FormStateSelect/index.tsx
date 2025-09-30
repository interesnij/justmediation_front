import React, {useRef, useEffect, useState} from "react";
import classNames from "classnames";
import { useField, FieldHookConfig } from "formik";
import { ClipLoader } from "components";
import { getStates } from "api";
import { useQuery } from "react-query";
import ArrowIcon from "assets/icons/arrow-drop-down.svg";
import { find } from "lodash";
import "./style.scss";

type Props = FieldHookConfig<string> & {
  label?: string;
  className?: string;
  placeholder?: string;
  help?: string;
  isRequired?: boolean;
  disabled?: boolean;
  timezone?: boolean;
  country?: string;
  selectedState? : number;
  onSelect?(param): void;
  statesData?: (states: { title: string; id: string; }[]) => void;
};

const StateSelect: React.FC<Props> = ({
  label,
  className,
  help,
  placeholder,
  isRequired,
  disabled = false,
  timezone = false,
  country,
  selectedState = -1,
  onSelect = () => {},
  statesData,
  ...props
}) => {

  const [field, meta, helpers] = useField(props);

  const actionRef = useRef<HTMLDivElement>(null);

  const { isError, error, data, status } = useQuery<
    { title: string; id: string }[],
    Error
  >(["states", country], () => getStates(country), {
    keepPreviousData: true,
    enabled: !!country,
  });

  const handleChange = (param) => {
    actionRef.current && actionRef.current.blur();
    helpers.setValue(param.id);
    onSelect(param);
  };

  useEffect(() =>{
    if(data && !find(data, ['id', selectedState])){
      helpers.setValue("");
      onSelect("");
    }

    data && data.length > 0 && statesData && statesData(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div
      className={classNames("select-control", className, {
        error: meta.touched && meta.error,
      })}
    >
      <div className="d-flex justify-content-between">
        <div className="select-control__label">{label}</div>
        {!isRequired && (
          <div className="select-control__required">Optional</div>
        )}
      </div>
      <div
        className="select-control__container search_container"
        ref={actionRef}
        tabIndex={disabled ? undefined : 0}
      >
        <div
          className={classNames("select-control__main", {
            active: field.value,
          })}
        >
          <div className="flex-1 d-flex justify-content-between">
            <span className="my-auto">
              {field.value
                ? data && data.find((item) => item.id === field.value)?.title
                : placeholder}
            </span>
          </div>
          <img src={ArrowIcon} className="select-control__arrow" alt="arrow" />
        </div>
        <div className={classNames("select-control__menu")}>
          {status === "loading" ? (
            <ClipLoader />
          ) : isError ? (
            <div className="my-3 text-gray text-center">{error}</div>
          ) : data && data.length > 0 ? (
            data.map((state) => {
              return (
                <div
                  className={classNames("select-control__menu-item", {
                    active: field.value === state.id,
                  })}
                  key={state.id}
                  onClick={() => handleChange(state)}
                >
                  <span>{state.title}</span>
                </div>
              );
            })
          ) : (
            <div className="my-3 text-gray text-center">Please select a state</div>
          )}
        </div>
      </div>

      <div className="select-control__footer">
        {meta.touched && meta.error && (
          <div className="select-control__validation">{meta.error}</div>
        )}
        {help && <div className="select-control__help ml-auto">{help}</div>}
      </div>
    </div>
  );
};

export const FormStateSelect = React.memo(StateSelect);
