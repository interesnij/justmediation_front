import React, {useEffect, useState, useRef} from "react";
import classNames from "classnames";
import { useField, FieldHookConfig } from "formik";
import { ClipLoader } from "components";
import { getCities } from "api";
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
  state?: string;
  selectedCity? : number;
  onSelect?(param): void;
  citiesData?: (cities: { name: string; id: string; }[]) => void;
};

const CitySelect: React.FC<Props> = ({
  label,
  className,
  help,
  placeholder,
  isRequired,
  disabled = false,
  timezone = false,
  state,
  selectedCity = -1,
  onSelect = () => {},
  citiesData,
  ...props
}) => {
  const [field, meta, helpers] = useField(props);

  const actionRef = useRef<HTMLDivElement>(null);

  const { isError, error, data, status } = useQuery<
    { name: string; id: string }[],
    Error
  >(["cities", state], () => getCities({ state }), {
    keepPreviousData: true,
    enabled: !!state,
  });

  const handleChange = (param) => {
    actionRef.current && actionRef.current.blur();
    helpers.setValue(param.id);
    onSelect(param);
  };

  useEffect(() =>{
    if(data && !find(data, ['id', selectedCity])){
      helpers.setValue("");
      onSelect("");
    }
    data && data.length > 0 && citiesData && citiesData(data);
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
                ? data && data.find((item) => item.id === field.value)?.name
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
            data.map((city) => {
              return (
                <div
                  className={classNames("select-control__menu-item", {
                    active: field.value === city?.id,
                  })}
                  key={city?.id}
                  onClick={() => handleChange(city)}
                >
                  <span>{city.name}</span>
                </div>
              );
            })
          ) : (
            <div className="my-3 text-gray text-center">Please select a city</div>
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

export const FormCitySelect = React.memo(CitySelect);