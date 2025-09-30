import React, { useRef, useEffect, memo } from "react";
import classNames from "classnames";
import { useField, FieldHookConfig } from "formik";
import { ClipLoader } from "components";
import { getCountries } from "api";
import { useQuery } from "react-query";
import ArrowIcon from "assets/icons/arrow-drop-down.svg";
import "./style.scss";

type Props = FieldHookConfig<string> & {
  label?: string;
  className?: string;
  placeholder?: string;
  help?: string;
  isRequired?: boolean;
  disabled?: boolean;
  timezone?: boolean;
  onSelect?(params): void;
  countryData?: (arg: { title: string; id: string; code: string; }[]) => void;
};

const CountrySelect: React.FC<Props> = ({
  label,
  className,
  help,
  placeholder,
  isRequired,
  disabled = false,
  timezone = false,
  onSelect = () => {},
  countryData,
  ...props
}) => {
  const [field, meta, helpers] = useField(props);

  const actionRef = useRef<HTMLDivElement>(null);

  const { isLoading, isError, error, data } = useQuery<
    { title: string; id: string; code: string }[],
    Error
  >(["countries"], () => getCountries(), {
    keepPreviousData: true,
  });

  const handleChange = (param) => {
    actionRef.current && actionRef.current.blur();
    onSelect(param);
    helpers.setValue(param.id);
  };

  useEffect(() => {
    data && data.length > 0 && countryData && countryData(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

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
          {isLoading ? (
            <ClipLoader />
          ) : isError ? (
            <div className="my-3 text-gray text-center">{error}</div>
          ) : data && data.length > 0 ? (
            data.map((country) => {
              return (
                <div
                  className={classNames("select-control__menu-item", {
                    active: field.value === country.id,
                  })}
                  key={country.id}
                  onClick={() => handleChange(country)}
                >
                  <span>{country.title}</span>
                </div>
              );
            })

          ) : (
            <div className="my-3 text-gray text-center">Empty</div>
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

export const FormCountrySelect = memo(CountrySelect);