import React, { useRef } from "react";
import classNames from "classnames";
import { utcToZonedTime, format } from 'date-fns-tz'
import enIN from 'date-fns/locale/en-IN'
import { useField, FieldHookConfig } from "formik";
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/react";
import ArrowIcon from "assets/icons/arrow-drop-down.svg";
import "./style.scss";


type Props = FieldHookConfig<string> & {
  values?: {
    title: string;
    id: any;
    currency?: string;
  }[];
  label?: string;
  className?: string;
  placeholder?: string;
  help?: string;
  isRequired?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  timezone?: boolean;
};

export const FormSelect: React.FC<Props> = ({
  label,
  className,
  help,
  values = [],
  placeholder,
  isRequired,
  isLoading = false,
  disabled = false,
  timezone = false,
  ...props
}) => {
  const [field, meta, helpers] = useField(props);

  const actionRef = useRef<HTMLDivElement>(null);

  const handleChange = (param) => {
    actionRef.current && actionRef.current.blur();
    helpers.setValue(param);
  };


  const toFormatSelectedLabel = (type: string | undefined, tz: boolean) => {
    if (!type || type === label || placeholder === type) {
      return type;
    }

    let newType: string = type;

    if (tz) {

      const toFormatZn = (type: string, long: string = "zzzz"): string => {
        return format(utcToZonedTime(new Date(), type), long, {
          timeZone: type,
          locale: enIN
        });
      }

      const longZn: string = toFormatZn(type, "zzzz");
      const utc: string = toFormatZn(type, "xxx");

      const nextValue: string = `(UTC${utc}) ${longZn}`

      newType = nextValue
    }

    return newType;
  }

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
        className="select-control__container"
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
              {toFormatSelectedLabel(field.value
                ? values.find((item) =>
                    +item.id
                      ? +item.id === +field.value
                      : item.id === field.value
                  )?.title
                : placeholder, timezone)}
            </span>
          </div>
          <img src={ArrowIcon} className="select-control__arrow" alt="arrow" />
        </div>
        <div className={classNames("select-control__menu")}>
          {isLoading ? (
            <ClipLoader
              size={40}
              color="rgba(0,0,0,.6)"
              css={css`
                display: block;
                margin: 20px auto;
              `}
            />
          ) : values.length > 0 ? (
            values.map(({ title, id: itemVal, currency }) => {
              return (
                <div
                  className={classNames("select-control__menu-item", {
                    active: +field.value === +itemVal,
                  })}
                  key={itemVal}
                  onClick={() => handleChange(itemVal)}
                >
                  <span>{title}</span>
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
